import { analisar } from "profanity-br";

export default function ValidarPost(dados) {

    if (!dados.usuario_id) {
        throw new Error('Usuario não encontrado')
    }

    if (!dados.titulo || dados.titulo === '') {
        throw new Error('Você deve dar um título para sua postagem');
    }

    if (dados.tipo === 'CONQUISTA' && !dados.titulo_conquista) {
    throw new Error('Para compartilhar uma conquista você deve escrever um título');
    }

    if (!dados.conteudo) {
        throw new Error('A postagem não pode estar vazia. Diga alguma coisa!')
    }

}