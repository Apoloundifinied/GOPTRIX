import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Define o apelido de um membro')
        .addUserOption(o => o.setName('usuario').setDescription('Usuário alvo').setRequired(true))
        .addStringOption(o => o.setName('apelido').setDescription('Novo apelido').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        try {
            const user = interaction.options.getUser('usuario');
            const nick = interaction.options.getString('apelido');
            const member = await interaction.guild.members.fetch(user.id);
            await member.setNickname(nick);
            await interaction.editReply({ content: `Apelido definido para ${member.user.tag}: ${nick}.` });
        } catch (err) {
            await interaction.editReply({ content: `Erro ao definir apelido: ${err.message}` });
        }
    }
};
