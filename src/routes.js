import UserController from './controller/userController.js';
import VicioController from './controller/viciosController.js';

export function AddRoutes (api) {

    api.use(UserController)
    api.use(VicioController)

}