import { Router } from 'express';
import ViewsController from "../controllers/views.controller.js";

const router = Router();
const { home, login, register, cart, detailProduct } = new ViewsController();

// Home
router.get('/', home);
// Login
router.get('/login', login);
// Register
router.get('/register', register);
// Cart
router.get('/cart/:id', cart);
// Detalle de producto
router.get("/products/:pid", detailProduct);

export default router;
