import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Envia um anúncio em um canal')
        .addChannelOption(o => o.setName('canal').setDescription('Canal de destino').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(o => o.setName('titulo').setDescription('Título').setRequired(true))
        .addStringOption(o => o.setName('mensagem').setDescription('Mensagem').setRequired(true))
        .addStringOption(o => o.setName('cor').setDescription('Hex da cor, ex: #3498db').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        try {
            const channel = interaction.options.getChannel('canal');
            const title = interaction.options.getString('titulo');
            const message = interaction.options.getString('mensagem');
            const colorStr = interaction.options.getString('cor');
            let color = 0x3498DB;
            if (colorStr && /^#?[0-9a-fA-F]{6}$/.test(colorStr)) {
                const hex = colorStr.startsWith('#') ? colorStr.slice(1) : colorStr;
                color = parseInt(hex, 16);
            }
            const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(message).setTimestamp();
            await channel.send({ embeds: [embed] });
            await interaction.editReply({ content: `Anúncio enviado em ${channel}.` });
        } catch (err) {
            await interaction.editReply({ content: `Erro ao anunciar: ${err.message}` });
        }
    }
};
