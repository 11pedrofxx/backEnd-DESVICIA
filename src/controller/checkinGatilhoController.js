import { Router } from "express";
import * as db from '../service/CheckinGatilhoService.js'
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
endpoints.use(getAuthentication());

endpoints.post('/CheckinGatilho', async (req, resp) => {
    try {
        const idUsuario = req.user.id; 
        const { checkin_id, gatilho_id } = req.body;

        const id = await db.SalvarCheckinGatilhoService(checkin_id, gatilho_id, idUsuario);

        resp.send({ id });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints