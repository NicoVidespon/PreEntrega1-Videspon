import UserModel from "./models/UserModel.js";

export default class UsersDao {
  // Crear un nuevo usuario
  async create(user) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  // Obtener todos los usuarios
  async get() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error("Error al obtener usuarios: " + error.message);
    }
  }

  // Obtener un usuario según un filtro 
  async getBy(filter) {
    try {
      return await UserModel.findOne(filter);
    } catch (error) {
      throw new Error("Error al obtener el usuario: " + error.message);
    }
  }

  // Actualizar un usuario 
  async update(uid, userToUpdate) {
    try {
      return await UserModel.findByIdAndUpdate(uid, userToUpdate, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  // Eliminar un usuario 
  async delete(uid) {
    try {
      return await UserModel.findByIdAndDelete(uid);
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }
}
