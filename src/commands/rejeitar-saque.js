import { SlashCommandBuilder } from 'discord.js';
import { rejectWithdraw } from '../services/withdrawService.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rejeitar-saque')
        .setDescription('❌ Rejeita uma solicitação de saque (Admin)')
        .addStringOption(option =>
            option
                .setName('withdraw_id')
                .setDescription('ID do saque a rejeitar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo da rejeição')
                .setRequired(true)
        ),

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

            const withdrawId = interaction.options.getString('withdraw_id');
            const rejectionReason = interaction.options.getString('motivo');

            const withdraw = await rejectWithdraw(withdrawId, rejectionReason);

            if (!withdraw) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Saque não encontrado!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const successEmbed = createSuccessEmbed(
                '❌ Saque Rejeitado',
                `Saque **${withdrawId}** foi rejeitado!\n**Valor:** ${formatCurrency(withdraw.amount)}\n**Motivo:** ${rejectionReason}`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Notify streamer
            try {
                const user = await interaction.client.users.fetch(withdraw.streamerId);
                const dmEmbed = createErrorEmbed(
                    '❌ Seu Saque foi Rejeitado',
                    `Seu saque de ${formatCurrency(withdraw.amount)} foi rejeitado.\n\nMotivo: ${rejectionReason}\n\nVocê pode solicitar outro saque em breve.`
                );
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Erro ao enviar DM:', error);
            }

            // Log
            const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-gerais');
            if (logsChannel) {
                const logEmbed = createErrorEmbed(
                    '❌ Saque Rejeitado',
                    `**ID:** ${withdrawId}\n**Streamer:** ${withdraw.streamerName}\n**Valor:** ${formatCurrency(withdraw.amount)}\n**Motivo:** ${rejectionReason}`
                );
                await logsChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error('Erro ao rejeitar saque:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao rejeitar saque!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
