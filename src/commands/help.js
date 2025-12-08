import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📖 Mostra todos os comandos disponíveis'),

    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📖 Ajuda - Comandos Disponíveis')
            .setDescription('Conheça os comandos principais do GOP TRIX BOT')
            .addFields(
                {
                    name: '🛒 Compras',
                    value: '`/loja` — Catálogo de otimizações\n`/enviar-comprovante` — Enviar comprovante PIX',
                    inline: false,
                },
                {
                    name: '⏳ Fila',
                    value: '`/fila-status` — Ver posição na fila\n`/fila-entrar` — Entrar na fila (pedido validado)\n`/fila-sair` — Sair da fila',
                    inline: false,
                },
                {
                    name: '🎫 Suporte',
                    value: 'Clique no botão abaixo para abrir um ticket de suporte',
                    inline: false,
                },
                {
                    name: '🛠️ Staff — Pagamentos',
                    value: '`/validar-comprovante` — Validar comprovante e enfileirar',
                    inline: false,
                },
                {
                    name: '🧩 Staff — Fila',
                    value: '`/fila-lista` `fila-atender` `fila-priorizar` `fila-transferir` `fila-finalizar`',
                    inline: false,
                },
                {
                    name: '🔧 Gestão de Servidor',
                    value: '`/clear` `lock-channel` `unlock-channel` `slowmode` `announce` `setnick` `createserver`',
                    inline: false,
                }
            )
            .setFooter({ text: 'GOP TRIX BOT — Verifique seu email em até 1 hora após a compra' })
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
