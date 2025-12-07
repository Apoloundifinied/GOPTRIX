import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getQueue } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('fila-lista')
        .setDescription('Lista os próximos da fila')
        .addIntegerOption(o => o.setName('limite').setDescription('Quantos mostrar (1-25)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const limit = Math.min(Math.max(interaction.options.getInteger('limite') || 10, 1), 25);
        const list = await getQueue(interaction.guild.id);
        if (list.length === 0) {
            await interaction.editReply({ content: 'Fila vazia.' });
            return;
        }
        const slice = list.slice(0, limit);
        const lines = slice.map((t, i) => `${i + 1}. ${t.clientName} — ${t.service} (prio ${t.priority})`).join('\n');
        const embed = new EmbedBuilder().setColor(0x3498DB).setTitle('Fila de Otimização').setDescription(lines).setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
};
