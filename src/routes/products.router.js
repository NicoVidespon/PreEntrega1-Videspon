import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Obtener productos con filtros, paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    let products = await productManager.getProducts();

    if (query) {
      products = products.filter(product => 
        product.category?.toLowerCase() === query.toLowerCase() || 
        (query.toLowerCase() === "disponible" && product.status === true)
      );
    }

    if (sort === "asc") products.sort((a, b) => a.price - b.price);
    if (sort === "desc") products.sort((a, b) => b.price - a.price);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit);

    res.json({
      status: "success",
      payload: paginatedProducts,
      totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevLink: currentPage > 1 ? `/api/products?limit=${limit}&page=${currentPage - 1}&sort=${sort}&query=${query}` : null,
      nextLink: currentPage < totalPages ? `/api/products?limit=${limit}&page=${currentPage + 1}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
