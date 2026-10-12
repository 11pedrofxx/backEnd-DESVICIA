import connection from "./connection.js";

export async function SalvarCheckinGatilho(checkin_id, gatilho_id) {

    const command = `
    insert into checkin_gatilhos (checkin_id, gatilho_id)
    values (?, ?)
    `

    let resposta = await connection.query(command, [checkin_id, gatilho_id]);
    return resposta[0].affectedRows;

}