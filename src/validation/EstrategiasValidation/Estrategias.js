export function validarEstrategia(dados) {
    if (!dados.titulo || dados.titulo.trim() === '') {
        throw new Error("O título da estratégia não pode estar vazio.");
    }
}