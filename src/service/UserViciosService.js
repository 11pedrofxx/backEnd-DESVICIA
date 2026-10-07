import * as vinc from '../repository/UserViciosRepository.js'

export async function vincVicio (UserID, VicioID, dataInicio) {

    let id = await vinc.vincularVicio(UserID, VicioID, dataInicio)
    return id;

}