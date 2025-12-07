import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('enviar-boas-vindas')
        .setDescription('🎉 Admin: Enviar mensagem de boas-vindas no canal')
        .addChannelOption(option =>
            option
                .setName('canal')
                .setDescription('Canal para enviar a mensagem')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            // Verificar permissões
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                await interaction.editReply({
                    content: ' Apenas administradores podem usar este comando!'
                });
                return;
            }

            // Definir canal
            const channel = interaction.options.getChannel('canal') || interaction.channel;

            if (!channel) {
                await interaction.editReply({
                    content: '❌ Canal não encontrado!'
                });
                return;
            }

            // Criar embed de boas-vindas
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('✨ BEM-VINDO AO GOP TRIX ✨')
                .setDescription(`
                    🎉 Bem-vindo ao servidor oficial de vendas de CFG!

                    **Aqui você encontra:**
                    💰 **Compra de CFG** - Produtos de qualidade com desconto
                    🤝 **Sistema de Afiliação** - Ganhe comissões vendendo
                    📊 **Acompanhamento** - Controle suas vendas em tempo real
                    💳 **Saques PIX** - Retire seus ganhos quando quiser

                    **Para começar:**
                    1. Use \`/help\` para conhecer todos os comandos
                    2. Use \`/criar-parceiro\` para virar um afiliado
                    3. Use \`/meu-perfil\` para acompanhar seu progresso
                    4. Explore os canais temáticos do servidor
                `)
                .addFields(
                    { name: '💡 Sistema de Desconto', value: 'Todos os clientes ganham 5% de desconto automático!', inline: false },
                    { name: '🎁 Comissão de Afiliado', value: 'Ganhe 10% em cada venda realizada por seu link', inline: false },
                    { name: '⚡ Processamento Rápido', value: 'PIX instantâneo - receba seus ganhos em segundos', inline: false }
                )
                .setFooter({ text: '© GOP TRIX | Sistema Profissional de Afiliação', iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            // Criar botões
            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Ver Comandos')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('📋')
                        .setCustomId('channel-action-boas-vindas-ver-comandos'),
                    new ButtonBuilder()
                        .setLabel('Virar Afiliado')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🤝')
                        .setCustomId('channel-action-boas-vindas-virar-afiliado'),
                    new ButtonBuilder()
                        .setLabel('Abrir Suporte')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🎧')
                        .setCustomId('channel-action-boas-vindas-abrir-suporte')
                );

            // Enviar mensagem
            await channel.send({
                embeds: [welcomeEmbed],
                components: [buttonRow]
            });

            await interaction.editReply({
                content: `✅ Mensagem de boas-vindas enviada em ${channel}!`
            });

        } catch (error) {
            console.error('Erro ao enviar boas-vindas:', error);
            await interaction.editReply({
                content: '❌ Erro ao enviar mensagem de boas-vindas!'
            });
        }
    }
};
