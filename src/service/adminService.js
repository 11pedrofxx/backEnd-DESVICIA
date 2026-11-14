import bcrypt from 'bcrypt';
import * as db from '../repository/adminRepository.js'
import jwt from 'jsonwebtoken'


export async function LoginADMService(email, senha) {

    if (!email || email === '') {
        throw new Error('Você deve informar o email');
    }
    if (!senha || senha === '') {
        throw new Error('Você deve informar a senha');
    }

    let usuario = await db.BuscarEmail(email);
    if (!usuario) {
        throw new Error('Você precisa ser um adm para acessar')
    }

    let senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
        throw new Error('Usuario ou senha incorreta')
    }

    const KEY = process.env.JWT_SECRET
    const payload = {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo
    }

    return jwt.sign(payload, KEY, { expiresIn: '2h' });
}

export async function TotalUsuariosService() {

    let total = await db.TotalUser();
    return total;

} 
export async function TotalCheckinsService() {

    let total = await db.TotalCheckins();
    return total;

} 