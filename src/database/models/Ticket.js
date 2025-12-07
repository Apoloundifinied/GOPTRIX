import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
    },
    channelId: String,
    clientId: String,
    clientName: String,
    affiliateId: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        enum: ['support', 'sales', 'optimization', 'other'],
        default: 'support',
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    closedAt: Date,
    closedBy: String,
});

export default mongoose.model('Ticket', ticketSchema);
