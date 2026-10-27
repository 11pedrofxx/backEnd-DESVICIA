import { Router } from "express";
import * as db from "../service/userService.js";
import { validarRecaptcha } from "../service/recaptchaService.js";
import { generateToken, getAuthentication } from "../utils/jwt.js";
import { enviarEmailCodigo } from "../service/EmailService.js";
const endpoints = Router();

endpoints.post('/usuario/pre-cadastro', async (req, resp) => {

    try {
        let usuario = req.body;
        let captcha = await validarRecaptcha(usuario.token);
        if (!captcha) {
            throw new Error('Confirmação do reCAPTCHA pendente ou inválida.');
        }

        let respo = await db.preCadastro(usuario);
        console.log("Dados retornados para o e-mail:", respo);
        await enviarEmailCodigo(respo.email, respo.codigo);

        resp.send({
            mensagem: 'Código de verificação gerado com sucesso.',
            email: respo.email
        });
    } catch (error) {
        console.error("Erro no pré-cadastro:", error);
        resp.status(400).send(ErrorDefault(error));
    }

})


endpoints.post('/usuario/confirmar-cadastro', async (req, resp) => {
    try {
        let { email, codigo } = req.body;

        if (!email || !codigo) {
            throw new Error('E-mail e código são obrigatórios.');
        }

        let usuarioCriado = await db.CadastroUser({ email, codigo });

        const token = generateToken({
            id: usuarioCriado.id,
            nome: usuarioCriado.nome,
            email: usuarioCriado.email
        });

        resp.send({
            mensagem: 'Conta confirmada e criada com sucesso!',
            usuario: usuarioCriado,
            token
        });
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
endpoints.post('/esqueci-senha', async (req, resp) => {
    try {
        let email = req.body.email;
        let mensagem = await db.solicitarRecuperacaoLinkService(email);
        resp.send(mensagem);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/redefinir-senha', async (req, resp) => {
    try {
        let token = req.body.token;
        let novaSenha = req.body.novaSenha;
        let resultado = await db.redefinirSenhaPorTokenService(token, novaSenha);
        resp.send(resultado);
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

endpoints.get('/usuario', getAuthentication(), async (req, resp) => {
    try {

        let id = req.user.id; 
        let usuario = await db.buscarUserByID(id);
        resp.send(usuario);
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.get('/apresentacao/status', getAuthentication(), async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        let terminou = await db.checarStatusApresentacao(idUsuario);
        resp.send({ viuApresentacao: terminou });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});

endpoints.post('/apresentacao/concluir', getAuthentication(), async (req, resp) => {
    try {
        let idUsuario = req.user.id;
        await db.marcarApresentacaoComoConcluida(idUsuario);
        resp.send({ mensagem: "Apresentação concluída!" });
    } catch (error) {
        resp.status(400).send(ErrorDefault(error));
    }
});
export default endpoints;