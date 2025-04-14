import UserModel from "./models/UserModel.js";

export default class UsersDaoMongo {

  create = async (user) => {
    try {
      return await UserModel.create(user);
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  };

  get = async () => {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error("Error al obtener usuarios: " + error.message);
    }
  };

  getBy = async (filter) => {
    try {
      return await UserModel.findOne(filter);
    } catch (error) {
      throw new Error("Error al obtener el usuario: " + error.message);
    }
  };

  getUser = async (email) => {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new Error("Error al obtener el usuario por email: " + error.message);
    }
  };

  update = async (uid, userToUpdate) => {
    try {
      return await UserModel.findByIdAndUpdate(uid, userToUpdate, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  };

  delete = async (uid) => {
    try {
      return await UserModel.findByIdAndDelete(uid);
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  };
}
