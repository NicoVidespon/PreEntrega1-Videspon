import ProductModel from "./models/ProductModel.js";

export default class ProductsDaoMongo {
  
  create = async (product) => {
    try {
      return await ProductModel.create(product);
    } catch (error) {
      throw new Error("Error al crear el producto: " + error.message);
    }
  };

  get = async () => {
    try {
      return await ProductModel.find();
    } catch (error) {
      throw new Error("Error al obtener los productos: " + error.message);
    }
  };

  getBy = async (filter) => {
    try {
      return await ProductModel.findOne(filter);
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  };

  update = async (id, update) => {
    try {
      return await ProductModel.findByIdAndUpdate(id, update, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  };

  delete = async (id) => {
    try {
      return await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  };
}
