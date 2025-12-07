import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { updatePriority } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-priorizar')
        .setDescription('Atualiza a prioridade de um ticket da fila')
        .addStringOption(o => o.setName('queue_id').setDescription('ID da fila').setRequired(true))
        .addIntegerOption(o => o.setName('prioridade').setDescription('Novo valor (1-10)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const qid = interaction.options.getString('queue_id');
        const prio = interaction.options.getInteger('prioridade');
        if (prio < 1 || prio > 10) {
            await interaction.editReply({ content: 'Informe prioridade entre 1 e 10.' });
            return;
        }
        const t = await updatePriority(qid, prio);
        if (!t) {
            await interaction.editReply({ content: 'Ticket não encontrado.' });
            return;
        }
        await interaction.editReply({ content: `Prioridade atualizada para ${prio}.` });
    }
};
