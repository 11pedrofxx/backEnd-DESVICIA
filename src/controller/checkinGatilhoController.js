import { Router } from "express";
import * as db from '../service/CheckinGatilhoService.js'

const endpoints = Router();

endpoints.post('/CheckinGatilho', async (req, resp) => {

    try {
        
        let checkin_id = req.body.checkin_id;
        let gatilho_id = req.body.gatilho_id;
        let id = await db.SalvarCheckinGatilhoService(checkin_id, gatilho_id);
        resp.send(id);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

export default endpoints