import * as db from '../repository/estrategiasRepository.js';
import { validarEstrategia } from '../validation/EstrategiasValidation/Estrategias.js';

export async function adicionarEstrategiaService(idUsuario, dados) {
    validarEstrategia(dados);
    dados.usuario_id = idUsuario;
    dados.personalizado = true;
    let id = await db.inserirEstrategia(idUsuario, dados);
    return id;
}

export async function listarEstrategiasService(idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
        throw new Error("ID do usuário inválido para a busca.");
    }

    let estrategias = await db.buscarEstrategias(idUsuario);
    return estrategias;
}''

export async function deleteEstrategia(id, idUsuario) {
    let estrategia = await db.buscarEstrategiaPorId(id);
    
    if (!estrategia) {
        throw new Error('O ID informado não existe.');
    }

    if (estrategia.personalizado === 0 || estrategia.personalizado === false) {
        throw new Error('Não podes apagar uma estratégia padrão do sistema.');
    }

    if (estrategia.usuario_id !== Number(idUsuario)) {
        throw new Error('Você não tem permissão para apagar esta estratégia.');
    }

    let linhasafetadas = await db.deletarEstrategia(id, idUsuario);
    return linhasafetadas;
}