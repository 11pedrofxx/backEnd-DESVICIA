import { Router } from "express";
import * as db from '../service/gatilhosService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/gatilhos', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let gatilho = req.body;
        let id = await db.postGatilhoService(idUsuario, gatilho);
        resp.send({ id });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/gatilhos', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let gatilhos = await db.buscarGatilhosService(idUsuario);
        resp.send(gatilhos);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.delete('/gatilhos/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let idUsuario = req.user.id;
        let linhasAfetadas = await db.DeleteService(id, idUsuario);
        resp.send({
            linhasAfetadas: linhasAfetadas
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;