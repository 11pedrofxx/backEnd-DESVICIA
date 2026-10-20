import { Router } from 'express';
import { adicionarEstrategiaService, deleteEstrategia, listarEstrategiasService } from '../service/estrategiasService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/estrategia', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let dados = req.body;
        let id = await adicionarEstrategiaService(idUsuario, dados);

        resp.status(201).send({
            id: id,
            msg: "Estratégia de enfrentamento criada com sucesso."
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/estrategias', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let estrategias = await listarEstrategiasService(idUsuario);

        resp.status(200).send(estrategias);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.delete('/estrategias/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let idUsuario = req.user.id;
        let linhasafetadas = await deleteEstrategia(id, idUsuario);

        resp.send({
            msg: "Estratégia eliminada com sucesso."
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;