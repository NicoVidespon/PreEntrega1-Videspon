import { Router } from "express";
import passport from "passport";
import CartsController from "../controllers/carts.controller.js";
import { authorization } from "../middlewares/authorization.middleware.js";


const router = Router();
const {
  getCarts,
  getCart,
  createCart,
  addProduct,
  deleteProductFromCart,
  updateProductQuantity,
  clearCart,
  checkout
} = new CartsController();

router.get("/", getCarts);
router.get("/:cid", getCart);
router.post("/", createCart);
router.post(
  "/:cid/product/:pid",
   passport.authenticate("jwt", { session: false }),
    authorization("user"),
  addProduct
);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", clearCart);
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  checkout
);

export default router;
