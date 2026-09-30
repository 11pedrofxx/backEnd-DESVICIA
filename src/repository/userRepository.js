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