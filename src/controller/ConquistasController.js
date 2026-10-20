import { Router } from "express";
import * as db from '../service/ConquistasService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/conquistas/vincular', async (req, resp) => {
    try {
        const idUsuario = req.user.id;
        const { conquista_id } = req.body;

        await db.adicionarConquistaService(idUsuario, conquista_id);

        resp.status(201).send({
            msg: "Conquista processada com sucesso."
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/conquistas', async (req, resp) => {
    try {
        const idUsuario = req.user.id;
        const conquistas = await db.listarConquistasService(idUsuario);

        resp.status(200).send(conquistas);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;