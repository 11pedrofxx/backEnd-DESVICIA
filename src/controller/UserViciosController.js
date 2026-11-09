import { Router } from "express";
import * as repository from "../repository/UserViciosRepository.js";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
endpoints.use(getAuthentication());

function obterUsuarioId(req) {
    const id = Number(req.user?.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        const erro = new Error("Usuário não autenticado ou token inválido.");
        erro.status = 401;
        throw erro;
    }
    return id;
}

function validarDataInicio(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        const erro = new Error("dataInicio deve estar no formato YYYY-MM-DD.");
        erro.status = 400;
        throw erro;
    }

    const data = new Date(`${valor}T00:00:00.000Z`);
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) {
        const erro = new Error("dataInicio não é uma data válida.");
        erro.status = 400;
        throw erro;
    }

    return valor;
}

function responderErro(resp, error) {
    console.error("Erro nas rotas de hábitos:", error);
    return resp.status(error.status || 500).json({
        erro: error.message || "Não foi possível processar os hábitos."
    });
}

// Vincula um hábito padrão já existente na tabela vicios.
endpoints.post("/userVicio", async (req, resp) => {
    try {
        const usuarioId = obterUsuarioId(req);
        const vicioId = Number(req.body?.VicioID);
        const dataInicio = validarDataInicio(req.body?.dataInicio);

        if (!Number.isSafeInteger(vicioId) || vicioId <= 0) {
            const erro = new Error("VicioID deve ser um número inteiro positivo.");
            erro.status = 400;
            throw erro;
        }

        const linhasAfetadas = await repository.vincularVicio(
            usuarioId,
            vicioId,
            dataInicio
        );

        return resp.status(200).json({
            msg: "Hábito vinculado com sucesso.",
            linhasAfetadas
        });
    } catch (error) {
        return responderErro(resp, error);
    }
});

// Cria (ou reutiliza) um hábito personalizado e o vincula ao usuário.
endpoints.post("/userVicioPersonalizado", async (req, resp) => {
    try {
        const usuarioId = obterUsuarioId(req);
        const nomeVicio = typeof req.body?.nomeVicio === "string"
            ? req.body.nomeVicio.trim().replace(/\s+/g, " ")
            : "";
        const dataInicio = validarDataInicio(req.body?.dataInicio);

        if (!nomeVicio) {
            const erro = new Error("Informe o nome do hábito personalizado.");
            erro.status = 400;
            throw erro;
        }
        if (nomeVicio.length > 50) {
            const erro = new Error("O nome do hábito deve ter no máximo 50 caracteres.");
            erro.status = 400;
            throw erro;
        }

        const id = await repository.criarVicioPersonalizado(
            usuarioId,
            nomeVicio,
            dataInicio
        );

        return resp.status(201).json({
            msg: "Hábito personalizado cadastrado e vinculado com sucesso!",
            id
        });
    } catch (error) {
        return responderErro(resp, error);
    }
});

export default endpoints;
