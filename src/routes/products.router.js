import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import ProductsController from "../controllers/products.controller.js";

const router = Router();
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = new ProductsController();

router.get("/", getProducts);
router.get("/:pid", getProduct);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  createProduct
);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  updateProduct
);
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  deleteProduct
);

export default router;
