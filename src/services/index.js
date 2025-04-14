import UsersDaoMongo from "../daos/MONGO/users.dao.js";
import ProductsDaoMongo from "../daos/MONGO/products.dao.js";
import CartsDaoMongo from "../daos/MONGO/carts.dao.js";
import TicketsDaoMongo from "../daos/MONGO/tickets.dao.js";

import UserRepository from "./users.repository.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";

export const usersService    = new UserRepository(new UsersDaoMongo());
export const productsService = new ProductRepository(new ProductsDaoMongo());
export const cartsService    = new CartRepository(new CartsDaoMongo());
export const ticketsService  = new TicketRepository(new TicketsDaoMongo());
