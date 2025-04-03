import UsersDao from "../daos/MONGO/users.dao.js";

class UserController {
  constructor() {
    this.usersService = new UsersDao();
  }

  // Crear un usuario
  createUser = async (req, res) => {
    try {
      const newUser = req.body;
      const user = await this.usersService.create(newUser);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario", details: error.message });
    }
  };

  // Obtener todos los usuarios
  getUsers = async (req, res) => {
    try {
      const users = await this.usersService.get();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
    }
  };

  // Obtener un usuario por ID
  getUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.usersService.getBy({ _id: uid });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
  };

  // Actualizar un usuario
  updateUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const userToUpdate = req.body;
      const updatedUser = await this.usersService.update(uid, userToUpdate);
      if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario", details: error.message });
    }
  };

  // Eliminar un usuario
  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const deletedUser = await this.usersService.delete(uid);
      if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario", details: error.message });
    }
  };
}

export default UserController;
