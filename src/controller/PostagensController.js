import { Router } from "express";
import * as db from '../service/PostagensService.js';
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
endpoints.use(getAuthentication());

endpoints.post('/Postar', async (req, resp) => {
    try {
        let usuario_id = req.user.id || req.user; 
        let dados = req.body;

        dados.usuario_id = usuario_id;

        let id = await db.FazerPostService(dados);
        resp.status(201).send({ id });

    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

endpoints.get('/postagens', async (req, resp) => {
    
    try {
        let usuario_id = req.user.id || req.user;
        let dados = await db.BuscarPostagensService(usuario_id);
        resp.send(dados);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

endpoints.get('/postagens/categoria/:categoria', async (req, resp) => {
    
    try {
        let categoria = decodeURIComponent(req.params.categoria);
        let usuario_id = req.user.id || req.user;
        let dados = await db.BuscaPorCategoria(categoria, usuario_id);
        resp.send(dados);

    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }

})

endpoints.post('/apoiar/:id', async (req, resp) => {
    try {
        let postagem_id = req.params.id;
        let usuario_id = req.user.id || req.user;

        await db.ApoiarPostagemService(postagem_id, usuario_id);

        resp.status(200).send({
            message: 'Você apoiou essa publicação!'
        });
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

endpoints.post('/Remover-Like/:id', async (req, resp) => {
    try {
        let postagem_id = req.params.id;
        let usuario_id = req.user.id || req.user;

        await db.RemoverLikeService(postagem_id, usuario_id);

        resp.send({
            message: 'Apoio removido com sucesso'
        })
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
})

endpoints.post('/FazerComentario/:id', async (req, resp) => {
    try {
        let postagem_id = req.params.id
        let usuario_id = req.user.id || req.user;
        let {conteudo} = req.body;
        let id = await db.PostComentarioService(postagem_id, usuario_id, conteudo);

        resp.status(201).send({ id });

    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
})

endpoints.get('/BuscarComentarios/:id', async (req, resp) => {

    try {
        
        let postagem_id = req.params.id;
        let usuario_id = req.user.id || req.user;
        let comentarios = await db.BuscarComentariosService(postagem_id)
        resp.send(comentarios);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }

})


export default endpoints