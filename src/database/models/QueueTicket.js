import mongoose from 'mongoose';

const queueTicketSchema = new mongoose.Schema({
    queueId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    clientName: { type: String, required: true },
    service: { type: String, required: true },
    guildId: { type: String, required: true, index: true },
    priority: { type: Number, default: 5 },
    status: { type: String, enum: ['waiting', 'in_service', 'completed', 'cancelled'], default: 'waiting' },
    assignedTo: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
});

export default mongoose.model('QueueTicket', queueTicketSchema);
