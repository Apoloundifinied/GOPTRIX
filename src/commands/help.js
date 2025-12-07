import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📖 Mostra todos os comandos disponíveis'),

    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📖 Ajuda - Comandos Disponíveis')
            .setDescription('Conheça todos os comandos do GOP TRIX BOT')
            .addFields(
                {
                    name: '🎫 Suporte',
                    value: 'Clique no botão abaixo para criar um ticket de suporte',
                    inline: false,
                },
                {
                    name: '🛠️ Otimizações à venda',
                    value: '`/loja` - Abra o catálogo de otimizações\n`/enviar-comprovante` - Envie o comprovante PIX\n`/validar-comprovante` - Validar pagamento (Admin)'
                }
            )
            .setFooter({ text: 'GOP TRIX BOT - Use /help <comando> para mais informações' })
            .setTimestamp();

        const ticketButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create-ticket')
                    .setLabel('🎫 Abrir Ticket de Suporte')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({
            embeds: [helpEmbed],
            components: [ticketButton],
            flags: 64,
        });
    },
};
