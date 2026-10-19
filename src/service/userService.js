import bcrypt from 'bcrypt';
import * as db from '../repository/userRepository.js';
import crypto from 'crypto'

export async function cadastrarUsuario(usuario) {

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

    }

    let id = await db.inserirUsuario(UsuarioParaSalvar);

    return id

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

   
    if (!usuario) {
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

export async function EsquecerSenha (email) {
    let emailLimpo = email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);

    if (usuarioExistente) {

        let id = usuarioExistente.id
        const codigo = crypto.randomInt(100000, 1000000).toString();
        const expiracao = new Date(Date.now() + 10 * 60 * 1000);
        let linhasAfetadas = await db.codigoRecuperacao(codigo, expiracao, id);
        return {
            linhasAfetadas: linhasAfetadas,
            codigo: codigo
        }

    }

    else {
        throw new Error('Email não encontrado. Tente novamente')
    }

    
}

export async function ValidarCodigo(email, codigoDigitado) {

    let emailLimpo = email.trim().toLowerCase();

    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (usuarioExistente) {

        let codigo = String(usuarioExistente.codigo_recuperacao)
        if (String(codigoDigitado) !== codigo) {
            throw new Error ('O código está incorreto ou expirou, tente novamente')
        }

        if (new Date() > new Date(usuarioExistente.expiracao_codigo)) {
            throw new Error('O código de verificação expirou. Solicite um novo.');
        }
        
    }

    else {
        throw new Error('Não foi possível encontrar nenhum usuário com esse email')
    }
    return true
}

export async function MudarSenha(email, SenhaNova) {

    let emailLimpo = email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
        if (!usuarioExistente) {
            throw new Error('Nenhum usuário encontrado. Verifique se o email está correto');
        }
    let id = usuarioExistente.id
        if (!SenhaNova) {
            throw new Error('A nova senha deve ter pelo menos 6 caracteres.')
        }
    const senhaNovaCriptografada = await bcrypt.hash(SenhaNova, 10);
    let linhasAfetadas = await db.RedefinirSenha(senhaNovaCriptografada, id);
        return linhasAfetadas

}