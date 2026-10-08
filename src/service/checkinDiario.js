import * as db from '../repository/checkinDiario.js';
import checkinValidation from '../validation/checkinValidation.js';

export async function CheckinDiarioService(dados) {

    checkinValidation(dados);
    let data_existente = await db.validarData(dados.usuario_id, dados.data_checkin);
    if (data_existente) {

        throw new Error(`Você já fez o seu Checkin Diário. Fique tranquilo(a)`);

    }

    let id = await db.fazerCheckin(dados);
    return id;

}

export async function getCheckins(id) { 
    
    if (!id || isNaN(id)) {

        throw new Error(`O ID que você digitou está errado ou não existe`);

    }

    let registro = await db.buscarCheckIns(id);
    if (registro.length === 0) {
        throw new Error(`Nenhum check-in encontrado para este usuário.`);
    }
    return registro;

}

export async function editCheckin (dados, id) {

    if (!id || isNaN(id)) {

        throw new Error(`O ID que você digitou está errado ou não existe`);

    }

    let linhasafetadas = await db.editarCheckin(dados, id)

    if (linhasafetadas === 0) {
        throw new Error("Nenhum check-in encontrado com este ID.");
    }

    return linhasafetadas;

}