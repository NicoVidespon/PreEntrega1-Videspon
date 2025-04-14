import { cartsService } from "../services/index.js";
import mongoose from "mongoose";

export default class CartsController {
  constructor() {
    this.service = cartsService;
  }

  getCarts = async (req, res) => {
    try {
      const carts = await this.service.getAllCarts();
      res.json(carts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getCart = async (req, res) => {
    try {
      const { cid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid))
        return res.status(400).json({ error: "ID inválido" });

      const cart = await this.service.getCartById(cid);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createCart = async (req, res) => {
    try {
      const newCart = await this.service.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  addProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      if (!quantity)
        return res.status(400).json({ error: "Debes especificar una cantidad" });

      const updated = await this.service.addProduct(cid, pid, quantity);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updated = await this.service.deleteProductFromCart(cid, pid);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      if (!quantity) return res.status(400).json({ error: "Cantidad requerida" });

      const updated = await this.service.updateProductQuantity(cid, pid, quantity);
      if (!updated)
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const cleared = await this.service.clearCart(cid);
      res.json(cleared);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  checkout = async (req, res) => {
    try {
      console.log("req.user =", req.user);
      const { cid } = req.params;
      const purchaser = req.user.email;        
      const result = await this.service.checkout(cid, purchaser);

      if (result.failedProducts?.length)
        return res.status(200).json({
          status: "partial_success",
          ticket: result.ticket,
          failedProducts: result.failedProducts,
        });

      res.json({ status: "success", ticket: result.ticket });
    } catch (error) {
      console.error("Error en checkout:", error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };
}
