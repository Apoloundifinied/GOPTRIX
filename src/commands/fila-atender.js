import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { assignTicket, getQueue } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-atender')
        .setDescription('Inicia atendimento do próximo da fila ou de um ticket')
        .addStringOption(o => o.setName('queue_id').setDescription('ID da fila').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const qid = interaction.options.getString('queue_id');
        let ticket = null;
        if (qid) {
            ticket = await assignTicket(qid, interaction.user.id);
        } else {
            const list = await getQueue(interaction.guild.id);
            if (list.length === 0) {
                await interaction.editReply({ content: 'Fila vazia.' });
                return;
            }
            ticket = await assignTicket(list[0].queueId, interaction.user.id);
        }
        if (!ticket) {
            await interaction.editReply({ content: 'Não foi possível iniciar atendimento.' });
            return;
        }
        try {
            const user = await interaction.client.users.fetch(ticket.clientId);
            await user.send({ content: `Seu atendimento iniciou. Responsável: ${interaction.user.tag}.` });
        } catch {}
        await interaction.editReply({ content: `Atendimento iniciado: ${ticket.clientName} — ${ticket.service}.` });
    }
};
