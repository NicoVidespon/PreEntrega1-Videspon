import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import CartManager from "../managers/CartManager.js"; 

const route = Router();
const cartManager = new CartManager(); 

// Ruta para obtener los usuarios con paginación
route.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const options = {
      limit,
      page,
      sort: { last_name: 1 }, 
    };

    const result = await UserModel.paginate({}, options);

    const response = {
      count: result.totalDocs,
      result: result.docs,
      currentPage: result.page,
      hasPrev: result.hasPrevPage,
      hasNext: result.hasNextPage,
      prev: result.prevPage ? `?page=${result.prevPage}&limit=${limit}` : null,
      next: result.nextPage ? `?page=${result.nextPage}&limit=${limit}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

// Ruta para crear un nuevo usuario y asignarle un carrito
route.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: "Faltan datos para crear el usuario" });
    }

    // Crear un nuevo carrito para el usuario
    const newCart = await cartManager.createCart();

    if (!newCart) {
      return res.status(500).json({ message: "Error al crear el carrito" });
    }

    // Crear el usuario con referencia al carrito
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      cartId: newCart._id, 
    });
    await newUser.save();

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: newUser,
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
});

// Ruta para eliminar un usuario por ID
route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
});

export default route;
