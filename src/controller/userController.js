import { Router  } from "express";
import { buscarUserByID, cadastrarUsuario, EsquecerSenha, MudarSenha, ValidarCodigo} from "../service/userService.js";
import { loginUser } from "../service/userService.js";

const endpoints = Router();

endpoints.post('/User', async (req, resp) => {

    try {
        
        let usuario = req.body;
        let id = await cadastrarUsuario(usuario);
        resp.send({id})

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }


})

endpoints.get('/usuario', async (req, resp) => {

    try {

    let id = req.query.id;
    let usuario = await buscarUserByID(id);
    resp.send(usuario)

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

    

})

endpoints.post ('/login', async (req, resp) => {

    try {
         
        let email = req.body.email;
        let senha = req.body.senha;

        let usuario = await loginUser(email, senha);
        resp.send({
            mensagem: `Seja bem-vindo, ${usuario.nome}!`,
            usuario: usuario
        });

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }

})

endpoints.post('/esquecer-senha', async (req, resp) => {
    try {
        
        let email = req.body.email;
        let objeto = await EsquecerSenha(email)
        resp.send(objeto)

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
})

endpoints.post('/validar-codigo', async (req, resp) => {
    try {
        
        let email = req.body.email;
        let codigoDigitado = req.body.codigoDigitado
        let validacao = await ValidarCodigo(email, codigoDigitado)
        resp.send(validacao);

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
})

endpoints.put('/redefinir-senha', async (req, resp) => {
    try {
        
        let email = req.body.email;
        let SenhaNova = req.body.senha
        let linhasAfetadas = await MudarSenha(email, SenhaNova);
        resp.send({linhasAfetadas});

    } catch (error) {
        resp.status(400).send(ErrorDefault(error))
    }
})

export default endpoints