import { CartModel } from "./models/CartModel.js";

export default class CartsDaoMongo {
  constructor() {
    this.cartModel = CartModel;
  }

  // Obtener carrito por ID
  async getCartById(cartId) {
    try {
      return await this.cartModel.findById(cartId).populate("productos.producto").exec();
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  // Obtener todos los carritos
  async getAllCarts() {
    try {
      return await this.cartModel.find().populate("productos.producto").exec();
    } catch (error) {
      throw new Error("Error al obtener los carritos: " + error.message);
    }
  }

  // Crear un nuevo carrito 
  async createCart(cartData = {}) {
    try {
      const newCart = new this.cartModel({
        productos: [],
        monto: 0,
        ...cartData,
      });
      return await newCart.save();
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  // Vaciar el carrito
  async clearCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
      cart.productos = [];
      cart.monto = 0;
      return await cart.save();
    } catch (error) {
      throw new Error("Error al vaciar el carrito: " + error.message);
    }
  }

  // Agregar un producto al carrito
  async addProduct(cartId, productId, quantity) {
    try {
      if (typeof quantity !== "number" || quantity <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );

      if (productIndex > -1) {
        cart.productos[productIndex].quantity += quantity;
      } else {
        cart.productos.push({ producto: productId, quantity });
      }

      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }

  // Calcular el monto total del carrito
  async calculateTotal(cart) {
    try {
      if (!cart.productos || !cart.productos.length) return 0;
      const total = cart.productos.reduce((acc, item) => {
        if (item.producto && item.producto.price) {
          return acc + item.producto.price * item.quantity;
        }
        return acc;
      }, 0);
      return total;
    } catch (error) {
      throw new Error("Error al calcular el total del carrito: " + error.message);
    }
  }

  // Eliminar un producto del carrito
  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );
      if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

      cart.productos.splice(productIndex, 1);
      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito: " + error.message);
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productInCart = cart.productos.find(
        (p) => p.producto.toString() === productId
      );
      if (!productInCart) throw new Error("Producto no encontrado en el carrito");

      productInCart.quantity = quantity;
      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar cantidad de producto: " + error.message);
    }
  }
}
