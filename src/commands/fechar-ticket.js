import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { closeTicket } from '../services/ticketService.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fechar-ticket')
        .setDescription('🔒 Feche um ticket (apenas no canal de ticket)')
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo do fechamento')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            // Verificar se é um canal de ticket
            if (!interaction.channel || !interaction.channel.name.startsWith('ticket-')) {
                const errorEmbed = createErrorEmbed(
                    '❌ Erro',
                    'Este comando só pode ser usado em canais de ticket!'
                );
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const ticketId = interaction.channel.name.replace('ticket-', '').toUpperCase();
            const reason = interaction.options.getString('motivo') || 'Sem motivo especificado';

            await closeTicket(`TICKET-${ticketId}`, interaction.user.username);

            const successEmbed = createSuccessEmbed(
                '✅ Ticket Fechado',
                `Ticket **${ticketId}** foi fechado com sucesso!\n**Motivo:** ${reason}`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Log
            const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-gerais');
            if (logsChannel) {
                const logEmbed = createSuccessEmbed(
                    '🔒 Ticket Fechado',
                    `**ID:** ${ticketId}\n**Fechado por:** ${interaction.user.username}\n**Motivo:** ${reason}`
                );
                await logsChannel.send({ embeds: [logEmbed] });
            }

            // Delete channel after 5 seconds
            setTimeout(() => {
                interaction.channel.delete().catch(e => console.error('Erro ao deletar canal:', e));
            }, 5000);

        } catch (error) {
            console.error('Erro ao fechar ticket:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao fechar ticket!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
