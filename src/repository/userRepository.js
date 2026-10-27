import connection from './connection.js';

export async function salvarCadastroPendente(usuario) {
    const command = `
        insert into cadastros_pendentes (nome, email, senha_hash, codigo, dt_expiracao)
        values (?, ?, ?, ?, now() + interval 15 minute)
        on duplicate key update
            nome = values(nome),
            senha_hash = values(senha_hash),
            codigo = values(codigo),
            dt_expiracao = now() + interval 15 minute;
    `;

    const [resposta] = await connection.query(command, [
        usuario.nome,
        usuario.email,
        usuario.senha_hash,
        usuario.codigo
    ]);

    return resposta.insertId;
}

export async function BuscarCadastroPendente (email, codigo) {

    const command = `
    select id, nome, email, senha_hash
    from cadastros_pendentes
    where email = ?
    and codigo = ?
    and dt_expiracao > now();
    `
    const codigoFormatado = Array.isArray(codigo) ? codigo.join('') : String(codigo).trim();
    const [resposta] = await connection.query(command, [email, codigoFormatado]);
    return resposta[0];
}


export async function inserirUsuario(usuario) {
    const command = `
        insert into usuarios (nome, email, senha_hash) 
        values (?, ?, ?)
    `;
    
    const [result] = await connection.query(command, [
        usuario.nome,
        usuario.email,
        usuario.senha_hash
    ]);

    return result.insertId;
}

export async function deletarCadastroPendente(id) {
    const command = `delete from cadastros_pendentes where id = ?;`;
    let [resposta] = await connection.query(command, [id]);
    return resposta.affectedRows
}

export async function buscarUsuarioPorEmail(email) {
    const command = `
        select * from usuarios
        where lower(trim(email)) = ?
    `;

    const [linhas] = await connection.query(command, [email]);
    return linhas[0];
}

export async function buscarUsuarioPorID(id) {
    const command = `
        select * from usuarios
        where id = ?
    `;
    
    const [linhas] = await connection.query(command, [id]);
    return linhas[0];
}

export async function codigoRecuperacao(codigo, expiracao, id) {
    const command = `
        update usuarios 
           set codigo_recuperacao = ?, 
               expiracao_codigo = ? 
         where id = ?
    `;

    let resposta = await connection.query(command, [codigo, expiracao, id]);
    let info = resposta[0];
    return info.affectedRows;
}

export async function RedefinirSenha(senha, id) {
    const command = `
        update usuarios
           set senha_hash = ?,
               codigo_recuperacao = null,
               expiracao_codigo = null
         where id = ?
    `;

    let resposta = await connection.query(command, [senha, id]);
    let info = resposta[0];
    return info.affectedRows;
}

export async function verificarApresentacao(idUsuario) {
    const command = `
        select concluida 
        from apresentacao 
        where usuario_id = ?
    `;
    const [linhas] = await connection.query(command, [idUsuario]);
    
    if (linhas.length > 0) {
        return linhas[0].concluida;
    } else {
        return 0;
    }
}

export async function concluirApresentacao(idUsuario) {
    const command = `
        insert into apresentacao (usuario_id, concluida, data_conclusao) 
        values (?, true, now())
        on duplicate key update 
            concluida = true, 
            data_conclusao = now()
    `;
    const [result] = await connection.query(command, [idUsuario]);
    return result.affectedRows;
}