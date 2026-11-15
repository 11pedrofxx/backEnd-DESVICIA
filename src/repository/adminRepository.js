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
    return resposta[0];
}

export async function TotalCheckins() {
    const command = `
    select count(*) from checkins_diarios
    `

    let resposta = await connection.query(command);
    return resposta[0];
}

export async function buscarCheckIns() {
    const command = `
    select usuario_id, data_checkin from checkins_diarios
    order by usuario_id,
    data_checkin asc;
    `
    let [resposta] = await connection.query(command);
    return resposta;
}

export async function MediaGatilhos() {

    const command = `
    select gatilhos.nome as gatilho,
    count(checkin_gatilhos.gatilho_id) as total,
    (count(checkin_gatilhos.gatilho_id) * 100.0 / (select count(*) from checkin_gatilhos)) as porcentagem
    from gatilhos
    join checkin_gatilhos on gatilhos.id = checkin_gatilhos.gatilho_id
    group by gatilhos.id, gatilhos.nome
    order by total desc;
        `

    let [resposta] = await connection.query(command);
    return resposta;

}

export async function MediaHumor() {

    const command = `
    select  nivel_humor, count(*) as total, (count(*) * 100.0 / (select count(*) from checkins_diarios)) as media
        from checkins_diarios
        group by nivel_humor
        order by nivel_humor asc;
        `

    let [resposta] = await connection.query(command);
    return resposta;

}