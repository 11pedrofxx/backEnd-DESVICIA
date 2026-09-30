import UserController from './controller/userController.js';

export function AddRoutes (api) {

    api.use(UserController)

}