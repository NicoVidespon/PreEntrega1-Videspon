import { Router } from "express";
import { promises as fs } from "fs";
import crypto from "crypto"; 
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const PRODUCTS_FILE = path.join(__dirname, "../data/products.json");

const getProducts = async () => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return []; 
    throw error;
  }
};

const saveProducts = async (products) => {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await getProducts();
  const result = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(result);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await getProducts();
  const product = products.find((p) => p.id === pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const products = await getProducts();

    const newProduct = {
      id: crypto.randomBytes(10).toString("hex"),
      title,
      description,
      code,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      thumbnails: thumbnails || [],
      status: true,
    };

    products.push(newProduct);
    await saveProducts(products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  const products = await getProducts();
  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado" });

  const product = products[productIndex];
  const updatedProduct = {
    ...product,
    ...updates,
    id: product.id,
  };
  products[productIndex] = updatedProduct;

  await saveProducts(products);
  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await getProducts();
  const filteredProducts = products.filter((p) => p.id !== pid);

  if (filteredProducts.length === products.length)
    return res.status(404).json({ error: "Producto no encontrado" });

  await saveProducts(filteredProducts);
  res.status(204).send(); 
});

export default router;
