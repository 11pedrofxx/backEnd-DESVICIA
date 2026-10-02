import * as db from '../repository/viciosRepository.js';

export async function postVicioService (vicio) {

    let nome = vicio.nome

    let resposta = await db.CadastrarVicio(vicio);
    return resposta

}

export async function getVicios () {

    let vicio = await db.consultarVicios()
    return vicio

}

export async function deleteVicios(id) {

    let linhasAfetadas = await db.deletarVicios(id);
    return linhasAfetadas

}