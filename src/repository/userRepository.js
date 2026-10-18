import connection from './connection.js';

export async function inserirUsuario(usuario) {
    const command = `
        INSERT INTO usuarios (nome, email, senha_hash) 
        VALUES (?, ?, ?)
    `;
    
    const [result] = await connection.query(command, [
        usuario.nome,
        usuario.email,
        usuario.senha_hash
    ]);

    return result.insertId;
}

export async function buscarUsuarioPorEmail (email) {

    const command = `
    
    select * from usuarios
    where LOWER(TRIM(email)) = ?

    `

    const [linhas] = await connection.query(command, [email]);
    return linhas[0];

}

export async function buscarUsuarioPorID (id) {

    const command = `
    
    select * from usuarios
    where id = ?

    `
    
    const [linhas] = await connection.query(command, [id])
    return linhas[0];

}

export async function codigoRecuperacao(codigo, expiracao, id) {
    
    const command = `
    update usuarios 
        set codigo_recuperacao = ?, 
        expiracao_codigo = ? 
    where id = ?;
    `

    let resposta = await connection.query(command, [codigo, expiracao, id])
    let info = resposta[0];
    return info.affectedRows
}