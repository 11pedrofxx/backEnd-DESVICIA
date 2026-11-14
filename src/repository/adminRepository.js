import connection from '../repository/connection.js';

export async function BuscarEmail(email) {
    const command = `
    select * from usuarios
    where email = ? and tipo = "admin"
    `

    let resposta = await connection.query(command, [email]);
    return resposta[0][0];
}

export async function TotalUser() {
    const command = `
    select count(*) from usuarios;
    `
    let resposta = await connection.query(command);
    return resposta[0][0].total;
}

export async function TotalCheckins() {
    const command = `
    select count(*) from checkins_diarios
    `

    let resposta = await connection.query(command);
    return resposta[0][0].total;
}