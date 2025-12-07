import { SlashCommandBuilder } from 'discord.js';
import { completeWithdraw } from '../services/withdrawService.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('completar-saque')
        .setDescription('✅ Marca um saque como completado/enviado (Admin)')
        .addStringOption(option =>
            option
                .setName('withdraw_id')
                .setDescription('ID do saque a completar')
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

            const withdraw = await completeWithdraw(withdrawId);

            if (!withdraw) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Saque não encontrado!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const successEmbed = createSuccessEmbed(
                '✅ Saque Completado',
                `Saque **${withdrawId}** foi marcado como completado!\n**Valor:** ${formatCurrency(withdraw.amount)}\n**Streamer:** ${withdraw.streamerName}\n\n💸 O valor foi transferido!`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Notify streamer
            try {
                const user = await interaction.client.users.fetch(withdraw.streamerId);
                const dmEmbed = createSuccessEmbed(
                    '✅ Seu Saque foi Enviado!',
                    `Seu saque de ${formatCurrency(withdraw.amount)} foi processado e enviado!\n\nID do Saque: \`${withdrawId}\`\n\nVerifique sua conta em breve.`
                );
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Erro ao enviar DM:', error);
            }

            // Log
            const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-gerais');
            if (logsChannel) {
                const logEmbed = createSuccessEmbed(
                    '✅ Saque Completado',
                    `**ID:** ${withdrawId}\n**Streamer:** ${withdraw.streamerName}\n**Valor:** ${formatCurrency(withdraw.amount)}`
                );
                await logsChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error('Erro ao completar saque:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao completar saque!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
