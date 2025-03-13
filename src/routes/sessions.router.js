import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import passport from "passport";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretoSuperSeguro";

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const newUser = new UserModel({ first_name, last_name, email, age, password });
    await newUser.save();
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario", details: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const plainPassword = password.trim();
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true })
       .json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login", details: error.message });
  }
});

// Logout 
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logout exitoso" });
});

// Ruta current 
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;
