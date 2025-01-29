import Product from "../models/ProductModel.js"; // Ajusta la ruta si es necesario
import mongoose from 'mongoose';

class ProductManager {
  // Obtener productos con paginación
  async getPaginatedProducts(page, limit) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find().skip(skip).limit(limit).exec();
      
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      
      return {
        products,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      };
    } catch (error) {
      throw new Error(`Error al obtener productos con paginación: ${error.message}`);
    }
  }

  // Obtener productos por sus IDs
  async getProductsByIds(ids) {
    try {
      return await Product.find({ '_id': { $in: ids } });
    } catch (error) {
      throw new Error(`Error al obtener productos por ID: ${error.message}`);
    }
  }

  // Contar la cantidad de productos con filtros opcionales
  async countProducts(filters = {}) {
    try {
      return await Product.countDocuments(filters);
    } catch (error) {
      throw new Error(`Error al contar productos: ${error.message}`);
    }
  }

  // Obtener un producto por su ID
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      if (!productData.title || !productData.price || !productData.category) {
        throw new Error("Faltan campos obligatorios");
      }
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  // Actualizar un producto
  async updateProduct(productId, updatedData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      if (!updatedProduct) throw new Error("Producto no encontrado");
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  // Eliminar un producto
  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) throw new Error("Producto no encontrado");
      return deletedProduct;  // Retorna el producto eliminado
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductManager;
