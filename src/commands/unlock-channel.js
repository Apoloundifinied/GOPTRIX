import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unlock-channel')
        .setDescription('Desbloqueia o envio de mensagens no canal atual')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        try {
            const channel = interaction.channel;
            const everyone = interaction.guild.roles.everyone;
            await channel.permissionOverwrites.edit(everyone, { SendMessages: null });
            await interaction.editReply({ content: `Canal desbloqueado: ${channel.name}.` });
        } catch (err) {
            await interaction.editReply({ content: `Erro ao desbloquear canal: ${err.message}` });
        }
    }
};
