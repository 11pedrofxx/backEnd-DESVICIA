import UserController from './controller/userController.js';
import VicioController from './controller/viciosController.js';
import UserVicio from './controller/UserViciosController.js';
import CheckinDiario from './controller/checkinDiarioController.js';
import gatilhos from './controller/gatilhosController.js';
import Checkingatilho from './controller/checkingatilhoController.js';
import Estrategias from './controller/estrategiasController.js';
import Contatos from './controller/contatosEmergController.js'

export function AddRoutes(api) {
    api.use(UserController);
    api.use(VicioController);
    api.use(UserVicio);
    api.use(CheckinDiario);
    api.use(gatilhos);
    api.use(Checkingatilho);
    api.use(Estrategias);
    api.use(Contatos)
};