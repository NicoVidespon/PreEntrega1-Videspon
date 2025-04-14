import TicketsDaoMongo from "../daos/MONGO/tickets.dao.js";
import TicketRepository from "./tickets.repository.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
    this.ticketRepo = new TicketRepository(new TicketsDaoMongo());
  }

  getCartById = (id) => this.dao.getCartById(id);

  getAllCarts = () => this.dao.getAllCarts();

  createCart = (data) => this.dao.createCart(data);

  addProduct = (cid, pid, qty) => this.dao.addProduct(cid, pid, qty);

  updateProductQuantity = (cid, pid, qty) => this.dao.updateProductQuantity(cid, pid, qty);

  deleteProductFromCart = (cid, pid) => this.dao.deleteProductFromCart(cid, pid);

  clearCart = (cid) => this.dao.clearCart(cid);

  updateProducts = (cid, products) => this.dao.updateProducts(cid, products);
  
  checkout = async (cartId, purchaserEmail) => {

    const cart = await this.dao.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    let totalAmount = 0;
    const failedProducts = [];

    for (const item of cart.productos) {
      const prod = item.producto; 
      if (prod.stock >= item.quantity) {
        prod.stock -= item.quantity;
        await prod.save();
        totalAmount += prod.price * item.quantity;
      } else {
        failedProducts.push(prod._id.toString());
      }
    }

    const remaining = cart.productos.filter(item =>
      failedProducts.includes(item.producto._id.toString())
    );
    cart.productos = remaining;
    cart.monto = await this.dao.calculateTotal(cart);
    await cart.save();

    const ticket = await this.ticketRepo.createTicket({
      amount: totalAmount,
      purchaser: purchaserEmail,
    });

    return { status: "success", ticket, failedProducts };
  };
}
