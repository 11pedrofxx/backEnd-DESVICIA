import connection from './connection.js';

export async function inserirEstrategia(idUsuario, dados) {
    const command = `
        insert into estrategias_enfrentamento (titulo, personalizado, usuario_id) 
        values (?, ?, ?);
    `;
    
    let resposta = await connection.query(command, [
        dados.titulo, 
        true, 
        idUsuario 
    ]);
    
    return resposta[0].insertId;
}

export async function buscarEstrategias(idUsuario) {
    const command = `
        select * FROM estrategias_enfrentamento 
        where personalizado = false or usuario_id = ?
        order by id desc;
    `;
    
    let resposta = await connection.query(command, [idUsuario]);
    return resposta[0];
}

export async function buscarEstrategiaPorId(id) {
    const command = `SELECT * FROM estrategias_enfrentamento WHERE id = ?`;
    let resposta = await connection.query(command, [id]);
    return resposta[0][0];
}

export async function deletarEstrategia(id, idUsuario) {
    const command = `DELETE FROM estrategias_enfrentamento WHERE id = ? AND usuario_id = ?`;
    let resposta = await connection.query(command, [id, idUsuario]);
    return resposta[0].affectedRows;
}