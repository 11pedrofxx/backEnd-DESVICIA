import connection from './connection.js';

export async function VincularConquista(usuario_id, conquista_id) {

    const command = `
    INSERT INTO usuarios_conquistas (usuario_id, conquista_id) 
        VALUES (?, ?);
    `

    let resposta = await connection.query(command, [usuario_id, conquista_id]);
    return resposta[0].affectedRows;

}

export async function listarConquistasUsuario(usuario_id) {
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
    let resposta = await connection.query(command, [usuario_id]);
    return resposta[0];
}