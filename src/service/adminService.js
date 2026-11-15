import bcrypt from 'bcrypt';
import * as db from '../repository/adminRepository.js'
import { EstatisticaOfensiva } from './checkinDiarioService.js';
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

export async function SequenciaMedia() {

    let checkins = await db.buscarCheckIns();

    let checkinsAgrupados = checkins.reduce((acumulador, atual) => {
        if (!acumulador[atual.usuario_id]) {
            acumulador[atual.usuario_id] = [];
        }
        acumulador[atual.usuario_id].push(atual.data_checkin);
        return acumulador;
    }, {});

    const usuariosIds = Object.keys(checkinsAgrupados);
    const totalUsuarios = usuariosIds.length;

    if (totalUsuarios === 0) {
        return { mediaSequencia: 0 };
    }

    let somaOfensivas = 0;

    for (let id of usuariosIds) {
        let estatistica = await EstatisticaOfensiva(id);
        somaOfensivas += estatistica.ofensiva_atual;
    }
    let mediaFinal = somaOfensivas / totalUsuarios;
    
    return { mediaSequencia: Number(mediaFinal.toFixed(1)) };
}

export async function GatilhosService() {
    let mediaGatilho = await db.MediaGatilhos();
    return mediaGatilho;
}

export async function MediaHumorService() {
    let media = await db.MediaHumor();
    return media;
}