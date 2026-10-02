import connection from './connection.js';

export async function CadastrarVicio(nome) {

    const command = `
    
    insert into vicios (nome)
    values (?)

    `

    const [result] = await connection.query(command, [nome])
    return result.insertId;

}

export async function consultarVicios() {

    const command = `select * from vicios`;
    
    let resposta = await connection.query(command, []);
    let registros = resposta[0];
    return registros;
}

export async function deletarVicios(id) {

    const command = `
    
    delete from vicios
    where id = ?

    `

    let resposta = await connection.query(command, [id]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;

}