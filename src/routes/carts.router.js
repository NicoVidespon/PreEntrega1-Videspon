import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductModel from "../models/ProductModel.js"; 

const router = Router();
const cartManager = new CartManager();

// Crear un carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito: " + error.message });
  }
});

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos: " + error.message });
  }
});

// Obtener un carrito por ID con los productos completos (populate)
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito: " + error.message });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products", async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: "Datos de producto inválidos." });
    }

    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const cart = await cartManager.addProductToCart(cid, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito: " + error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const productInCart = await cartManager.isProductInCart(cid, pid);
    if (!productInCart) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    const cart = await cartManager.deleteProductFromCart(cid, pid);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito: " + error.message });
  }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito: " + error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor que 0." });
    }

    const productInCart = await cartManager.isProductInCart(cid, pid);
    if (!productInCart) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    const updatedCart = await cartManager.updateProductQuantityInCart(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto: " + error.message });
  }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Debe enviar un arreglo de productos." });
    }

    const updatedCart = await cartManager.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito: " + error.message });
  }
});

export default router;