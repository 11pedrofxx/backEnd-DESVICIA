import * as db from '../repository/PostagensRepository.js';
import ValidarPost from '../validation/posts/FazerPostagem.js';
import { ValidarComentario } from '../validation/posts/comentarios.js';

export async function FazerPostService(dados) {

    ValidarPost(dados);
    let id = await db.FazerPostagem(dados);
    return id;

}

export async function BuscarPostagensService(usuario_id) {

    let registros = await db.BuscarPostagens(usuario_id);
    return registros;

}

export async function BuscaPorCategoria (categoria, usuario_id) {
    
    let registros = await db.BuscarPostagensPorCategoria(categoria, usuario_id);
    return registros;

}

export async function ApoiarPostagemService(postagem_id, usuario_id) {
    try {
        let id = await db.DarLike(postagem_id, usuario_id);
        return id
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Você não pode apoiar a mesma publicação duas vezes');
        }
        throw error
    }
}

export async function PostComentarioService(postagem_id, usuario_id, conteudo) {

    ValidarComentario(conteudo);
    let id = await db.CriarComentario(postagem_id, usuario_id, conteudo.trim());
    return id;

}