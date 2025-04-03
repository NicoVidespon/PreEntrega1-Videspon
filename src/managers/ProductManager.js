import Product from "../daos/MONGO/models/ProductModel.js";

class ProductManager {
  // Obtener todos los productos
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  // Obtener productos con paginación
  async getPaginatedProducts(page = 1, limit = 10) {
    try {
     
      page = parseInt(page);
      limit = parseInt(limit);

      const products = await Product.find()
        .skip((page - 1) * limit)
        .limit(limit);


      const total = await Product.countDocuments();


      const totalPages = Math.ceil(total / limit);
      const currentPage = page;

      return {
        products,
        currentPage,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
      };
    } catch (error) {
      throw new Error("Error al obtener los productos paginados: " + error.message);
    }
  }

  // Crear un producto
  async createProduct(productData) {
    const { title, description, code, price, stock, category, thumbnails } = productData;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Todos los campos son obligatorios");
    }

    const newProduct = new Product({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });

    await newProduct.save();
    return newProduct;
  }

  // Obtener un producto por ID
  async getProductById(pid) {
    try {
      const product = await Product.findById(pid);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Actualizar un producto
  async updateProduct(pid, updates) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true });
      if (!updatedProduct) throw new Error("Producto no encontrado");
      return updatedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Eliminar un producto
  async deleteProduct(pid) {
    try {
      const result = await Product.findByIdAndDelete(pid);
      if (!result) throw new Error("Producto no encontrado");
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default ProductManager;
