import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('enviar-ticket-invite')
        .setDescription('🎫 Admin: Enviar convite para abrir ticket')
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
                    content: '❌ Apenas administradores podem usar este comando!'
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

            // Criar embed de tickets
            const ticketEmbed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🎫 ABRIR TICKET')
                .setDescription(`
                    Bem-vindo ao canal de suporte! Aqui você pode solicitar ajuda da staff.

                    **Tipos de Ticket:**
                    🔴 **Problema Técnico** - Erros, bugs, falhas
                    💬 **Dúvida Geral** - Perguntas sobre o sistema
                    💰 **Financeiro** - Problemas com transações
                    📝 **Outro** - Outros assuntos

                    **Nossa Promessa:**
                    • Resposta em até 2 horas
                    • Atendimento profissional
                    • Resolução rápida
                `)
                .addFields(
                    { name: '⏰ Tempo de Resposta', value: 'Até 2 horas', inline: true },
                    { name: '✅ Taxa de Resolução', value: '98%', inline: true }
                )
                .setFooter({ text: '© GOP TRIX | Suporte Profissional', iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            // Criar botões com customId especial
            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Abrir Ticket')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🎫')
                        .setCustomId('create-ticket'),
                    new ButtonBuilder()
                        .setLabel('Ver Meus Tickets')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📋')
                        .setCustomId('channel-action-abrir-ticket-ver-meus-tickets')
                );

            // Enviar mensagem
            await channel.send({
                embeds: [ticketEmbed],
                components: [buttonRow]
            });

            await interaction.editReply({
                content: `✅ Mensagem de tickets enviada em ${channel}!`
            });

        } catch (error) {
            console.error('Erro ao enviar convite de ticket:', error);
            await interaction.editReply({
                content: '❌ Erro ao enviar mensagem de tickets!'
            });
        }
    }
};
