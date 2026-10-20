import connection from './connection.js';

export async function VincularConquista(idUsuario, conquista_id) {
    const command = `
        INSERT INTO usuarios_conquistas (usuario_id, conquista_id) 
        VALUES (?, ?);
    `;

    let resposta = await connection.query(command, [idUsuario, conquista_id]);
    return resposta[0].affectedRows;
}

export async function listarConquistasUsuario(idUsuario) {
    const command = `
        SELECT 
            conquistas.id, 
            conquistas.titulo, 
            conquistas.dias_meta 
        FROM conquistas
        INNER JOIN usuarios_conquistas ON conquistas.id = usuarios_conquistas.conquista_id
        WHERE usuarios_conquistas.usuario_id = ?
        ORDER BY conquistas.dias_meta ASC;
    `;
    let resposta = await connection.query(command, [idUsuario]);
    return resposta[0];
}