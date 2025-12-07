import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } from 'discord.js';
import Order from '../database/models/Order.js';
import User from '../database/models/User.js';

export default {
    data: new SlashCommandBuilder()
        .setName('enviar-comprovante')
        .setDescription('Enviar comprovante de pagamento PIX'),

    async execute(interaction) {
        try {
            const clientId = interaction.user.id;

            // Buscar order pendente
            const order = await Order.findOne({
                clientId,
                status: 'aguardando-comprovante'
            }).sort({ createdAt: -1 });

            if (!order) {
                await interaction.reply({
                    content: 'Nenhum pedido aguardando comprovante. Use /processar-compra para criar um pedido.',
                    flags: 64
                });
                return;
            }

            // Verificar se passou do prazo
            if (new Date() > order.paymentDeadline) {
                order.status = 'rejeitado';
                order.rejectReason = 'Prazo de pagamento expirado (24 horas)';
                await order.save();

                await interaction.reply({
                    content: 'Seu pedido expirou (limite de 24 horas). Use /processar-compra para criar um novo.',
                    flags: 64
                });
                return;
            }

            // Criar modal para comprovante
            const modal = new ModalBuilder()
                .setCustomId('comprovante-modal')
                .setTitle('Enviar Comprovante de Pagamento');

            const descricaoInput = new TextInputBuilder()
                .setCustomId('descricao-comprovante')
                .setLabel('Descricao do comprovante')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder('Ex: Pix enviado em 19:30, valor R$ 95.00, banco XYZ');

            const hashInput = new TextInputBuilder()
                .setCustomId('hash-pix')
                .setLabel('Hash/ID do PIX (se disponivel)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder('Deixe em branco se nao conseguir');

            const firstActionRow = new ActionRowBuilder().addComponents(descricaoInput);
            const secondActionRow = new ActionRowBuilder().addComponents(hashInput);

            modal.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal);

            // Capturar submissao
            const submitted = await interaction.awaitModalSubmit({
                time: 15 * 60 * 1000 // 15 minutos
            }).catch(() => null);

            if (!submitted) {
                return;
            }

            const descricao = submitted.fields.getTextInputValue('descricao-comprovante');
            const hash = submitted.fields.getTextInputValue('hash-pix') || 'nao-fornecido';

            // Atualizar order com comprovante
            order.status = 'comprovante-enviado';
            order.proofDescription = descricao;
            order.pixHash = hash;
            order.proofSubmittedAt = new Date();
            order.proofSubmittedBy = interaction.user.username;

            await order.save();

            // Notificar usuario
            const confirmEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle('Comprovante Recebido')
                .setDescription('Seu comprovante foi enviado com sucesso. Um administrador validara em breve.')
                .addFields(
                    {
                        name: 'ID do Pedido',
                        value: `\`${order.orderId}\``,
                        inline: false
                    },
                    {
                        name: 'Status',
                        value: 'Aguardando validacao do admin',
                        inline: false
                    },
                    {
                        name: 'Seu Desconto',
                        value: `R$ ${order.discount.toFixed(2)} ${order.affiliateId ? '(via afiliado)' : ''}`,
                        inline: true
                    },
                    {
                        name: 'Valor Pago',
                        value: `R$ ${order.finalPrice.toFixed(2)}`,
                        inline: true
                    }
                )
                .setFooter({ text: 'Voce sera notificado quando validarem' })
                .setTimestamp();

            await submitted.reply({
                embeds: [confirmEmbed],
                flags: 0
            });

            // Notificar adminstradores
            const client = interaction.client;
            let adminChannel = client.channels.cache.find(ch => ch.name === 'admin-pagamentos');

            // Se canal não existe, tentar criar
            if (!adminChannel) {
                try {
                    const { ChannelType } = await import('discord.js');
                    adminChannel = await interaction.guild.channels.create({
                        name: 'admin-pagamentos',
                        type: ChannelType.GuildText,
                        topic: '📬 Notificações de comprovantes de pagamento PIX',
                        reason: 'Canal automático para comprovantes de pagamento'
                    });
                    console.log('✅ Canal admin-pagamentos criado automaticamente');
                } catch (createError) {
                    console.warn('Não foi possível criar canal admin-pagamentos:', createError.message);
                }
            }

            if (adminChannel) {
                const adminEmbed = new EmbedBuilder()
                    .setColor(0xFF9800)
                    .setTitle('Novo Comprovante para Validacao')
                    .setDescription('Um cliente enviou comprovante de pagamento')
                    .addFields(
                        {
                            name: 'ID do Pedido',
                            value: `\`${order.orderId}\``,
                            inline: false
                        },
                        {
                            name: 'Cliente',
                            value: `${interaction.user.username} (${clientId})`,
                            inline: false
                        },
                        {
                            name: 'Servico',
                            value: order.service,
                            inline: true
                        },
                        {
                            name: 'Valor',
                            value: `R$ ${order.finalPrice.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: 'Descricao do Comprovante',
                            value: descricao,
                            inline: false
                        },
                        {
                            name: 'Hash PIX',
                            value: `\`${hash}\``,
                            inline: false
                        },
                        {
                            name: 'Email para Envio',
                            value: order.paymentEmail,
                            inline: false
                        }
                    )
                    .setFooter({ text: 'Use /validar-comprovante para aprovar ou rejeitar' })
                    .setTimestamp();

                const adminActionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`validar-comprovante-${order.orderId}`)
                            .setLabel('Validar Comprovante')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`rejeitar-comprovante-${order.orderId}`)
                            .setLabel('Rejeitar Comprovante')
                            .setStyle(ButtonStyle.Danger)
                    );

                try {
                    await adminChannel.send({
                        embeds: [adminEmbed],
                        components: [adminActionRow]
                    });
                } catch (err) {
                    console.warn('Nao foi possivel enviar para canal admin:', err.message);
                }
            }

        } catch (error) {
            console.error('Erro ao enviar comprovante:', error);
            await interaction.reply({
                content: 'Erro ao enviar comprovante: ' + error.message,
                flags: 64
            });
        }
    }
};
