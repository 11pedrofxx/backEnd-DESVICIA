import connection from './connection.js';

export async function inserirContato(usuario_id, nome, telefone) {
    const command = `
        INSERT INTO contatos_emergencia (usuario_id, nome, telefone)
        VALUES (?, ?, ?)
    `;

    const [result] = await connection.query(command, [usuario_id, nome, telefone]);
    return result.insertId;
}

export async function consultarContatos(usuario_id) {
    const command = `
        SELECT * FROM contatos_emergencia 
        WHERE usuario_id = ?
    `;
    
    let resposta = await connection.query(command, [usuario_id]);
    let registros = resposta[0];
    return registros;
}

export async function deletarContato(id) {
    const command = `
        DELETE FROM contatos_emergencia
        WHERE id = ?
    `;

    let resposta = await connection.query(command, [id]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;
}