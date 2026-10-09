import connection from './connection.js';

export async function fazerCheckin (dados) {

    const command = `   
        INSERT INTO checkins_diarios (
        usuario_id,
        data_checkin,
        nivel_humor,
        nivel_fissura,
        foi_dia_dificil,
        notas
    )
        VALUES ( ?, ?, ?, ?, ?, ?);
    `

    let resposta = await connection.query(command, [

        dados.usuario_id,
        dados.data_checkin,
        dados.nivel_humor,
        dados.nivel_fissura,
        dados.foi_dia_dificil,
        dados.notas
    ]);

    let info = resposta[0];
    let id = info.insertId;
    return id;

}

export async function validarData(usuario_id, data) {
    
    const command = `
    
    select * from checkins_diarios
    where usuario_id = ? and data_checkin = ?
    
    `

    let [linhas] = await connection.query(command, [usuario_id, data]);
    return linhas[0];

}

export async function buscarCheckIns(id) {

    const command = `
    
    select * from checkins_diarios
    where usuario_id = ?
    order by data_checkin desc;

    `

    const [linhas] = await connection.query(command, [id]);
    return linhas;

}

export async function editarCheckin(dados, id) {
    
    const command = `
        UPDATE checkins_diarios
        SET nivel_humor = ?,
            nivel_fissura = ?,
            foi_dia_dificil = ?,
            notas = ?
        WHERE id = ?
    `;

    let resposta = await connection.query(command, [
        dados.nivel_humor,
        dados.nivel_fissura,
        dados.foi_dia_dificil,
        dados.notas,
        id
    ]);

    let info = resposta[0];
    let linhasafetadas = info.affectedRows;
    return linhasafetadas;
}

export async function deletarCheckin(id) {

    const command = `
    
    delete from checkins_diarios
    where id = ?

    `

    let resposta = await connection.query(command , [id]);
    let info = resposta[0];
    return info.affectedRows;

}