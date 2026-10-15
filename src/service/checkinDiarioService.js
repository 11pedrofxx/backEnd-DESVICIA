import * as db from '../repository/checkinDiarioRepository.js';
import checkinValidation from '../validation/checkinValidation.js';
import { SalvarCheckinGatilhoService } from './CheckinGatilhoService.js';
import { adicionarConquistaService } from './ConquistasService.js';

export async function CheckinDiarioService(dados) {

    checkinValidation(dados);
    let data_existente = await db.validarData(dados.usuario_id, dados.data_checkin);
    if (data_existente) {
        throw new Error(`Você já fez o seu Checkin Diário. Fique tranquilo(a)`);
    }

    let id = await db.fazerCheckin(dados);

    if (dados.gatilhos_sentidos && dados.gatilhos_sentidos.length > 0) {
        for (let gatilho_id of dados.gatilhos_sentidos) {
            await SalvarCheckinGatilhoService(id, gatilho_id);
        }
    }

    let status = await EstatisticaOfensiva(dados.usuario_id);
    let diasAtuais = status.ofensiva_atual;

    if (diasAtuais >= 1) {
        await adicionarConquistaService(dados.usuario_id, 3);
    }
    if (diasAtuais >= 3) {
        await adicionarConquistaService(dados.usuario_id, 4);
    }
    if (diasAtuais >= 7) {
        await adicionarConquistaService(dados.usuario_id, 5);
    }
    if (diasAtuais >= 30) {
        await adicionarConquistaService(dados.usuario_id, 6);
    }
    if (diasAtuais >= 60) {
        await adicionarConquistaService(dados.usuario_id, 7);
    }
    if (diasAtuais >= 100) {
        await adicionarConquistaService(dados.usuario_id, 8);
    }

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

export async function deleteCheckin (id) {

    if (!id || isNaN(id)) {

        throw new Error(`O ID que você digitou está errado ou não existe`);

    }

    let linhasAfetadas = await db.deletarCheckin(id);
    if (linhasAfetadas === 0) {
        throw new Error(`Esse ID não existe. Tente novamente.`);
    }

    return linhasAfetadas;

}

export async function EstatisticaOfensiva(id) {

    if (!id || isNaN(id)) {

        throw new Error(`O ID que você digitou está errado ou não existe`)

    }

    let checkins = await db.buscarCheckIns(id);

    if (checkins.length === 0) {

        return { total_dias: 0, ofensiva_atual: 0};

    }

    let TotalDias = checkins.length;
    let ofensivaAtual = 0;

    let hoje = new Date();
    hoje.setHours( 0, 0, 0, 0 );

    let dataMaisRecente = new Date(checkins[0].data_checkin);
    dataMaisRecente.setHours(0, 0, 0, 0);

    const umDia = 1000 * 60 * 60 * 24;
    let diferencaParaHoje = (hoje - dataMaisRecente) / umDia;

    if (diferencaParaHoje > 1) {
        return { total_dias: TotalDias, ofensiva_atual: 0 };
    }
    ofensivaAtual = 1;

    for (let i = 0; i < checkins.length - 1; i++) {

        let dataAtual = new Date(checkins[i].data_checkin);
        dataAtual.setHours(0, 0, 0, 0);

        let dataAnterior = new Date(checkins[i + 1].data_checkin);
        dataAnterior.setHours(0, 0, 0, 0);

        let diferencaEntreEles = (dataAtual - dataAnterior) / umDia;

        if (diferencaEntreEles === 1) {
            ofensivaAtual++;
        }
        else if (diferencaEntreEles > 1) {
            break;
        }

    }

    return { 
        total_dias: TotalDias, 
        ofensiva_atual: ofensivaAtual 
    };
}