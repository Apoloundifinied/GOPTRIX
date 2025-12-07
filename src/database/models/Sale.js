import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    saleId: {
        type: String,
        required: true,
        unique: true,
    },
    clientId: String,
    clientName: String,
    price: {
        type: Number,
        required: true,
    },
    product: String,
    affiliateId: {
        type: String,
        default: null,
    },
    affiliateCommission: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed',
    },
    cfgFile: String,
    ticketId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    followUpSent: {
        type: Boolean,
        default: false,
    },
    followUpDate: Date,
});

export default mongoose.model('Sale', saleSchema);
