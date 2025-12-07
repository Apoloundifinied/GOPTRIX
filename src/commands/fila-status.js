import { SlashCommandBuilder } from 'discord.js';
import { getUserTicket, getPosition } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-status')
        .setDescription('Consulta sua posição na fila'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const ticket = await getUserTicket(interaction.user.id, interaction.guild.id);
        if (!ticket) {
            await interaction.editReply({ content: 'Você não está na fila.' });
            return;
        }
        if (ticket.status === 'in_service') {
            await interaction.editReply({ content: 'Seu atendimento já começou.' });
            return;
        }
        const pos = await getPosition(ticket.queueId, interaction.guild.id);
        await interaction.editReply({ content: `Sua posição na fila: ${pos}. Serviço: ${ticket.service}.` });
    }
};
