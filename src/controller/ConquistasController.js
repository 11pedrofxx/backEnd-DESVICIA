import { Router } from "express";
import * as db from '../service/ConquistasService.js';

const endpoints = Router();

endpoints.post('/conquistas/vincular', async (req, resp) => {

    try {
        let usuario_id = req.body
        let conquista_id = req.body
        await db.adicionarConquistaService(usuario_id, conquista_id);

        resp.status(201).send(
            { msg: "Conquista processada com sucesso." }
        );
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
   
})

endpoints.get('/conquistas/:idUsuario', async (req, resp) => {
    try {
        let id = req.params.idUsuario;
        let conquistas = await db.listarConquistasService(id);
        
        resp.status(200).send(conquistas);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

export default endpoints