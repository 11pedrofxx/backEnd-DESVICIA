import connection from './connection.js';

export async function CadastrarVicio(idUsuario, nome) {
    const command = `
        insert into vicios (nome, personalizado, usuario_id)
        values (?, ?, ?)
    `;

    const [result] = await connection.query(command, [nome, true, idUsuario]);
    return result.insertId;
}

export const postVicioRepository = CadastrarVicio;

export async function consultarVicios(idUsuario) {
    const command = `
        select * from vicios
        where personalizado = false or usuario_id = ?
    `;
    
    let resposta = await connection.query(command, [idUsuario]);
    let registros = resposta[0];
    return registros;
}

export async function deletarVicios(id, idUsuario) {
    const command = `
        delete from vicios
        where id = ? and usuario_id = ?
    `;

    let resposta = await connection.query(command, [id, idUsuario]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;
}