import { SlashCommandBuilder } from 'discord.js';
import { getPendingOrders } from '../services/orderService.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pedidos-pendentes')
        .setDescription('📋 Lista pedidos esperando comprovante (Admin)'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            // Check if user is admin
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (!interaction.member.roles.cache.has(adminRole?.id)) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui permissão para usar este comando!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const pendingOrders = await getPendingOrders();

            if (pendingOrders.length === 0) {
                const infoEmbed = createInfoEmbed('📋 Pedidos Pendentes', 'Nenhum pedido esperando comprovante.');
                await interaction.editReply({ embeds: [infoEmbed] });
                return;
            }

            let description = '';
            pendingOrders.forEach((order, index) => {
                const statusText = {
                    'pendente': '⏳ Pendente',
                    'aguardando-comprovante': '⏳ Aguardando Comprovante',
                    'comprovante-enviado': '📸 Comprovante Enviado'
                };

                description += `\n**${index + 1}. ${order.clientName}**\n`;
                description += `   └─ ID: \`${order.orderId}\`\n`;
                description += `   └─ Serviço: ${order.service}\n`;
                description += `   └─ Valor: ${formatCurrency(order.finalPrice)}\n`;
                description += `   └─ Status: ${statusText[order.status]}\n`;
                description += `   └─ Solicitado: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}\n`;
            });

            const embed = createInfoEmbed(
                `📋 Pedidos Pendentes (${pendingOrders.length})`,
                description
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao listar pedidos pendentes:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao listar pedidos!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
