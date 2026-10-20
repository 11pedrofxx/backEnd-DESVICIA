import { Router } from "express";
import * as db from '../service/contatosEmergService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();

endpoints.use(getAuthentication());

endpoints.post('/contato', async (req, resp) => {
    try {
        let usuario_id = req.user.id;
        let nome = req.body.nome;
        let telefone = req.body.telefone;

        let idInserido = await db.adicionarContato(usuario_id, nome, telefone);

        resp.status(201).send({
            msg: "Contato de emergência salvo com sucesso!",
            id: idInserido
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/contatos', async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let contatos = await db.listarContatos(idUsuario);
        
        resp.status(200).send(contatos);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.delete('/contatos/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let usuario_id = req.user.id;
        let linhasAfetadas = await db.removerContato(id, usuario_id);
        
        resp.status(200).send({
            msg: "Contato de emergência removido com sucesso.",
            linhasAfetadas: linhasAfetadas
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;