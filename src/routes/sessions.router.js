import { Router } from "express";
import passport from "passport";
import SessionsController from '../controllers/sessions.controller.js';

const router = Router();
const { register, login, logout, current } = new SessionsController();

// Registro de usuario
router.post("/register", register);
// Login de usuario
router.post("/login", login);
// Logout de usuario
router.post("/logout", logout);
// Ruta current (protege con JWT)
router.get("/current", passport.authenticate("jwt", { session: false }), current);

export default router;
