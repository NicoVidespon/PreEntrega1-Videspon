import { RouterClass } from './router.js'
import UserController from '../controllers/users.controller.js'

export class UserRouter extends RouterClass {
    init() {
        const userController = new UserController()

        this.get('/', ['ADMIN'], userController.getUsers)
        this.get('/:uid', ['ADMIN'], userController.getUser)
        this.post('/', ['PUBLIC'], userController.createUser)
        this.put('/:uid', ['ADMIN'], userController.updateUser)
        this.delete('/:uid', ['ADMIN'], userController.deleteUser)
    }
}
