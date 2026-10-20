import { Router } from "express";
import * as db from '../service/viciosService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/Vicios', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let vicio = req.body.nome;

        let idInserido = await db.postVicioService(idUsuario, vicio);

        resp.send(idInserido);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/listarvicios', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let vicios = await db.getVicios(idUsuario);
        resp.send(vicios);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.delete('/vicios/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let idUsuario = req.user.id;
        let linhasAfetadas = await db.deleteVicios(id, idUsuario);

        resp.send({
            msg: "Vicio deletado com sucesso.",
            linhasAfetadas: linhasAfetadas
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;