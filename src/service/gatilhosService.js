import * as db from '../repository/gatilhosRepository.js';
import { validarGatilho } from '../validation/gatilhoValidation/gatilho.js';

export async function postGatilhoService(idUsuario, gatilho) {
    gatilho.usuario_id = idUsuario;
    gatilho.personalizado = true;

    await validarGatilho(gatilho);
    let id = await db.postGatilho(idUsuario, gatilho);
    return id;
}

export async function buscarGatilhosService(idUsuario) {
    let gatilhos = await db.buscarGatilhos(idUsuario);
    return gatilhos;
}

export async function DeleteService(id, idUsuario) {
    if (!id || isNaN(id)) {
        throw new Error('O ID está incorreto ou inválido');
    }
    let linhasAfetadas = await db.deletarGatilho(id, idUsuario);
    if (linhasAfetadas === 0) {
        throw new Error('Gatilho não encontrado para eliminar.');
    }
    return linhasAfetadas;
}