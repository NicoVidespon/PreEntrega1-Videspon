import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import Product from "../models/ProductModel.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener productos con filtros, paginación y ordenamiento
router.get("/", async (req, res) => {
  let { limit = 10, page = 1, sort, query } = req.query;

  try {
    limit = parseInt(limit) > 0 ? parseInt(limit) : 10;
    page = parseInt(page) > 0 ? parseInt(page) : 1;

    const filter = {};
    if (query) {
      filter.$or = [
        { category: query },
        { status: query }
      ];
    }

    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.render("home", {
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `/?page=${prevPage}&limit=${limit}` : null,
      nextLink: nextPage ? `/?page=${nextPage}&limit=${limit}` : null,
      query,  
      sort,  
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});


// Ruta para obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).render("error", { message: "Producto no encontrado" });
    }

    res.render("productDetail", {
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).render("error", { message: "Ocurrió un error interno" });
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    const newProduct = new Product({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado para actualizar." });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
