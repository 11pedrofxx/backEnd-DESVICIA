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
            conquistas.id, 
            conquistas.titulo, 
            conquistas.dias_meta 
        from conquistas
        inner join usuarios_conquistas on conquistas.id = usuarios_conquistas.conquista_id
        where usuarios_conquistas.usuario_id = ?
        order by conquistas.dias_meta asc;
    `;
    let resposta = await connection.query(command, [idUsuario]);
    return resposta[0];
}