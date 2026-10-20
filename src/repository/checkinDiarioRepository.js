import connection from './connection.js';

export async function fazerCheckin(idUsuario, dados) {
    const command = `   
        INSERT INTO checkins_diarios (
            usuario_id,
            data_checkin,
            nivel_humor,
            nivel_fissura,
            foi_dia_dificil,
            notas
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    let resposta = await connection.query(command, [
        idUsuario,
        dados.data_checkin,
        dados.nivel_humor,
        dados.nivel_fissura,
        dados.foi_dia_dificil,
        dados.notas
    ]);

    let info = resposta[0];
    return info.insertId;
}

export async function validarData(idUsuario, data) {
    const command = `
        SELECT * FROM checkins_diarios
         WHERE usuario_id = ? AND data_checkin = ?
    `;

    let [linhas] = await connection.query(command, [idUsuario, data]);
    return linhas[0];
}

export async function buscarCheckIns(idUsuario) {
    const command = `
        SELECT * FROM checkins_diarios
         WHERE usuario_id = ?
      ORDER BY data_checkin DESC;
    `;

    const [linhas] = await connection.query(command, [idUsuario]);
    return linhas;
}

export async function editarCheckin(dados, idCheckin, idUsuario) {
    const command = `
        UPDATE checkins_diarios
           SET nivel_humor = ?,
               nivel_fissura = ?,
               foi_dia_dificil = ?,
               notas = ?
         WHERE id = ? AND usuario_id = ?
    `;

    let resposta = await connection.query(command, [
        dados.nivel_humor,
        dados.nivel_fissura,
        dados.foi_dia_dificil,
        dados.notas,
        idCheckin,
        idUsuario
    ]);

    let info = resposta[0];
    return info.affectedRows;
}

export async function deletarCheckin(idCheckin, idUsuario) {
    const command = `
        DELETE FROM checkins_diarios
         WHERE id = ? AND usuario_id = ?
    `;

    let resposta = await connection.query(command, [idCheckin, idUsuario]);
    let info = resposta[0];
    return info.affectedRows;
}