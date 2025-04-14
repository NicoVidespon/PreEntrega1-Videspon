import { Router } from "express";
import passport from "passport";
import TicketsController from "../controllers/tickets.controller.js";

const router = Router();
const {createTicket, getAllTickets, getTicketById} = new TicketsController();

router.post("/", passport.authenticate("jwt", { session: false }), createTicket);
router.get("/", passport.authenticate("jwt", { session: false }), getAllTickets);
router.get("/:tid", passport.authenticate("jwt", { session: false }), getTicketById);

export default router;
