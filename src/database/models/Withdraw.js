import mongoose from 'mongoose';

const withdrawSchema = new mongoose.Schema({
    withdrawId: {
        type: String,
        required: true,
        unique: true,
    },
    streamerId: {
        type: String,
        required: true,
    },
    streamerName: String,
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ['pix', 'bank', 'wallet'],
        default: 'pix',
    },
    methodDetails: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending',
    },
    approvedBy: String,
    approvalDate: Date,
    rejectionReason: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: Date,
});

export default mongoose.model('Withdraw', withdrawSchema);
