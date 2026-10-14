import * as db from '../repository/contatosEmergRepository.js'

export async function adicionarContato(usuario_id, nome, telefone) {
    if (!usuario_id || !nome || !telefone) {
        throw new Error("Todos os campos (usuário, nome e telefone) são obrigatórios.");
    }
    let contatoExistente = await db.buscarContatoPorTelefone(usuario_id, telefone);
    if (contatoExistente) {
        throw new Error("Você já cadastrou um contato com esse número de telefone.");
    }

    let id = await db.inserirContato(usuario_id, nome, telefone);
    return id;
}

export async function listarContatos(usuario_id) {
    if (!usuario_id) {
        throw new Error('O ID do utilizador é obrigatório para listar os contactos.');
    }

    let contatos = await db.consultarContatos(usuario_id);
    return contatos;
}

export async function removerContato(id) {
    if (!id) {
        throw new Error('O ID do contacto é obrigatório.');
    }

    let linhasAfetadas = await db.deletarContato(id);
    
    if (linhasAfetadas === 0) {
        throw new Error('Contacto não encontrado ou já foi eliminado.');
    }

    return linhasAfetadas;
}