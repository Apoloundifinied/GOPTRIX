import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { completeTicket } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-finalizar')
        .setDescription('Finaliza um atendimento')
        .addStringOption(o => o.setName('queue_id').setDescription('ID da fila').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const qid = interaction.options.getString('queue_id');
        const t = await completeTicket(qid);
        if (!t) {
            await interaction.editReply({ content: 'Ticket não encontrado.' });
            return;
        }
        try {
            const user = await interaction.client.users.fetch(t.clientId);
            await user.send({ content: 'Seu atendimento foi concluído. Se precisar, procure suporte.' });
        } catch {}
        await interaction.editReply({ content: 'Atendimento finalizado.' });
    }
};
