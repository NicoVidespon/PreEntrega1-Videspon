import { productService } from "../services/index.js";
class ProductController {
  constructor() {
    this.service = productService;
  }

  // Crear producto
  createProduct = async (req, res, next) => {
    try {
      const result = await this.service.createProduct(req.body);
      res.status(201).json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };

  // Obtener productos con filtros, paginación y ordenamiento 
  getProducts = async (req, res, next) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      let products = await this.service.getProducts(); 

      if (query) {
        products = products.filter((product) =>
          product.category?.toLowerCase() === query.toLowerCase() ||
          (query.toLowerCase() === "disponible" && product.status === true)
        );
      }

      if (sort === "asc") products.sort((a, b) => a.price - b.price);
      if (sort === "desc") products.sort((a, b) => b.price - a.price);

      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit);

      res.status(200).json({
        status: "success",
        payload: paginatedProducts,
        totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        page: currentPage,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevLink: currentPage > 1 ? `/api/products?limit=${limit}&page=${currentPage - 1}&sort=${sort}&query=${query}` : null,
        nextLink: currentPage < totalPages ? `/api/products?limit=${limit}&page=${currentPage + 1}&sort=${sort}&query=${query}` : null,
      });
    } catch (error) {
      next(error);
    }
  };

  // Obtener producto por ID
  getProduct = async (req, res, next) => {
    const { pid } = req.params;
    try {
      const product = await this.service.getProduct({ _id: pid });
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  };

  // Actualizar producto 
  updateProduct = async (req, res, next) => {
    try {
      const updatedProduct = await this.service.updateProduct(req.params.pid, req.body);
      if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
      res.status(200).json({ status: "success", payload: updatedProduct });
    } catch (error) {
      next(error);
    }
  };

  // Eliminar producto 
  deleteProduct = async (req, res, next) => {
    try {
      const deletedProduct = await this.service.deleteProduct(req.params.pid);
      if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
