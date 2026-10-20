import { Router } from "express"
import * as db from "../service/checkinDiarioService.js"
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
endpoints.use(getAuthentication());

endpoints.post('/checkin', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let dados = req.body;

        let id = await db.CheckinDiarioService(idUsuario, dados);
        resp.send({
            msg: `Checkin Diário feito com Sucesso.`,
            id
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/buscarCheckins', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let registro = await db.getCheckins(idUsuario);
        resp.send(registro);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.put('/checkin/:id', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let idCheckin = req.params.id;
        let dados = req.body;

        let linhasafetadas = await db.editCheckin(dados, idCheckin, idUsuario);
        resp.send({ linhasafetadas });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.delete('/checkin/:id', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let idCheckin = req.params.id;
        let linhasAfetadas = await db.deleteCheckin(idCheckin, idUsuario);
        resp.send({ linhasAfetadas });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/ofensiva', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let status = await db.EstatisticaOfensiva(idUsuario);
        resp.send(status);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;