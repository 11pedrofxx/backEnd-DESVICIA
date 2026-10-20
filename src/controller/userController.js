import { Router } from "express";
import * as db from "../service/userService.js";
import { validarRecaptcha } from "../service/recaptchaService.js";
import { generateToken, getAuthentication } from "../utils/jwt.js";
const endpoints = Router();

endpoints.post('/User', async (req, resp) => {
    try {
        let usuario = req.body;
        let resposta = await validarRecaptcha(usuario.token);
        if (!resposta) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let id = await db.cadastrarUsuario(usuario);
        resp.send({ id });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/login', async (req, resp) => {
    try {
        let email = req.body.email;
        let senha = req.body.senha;
        let captchaToken = req.body.captchaToken;
        
        let resposta = await validarRecaptcha(captchaToken);
        if (!resposta) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let usuario = await db.loginUser(email, senha);

        let token = generateToken({ id: usuario.id, email: usuario.email, role: usuario.role });

        resp.send({
            mensagem: `Seja bem-vindo, ${usuario.nome}!`,
            usuario: usuario,
            token: token
        });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/login/google', async (req, resp) => {
    try {
        let googleToken = req.body.googleToken;
        let usuario = await db.loginComGoogle(googleToken);

        let token = generateToken({ id: usuario.id, email: usuario.email, role: usuario.role });

        resp.send({
            mensagem: `Seja bem-vindo, ${usuario.nome}!`,
            usuario: usuario,
            token: token 
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

endpoints.get('/usuario', getAuthentication(), async (req, resp) => {
    try {

        let id = req.user.id; 
        let usuario = await db.buscarUserByID(id);
        resp.send(usuario);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

export default endpoints;