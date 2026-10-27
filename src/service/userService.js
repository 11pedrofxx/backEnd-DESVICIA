import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import * as db from '../repository/userRepository.js';
import { enviarEmailRecuperacao } from './EmailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function preCadastro(usuario) {
    let emailLimpo = usuario.email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (usuarioExistente) {
        throw new Error('Esse email já foi cadastrado.');
    }
    if (!usuario.senha || usuario.senha.trim().length < 6) {
        throw new Error('A senha é obrigatória e deve ter pelo menos 6 caracteres.');
    }

    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
    const codigo = crypto.randomInt(100000, 1000000).toString();

    let Cadastro = {
        nome: usuario.nome,
        email: emailLimpo,
        senha_hash: senhaCriptografada,
        codigo: codigo
    }

    let idPendente = await db.salvarCadastroPendente(Cadastro);
    return {
        id: idPendente,
        email: emailLimpo,
        codigo: codigo
    };

}

export async function CadastroUser(dados) {
    let emailLimpo = dados.email.trim().toLowerCase();
    
    let validarCadastro = await db.BuscarCadastroPendente(emailLimpo, dados.codigo);

    if (!validarCadastro) {
        throw new Error('Código de verificação inválido ou expirado.');
    }

    const UsuarioParaSalvar = {
        nome: validarCadastro.nome,
        email: validarCadastro.email,
        senha_hash: validarCadastro.senha_hash
    };

    let id = await db.inserirUsuario(UsuarioParaSalvar);
    await db.deletarCadastroPendente(validarCadastro.id);

    return {
        id,
        nome: validarCadastro.nome,
        email: validarCadastro.email
    };
}

export async function cadastrarUsuario(usuario) {
    if (!usuario.senha || usuario.senha.trim().length < 6) {
        throw new Error('A senha é obrigatória e deve ter pelo menos 6 caracteres.');
    }

    let emailLimpo = usuario.email.trim().toLowerCase();

    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (usuarioExistente) {
        throw new Error('Esse email já foi cadastrado.');
    }
    
    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);

    const UsuarioParaSalvar = {
        nome: usuario.nome,
        email: emailLimpo,
        senha_hash: senhaCriptografada
    };

    let id = await db.inserirUsuario(UsuarioParaSalvar);

    return id;
}

export async function buscarUserByID(id) {
    if (!id || isNaN(id)) {
        throw new Error('Esse id não existe ou está indisponivel');
    }

    let usuario = await db.buscarUsuarioPorID(id);

    if (!usuario) {
        throw new Error('Usuário não encontrado.');
    }
    delete usuario.senha_hash;
    return usuario;
}

export async function loginUser(email, senha) {
    let emailLimpo = email.trim().toLowerCase();
    let usuario = await db.buscarUsuarioPorEmail(emailLimpo);

    if (!usuario || !usuario.senha_hash) {
        throw new Error('E-mail ou senha incorretos.');
    }

    let senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
        throw new Error('E-mail ou senha incorretos.');
    }

    delete usuario.senha_hash;
    delete usuario.codigo_recuperacao;
    delete usuario.expiracao_codigo;

    return usuario;
}

export async function loginComGoogle(googleToken) {
    if (!googleToken) {
        throw new Error('Token do Google não informado');
    }
    const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const emailGoogle = payload.email;
    const nomeGoogle = payload.name;

    let usuario = await db.buscarUsuarioPorEmail(emailGoogle);

    if (!usuario) {
        const novoUsuario = {
            nome: nomeGoogle,
            email: emailGoogle,
            senha_hash: null
        };

        const idInserido = await db.inserirUsuario(novoUsuario);
        usuario = await db.buscarUsuarioPorID(idInserido);
    }

    delete usuario.senha_hash;
    delete usuario.codigo_recuperacao;
    delete usuario.expiracao_codigo;

    return usuario;
}

export async function EsquecerSenha(email) {
    let emailLimpo = email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);

    if (usuarioExistente) {
        let id = usuarioExistente.id;
        const codigo = crypto.randomInt(100000, 1000000).toString();
        const expiracao = new Date(Date.now() + 10 * 60 * 1000);
        let linhasAfetadas = await db.codigoRecuperacao(codigo, expiracao, id);
        return {
            linhasAfetadas: linhasAfetadas,
            codigo: codigo
        };
    } else {
        throw new Error('Email não encontrado. Tente novamente');
    }
}

export async function ValidarCodigo(email, codigoDigitado) {
    let emailLimpo = email.trim().toLowerCase();

    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (usuarioExistente) {
        let codigo = String(usuarioExistente.codigo_recuperacao);
        if (String(codigoDigitado) !== codigo) {
            throw new Error('O código está incorreto ou expirou, tente novamente');
        }

        if (new Date() > new Date(usuarioExistente.expiracao_codigo)) {
            throw new Error('O código de verificação expirou. Solicite um novo.');
        }
    } else {
        throw new Error('Não foi possível encontrar nenhum usuário com esse email');
    }
    return true;
}

export async function solicitarRecuperacaoLinkService(email) {
    if (!email) {
        throw new Error('O e-mail é obrigatório.');
    }

    const usuario = await db.buscarUsuarioPorEmail(email);
    if (!usuario) {
        throw new Error('E-mail não encontrado no sistema.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    await db.salvarTokenRecuperacao(usuario.id, token);

    const urlFrontend = process.env.URL_FRONTEND || 'http://localhost:5022';
    const linkRecuperacao = `${urlFrontend}/redefinir-senha?token=${token}`;

    await enviarEmailRecuperacao(email, linkRecuperacao);
    return { mensagem: 'E-mail com o link de redefinição enviado com sucesso!' };
}



export async function redefinirSenhaPorTokenService(token, novaSenha) {
    if (!token) {
        throw new Error('Token de verificação ausente ou inválido.');
    }

    if (!novaSenha || novaSenha.length < 6) {
        throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
    }

    const usuario = await db.BuscarPorToken(token);
    if (!usuario) {
        throw new Error('Link de redefinição inválido ou já utilizado.');
    }

    const agora = new Date();
    if (new Date(usuario.expiracao) < agora) {
        throw new Error('Este link de redefinição expirou. Solicite um novo.');
    }

    await db.atualizarSenhaPorToken(usuario.id, novaSenha);
    return { mensagem: 'Sua senha foi redefinida com sucesso!' };
}

export async function MudarSenha(email, SenhaNova) {
    let emailLimpo = email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (!usuarioExistente) {
        throw new Error('Nenhum usuário encontrado. Verifique se o email está correto');
    }
    let id = usuarioExistente.id;
    if (!SenhaNova || SenhaNova.trim().length < 6) {
        throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
    }
    const senhaNovaCriptografada = await bcrypt.hash(SenhaNova, 10);
    let linhasAfetadas = await db.RedefinirSenha(senhaNovaCriptografada, id);
    return linhasAfetadas;
}

export async function checarStatusApresentacao(idUsuario) {
    let status = await db.verificarApresentacao(idUsuario);
    
    if (status === 1) {
        return true;
    } else {
        return false;
    }
}

export async function marcarApresentacaoComoConcluida(idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
        throw new Error('Identificador de utilizador inválido.');
    }
    await db.concluirApresentacao(idUsuario);
}