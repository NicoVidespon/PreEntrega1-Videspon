import { usersService } from "../services/index.js";
import { createHash } from "../utils/bcrypt.js";

class UserController {
  constructor() {
    this.service = usersService;
  }

  createUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!email?.trim() || !password?.trim()) {
        return res.status(400).send({ status: 'error', error: 'Faltan campos obligatorios' });
      }

      const userFound = await this.service.getUser({ email });
      if (userFound) {
        return res.status(401).send({ status: 'error', error: 'El usuario ya existe' });
      }

      const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
      };

      const user = await this.service.createUser(newUser);
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario", details: error.message });
    }
  };

  getUsers = async (req, res) => {
    try {
      const users = await this.service.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.service.getUserById(uid); 
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const userToUpdate = req.body;
      const updatedUser = await this.service.updateUser(uid, userToUpdate); 
      if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario", details: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const deletedUser = await this.service.deleteUser(uid); 
      if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario", details: error.message });
    }
  };
}

export default UserController;
