import connection from "./connection.js";

export async function vincularVicio(idUsuario, vicioId, dataInicio) {
    const command = `
        insert into usuarios_vicios (usuario_id, vicio_id, data_inicio)
        values (?, ?, ?)
    `;

    let resposta = await connection.query(command, [idUsuario, vicioId, dataInicio]);
    let info = resposta[0];
    return info.affectedRows;
}

export async function consultarVinculo(idUsuario, vicioId) {
    const command = `
        select * from usuarios_vicios 
        where usuario_id = ? and vicio_id = ?
    `;
    let [linhas] = await connection.query(command, [idUsuario, vicioId]);
    return linhas[0];
}