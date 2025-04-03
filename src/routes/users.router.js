import { Router } from 'express'
import UserController from "../controllers/users.controller.js"; 


const router = Router()
const {createUser,getUsers,getUser,updateUser,deleteUser} = new UserController()

router.post('/', createUser)
router.get('/', getUsers)
router.get('/:uid', getUser)
router.put('/:uid', updateUser)
router.delete('/:uid', deleteUser)


export default router