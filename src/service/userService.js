import bcrypt from 'bcrypt';
import * as db from '../repository/userRepository.js';

export async function cadastrarUsuario(usuario) {

    let emailLimpo = usuario.email.trim().toLowerCase();
    let usuarioExistente = await db.buscarUsuarioPorEmail(emailLimpo);
    if (usuarioExistente) {
        throw new Error('Esse email já foi cadastrado no sistema.');
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

    let linhas = await db.buscarUsuarioPorID(id);
    if (isNaN(id)) {

        throw new Error('Esse id não existe ou está indisponivel');

    }

    return linhas;

}