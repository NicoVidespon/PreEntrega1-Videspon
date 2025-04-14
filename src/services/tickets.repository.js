export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTicket = (data) => this.dao.createTicket(data);

  getTicketById = (id) => this.dao.getTicketById(id);

  getAllTickets = () => this.dao.getAllTickets();
}
