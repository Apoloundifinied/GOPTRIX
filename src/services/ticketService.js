import Ticket from '../database/models/Ticket.js';

export async function createTicket(ticketData) {
    try {
        const ticket = await Ticket.create(ticketData);
        return ticket;
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        throw error;
    }
}

export async function getTicket(ticketId) {
    try {
        const ticket = await Ticket.findOne({ ticketId });
        return ticket;
    } catch (error) {
        console.error('Erro ao obter ticket:', error);
        throw error;
    }
}

export async function closeTicket(ticketId, closedBy) {
    try {
        const ticket = await Ticket.findOneAndUpdate(
            { ticketId },
            {
                status: 'closed',
                closedAt: new Date(),
                closedBy
            },
            { new: true }
        );
        return ticket;
    } catch (error) {
        console.error('Erro ao fechar ticket:', error);
        throw error;
    }
}

export async function getOpenTickets() {
    try {
        const tickets = await Ticket.find({ status: 'open' });
        return tickets;
    } catch (error) {
        console.error('Erro ao obter tickets abertos:', error);
        throw error;
    }
}
