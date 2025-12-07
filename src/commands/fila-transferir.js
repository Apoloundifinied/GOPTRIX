import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { transferTicket } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-transferir')
        .setDescription('Transfere um atendimento em curso para outro staff')
        .addStringOption(o => o.setName('queue_id').setDescription('ID da fila').setRequired(true))
        .addUserOption(o => o.setName('staff').setDescription('Novo responsável').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const qid = interaction.options.getString('queue_id');
        const staff = interaction.options.getUser('staff');
        const t = await transferTicket(qid, staff.id);
        if (!t) {
            await interaction.editReply({ content: 'Ticket não encontrado ou não está em atendimento.' });
            return;
        }
        await interaction.editReply({ content: `Transferido para ${staff.tag}.` });
    }
};
