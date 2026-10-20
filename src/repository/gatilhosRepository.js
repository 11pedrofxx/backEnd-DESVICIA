import connection from "./connection.js";

export async function postGatilho(idUsuario, gatilho) {
    const command = `
        insert into gatilhos (nome, personalizado, usuario_id)
        values (?, ?, ?)
    `;

    let resposta = await connection.query(command, [
        gatilho.nome,
        true,
        idUsuario
    ]);
    let info = resposta[0];
    return info.insertId;
}

export async function BuscarGatilhoByNome(nome, idUsuario) {
    const command = `
        select * from gatilhos
        where nome = ? and (personalizado = false or usuario_id = ?)
    `;

    let resposta = await connection.query(command, [nome, idUsuario]);
    return resposta[0];
}

export async function buscarGatilhos(idUsuario) {
    const command = `
        select * from gatilhos
        where personalizado = false or usuario_id = ?
    `;

    let resposta = await connection.query(command, [idUsuario]);
    return resposta[0];
}

export async function deletarGatilho(id, idUsuario) {
    const command = `
        delete from gatilhos
        where id = ? and usuario_id = ?
    `;

    let resposta = await connection.query(command, [id, idUsuario]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;
}