import { Router } from "express";
import * as db from '../service/adminService.js';
import { validarRecaptcha } from "../service/recaptchaService.js";
import { autenticarAdmin } from "../utils/jwt.js";

const endpoints = Router();

endpoints.post('/loginADM' , async (req, resp) => {
    try {
        let email = req.body.email;
        let senha = req.body.senha;

        let token = req.body.token;
        let captcha = await validarRecaptcha(token);
        if (!captcha) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let jwt = await db.LoginADMService(email, senha);
        resp.send({
            msg: 'Bem vindo ADM!',
            token: jwt
        })
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
})

endpoints.get('/todosUsuarios', autenticarAdmin, async (req, resp) => {

    try {
        let total = await db.TotalUsuariosService();
        resp.send(total);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }

})

endpoints.get('/TodosCheckins', autenticarAdmin, async (req, resp) => {

    try {
        let total = await db.TotalCheckinsService();
        resp.send(total);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }

})