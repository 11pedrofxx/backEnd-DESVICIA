import * as vinc from '../repository/UserViciosRepository.js'
import * as viciosDb from '../repository/viciosRepository.js'

export async function vincVicio (UserID, VicioID, dataInicio) {

    let vinculoExistente = await vinc.consultarVinculo(UserID, VicioID);
    if (vinculoExistente) {
        throw new Error('O utilizador já está a acompanhar este vício.');
    }

    let id = await vinc.vincularVicio(UserID, VicioID, dataInicio)
    return id;
}

export async function Vicio(UserID, VicioID, nomeVicio, dataInicio) {
    let idVicioFinal = VicioID;
 
    if (!idVicioFinal && nomeVicio) {
        let novoId = await viciosDb.CadastrarVicio(nomeVicio);
        idVicioFinal = novoId;
    }

    if (!idVicioFinal) {
        throw new Error('É necessário selecionar um vício ou informar o nome de um novo vício.');
    }

    let vinculoExistente = await vinc.consultarVinculo(UserID, idVicioFinal);
    if (vinculoExistente) {
        throw new Error('O utilizador já está a acompanhar este vício.');
    }

    let id = await vinc.vincularVicio(UserID, idVicioFinal, dataInicio);
    return id;
}
