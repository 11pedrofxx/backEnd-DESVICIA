import * as db from '../repository/CheckinGatilhoRepository.js';

export async function SalvarCheckinGatilhoService(checkin_id, gatilho_id) {

    let id = await db.SalvarCheckinGatilho(checkin_id, gatilho_id);
    return id;

} 