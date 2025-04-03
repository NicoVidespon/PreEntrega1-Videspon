import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";

const router = Router();
const cartsController = new CartsController();

// Rutas de carritos
router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCart);
router.post("/", cartsController.createCart);
router.post("/:cid/product/:pid", cartsController.addProductToCart);
router.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);
router.put("/:cid/products/:pid", cartsController.updateProductQuantity);
router.delete("/:cid", cartsController.clearCart);
router.post("/:cid/purchase", cartsController.checkout);

export default router;
