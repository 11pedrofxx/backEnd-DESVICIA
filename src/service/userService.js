import bcrypt from 'bcrypt';
import * as db from '../repository/userRepository.js';

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

    return usuario;
}