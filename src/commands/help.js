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
                    name: '🎫 Sistema de Tickets',
                    value: 'Clique no botão abaixo para criar um ticket de suporte',
                    inline: false,
                },
                {
                    name: '🤝 Sistema de Parceiros',
                    value: '`/criar-parceiro` - Crie uma conta de parceiro\n`/meu-perfil` - Veja seu perfil',
                    inline: false,
                },
                {
                    name: '💰 Sistema de Vendas',
                    value: '`/processar-venda` - Processa uma venda (Admin)\n`/vendas` - Veja suas vendas',
                    inline: false,
                },
                {
                    name: '💸 Sistema de Saques',
                    value: '`/solicitar-saque` - Solicite um saque\n`/aprovar-saque` - Aprove saques (Admin)',
                    inline: false,
                },
                {
                    name: '📅 Agendamentos',
                    value: '`/agendar` - Solicite um agendamento\n`/aprovar-agendamento` - Aprove agendamentos (Admin)',
                    inline: false,
                },
                {
                    name: '👥 Admin',
                    value: '`/painel-admin` - Acesse o painel de administração\n`/relatorio` - Gere relatórios',
                    inline: false,
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
