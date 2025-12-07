import { SlashCommandBuilder } from 'discord.js';
import { getUserTicket, cancelTicket } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-sair')
        .setDescription('Sai da fila de atendimento'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const ticket = await getUserTicket(interaction.user.id, interaction.guild.id);
        if (!ticket || ticket.status !== 'waiting') {
            await interaction.editReply({ content: 'Você não está em espera na fila.' });
            return;
        }
        await cancelTicket(ticket.queueId);
        await interaction.editReply({ content: 'Você saiu da fila.' });
    }
};
