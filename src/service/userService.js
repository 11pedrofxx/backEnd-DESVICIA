import bcrypt from 'bcrypt';
import * as db from '../repository/userRepository.js';

export async function cadastrarUsuario(usuario) {

    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
    const UsuarioParaSalvar = {

    nome: usuario.nome,
    email: usuario.email,
    senha_hash: senhaCriptografada

    }

    let id = await db.inserirUsuario(UsuarioParaSalvar);

    return id

}