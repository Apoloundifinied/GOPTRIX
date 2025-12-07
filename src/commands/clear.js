import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal atual')
        .addIntegerOption(o => o.setName('quantidade').setDescription('Número de mensagens (1-100)').setRequired(true))
        .addUserOption(o => o.setName('usuario').setDescription('Apenas mensagens deste usuário').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        const amount = interaction.options.getInteger('quantidade');
        const user = interaction.options.getUser('usuario');

        if (amount < 1 || amount > 100) {
            await interaction.editReply({ content: 'Informe uma quantidade entre 1 e 100.' });
            return;
        }

        const channel = interaction.channel;

        try {
            if (!user) {
                const deleted = await channel.bulkDelete(amount, true);
                await interaction.editReply({ content: `Removidas ${deleted.size} mensagens.` });
                return;
            }

            const fetched = await channel.messages.fetch({ limit: 100 });
            const toDelete = fetched.filter(m => m.author.id === user.id).first(amount);
            const ids = toDelete.map(m => m.id);

            let count = 0;
            for (const id of ids) {
                const msg = fetched.get(id);
                if (msg) {
                    await msg.delete();
                    count++;
                }
            }
            await interaction.editReply({ content: `Removidas ${count} mensagens de ${user.tag}.` });
        } catch (err) {
            await interaction.editReply({ content: `Erro ao limpar: ${err.message}` });
        }
    }
};
