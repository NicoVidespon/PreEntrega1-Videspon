import SessionsDaoMongo from "../daos/MONGO/sessions.dao.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

class SessionsController {
    constructor() {
        this.service = new SessionsDaoMongo();
    }

    register = async (req, res) => {
        try {
            const { first_name, last_name, email, password } = req.body;
            console.log(req.body);

            if (!email || !password) {
                return res.status(400).send({ status: "error", error: "Email y password son obligatorios" });
            }

            const userFound = await this.service.getUser(email);
            if (userFound) {
                return res.status(401).send({ status: "error", error: "El usuario ya existe" });
            }

            const hashedPassword = createHash(password);

            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword 
            };

            const result = await this.service.createUser(newUser);
            res.send({ status: "success", payload: result });
        } catch (error) {
            console.error("🚨 Error en el registro:", error);
            res.status(500).json({ error: "Error al registrar usuario", details: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log("🔹 Intento de login con email:", email);

            const user = await this.service.getUser(email);
            if (!user) {
                console.log("❌ Usuario no encontrado");
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            const isMatch = isValidPassword(password, user.password);
            console.log("🔍 ¿La contraseña es correcta?", isMatch);

            if (!isMatch) {
                console.log("❌ Contraseña incorrecta");
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

         
            res.cookie("token", token, { httpOnly: true }).json({ message: "Login exitoso", token });
        } catch (error) {
            console.error("🚨 Error en el login:", error);
            res.status(500).json({ error: "Error en el login", details: error.message });
        }
    };

    logout = (req, res) => {
        res.clearCookie("token").json({ message: "Logout exitoso" });
    };

    current = (req, res) => {
        const { _id, first_name, last_name, email, age, role } = req.user;
        res.json({ user: { _id, first_name, last_name, email, age, role } });
    };
}

export default SessionsController;
