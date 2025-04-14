import CartModel from "./models/CartModel.js";

export default class CartsDaoMongo {
  createCart = async (cartData = {}) => {
    try {
      const newCart = new CartModel({ productos: [], monto: 0, ...cartData });
      return await newCart.save();
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  };

  getAllCarts = async () => {
    try {
      return await CartModel.find().populate("productos.producto").exec();
    } catch (error) {
      throw new Error("Error al obtener los carritos: " + error.message);
    }
  };

  getCartById = async (cartId) => {
    try {
      return await CartModel.findById(cartId).populate("productos.producto").exec();
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  };

  clearCart = async (cartId) => {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
      cart.productos = [];
      cart.monto = 0;
      return await cart.save();
    } catch (error) {
      throw new Error("Error al vaciar el carrito: " + error.message);
    }
  };

  addProduct = async (cartId, productId, quantity) => {
    try {
      if (typeof quantity !== "number" || quantity <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const idx = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );
      if (idx > -1) {
        cart.productos[idx].quantity += quantity;
      } else {
        cart.productos.push({ producto: productId, quantity });
      }

      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  };

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      if (typeof quantity !== "number" || quantity <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const idx = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );
      if (idx === -1) return null;

      cart.productos[idx].quantity = quantity;
      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar la cantidad del producto: " + error.message);
    }
  };

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const idx = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );
      if (idx === -1) throw new Error("Producto no encontrado en el carrito");

      cart.productos.splice(idx, 1);
      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito: " + error.message);
    }
  };

  updateProducts = async (cartId, newProducts) => {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
      cart.productos = newProducts;
      cart.monto = await this.calculateTotal(cart);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar productos del carrito: " + error.message);
    }
  };

  calculateTotal = async (cart) => {
    try {
      if (!cart.productos?.length) return 0;
      return cart.productos.reduce((sum, item) => {
        const p = item.producto;
        return sum + (p.price || 0) * item.quantity;
      }, 0);
    } catch (error) {
      throw new Error("Error al calcular el total del carrito: " + error.message);
    }
  };
}
