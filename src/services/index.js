import UsersDao from "../daos/MONGO/users.dao.js";
import ProductsDao from "../daos/MONGO/products.dao.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";

export const usersService = new UserRepository(new UsersDao());
export const productService = new ProductRepository(new ProductsDao());
