import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { engine as exphbs } from "express-handlebars";
import path from "path";
import session from "express-session";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import passport from "./config/passport.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import connectionMongo from "./connection/mongo.js";
import usersRouter from "./routes/users.router.js"
import ProductManager from "./managers/ProductManager.js";


const app = express();
connectionMongo();

const PORT = process.env.PORT; 
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

// Middleware para sesiones
const FileStoreSession = FileStore(session);
app.use(
  session({
    store: new FileStoreSession({
      path: "./sessions",
      ttl: 1000,
      retries: 0,
    }),
    secret: "1234",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("src/public")));

app.use(passport.initialize());

// Rutas API y Vistas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter)
app.use('/', viewsRouter);

const productManager = new ProductManager();

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  try {
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
  } catch (error) {
    console.error("Error al obtener productos para el cliente:", error);
  }

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
      const cart = await cartsRouter.addProductToCart(cartId, productId, 1); 
      socket.emit("cartUpdated", cart);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
