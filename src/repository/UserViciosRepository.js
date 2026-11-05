import connection from "./connection.js";

function validarParametros(idUsuario, vicioId, dataInicio) {
    if (!Number.isSafeInteger(Number(idUsuario)) || Number(idUsuario) <= 0) {
        throw new Error("ID do usuário inválido.");
    }
    if (!Number.isSafeInteger(Number(vicioId)) || Number(vicioId) <= 0) {
        throw new Error("ID do hábito inválido.");
    }
    if (!dataInicio) {
    throw new Error("Informe a data de início.");
}
}

export async function vincularVicio(idUsuario, vicioId, dataInicio) {
    validarParametros(idUsuario, vicioId, dataInicio);

    const vinculoExistente = await consultarVinculo(idUsuario, vicioId);
    if (vinculoExistente) return 0;

    const command = `
        insert into usuarios_vicios (usuario_id, vicio_id, data_inicio)
        values (?, ?, ?)
    `;

    try {
        const [resultado] = await connection.query(command, [idUsuario, vicioId, dataInicio]);
        return resultado.affectedRows;
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return 0;
        throw error;
    }
}

export async function consultarVinculo(idUsuario, vicioId) {
    const command = `
        select usuario_id, vicio_id, data_inicio
        from usuarios_vicios
        where usuario_id = ? and vicio_id = ?
        limit 1
    `;
    const [linhas] = await connection.query(command, [idUsuario, vicioId]);
    return linhas[0] || null;
}
