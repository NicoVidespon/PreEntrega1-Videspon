import { generateTicketCode } from "../utils/generateTicketCode.js";
import CartsDaoMongo from "../daos/MONGO/carts.dao.js";
import TicketsDaoMongo from "../daos/MONGO/tickets.dao.js";
import ProductManager from "../managers/ProductManager.js";
import mongoose from "mongoose"; // Para validar ObjectId

class CartsController {
  constructor() {
    this.cartsService = new CartsDaoMongo();
    this.ticketsService = new TicketsDaoMongo();
    this.productManager = new ProductManager();
  }

  // Obtener todos los carritos
  getCarts = async (req, res) => {
    try {
      const carts = await this.cartsService.getAllCarts();
      res.status(200).json(carts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Obtener un carrito por ID
  getCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await this.cartsService.getCartById(cid);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Crear un nuevo carrito
  createCart = async (req, res) => {
    try {
      const newCart = await this.cartsService.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Agregar producto al carrito
  addProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;
      const updatedCart = await this.cartsService.addProduct(cid, pid, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Eliminar un producto del carrito
  deleteProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await this.cartsService.deleteProductFromCart(cid, pid);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actualizar el carrito con un arreglo de productos
  updateCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body; 
      const cart = await this.cartsService.getCartById(cid);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
      
      cart.productos = [];
      for (const { producto, quantity } of products) {
        // Opcional: validar que el producto existe
        const productExist = await this.productManager.getProductById(producto);
        if (productExist) {
          cart.productos.push({ producto, quantity });
        }
      }
      cart.monto = await this.cartsService.calculateTotal(cart);
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actualizar la cantidad de un producto en el carrito
  updateProductQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updatedCart = await this.cartsService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Vaciar el carrito
  clearCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const updatedCart = await this.cartsService.clearCart(cid);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Checkout
  checkout = async (req, res) => {
    try {
      const { cid } = req.params;
      res.status(200).json({ message: "Compra finalizada (lógica de checkout pendiente)" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default CartsController;
