import { Router  } from "express";
import { cadastrarUsuario } from "../service/userService";
const endpoints = Router();

endpoints.post('/User', async (req, resp) => {

    try {
        
         let usuario = req.body;
         let id = await cadastrarUsuario(usuario);
         resp.send(id)

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }


})

export default endpoints