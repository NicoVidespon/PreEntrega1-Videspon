import { Router } from 'express';
import ViewsController from "../controllers/views.controller.js";

const router = Router();
const { home, login, register, cart, detailProduct } = new ViewsController();

router.get('/', home);
router.get('/login', login);
router.get('/register', register);
router.get('/cart/:id', cart);
router.get("/products/:pid", detailProduct);

export default router;
