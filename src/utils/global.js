global.ErrorDefault = function ErrorDefault(error) {
    let mensagem = 'Ocorreu um erro inesperado.';

    if (typeof error === 'string') {
        mensagem = error;
    } else if (error && error.message) {
        mensagem = error.message;
    }

    return {
        erro: mensagem
    };
};