import * as db from '../repository/ConquistasRepository.js'

export async function adicionarConquistaService(usuario_id, conquista_id) {
    if (!usuario_id || !conquista_id) {
        throw new Error("O ID do usuário e da conquista são obrigatórios.");
    }
    try {
        let linhasAfetadas = await db.VincularConquista(usuario_id, conquista_id);
        return linhasAfetadas;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return 0; 
        throw error;
    }
}

export async function listarConquistasService(usuario_id) {
    if (!usuario_id || isNaN(usuario_id)) {
        throw new Error("ID do usuário inválido.");
    }
    return await db.listarConquistasUsuario(usuario_id);
}