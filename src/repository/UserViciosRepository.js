import connection from "./connection.js"
export async function vincularVicio(UserID, VicioID, dataInicio) {
    
    const command = `
    
    INSERT INTO usuarios_vicios (usuario_id, vicio_id, data_inicio)
    VALUES (?, ?, ?)
    `;

    let resposta = await connection.query(command, [UserID, VicioID, dataInicio])
    let info = resposta[0];
    let resp = info.affectedRows;
    return resp;

}