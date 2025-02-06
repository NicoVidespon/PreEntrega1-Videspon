import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { engine as exphbs } from "express-handlebars";
import path from "path";
import session from "express-session";
import methodOverride from "method-override";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";
import connectionMongo from "./connection/mongo.js";

const app = express();
connectionMongo(); 
const PORT = 8080;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// Configuración de Handlebars
app.engine(
  "handlebars",
  exphbs({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Middleware para manejar sesiones
app.use(
  session({
    secret: "1234", 
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.resolve("src/public")));

// Instancias de managers
const productManager = new ProductManager();
const cartManager = new CartManager();

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta para "home"
app.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const products = await productManager.getPaginatedProducts(parseInt(page), parseInt(limit));

    let cartId = req.session.cartId;
    if (!cartId) {
      const newCart = await cartManager.createCart();
      cartId = newCart._id;
      req.session.cartId = cartId;
    }

    res.render("home", {
      products: products.products,  
      currentPage: products.currentPage,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      cartId  
    });
  } catch (error) {
    console.error("Error al cargar la página home:", error);
    res.status(500).send("Error al cargar la página.");
  }
});


// Ruta para "cart"
app.get('/cart/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartManager.getCartById(cartId);
    res.render('cart', { cart }); 
  } catch (error) {
    res.status(500).send('Error al cargar el carrito: ' + error.message);
  }
});

// Ruta para "Detalle de producto"
app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).send("Producto no encontrado");

    let cartId = req.session.cartId;
    if (!cartId) {
      const newCart = await cartManager.createCart();
      cartId = newCart._id;
      req.session.cartId = cartId;
    }
    
    res.render("productDetail", { product, cartId });
  } catch (error) {
    console.error("Error al cargar la página del producto:", error);
    res.status(500).send("Error al cargar el producto.");
  }
});

// WebSockets
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("updateProducts", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al obtener productos para el cliente:", error);
    }
  });

  socket.on("addProduct", async (newProduct) => {
    try {
      await productManager.createProduct(newProduct);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  });

  socket.on("addProductToCart", async (data) => {
    try {
      const { productId, cartId } = data;  
      const cart = await cartManager.addProductToCart(cartId, productId, 1); 
      socket.emit("cartUpdated", cart);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
