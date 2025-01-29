import { CartModel } from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

class CartManager {
  // Crea un carrito vacío
  async createCart() {
    const newCart = new CartModel();
    await newCart.save();
    return newCart;
  }

  // Obtiene todos los carritos con los productos 
  async getAllCarts() {
    return await CartModel.find().populate("productos.producto").exec();
  }

  // Obtiene un carrito por su ID con los productos 
  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate("productos.producto").exec();
  }
  // Agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity) {
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
  }


  // Elimina un producto del carrito
  async deleteProductFromCart(cartId, productId) {
    const cart = await this._getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.productos = cart.productos.filter((item) => item.producto.toString() !== productId);
    cart.monto = await this.calculateTotal(cart);
    await cart.save();
    return cart;
  }

  // Vacía el carrito
  async clearCart(cartId) {
    const cart = await this._getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.productos = [];
    cart.monto = 0;
    await cart.save();
    return cart;
  }

  // Calcula el total del carrito
  async calculateTotal(cart) {
    const productIds = cart.productos.map(item => item.producto);
    const products = await ProductModel.find({ '_id': { $in: productIds } });

    let total = 0;
    for (let item of cart.productos) {
      const product = products.find(p => p._id.toString() === item.producto.toString());
      total += product.price * item.quantity;
    }

    return total;
  }
  async _getCartById(cartId) {
    return await CartModel.findById(cartId).populate("productos.producto").exec();
  }
}

export default CartManager;
