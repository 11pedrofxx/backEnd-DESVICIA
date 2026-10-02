import { Router  } from "express";
import * as db from '../service/viciosService.js'

const endpoints = Router();

endpoints.post('/Vicios', async (req, resp) => {

    try {
        let vicio = req.body.nome;

        let idInserido = await db.postVicioService(vicio);

       resp.send(idInserido)

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.get ('/listarvicios', async (req, resp) => {

    try {
    
        let vicios = await db.getVicios();
        resp.send(vicios);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.delete ('/deletar/:id', async (req, resp) => {

    try {
        let id = req.params.id
        let linhasAfetadas = await db.deleteVicios(id)
        resp.send (linhasAfetadas)
    } catch (error) {

        resp.status(400).send(ErrorDefault(error))
        
    }

})

export default endpoints