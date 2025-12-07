import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Define o modo lento do canal atual')
        .addIntegerOption(o => o.setName('segundos').setDescription('Segundos por mensagem (0-21600)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        const seconds = interaction.options.getInteger('segundos');
        if (seconds < 0 || seconds > 21600) {
            await interaction.editReply({ content: 'Informe um valor entre 0 e 21600 segundos.' });
            return;
        }
        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            await interaction.editReply({ content: `Modo lento definido: ${seconds}s.` });
        } catch (err) {
            await interaction.editReply({ content: `Erro ao definir modo lento: ${err.message}` });
        }
    }
};
