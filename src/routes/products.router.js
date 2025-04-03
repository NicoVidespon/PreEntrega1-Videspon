import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const router = Router();
const productController = new ProductController();

// Obtener productos 
router.get("/", productController.getProducts);

// Obtener producto por ID
router.get("/:pid", productController.getProduct);

// Crear un nuevo producto
router.post("/", productController.createProduct);

// Actualizar un producto
router.put("/:pid", productController.updateProduct);

// Eliminar un producto
router.delete("/:pid", productController.deleteProduct);

export default router;
