import { BuscarGatilhoByNome } from "../../repository/gatilhosRepository.js"

export async function validarGatilho (gatilho) {

    let nome = await BuscarGatilhoByNome(gatilho.nome);
    if (nome.length > 0) {

        throw new Error(`Esse gatilho já foi registrado`)

    }

}