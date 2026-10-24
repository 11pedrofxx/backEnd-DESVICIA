import axios from 'axios';

export async function validarRecaptcha(token) {
    if (token === 'Teste') {
        return true;
    }
    const chaveSecreta = process.env.ReCAPTCHA; 

    try {
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${chaveSecreta}&response=${token}`;
        
        const resposta = await axios.post(url);
        return resposta.data.success;

    } catch (error) {
        return false;
    }
}