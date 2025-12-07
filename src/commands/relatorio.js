import { SlashCommandBuilder } from 'discord.js';
import { getAllStreamers } from '../services/streamerService.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('relatorio')
        .setDescription('📊 Gere um relatório de vendas e parceiros (Admin)')
        .addStringOption(option =>
            option
                .setName('tipo')
                .setDescription('Tipo de relatório')
                .setRequired(true)
                .addChoices(
                    { name: 'Parceiros', value: 'streamers' },
                    { name: 'Saldo Total', value: 'balance' }
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (!interaction.member.roles.has(adminRole?.id)) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui permissão!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const type = interaction.options.getString('tipo');
            const streamers = await getAllStreamers();

            if (type === 'streamers') {
                let streamersText = '';
                streamers.forEach(s => {
                    streamersText += `• **${s.username}** (${s.affiliateId}) - Vendas: ${s.totalSales} | Comissão: ${formatCurrency(s.totalCommission)}\n`;
                });

                const embed = createInfoEmbed(
                    '📊 Relatório de Parceiros',
                    `Total de parceiros: **${streamers.length}**`
                )
                    .addFields({ name: 'Parceiros', value: streamersText || 'Nenhum parceiro', inline: false });

                await interaction.editReply({ embeds: [embed] });

            } else if (type === 'balance') {
                let totalBalance = 0;
                let balanceText = '';

                streamers.forEach(s => {
                    totalBalance += s.balance;
                    if (s.balance > 0) {
                        balanceText += `• **${s.username}** - ${formatCurrency(s.balance)}\n`;
                    }
                });

                const embed = createInfoEmbed(
                    '💰 Relatório de Saldo',
                    `Saldo total: **${formatCurrency(totalBalance)}**`
                )
                    .addFields({ name: 'Saldos', value: balanceText || 'Sem saldos', inline: false });

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Erro:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao gerar relatório!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
