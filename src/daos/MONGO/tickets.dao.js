import TicketModel from "./models/TicketModel.js";
import { v4 as uuidv4 } from "uuid";

export default class TicketsDaoMongo {
  createTicket = async ({ amount, purchaser }) => {
    try {
      return await TicketModel.create({
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount,
        purchaser,
      });
    } catch (error) {
      throw new Error(`Error al crear el ticket: ${error.message}`);
    }
  };

  getTicketById = async (tid) => {
    try {
      return await TicketModel.findById(tid);
    } catch (error) {
      throw new Error(`Error al buscar el ticket: ${error.message}`);
    }
  };

  getAllTickets = async () => {
    try {
      return await TicketModel.find();
    } catch (error) {
      throw new Error(`Error al obtener los tickets: ${error.message}`);
    }
  };
}
