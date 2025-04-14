import SessionsDaoMongo from "../daos/MONGO/sessions.dao.js";
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/authToken.js';
import UserDTO from "../dtos/users.dto.js";


class SessionsController {
    constructor() {
        this.service = new SessionsDaoMongo();
    }

    register = async (req, res) => {
        try {
            const { first_name, last_name, email, password, adminCode } = req.body; 
    
            if (!email?.trim() || !password?.trim()) {
                return res.status(400).send({ status: 'error', error: 'Faltan campos obligatorios' });
            }
    
            const userFound = await this.service.getUser(email);
            if (userFound) {
                return res.status(401).send({ status: 'error', error: 'El usuario ya existe' });
            }
    
            const role = adminCode === process.env.ADMIN_SECRET ? "admin" : "user"; 
    
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role
            };
    
            const result = await this.service.createUser(newUser);
    
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
        
    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email?.trim() || !password?.trim()) {
                return res.status(400).send({ status: 'error', error: 'Email y password son obligatorios' });
            }

            const userFound = await this.service.getUser(email);
            if (!userFound) {
                return res.status(401).send({ status: 'error', error: 'El usuario no existe' });
            }

            const passwordIsValid = isValidPassword(password, userFound);
            if (!passwordIsValid) {
                return res.status(401).send({ status: 'error', error: 'Email o contraseña incorrectos' });
            }

            const token = generateToken({
                id: userFound._id,
                email: userFound.email,
                role: userFound.role,
            });

            res
                .cookie("coderCookieToken", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
                .send({ status: "success", message: "Login exitoso" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "error", error: error.message });
        }
    };

    logout = (req, res) => {
        res.clearCookie("coderCookieToken").json({ message: "Logout exitoso" });
    };

    current = async (req, res) => {
        try {
            const userDto = new UserDTO(req.user);
            res.status(200).json({ status: "success", user: userDto });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    };
}

export default SessionsController;
