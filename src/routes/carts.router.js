import { Router } from "express";
import { promises as fs } from "fs";
import crypto from "crypto"; 
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const CARTS_FILE = path.join(__dirname, "../data/carts.json");

const getCarts = async () => {
  try {
    const data = await fs.readFile(CARTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return []; 
    throw error;
  }
};

const saveCarts = async (carts) => {
  try {
    await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
  } catch (error) {
    throw new Error(`Error al guardar los carritos: ${error.message}`);
  }
};

router.post("/", async (req, res) => {
  try {
    const carts = await getCarts();
    const newCart = { id: crypto.randomBytes(10).toString("hex"), products: [] };
    carts.push(newCart);
    await saveCarts(carts);
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carts = await getCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carts = await getCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find((p) => p.product === pid);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await saveCarts(carts);
    res.json(cart.products); 
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

export default router;
