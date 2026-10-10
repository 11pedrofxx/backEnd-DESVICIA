import connection from "./connection.js";

export async function postGatilho (gatilho) {

    const command = `
    
    insert into gatilhos(nome, personalizado, usuario_id)
    values (?, ?, ?)
    `

    let resposta = await connection.query(command, [

        gatilho.nome,
        gatilho.personalizado,
        gatilho.usuario_id

    ]);
    let id = resposta[0];
    return id.insertId;

}

export async function BuscarGatilhoByNome(nome) {

    const command = `
    
    select * from gatilhos
    where nome = ?

    `

    let resposta = await connection.query(command, [nome]);
    return resposta[0];
}

export async function buscarGatilhos() {
    
    const command = `
    
    select * from gatilhos

    `

    let resposta = await connection.query(command);
    return resposta[0];
    

}

export async function deletarGatilho(id) {

    const command = `
    
    delete from gatilhos
    where id = ?

    `

    let resposta = await connection.query(command, [id]);
    let info = resposta[0];
    let linhasAfetadas = info.affectedRows;
    return linhasAfetadas;

}