// src/controllers/views.controller.js
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

export default class ViewsController {
  constructor() {
    // Instanciar los managers para usarlos en los métodos
    this.productManager = new ProductManager();
    this.cartManager = new CartManager();
  }

  // Renderiza la vista home con productos paginados y cartId de la sesión
  home = async (req, res) => {
    try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
     
      const productsData = await this.productManager.getPaginatedProducts(page, limit);
      console.log("Productos obtenidos:", productsData);

      let cartId = req.session.cartId;
      if (!cartId) {
        const newCart = await this.cartManager.createCart();
        cartId = newCart._id;
        req.session.cartId = cartId;
      }

      res.render("home", {
        products: productsData.products,
        currentPage: productsData.currentPage,
        totalPages: productsData.totalPages,
        prevPage: productsData.prevPage,
        nextPage: productsData.nextPage,
        cartId,
      });
    } catch (error) {
      console.error("Error al cargar la página home:", error);
      res.status(500).send("Error al cargar la página.");
    }
  };

  // Renderiza la vista de login
  login = (req, res) => {
    res.render("login", {});
  };

  // Renderiza la vista de registro
  register = (req, res) => {
    res.render("register", {});
  };

  // Renderiza la vista del carrito
  cart = async (req, res) => {
    try {
      const cartId = req.params.id;
      const cart = await this.cartManager.getCartById(cartId);
      res.render("cart", { cart });
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      res.status(500).send("Error al cargar el carrito: " + error.message);
    }
  };

  // Renderiza la vista de detalle del producto
  detailProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productManager.getProductById(pid);
      if (!product) return res.status(404).send("Producto no encontrado");

      let cartId = req.session.cartId;
      if (!cartId) {
        const newCart = await this.cartManager.createCart();
        cartId = newCart._id;
        req.session.cartId = cartId;
      }

      res.render("productDetail", { product, cartId });
    } catch (error) {
      console.error("Error al cargar la página del producto:", error);
      res.status(500).send("Error al cargar el producto.");
    }
  };
}
