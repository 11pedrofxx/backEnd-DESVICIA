import * as db from '../repository/estrategiasRepository.js';
import { validarEstrategia } from '../validation/EstrategiasValidation/Estrategias.js';

export async function adicionarEstrategiaService(dados) {
    
    validarEstrategia(dados);
    dados.personalizado = dados.usuario_id ? true : false;
    let id = await db.inserirEstrategia(dados);
    return id;
}

export async function listarEstrategiasService(usuario_id) {
    if (!usuario_id || isNaN(usuario_id)) {
        throw new Error("ID do usuário inválido para a busca.");
    }

    let estrategias = await db.buscarEstrategias(usuario_id);
    return estrategias;
}

export async function deleteEstrategia(id) {
    let estrategia = await db.buscarEstrategiaPorId(id);
    
    if (!estrategia) {
        throw new Error('O ID informado não existe.');
    }

    if (estrategia.personalizado === 0 || estrategia.personalizado === false) {
        throw new Error('Não podes apagar uma estratégia padrão do sistema.');
    }

    let linhasafetadas = await db.deletarEstrategia(id);
    return linhasafetadas;
}