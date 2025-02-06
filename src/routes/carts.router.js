import { Router } from "express";
import { CartModel } from "../models/CartModel.js";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts(); 
    res.json(carts);
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('productos.producto'); 
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.productos); 
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const cart = await CartModel.findById(cid).populate("productos.producto");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const productInCart = cart.productos.find(p => p.producto._id.toString() === pid.toString());
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.productos.push({ producto: pid, quantity: 1 });
    }
    cart.monto = cart.productos.reduce((total, p) => {
      const price = p.producto && p.producto.price ? p.producto.price : 0;
      return total + (p.quantity * price);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Eliminar un producto del carrito (DELETE)
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productIndex = cart.productos.findIndex(p => p.producto._id.toString() === pid);
    if (productIndex === -1) {
      console.log("Productos en el carrito:", cart.productos);
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.productos.splice(productIndex, 1);
    cart.monto = await cartManager.calculateTotal(cart);
    await cart.save();
    res.redirect("back");
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    
    cart.productos = [];
    
    for (const { producto, quantity } of products) {
      const productExist = await productManager.getProductById(producto);
      if (productExist) {
        cart.productos.push({ producto, quantity });
      }
    }
    
    await cart.save();
    res.redirect("back");
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar la cantidad de un producto en el carrito 
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    
    const productInCart = cart.productos.find(p => p.producto._id.toString() === pid.toString());
    if (!productInCart) return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    
    productInCart.quantity = quantity;
    await cart.save();
    res.redirect("back");
  } catch (error) {
    console.error("Error al actualizar cantidad de producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    
    cart.productos = [];
    cart.monto = 0;
    await cart.save();
    res.redirect("back");
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
