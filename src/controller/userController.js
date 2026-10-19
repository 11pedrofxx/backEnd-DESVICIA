import { Router } from "express";
import * as db from "../service/userService.js";
import { validarRecaptcha } from "../service/recaptchaService.js";

const endpoints = Router();

endpoints.post('/User', async (req, resp) => {
    try {
        let usuario = req.body;
        let resposta = await validarRecaptcha(usuario.token)
        if (!resposta) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let id = await db.cadastrarUsuario(usuario);
        resp.send({ id });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/usuario', async (req, resp) => {
    try {
        let id = req.query.id;
        let usuario = await db.buscarUserByID(id);
        resp.send(usuario);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/login', async (req, resp) => {
    try {
        let email = req.body.email;
        let senha = req.body.senha;
        let token = req.body.token;
        let resposta = await validarRecaptcha(token)
        if (!resposta) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let usuario = await db.loginUser(email, senha);
        resp.send({
            mensagem: `Seja bem-vindo, ${usuario.nome}!`,
            usuario: usuario
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/esquecer-senha', async (req, resp) => {
    try {
        let email = req.body.email;
        let objeto = await db.EsquecerSenha(email);
        resp.send(objeto);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/validar-codigo', async (req, resp) => {
    try {
        let email = req.body.email;
        let codigoDigitado = req.body.codigoDigitado;
        let validacao = await db.ValidarCodigo(email, codigoDigitado);
        resp.send(validacao);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.put('/redefinir-senha', async (req, resp) => {
    try {
        let email = req.body.email;
        let SenhaNova = req.body.senha;
        let linhasAfetadas = await db.MudarSenha(email, SenhaNova);
        resp.send({ linhasAfetadas });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;