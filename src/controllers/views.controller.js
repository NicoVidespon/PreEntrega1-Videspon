import { cartsService, productsService } from "../services/index.js";

export default class ViewsController {
  constructor() {
    this.productsService = productsService;
    this.cartsService    = cartsService;
  }

  home = async (req, res) => {
    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;

      const {
        products,
        currentPage,
        totalPages,
        prevPage,
        nextPage
      } = await this.productsService.getPaginatedProducts(page, limit);

      let cartId = req.session.cartId;
      if (!cartId) {
        const newCart = await this.cartsService.createCart();
        cartId = newCart._id.toString();
        req.session.cartId = cartId;
      }

      res.render("home", {
        products,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        cartId
      });
    } catch (error) {
      console.error("Error al cargar la página home:", error.message);
      res.status(500).send("Error al cargar la página.");
    }
  };

  login    = (_, res) => res.render("login");
  register = (_, res) => res.render("register");

  cart = async (req, res) => {
    try {
      const cartId = req.params.id;
      const cart   = await this.cartsService.getCartById(cartId);
      if (!cart) return res.status(404).send("Carrito no encontrado");
      res.render("cart", { cart });
    } catch (error) {
      console.error("Error al cargar el carrito:", error.message);
      res.status(500).send("Error al cargar el carrito.");
    }
  };

  detailProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productsService.getProductById(pid);
      if (!product) return res.status(404).send("Producto no encontrado");

      let cartId = req.session.cartId;
      if (!cartId) {
        const newCart = await this.cartsService.createCart();
        cartId = newCart._id.toString();
        req.session.cartId = cartId;
      }

      res.render("productDetail", { product, cartId });
    } catch (error) {
      console.error("Error al cargar el producto:", error.message);
      res.status(500).send("Error al cargar el producto.");
    }
  };
}
