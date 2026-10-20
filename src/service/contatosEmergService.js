import * as db from '../repository/contatosEmergRepository.js';

export async function adicionarContato(idUsuario, nome, telefone) {
    if (!idUsuario || !nome || !telefone) {
        throw new Error("Todos os campos (usuário, nome e telefone) são obrigatórios.");
    }
    let contatoExistente = await db.buscarContatoPorTelefone(idUsuario, telefone);
    if (contatoExistente) {
        throw new Error("Você já cadastrou um contato com esse número de telefone.");
    }

    let id = await db.inserirContato(idUsuario, nome, telefone);
    return id;
}

export async function listarContatos(idUsuario) {
    if (!idUsuario) {
        throw new Error('O ID do utilizador é obrigatório para listar os contactos.');
    }

    let contatos = await db.consultarContatos(idUsuario);
    return contatos;
}

export async function removerContato(idContato, idUsuario) {
    if (!idContato) {
        throw new Error('O ID do contacto é obrigatório.');
    }

    let linhasAfetadas = await db.deletarContato(idContato, idUsuario);
    
    if (linhasAfetadas === 0) {
        throw new Error('Contacto não encontrado ou já foi eliminado.');
    }

    return linhasAfetadas;
}