import Order from '../database/models/Order.js';
import { createSaleWithFollowUp } from './saleService.js';
import { getStreamerByAffiliateId, updateStreamerBalance } from './streamerService.js';

export async function createOrder(orderData) {
    try {
        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

export async function getOrder(orderId) {
    try {
        const order = await Order.findOne({ orderId });
        return order;
    } catch (error) {
        console.error('Erro ao obter pedido:', error);
        throw error;
    }
}

export async function getPendingOrders() {
    try {
        const orders = await Order.find({
            status: { $in: ['pendente', 'aguardando-comprovante', 'comprovante-enviado'] }
        }).sort({ createdAt: -1 });
        return orders;
    } catch (error) {
        console.error('Erro ao obter pedidos pendentes:', error);
        throw error;
    }
}

export async function updateOrderProof(orderId, messageId, imageUrl) {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            {
                status: 'comprovante-enviado',
                proofMessageId: messageId,
                proofImageUrl: imageUrl
            },
            { new: true }
        );
        return order;
    } catch (error) {
        console.error('Erro ao atualizar comprovante:', error);
        throw error;
    }
}

export async function validateOrder(orderId, validatedBy) {
    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        // Atualizar status
        order.status = 'validado';
        order.validatedBy = validatedBy;
        order.validatedAt = new Date();
        await order.save();

        // Criar venda automáticamente
        const saleData = {
            saleId: `SALE-${order.orderId.split('-')[1]}`,
            clientName: order.clientName,
            price: order.finalPrice,
            product: order.service,
            affiliateId: order.affiliateId,
            affiliateCommission: order.affiliateCommission,
            status: 'completed',
            ticketId: null,
        };

        await createSaleWithFollowUp(saleData);

        return order;
    } catch (error) {
        console.error('Erro ao validar pedido:', error);
        throw error;
    }
}

export async function rejectOrder(orderId, rejectionReason) {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            {
                status: 'rejeitado',
                rejectionReason
            },
            { new: true }
        );
        return order;
    } catch (error) {
        console.error('Erro ao rejeitar pedido:', error);
        throw error;
    }
}

export async function getOrdersByClient(clientId) {
    try {
        const orders = await Order.find({ clientId }).sort({ createdAt: -1 });
        return orders;
    } catch (error) {
        console.error('Erro ao obter pedidos do cliente:', error);
        throw error;
    }
}
