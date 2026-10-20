import connection from './connection.js';

export async function inserirContato(idUsuario, nome, telefone) {
    const command = `
        INSERT INTO contatos_emergencia (usuario_id, nome, telefone)
        VALUES (?, ?, ?)
    `;

    const [result] = await connection.query(command, [idUsuario, nome, telefone]);
    return result.insertId;
}

export async function consultarContatos(idUsuario) {
    const command = `
        SELECT * FROM contatos_emergencia 
        WHERE usuario_id = ?
    `;
    
    let resposta = await connection.query(command, [idUsuario]);
    let registros = resposta[0];
    return registros;
}

export async function deletarContato(idContato, idUsuario) {
    const command = `
        DELETE FROM contatos_emergencia
        WHERE id = ? AND usuario_id = ?
    `;

    let resposta = await connection.query(command, [idContato, idUsuario]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;
}

export async function buscarContatoPorTelefone(idUsuario, telefone) {
    const command = `
        SELECT * FROM contatos_emergencia 
        WHERE usuario_id = ? AND telefone = ?;
    `;
    let resposta = await connection.query(command, [idUsuario, telefone]);
    return resposta[0][0];
}