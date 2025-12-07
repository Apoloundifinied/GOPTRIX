import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clientId: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true // CFG, Otimização, etc
    },
    originalPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    affiliateId: {
        type: String,
        default: null
    },
    affiliateCommission: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pendente', 'aguardando-comprovante', 'comprovante-enviado', 'validado', 'rejeitado'],
        default: 'pendente'
    },
    pixKey: {
        type: String,
        required: true
    },
    paymentEmail: {
        type: String,
        required: true
    },
    paymentDeadline: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    proofDescription: {
        type: String,
        default: null
    },
    pixHash: {
        type: String,
        default: null
    },
    proofSubmittedAt: {
        type: Date,
        default: null
    },
    proofSubmittedBy: {
        type: String,
        default: null
    },
    validatedBy: {
        type: String,
        default: null
    },
    validatedAt: {
        type: Date,
        default: null
    },
    validationNotes: {
        type: String,
        default: null
    },
    rejectedBy: {
        type: String,
        default: null
    },
    rejectedAt: {
        type: Date,
        default: null
    },
    rejectReason: {
        type: String,
        default: null
    },
    // Campos de Entrega
    deliveryLink: {
        type: String,
        default: null // Link único de download
    },
    deliveryUniquePath: {
        type: String,
        default: null // ID único para acesso ao download
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    deliveredBy: {
        type: String,
        default: null
    },
    clientDownloadedAt: {
        type: Date,
        default: null
    },
    clientDownloadCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', OrderSchema);
