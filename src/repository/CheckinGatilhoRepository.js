import connection from "./connection.js";

export async function SalvarCheckinGatilho(checkin_id, gatilho_id) {
    const command = `
        INSERT INTO checkin_gatilhos (checkin_id, gatilho_id)
        VALUES (?, ?)
    `;

    let resposta = await connection.query(command, [checkin_id, gatilho_id]);
    return resposta[0].affectedRows;
}