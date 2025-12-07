import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getPendingWithdraws, approveWithdraw } from '../services/withdrawService.js';
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('aprovar-saque')
        .setDescription('✅ Aprove solicitações de saque (Admin)')
        .addStringOption(option =>
            option
                .setName('withdraw_id')
                .setDescription('ID do saque a aprovar')
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

            const withdraw = await approveWithdraw(withdrawId, interaction.user.username);

            const successEmbed = createSuccessEmbed(
                '✅ Saque Aprovado',
                `Saque **${withdrawId}** foi aprovado com sucesso!\n**Valor:** ${formatCurrency(withdraw.amount)}\n**Streamer:** ${withdraw.streamerName}`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Notify streamer
            try {
                const user = await interaction.client.users.fetch(withdraw.streamerId);
                const dmEmbed = createSuccessEmbed(
                    '✅ Seu Saque foi Aprovado!',
                    `Seu saque de ${formatCurrency(withdraw.amount)} foi aprovado!\n\nID do Saque: \`${withdrawId}\`\n\nO valor será transferido em breve.`
                );
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Erro ao enviar DM:', error);
            }

        } catch (error) {
            console.error('Erro ao aprovar saque:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao aprovar saque!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
