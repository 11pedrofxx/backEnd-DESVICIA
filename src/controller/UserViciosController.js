import { Router } from "express";
import * as DB from '../service/UserViciosService.js'
const endpoints = Router();

endpoints.post ('/userVicio', async (req, resp) => {
    try {
        let UserID = req.body.UserID;
        let VicioID = req.body.VicioID;
        let dataInicio = req.body.dataInicio;
        let linhasAfetadas = await DB.vincVicio(UserID, VicioID, dataInicio);
        resp.send({
            msg: `Usuario vinculado ao vicio`,
            linhasAfetadas: linhasAfetadas
        })
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
})

export default endpoints;