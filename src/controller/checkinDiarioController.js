import { Router } from "express"
import * as db from '../service/checkinDiario.js';

const endpoints = Router();

endpoints.post ('/checkin' , async (req, resp) => {

    try {
        
        let dados = req.body;
        let id = await db.CheckinDiarioService(dados);
        resp.send({

            msg: `Checkin Diário feito com Sucesso.`

        })

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.get ('/buscarCheckins/:id', async (req, resp) => {

    try {
    let id = req.params.id;
    let registro = await db.getCheckins(id);
    resp.send (registro);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.put ('/checkin/:id' , async (req, resp) => {

    try {
        
        let dados = req.body;
        let id = req.params.id;
        let linhasafetadas = await db.editCheckin(dados, id);
        resp.send(linhasafetadas);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

export default endpoints;