import { SlashCommandBuilder } from 'discord.js';
import { enqueue, getPosition } from '../services/queueService.js';
import Order from '../database/models/Order.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-entrar')
        .setDescription('Entra na fila de atendimento de otimização')
        .addStringOption(o => o.setName('pedido').setDescription('ID do pedido validado').setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const orderId = interaction.options.getString('pedido');
        let order = null;
        if (orderId) {
            order = await Order.findOne({ orderId, clientId: interaction.user.id, status: 'validado' });
        } else {
            order = await Order.findOne({ clientId: interaction.user.id, status: 'validado' }).sort({ validatedAt: -1 });
        }
        if (!order) {
            await interaction.editReply({ content: 'Nenhum pedido validado encontrado.' });
            return;
        }
        const ticket = await enqueue({
            orderId: order.orderId,
            clientId: order.clientId,
            clientName: order.clientName,
            service: order.service,
            guildId: interaction.guild.id,
        });
        const pos = await getPosition(ticket.queueId, interaction.guild.id);
        await interaction.editReply({ content: `Você entrou na fila. Posição: ${pos}.` });
    }
};
