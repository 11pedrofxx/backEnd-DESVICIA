import UserController from './controller/userController.js';
import VicioController from './controller/viciosController.js';
import UserVicio from './controller/UserViciosController.js'

export function AddRoutes (api) {

    api.use(UserController)
    api.use(VicioController)
    api.use(UserVicio)

}