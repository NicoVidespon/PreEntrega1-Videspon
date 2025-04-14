import { ticketsService } from "../services/index.js";

export default class TicketsController {
  constructor() {
    this.service = ticketsService;
  }

  createTicket = async (req, res) => {
    try {
      const { amount, purchaser } = req.body;
      if (amount == null || !purchaser) {
        return res
          .status(400)
          .json({ status: "error", error: "Faltan campos obligatorios." });
      }

      const ticket = await this.service.createTicket({ amount, purchaser });
      res.status(201).json({ status: "success", payload: ticket });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  };

  getTicketById = async (req, res) => {
    try {
      const { tid } = req.params;
      const ticket = await this.service.getTicketById(tid);
      if (!ticket) {
        return res
          .status(404)
          .json({ status: "error", error: "Ticket no encontrado" });
      }
      res.json({ status: "success", payload: ticket });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  };

  getAllTickets = async (_req, res) => {
    try {
      const tickets = await this.service.getAllTickets();
      res.json({ status: "success", payload: tickets });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  };
}
