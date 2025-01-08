import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARTS_FILE = path.join(__dirname, "../data/carts.json");

class CartManager {
  async getCarts() {
    try {
      const data = await fs.readFile(CARTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return []; 
      throw error;
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw new Error(`Error al guardar los carritos: ${error.message}`);
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: crypto.randomBytes(10).toString("hex"),
      products: [],
    };

    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productExists = cart.products.find((p) => p.id === pid);
    if (productExists) {
      productExists.quantity++;
    } else {
      cart.products.push({ id: pid, quantity: 1 });
    }

    await this.saveCarts(carts);
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex((p) => p.id === pid);
    if (productIndex === -1) throw new Error("Producto no encontrado");

    cart.products.splice(productIndex, 1);
    await this.saveCarts(carts);
    return cart;
  }
}

export default CartManager;
