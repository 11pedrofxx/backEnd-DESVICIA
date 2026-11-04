import LeoProfanity from "leo-profanity";

LeoProfanity.loadDictionary('pt');

export function ValidarComentario (conteudo) {

if (!conteudo || !conteudo.trim() ) {
        throw new Error('O conteúdo do comentário não pode estar vazio.');
    }

if (LeoProfanity.check(conteudo)) {
    throw new Error('O comentário contém palavras que violam as diretrizes da comunidade.');
}

}