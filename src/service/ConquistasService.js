import * as db from '../repository/ConquistasRepository.js';

export async function adicionarConquistaService(idUsuario, conquista_id) {
    let afetados = await db.VincularConquista(idUsuario, conquista_id);
    return afetados;
}

export async function listarConquistasService(idUsuario) {
    let conquistas = await db.listarConquistasUsuario(idUsuario);
    return conquistas;
}