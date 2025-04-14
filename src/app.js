import express from "express";
import methodOverride from "method-override";               
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { engine as exphbs } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import passport from "./config/passport.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import { UserRouter } from "./routes/users.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import { connectDB, configObject } from "./config/index.js";
import { cartsService, productsService } from "./services/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

await connectDB();

const app = express();
const PORT = configObject.port || 3000;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

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
app.set("views", path.resolve(__dirname, "views"));


const FileStoreSession = FileStore(session);
app.use(
  session({
    store: new FileStoreSession({
      path: "./sessions",
      ttl: 60 * 60,
      retries: 0,
    }),
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(methodOverride("_method"));  
app.use(passport.initialize());

// Rutas API y vistas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/tickets", ticketsRouter);

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());

app.use("/", viewsRouter);

// Socket.io
io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  try {
    const products = await productsService.getProducts();
    socket.emit("updateProducts", products);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
  }

  socket.on("addProduct", async (newProduct) => {
    try {
      await productsService.createProduct(newProduct);
      const products = await productsService.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productsService.deleteProduct(productId);
      const products = await productsService.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  });

  socket.on("addProductToCart", async ({ productId, cartId }) => {
    try {
      const cart = await cartsService.addProduct(cartId, productId, 1);
      socket.emit("cartUpdated", cart);
    } catch (error) {
      console.error("❌ Error al agregar producto al carrito:", error);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
