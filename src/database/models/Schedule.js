import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    scheduleId: {
        type: String,
        required: true,
        unique: true,
    },
    clientId: String,
    clientName: String,
    requestedTime: Date,
    scheduledTime: Date,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending',
    },
    approvedBy: String,
    approvalDate: Date,
    service: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Schedule', scheduleSchema);
