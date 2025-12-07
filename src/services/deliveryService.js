/**
 * 📦 Serviço de Entrega de Produtos
 * Gerencia links únicos de download e entrega
 */

import { v4 as uuidv4 } from 'uuid';
import Order from '../database/models/Order.js';

/**
 * 🔗 Gerar link único de entrega
 */
export async function generateDeliveryLink(orderId) {
    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            throw new Error('Ordem não encontrada');
        }

        // Gerar ID único para acesso
        const uniquePath = `dl-${uuidv4().slice(0, 8)}-${Date.now()}`;
        const deliveryLink = `https://goptrix.com/download/${uniquePath}`;

        // Atualizar ordem
        order.deliveryUniquePath = uniquePath;
        order.deliveryLink = deliveryLink;
        order.deliveredBy = 'admin';
        order.deliveredAt = new Date();

        await order.save();

        return {
            success: true,
            orderId,
            deliveryLink,
            uniquePath
        };
    } catch (error) {
        console.error('Erro ao gerar link de entrega:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 📬 Enviar link de download ao cliente via DM
 */
export async function sendDeliveryToClient(client, userId, order, downloadLink) {
    try {
        const user = await client.users.fetch(userId);

        const deliveryEmbed = {
            color: 0x2ecc71,
            title: '✅ Seu Produto está Pronto!',
            description: `Sua compra foi validada e está pronta para download!`,
            fields: [
                {
                    name: '📦 Produto',
                    value: order.service,
                    inline: true
                },
                {
                    name: '💰 Valor Pago',
                    value: `R$ ${order.finalPrice.toFixed(2)}`,
                    inline: true
                },
                {
                    name: '📋 ID da Ordem',
                    value: `\`${order.orderId}\``,
                    inline: false
                },
                {
                    name: '🔗 Link de Download',
                    value: `[Clique aqui para baixar](${downloadLink})`,
                    inline: false
                },
                {
                    name: '⏰ Validade do Link',
                    value: 'Disponível por 30 dias',
                    inline: true
                },
                {
                    name: '📊 Limite de Downloads',
                    value: 'Sem limite',
                    inline: true
                }
            ],
            footer: {
                text: 'Obrigado por comprar conosco! 🎉'
            },
            timestamp: new Date()
        };

        await user.send({ embeds: [deliveryEmbed] });

        return {
            success: true,
            message: `Link enviado para ${user.username}`
        };
    } catch (error) {
        console.error('Erro ao enviar link ao cliente:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 🔍 Obter informações de entrega de uma ordem
 */
export async function getDeliveryInfo(orderId) {
    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            return {
                success: false,
                error: 'Ordem não encontrada'
            };
        }

        return {
            success: true,
            orderId: order.orderId,
            clientId: order.clientId,
            product: order.service,
            status: order.status,
            deliveryLink: order.deliveryLink,
            deliveredAt: order.deliveredAt,
            downloadCount: order.clientDownloadCount,
            lastDownload: order.clientDownloadedAt
        };
    } catch (error) {
        console.error('Erro ao obter info de entrega:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 📊 Listar todas as ordens com status de entrega
 */
export async function listDeliveries(status = null) {
    try {
        let query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .select('orderId clientId service status deliveryLink deliveredAt')
            .sort({ createdAt: -1 });

        return {
            success: true,
            count: orders.length,
            orders
        };
    } catch (error) {
        console.error('Erro ao listar entregas:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 🗑️ Remover link de download expirado
 */
export async function expireDeliveryLink(orderId) {
    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            throw new Error('Ordem não encontrada');
        }

        order.deliveryLink = null;
        order.deliveryUniquePath = null;

        await order.save();

        return {
            success: true,
            message: 'Link expirado com sucesso'
        };
    } catch (error) {
        console.error('Erro ao expirar link:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    generateDeliveryLink,
    sendDeliveryToClient,
    getDeliveryInfo,
    listDeliveries,
    expireDeliveryLink
};
