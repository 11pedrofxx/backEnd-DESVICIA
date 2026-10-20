import { Router } from "express";
import * as DB from '../service/UserViciosService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/userVicio', async (req, resp) => {
    try {
        let UserID = req.user.id;
        let VicioID = req.body.VicioID;
        let dataInicio = req.body.dataInicio;
        let linhasAfetadas = await DB.vincVicio(UserID, VicioID, dataInicio);
        resp.send({
            msg: `Usuario vinculado ao vicio`,
            linhasAfetadas: linhasAfetadas
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/userVicioPersonalizado', async (req, resp) => {
    try {
        let UserID = req.user.id;
        let { nomeVicio, dataInicio } = req.body;
        
        let id = await DB.Vicio(UserID, null, nomeVicio, dataInicio);
        
        resp.send({
            msg: "Vício personalizado cadastrado e vinculado com sucesso!",
            id: id
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;