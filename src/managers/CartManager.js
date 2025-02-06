import { CartModel } from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

class CartManager {
  // Crea un carrito vacío
  async createCart() {
    try {
      const newCart = new CartModel();
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  // Obtiene todos los carritos con los productos
  async getAllCarts() {
    try {
      return await CartModel.find().populate("productos.producto").exec();
    } catch (error) {
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  }

  // Obtiene un carrito por su ID con los productos
  async getCartById(cartId) {
    try {
      return await CartModel.findById(cartId).populate("productos.producto").exec();
    } catch (error) {
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity) {
    try {
      if (typeof quantity !== 'number' || quantity <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }

      const cart = await this._getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.productos.findIndex((item) => item.producto.toString() === productId);

      if (productIndex > -1) {
        cart.productos[productIndex].quantity += quantity;
      } else {
        cart.productos.push({ producto: productId, quantity });
      }

      cart.monto = await this.calculateTotal(cart);

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  // Vacía el carrito
  async clearCart(cartId) {
    try {
      const cart = await this._getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.productos = [];
      cart.monto = 0;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }

  // Calcula el total del carrito
  async calculateTotal(cart) {
    try {
      // Asegurarse de que los productos estén poblados (cada item.producto es un objeto con sus datos)
      if (!cart.productos || !cart.productos.length) return 0;

      const total = cart.productos.reduce((acc, item) => {
        // Verificamos que el producto esté poblado y tenga precio
        if (item.producto && item.producto.price) {
          return acc + (item.producto.price * item.quantity);
        }
        return acc;
      }, 0);

      return total;
    } catch (error) {
      throw new Error(`Error al calcular el total del carrito: ${error.message}`);
    }
  }

  // Elimina un producto del carrito
  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await this._getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.productos.findIndex((item) => item.producto.toString() === productId);

      if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

      cart.productos.splice(productIndex, 1);

      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      console.error(`Error al eliminar producto del carrito: ${error.message}`);
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }
}

export default CartManager;
