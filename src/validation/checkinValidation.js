
export default function checkinValidation (dados) {
    
    if (!dados.usuario_id) throw new Error("O ID do usuário é obrigatório.");
    if (!dados.data_checkin) throw new Error("A data do check-in é obrigatória.");

    if (dados.nivel_humor === undefined || dados.nivel_fissura === undefined) {
        throw new Error("Os níveis de humor e fissura devem ser informados.");
    }

}