import * as db from '../repository/viciosRepository.js';

export async function postVicioService(idUsuario, vicio) {
    let nome = typeof vicio === 'object' ? vicio.nome : vicio;

    let resposta = await db.CadastrarVicio(idUsuario, nome);
    return resposta;
}

export async function getVicios(idUsuario) {
    let vicios = await db.consultarVicios(idUsuario);
    return vicios;
}

export async function deleteVicios(id, idUsuario) {
    let linhasAfetadas = await db.deletarVicios(id, idUsuario);
    return linhasAfetadas;
}