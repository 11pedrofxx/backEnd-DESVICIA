import connection from "./connection.js";

function validarId(valor, campo) {
    const id = Number(valor);
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error(`${campo} inválido.`);
    }
    return id;
}

function validarDataInicio(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        throw new Error("Data de início inválida. Use YYYY-MM-DD.");
    }

    const data = new Date(`${valor}T00:00:00.000Z`);
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) {
        throw new Error("A data de início informada não existe.");
    }
    return valor;
}

function validarNomeVicio(valor) {
    if (typeof valor !== "string") {
        throw new Error("Informe o nome do hábito.");
    }

    const nome = valor.trim().replace(/\s+/g, " ");
    if (!nome) throw new Error("Informe o nome do hábito.");
    if (nome.length > 50) {
        throw new Error("O nome do hábito deve ter no máximo 50 caracteres.");
    }
    return nome;
}

async function inserirVinculo(db, usuarioId, vicioId, dataInicio) {
    try {
        const [resultado] = await db.query(
            `INSERT INTO usuarios_vicios (usuario_id, vicio_id, data_inicio)
             VALUES (?, ?, ?)`,
            [usuarioId, vicioId, dataInicio]
        );
        return resultado.affectedRows;
    } catch (error) {
        // A chave primária (usuario_id, vicio_id) impede vínculos duplicados.
        if (error.code === "ER_DUP_ENTRY") return 0;
        throw error;
    }
}

export async function vincularVicio(idUsuario, vicioId, dataInicio) {
    const usuarioId = validarId(idUsuario, "ID do usuário");
    const id = validarId(vicioId, "ID do hábito");
    const data = validarDataInicio(dataInicio);

    // A rota de hábitos padrão só pode usar registros globais do sistema.
    const [habitos] = await connection.query(
        `SELECT id
           FROM vicios
          WHERE id = ?
            AND personalizado = FALSE
            AND usuario_id IS NULL
          LIMIT 1`,
        [id]
    );

    if (habitos.length === 0) {
        throw new Error("O hábito padrão informado não existe.");
    }

    return inserirVinculo(connection, usuarioId, id, data);
}

export async function criarVicioPersonalizado(idUsuario, nomeVicio, dataInicio) {
    const usuarioId = validarId(idUsuario, "ID do usuário");
    const nome = validarNomeVicio(nomeVicio);
    const data = validarDataInicio(dataInicio);

    const usaPool = typeof connection.getConnection === "function";
    const db = usaPool ? await connection.getConnection() : connection;
    let transacaoIniciada = false;

    try {
        if (typeof db.beginTransaction !== "function") {
            throw new Error("A conexão MySQL precisa oferecer suporte a transações.");
        }

        await db.beginTransaction();
        transacaoIniciada = true;

        // Não permite criar um hábito personalizado com o nome de um padrão.
        const [padroes] = await db.query(
            `SELECT id
               FROM vicios
              WHERE personalizado = FALSE
                AND usuario_id IS NULL
                AND LOWER(TRIM(nome)) = LOWER(?)
              LIMIT 1`,
            [nome]
        );

        if (padroes.length > 0) {
            throw new Error("Esse nome já pertence a um hábito padrão. Selecione-o na lista.");
        }

        // Reutiliza o hábito personalizado do próprio usuário, se já existir.
        const [existentes] = await db.query(
            `SELECT id
               FROM vicios
              WHERE usuario_id = ?
                AND personalizado = TRUE
                AND LOWER(TRIM(nome)) = LOWER(?)
              LIMIT 1
              FOR UPDATE`,
            [usuarioId, nome]
        );

        let vicioId;
        if (existentes.length > 0) {
            vicioId = Number(existentes[0].id);
        } else {
            const [insercao] = await db.query(
                `INSERT INTO vicios (nome, personalizado, usuario_id)
                 VALUES (?, TRUE, ?)`,
                [nome, usuarioId]
            );
            vicioId = Number(insercao.insertId);
        }

        await inserirVinculo(db, usuarioId, vicioId, data);
        await db.commit();
        transacaoIniciada = false;
        return vicioId;
    } catch (error) {
        if (transacaoIniciada) {
            try {
                await db.rollback();
            } catch (erroRollback) {
                console.error("Erro ao desfazer transação de hábito:", erroRollback);
            }
        }
        throw error;
    } finally {
        if (usaPool) db.release();
    }
}

export async function consultarVinculo(idUsuario, vicioId) {
    const usuarioId = validarId(idUsuario, "ID do usuário");
    const id = validarId(vicioId, "ID do hábito");

    const [linhas] = await connection.query(
        `SELECT usuario_id, vicio_id, data_inicio
           FROM usuarios_vicios
          WHERE usuario_id = ? AND vicio_id = ?
          LIMIT 1`,
        [usuarioId, id]
    );

    return linhas[0] || null;
}
