import { productService } from "./index.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createProduct(newProduct) {
    return await this.dao.create(newProduct);
  }

  async getProducts() {
    return await this.dao.get();
  }

  async getProduct(filter) {
    return await this.dao.getBy(filter);
  }

  async updateProduct(pid, productToUpdate) {
    return await this.dao.update(pid, productToUpdate);
  }

  async deleteProduct(pid) {
    return await this.dao.delete(pid);
  }
}
