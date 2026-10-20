import * as vinc from '../repository/UserViciosRepository.js';
import * as viciosDb from '../repository/viciosRepository.js';

export async function vincVicio(idUsuario, vicioId, dataInicio) {
    let vinculoExistente = await vinc.consultarVinculo(idUsuario, vicioId);
    if (vinculoExistente) {
        throw new Error('O utilizador já está a acompanhar este vício.');
    }

    let id = await vinc.vincularVicio(idUsuario, vicioId, dataInicio);
    return id;
}

export async function Vicio(idUsuario, vicioId, nomeVicio, dataInicio) {
    let idVicioFinal = vicioId;

    if (!idVicioFinal && nomeVicio) {
        let novoId = await viciosDb.postVicioRepository(idUsuario, nomeVicio);
        idVicioFinal = novoId;
    }

    if (!idVicioFinal) {
        throw new Error('É necessário selecionar um vício ou informar o nome de um novo vício.');
    }

    let vinculoExistente = await vinc.consultarVinculo(idUsuario, idVicioFinal);
    if (vinculoExistente) {
        throw new Error('O utilizador já está a acompanhar este vício.');
    }

    let id = await vinc.vincularVicio(idUsuario, idVicioFinal, dataInicio);
    return id;
}