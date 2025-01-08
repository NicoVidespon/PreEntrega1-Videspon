import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { engine as exphbs } from "express-handlebars";
import fs from "fs/promises";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

app.use(express.json());
app.use(express.static(path.resolve("src/public")));

const productManager = new ProductManager();
const cartManager = new CartManager();

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Ruta para "home"
app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

//Ruta para "realTimeProducts"
app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

// WebSockets
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("updateProducts", async () => {
    const products = await productManager.getProducts();
    return products;
  });

  socket.on("addProduct", async (newProduct) => {
    try {
      const createdProduct = await productManager.createProduct(newProduct);
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
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
