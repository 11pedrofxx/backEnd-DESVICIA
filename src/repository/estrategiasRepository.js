import connection  from './connection.js';

export async function inserirEstrategia(dados) {
    const command = `
        INSERT INTO estrategias_enfrentamento (titulo, personalizado, usuario_id) 
        VALUES (?, ?, ?);
    `;
    
    let resposta = await connection.query(command, [
        dados.titulo, 
        dados.personalizado, 
        dados.usuario_id || null 
    ]);
    
    return resposta[0].insertId;
}

export async function buscarEstrategias(usuario_id) {
    const command = `
        SELECT * FROM estrategias_enfrentamento 
        WHERE personalizado = false OR usuario_id = ?
        ORDER BY id DESC;
    `;
    
    let resposta = await connection.query(command, [usuario_id]);
    return resposta[0];
}

export async function buscarEstrategiaPorId(id) {
    const command = `SELECT * FROM estrategias_enfrentamento WHERE id = ?`;
    let resposta = await connection.query(command, [id]);
    return resposta[0][0];
}

export async function deletarEstrategia(id) {
    const command = `DELETE FROM estrategias_enfrentamento WHERE id = ?`;
    let resposta = await connection.query(command, [id]);
    return resposta[0].affectedRows;
}