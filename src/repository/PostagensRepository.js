import connection from "./connection.js";

export async function FazerPostagem(info) {

    const commnand = `
    
    insert into postagens (usuario_id, categoria, tipo, conteudo, titulo_conquista, subtitulo_conquista)
    values (?, ?, ?, ?, ?, ?)
    `
    let [resposta] = await connection.query(commnand, [
        info.usuario_id,
        info.categoria || 'GLOBAL',
        info.tipo,
        info.conteudo,
        info.titulo_conquista || null,
        info.subtitulo_conquista || null
    ])
    
    return resposta.insertId;

}

export async function BuscarPostagens() {

    const command = `
    select 
        postagens.id,
        usuarios.vicio_principal as categoria,
        postagens.tipo,
        postagens.conteudo,
        postagens.titulo_conquista,
        postagens.subtitulo_conquista,
        postagens.criado_em,
        usuarios.id as autor_id,
        usuarios.nome_exibicao as autor_nome,
        usuarios.foto_perfil as autor_foto,
        count(distinct postagens_apoios.id) as total_apoios,
        count(distinct postagens_comentarios.id) as total_comentarios
    from postagens
    inner join usuarios on usuarios.id = postagens.usuario_id
    left join postagens_apoios on postagens_apoios.postagem_id = postagens.id
    left join postagens_comentarios on postagens_comentarios.postagem_id = postagens.id
    group by postagens.id, usuarios.id, usuarios.nome_exibicao, usuarios.foto_perfil, usuarios.vicio_principal
    order by postagens.criado_em desc;
    `;
    
    let [resposta] = await connection.query(command);
    return resposta;
}

export async function BuscarPostagensPorCategoria(categoria) {
    let command = `
    select 
        postagens.id,
        usuarios.vicio_principal as categoria,
        postagens.tipo,
        postagens.conteudo,
        postagens.titulo_conquista,
        postagens.subtitulo_conquista,
        postagens.criado_em,
        usuarios.id as autor_id,
        usuarios.nome_exibicao as autor_nome,
        usuarios.foto_perfil as autor_foto,
        count(distinct postagens_apoios.id) as total_apoios,
        count(distinct postagens_comentarios.id) as total_comentarios
    from postagens
    inner join usuarios on usuarios.id = postagens.usuario_id
    left join postagens_apoios on postagens_apoios.postagem_id = postagens.id
    left join postagens_comentarios on postagens_comentarios.postagem_id = postagens.id
    where LOWER(usuarios.vicio_principal) = LOWER(?)
    group by postagens.id, usuarios.id, usuarios.nome_exibicao, usuarios.foto_perfil, usuarios.vicio_principal
    order by postagens.criado_em desc;
    `;

    let [resposta] = await connection.query(command, [categoria]);
    return resposta;
}

export async function DarLike(postagem_id, usuario_id) {

    const command = `
    insert into postagens_apoios (postagem_id, usuario_id)
    values (?, ?);
    `;

    let [resposta] = await connection.query(command, [postagem_id, usuario_id]);
    return resposta.insertId;

}

export async function CriarComentario(postagem_id, usuario_id, conteudo) {

    const command = `
    insert into postagens_comentarios (postagem_id, usuario_id, conteudo)
    values (?, ?, ?);
    `

    let [resposta] = await connection.query(command, [postagem_id, usuario_id, conteudo])
    return resposta.insertId;

}

