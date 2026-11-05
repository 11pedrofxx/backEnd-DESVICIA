import LeoProfanity from "leo-profanity";
import { analisar } from "profanity-br";

LeoProfanity.loadDictionary('pt');

export function ValidarComentario(conteudo) {

    if (!conteudo || !conteudo.trim()) {
        throw new Error('O conteúdo do comentário não pode estar vazio.');
    }

    if (LeoProfanity.check(conteudo)) {
        throw new Error('O comentário contém palavras que violam as diretrizes da comunidade.');
    }

    const resultado = analisar(conteudo, {
        locale: 'pt-BR',
        limites: {
            vulgaridadeMax: 0,
            alvoSeveridadeMax: 0
        }
    });

    if (resultado.excedeuLimites) {
        throw new Error('O comentário contém palavras que violam as diretrizes da comunidade.');
    }

}