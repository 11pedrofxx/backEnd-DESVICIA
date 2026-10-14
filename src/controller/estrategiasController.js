import { Router } from 'express';
import { adicionarEstrategiaService, deleteEstrategia, listarEstrategiasService } from '../service/estrategiasService.js';

const endpoints = Router();

endpoints.post('/estrategia', async (req, resp) => {
    try {
        let dados = req.body;
        let id = await adicionarEstrategiaService(dados);
        
        resp.status(201).send({
            id: id,
            msg: "Estratégia de enfrentamento criada com sucesso."
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
});

endpoints.get('/estrategias/:id_usuario', async (req, resp) => {
    try {
        let id = req.params.id_usuario;
        let estrategias = await listarEstrategiasService(id);
        
        resp.status(200).send(estrategias);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
});

endpoints.delete('/estrategias/:id' , async (req, resp) => {
    try {
        let id = req.params.id;
        let linhasafetadas = await deleteEstrategia(id);

        resp.send({
            msg: "Estratégia eliminada com sucesso."
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
});

export default endpoints;