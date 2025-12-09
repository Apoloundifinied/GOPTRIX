import express from 'express';
import Order from '../database/models/Order.js';
import { getPaymentStatus } from '../services/paymentGatewayService.js';
import { enqueue, getPosition } from '../services/queueService.js';

const router = express.Router();

async function findGuildForUser(client, userId) {
    const guilds = await client.guilds.fetch();
    for (const [, guildSummary] of guilds) {
        try {
            const guild = await client.guilds.fetch(guildSummary.id);
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) return guild;
        } catch { }
    }
    return null;
}

function findChannelByNames(guild, names) {
    const lower = names.map(n => n.toLowerCase());
    return guild.channels.cache.find(ch => lower.includes(ch.name.toLowerCase())) || null;
}

async function handleNotification(req, res) {
    try {
        const client = req.app.locals.client;
        const type = req.body.type || req.query.type || req.body.topic || req.query.topic;
        const action = req.body.action || req.query.action;
        const paymentId = req.body?.data?.id || req.query?.id;

        if (type !== 'payment' || !paymentId) {
            return res.status(200).json({ ok: true });
        }

        const info = await getPaymentStatus(paymentId);

        if (info.status !== 'approved') {
            return res.status(200).json({ ok: true, status: info.status });
        }

        let order = await Order.findOne({ gatewayPaymentId: String(paymentId) });
        if (!order && info.external_reference) {
            order = await Order.findOne({ orderId: info.external_reference });
        }

        if (!order) {
            return res.status(200).json({ ok: true, message: 'order not found' });
        }

        order.gatewayStatus = info.status;
        order.status = 'validado';
        order.validatedAt = new Date();
        order.validatedBy = 'gateway:webhook';
        await order.save();

        let posMsg = '';
        try {
            const guild = await findGuildForUser(client, order.clientId);
            const guildId = guild?.id || null;
            const ticket = await enqueue({
                orderId: order.orderId,
                clientId: order.clientId,
                clientName: order.clientName,
                service: order.service,
                guildId: guildId || 'global',
            });
            const pos = await getPosition(ticket.queueId, guildId || 'global');
            posMsg = ` Você foi adicionado à fila. Posição: ${pos}.`;

            if (guild) {
                const channel = findChannelByNames(guild, ['fila-status', 'pedidos-pendentes', 'admin-fila']);
                if (channel) {
                    await channel.send({ content: `✅ Pagamento aprovado para pedido ${order.orderId}. <@${order.clientId}>.${posMsg}` });
                }
            }
        } catch { }

        try {
            const user = await client.users.fetch(order.clientId);
            await user.send({ content: `✅ Pagamento recebido!${posMsg}` });
        } catch { }

        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(200).json({ ok: true });
    }
}

router.post('/notification', handleNotification);
router.post('/', handleNotification);

export default router;
