import * as db from '../repository/contatosRepository.js';

export async function adicionarContato(usuario_id, nome, telefone) {
    // Validações idênticas ao vosso padrão
    if (!usuario_id) {
        throw new Error('O ID do utilizador é obrigatório.');
    }
    if (!nome) {
        throw new Error('O nome do contacto é obrigatório.');
    }
    if (!telefone) {
        throw new Error('O telefone do contacto é obrigatório.');
    }

    let idInserido = await db.inserirContato(usuario_id, nome, telefone);
    return idInserido;
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