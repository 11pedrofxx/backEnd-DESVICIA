import { Router } from "express";
import * as DB from "../service/UserViciosService.js";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
endpoints.use(getAuthentication());

function validarDataInicio(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        throw new Error("dataInicio deve estar no formato YYYY-MM-DD.");
    }

    const data = new Date(`${valor}T00:00:00.000Z`);
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) {
        throw new Error("dataInicio não é uma data válida.");
    }
    return valor;
}

function obterUsuarioId(req) {
    const id = Number(req.user?.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        const erro = new Error("Usuário não autenticado ou token inválido.");
        erro.status = 401;
        throw erro;
    }
    return id;
}

function responderErro(resp, error) {
    console.error("Erro nas rotas de hábitos:", error);
    return resp.status(error.status || 400).json({
        erro: error.message || "Não foi possível processar os hábitos."
    });
}

// Vincula um hábito padrão já cadastrado na tabela de vícios.
endpoints.post("/userVicio", async (req, resp) => {
    try {
        const userId = obterUsuarioId(req);
        const vicioId = Number(req.body?.VicioID);
        const dataInicio = validarDataInicio(req.body?.dataInicio);

        if (!Number.isSafeInteger(vicioId) || vicioId <= 0) {
            throw new Error("VicioID deve ser um número inteiro positivo.");
        }

        const linhasAfetadas = await DB.vincVicio(userId, vicioId, dataInicio);
        return resp.status(200).json({
            msg: "Usuário vinculado ao hábito com sucesso.",
            linhasAfetadas
        });
    } catch (error) {
        return responderErro(resp, error);
    }
});

// Cria e vincula um hábito personalizado conforme a implementação do Service.
endpoints.post("/userVicioPersonalizado", async (req, resp) => {
    try {
        const userId = obterUsuarioId(req);
        const nomeVicio = typeof req.body?.nomeVicio === "string"
            ? req.body.nomeVicio.trim()
            : "";
        const dataInicio = validarDataInicio(req.body?.dataInicio);

        if (!nomeVicio) throw new Error("Informe o nome do hábito personalizado.");
        if (nomeVicio.length > 100) throw new Error("O nome do hábito deve ter no máximo 100 caracteres.");

        const id = await DB.Vicio(userId, null, nomeVicio, dataInicio);
        return resp.status(201).json({
            msg: "Hábito personalizado cadastrado e vinculado com sucesso!",
            id
        });
    } catch (error) {
        return responderErro(resp, error);
    }
});

export default endpoints;
