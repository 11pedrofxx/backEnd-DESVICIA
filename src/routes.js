import UserController from './controller/userController.js';
import VicioController from './controller/viciosController.js';
<<<<<<< HEAD
import UserVicio from './controller/UserViciosController.js';
import CheckinDiario from './controller/checkinDiarioController.js';
import gatilhos from './controller/gatilhosController.js';
import CheckinGatilho from './controller/checkinGatilhoController.js';
=======
import UserVicio from './controller/UserViciosController.js'
import CheckinDiario from './controller/checkinDiarioController.js'
import gatilhos from './controller/gatilhosController.js'
import CheckinGatilho from './controller/checkinGatilhoController.js'
import Estrategias from './controller/estrategiasController.js'
>>>>>>> bb12dd9902ecc35919706b463a9fdfea9a684199


export function AddRoutes (api) {

    api.use(UserController)
    api.use(VicioController)
    api.use(UserVicio)
    api.use(CheckinDiario)
    api.use(gatilhos)
    api.use(CheckinGatilho)
    api.use(Estrategias)

};