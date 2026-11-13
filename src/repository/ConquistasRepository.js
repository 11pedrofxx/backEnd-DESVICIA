import connection from './connection.js';

export async function VincularConquista(idUsuario, conquista_id) {
    const command = `
        insert ignore into usuarios_conquistas (usuario_id, conquista_id) 
        values (?, ?);
    `;

    let resposta = await connection.query(command, [idUsuario, conquista_id]);
    return resposta[0].affectedRows;
}

export async function listarConquistasUsuario(idUsuario) {
    const command = `
        select 
            c.id, 
            c.titulo, 
            c.dias_meta,
            uc.data_conquista
        from conquistas c
        left join usuarios_conquistas uc 
            ON c.id = uc.conquista_id AND uc.usuario_id = ?
        ORDER BY c.dias_meta ASC;
    `;
    let resposta = await connection.query(command, [idUsuario]);
    return resposta[0];
}