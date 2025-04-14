export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createProduct = async (newProduct) =>
    this.dao.create(newProduct);

  getProducts = async () =>
    this.dao.get();

  getProductById = async (pid) =>
    this.dao.getBy({ _id: pid });

  updateProduct = async (pid, productToUpdate) =>
    this.dao.update(pid, productToUpdate);

  deleteProduct = async (pid) =>
    this.dao.delete(pid);

  getPaginatedProducts = async (page = 1, limit = 10) => {
    const all = await this.dao.get();
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const start = (page - 1) * limit;
    const products = all.slice(start, start + limit);
    return { products, currentPage, totalPages, prevPage, nextPage };
  };
}
