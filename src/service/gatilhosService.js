import * as db from '../repository/gatilhosRepository.js'
import { validarGatilho } from '../validation/gatilhoValidation/gatilho.js';

export async function postGatilhoService (gatilho) {

    await validarGatilho(gatilho);
    let id = await db.postGatilho(gatilho);
    return id;

}

export async function buscarGatilhosService () {

    let gatilhos = await db.buscarGatilhos();
    return gatilhos;

}

export async function DeleteService(id) {

    if (!id || isNaN(id)) {
        throw new Error('O ID está incorreto ou inválido')
    }
    let linhasAfetadas = await db.deletarGatilho(id);
        if (linhasAfetadas === 0) {
            throw new Error('Gatilho não encontrado para eliminar.');
        }
    return linhasAfetadas;

} 