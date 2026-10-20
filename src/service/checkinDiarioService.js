import * as db from '../repository/checkinDiarioRepository.js';
import checkinValidation from '../validation/checkinValidation.js';
import { SalvarCheckinGatilhoService } from './CheckinGatilhoService.js';
import { adicionarConquistaService } from './ConquistasService.js';

export async function CheckinDiarioService(idUsuario, dados) {
    dados.usuario_id = idUsuario;
    checkinValidation(dados);

    let data_existente = await db.validarData(idUsuario, dados.data_checkin);
    if (data_existente) {
        throw new Error(`Você já fez o seu Checkin Diário. Fique tranquilo(a)`);
    }

    let id = await db.fazerCheckin(idUsuario, dados);

    if (dados.gatilhos_sentidos && dados.gatilhos_sentidos.length > 0) {
        for (let gatilho_id of dados.gatilhos_sentidos) {
            await SalvarCheckinGatilhoService(id, gatilho_id, idUsuario);
        }
    }

    let status = await EstatisticaOfensiva(idUsuario);
    let diasAtuais = status.ofensiva_atual;

    if (diasAtuais >= 1) {
        await adicionarConquistaService(idUsuario, 3);
    }
    if (diasAtuais >= 3) {
        await adicionarConquistaService(idUsuario, 4);
    }
    if (diasAtuais >= 7) {
        await adicionarConquistaService(idUsuario, 5);
    }
    if (diasAtuais >= 30) {
        await adicionarConquistaService(idUsuario, 6);
    }
    if (diasAtuais >= 60) {
        await adicionarConquistaService(idUsuario, 7);
    }
    if (diasAtuais >= 100) {
        await adicionarConquistaService(idUsuario, 8);
    }

    return id;
}

export async function getCheckins(idUsuario) { 
    if (!idUsuario || isNaN(idUsuario)) {
        throw new Error(`O ID que você digitou está errado ou não existe`);
    }

    let registro = await db.buscarCheckIns(idUsuario);
    if (registro.length === 0) {
        throw new Error(`Nenhum check-in encontrado para este usuário.`);
    }
    return registro;
}

export async function editCheckin(dados, idCheckin, idUsuario) {
    if (!idCheckin || isNaN(idCheckin)) {
        throw new Error(`O ID que você digitou está errado ou não existe`);
    }

    let linhasafetadas = await db.editarCheckin(dados, idCheckin, idUsuario);

    if (linhasafetadas === 0) {
        throw new Error("Nenhum check-in encontrado com este ID.");
    }

    return linhasafetadas;
}

export async function deleteCheckin(idCheckin, idUsuario) {
    if (!idCheckin || isNaN(idCheckin)) {
        throw new Error(`O ID que você digitou está errado ou não existe`);
    }

    let linhasAfetadas = await db.deletarCheckin(idCheckin, idUsuario);
    if (linhasAfetadas === 0) {
        throw new Error(`Esse ID não existe. Tente novamente.`);
    }

    return linhasAfetadas;
}

export async function EstatisticaOfensiva(idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
        throw new Error(`O ID que você digitou está errado ou não existe`);
    }

    let checkins = await db.buscarCheckIns(idUsuario);

    if (checkins.length === 0) {
        return { total_dias: 0, ofensiva_atual: 0 };
    }

    let TotalDias = checkins.length;
    let ofensivaAtual = 0;

    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

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