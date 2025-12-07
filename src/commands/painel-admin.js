import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getAllStreamers } from '../services/streamerService.js';
import { getPendingWithdraws } from '../services/withdrawService.js';
import { getPendingSchedules } from '../services/scheduleService.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('painel-admin')
        .setDescription('🛡️ Acesse o painel administrativo (Admin)'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (!interaction.member.roles.has(adminRole?.id)) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui permissão para acessar o painel!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const streamers = await getAllStreamers();
            const pendingWithdraws = await getPendingWithdraws();
            const pendingSchedules = await getPendingSchedules();

            let totalBalance = 0;
            let totalCommissions = 0;

            streamers.forEach(s => {
                totalBalance += s.balance;
                totalCommissions += s.totalCommission;
            });

            const panelEmbed = createInfoEmbed(
                '🛡️ Painel de Administração',
                'Bem-vindo ao painel administrativo!'
            )
                .addFields(
                    { name: '👥 Total de Parceiros', value: String(streamers.length), inline: true },
                    { name: '💰 Saldo Total', value: formatCurrency(totalBalance), inline: true },
                    { name: '💸 Comissões Totais', value: formatCurrency(totalCommissions), inline: true },
                    { name: '⏳ Saques Pendentes', value: String(pendingWithdraws.length), inline: true },
                    { name: '📅 Agendamentos Pendentes', value: String(pendingSchedules.length), inline: true }
                );

            await interaction.editReply({ embeds: [panelEmbed] });

        } catch (error) {
            console.error('Erro:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao acessar painel!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
