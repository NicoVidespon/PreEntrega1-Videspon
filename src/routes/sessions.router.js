import { Router } from "express";
import passport from "passport";
import SessionsController from '../controllers/sessions.controller.js';

const router = Router();
const { register, login, logout, current } = new SessionsController();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current", passport.authenticate("jwt", { session: false }), current);

export default router;
