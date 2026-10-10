import { Router } from "express";
import * as db from '../service/gatilhosService.js'

const endpoints = Router();

endpoints.post ('/gatilhos' , async (req, resp) => {

try {
    
    let gatilho = req.body
    let id = await db.postGatilhoService(gatilho)
    resp.send({id})

} catch (error) {
    
    resp.status(400).send(ErrorDefault(error))

}

})

endpoints.get('/gatilhos', async (req, resp) =>{

    try {
        let gatilhos = await db.buscarGatilhosService();
        resp.send(gatilhos)

    } catch (error) {
         resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.delete('/gatilhos/:id' , async (req, resp) => {

    try {
        let id = req.params.id
        let linhasAfetadas = await db.DeleteService(id);
        resp.send({
            linhasAfetadas: linhasAfetadas
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

export default endpoints