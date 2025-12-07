import { v4 as uuidv4 } from 'uuid';
import QueueTicket from '../database/models/QueueTicket.js';
import Order from '../database/models/Order.js';

function getPriorityForService(service) {
    const s = (service || '').toLowerCase();
    if (s.includes('ultra') || s.includes('bios')) return 9;
    if (s.includes('avançada')) return 7;
    if (s.includes('sovietic')) return 6;
    return 5;
}

export async function enqueue({ orderId, clientId, clientName, service, guildId }) {
    const existing = await QueueTicket.findOne({ orderId, status: { $in: ['waiting', 'in_service'] }, guildId });
    if (existing) return existing;
    const queueId = `QUEUE-${uuidv4().slice(0, 8).toUpperCase()}`;
    const priority = getPriorityForService(service);
    const ticket = await QueueTicket.create({ queueId, orderId, clientId, clientName, service, guildId, priority });
    return ticket;
}

export async function getQueue(guildId) {
    const list = await QueueTicket.find({ guildId, status: 'waiting' }).sort({ priority: -1, createdAt: 1 });
    return list;
}

export async function getUserTicket(clientId, guildId) {
    const ticket = await QueueTicket.findOne({ clientId, guildId, status: { $in: ['waiting', 'in_service'] } }).sort({ createdAt: -1 });
    return ticket;
}

export async function assignTicket(queueId, staffId) {
    const ticket = await QueueTicket.findOneAndUpdate(
        { queueId, status: 'waiting' },
        { status: 'in_service', assignedTo: staffId, startedAt: new Date() },
        { new: true }
    );
    return ticket;
}

export async function completeTicket(queueId) {
    const ticket = await QueueTicket.findOneAndUpdate(
        { queueId, status: { $in: ['waiting', 'in_service'] } },
        { status: 'completed', endedAt: new Date() },
        { new: true }
    );
    return ticket;
}

export async function cancelTicket(queueId) {
    const ticket = await QueueTicket.findOneAndUpdate(
        { queueId, status: { $in: ['waiting'] } },
        { status: 'cancelled', endedAt: new Date() },
        { new: true }
    );
    return ticket;
}

export async function updatePriority(queueId, priority) {
    const ticket = await QueueTicket.findOneAndUpdate(
        { queueId },
        { priority },
        { new: true }
    );
    return ticket;
}

export async function transferTicket(queueId, staffId) {
    const ticket = await QueueTicket.findOneAndUpdate(
        { queueId, status: 'in_service' },
        { assignedTo: staffId },
        { new: true }
    );
    return ticket;
}

export async function getPosition(queueId, guildId) {
    const list = await getQueue(guildId);
    const idx = list.findIndex(t => t.queueId === queueId);
    return idx >= 0 ? idx + 1 : null;
}

export default {
    enqueue,
    getQueue,
    getUserTicket,
    assignTicket,
    completeTicket,
    cancelTicket,
    updatePriority,
    transferTicket,
    getPosition,
};
