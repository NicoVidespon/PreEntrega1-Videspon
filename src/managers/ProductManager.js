import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, "../data/products.json");

class ProductManager {
  async getProducts() {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return []; 
      throw error;
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error(`Error al guardar los productos: ${error.message}`);
    }
  }

  async createProduct(productData) {
    const { title, description, code, price, stock, category, thumbnails } = productData;

    const products = await this.getProducts();

    const newProduct = {
      id: crypto.randomBytes(10).toString("hex"),
      title,
      description,
      code,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      thumbnails: thumbnails || [],
      status: true,
    };

    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find((p) => p.id === pid);
  }

  async updateProduct(pid, updates) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) throw new Error("Producto no encontrado");

    const product = products[productIndex];
    const updatedProduct = {
      ...product,
      ...updates,
      id: product.id,
    };

    products[productIndex] = updatedProduct;
    await this.saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(pid) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== pid);
    if (filteredProducts.length === products.length) throw new Error("Producto no encontrado");

    await this.saveProducts(filteredProducts);
    return true;
  }
}

export default ProductManager;
