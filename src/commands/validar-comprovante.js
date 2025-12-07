import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Order from '../database/models/Order.js';
import User from '../database/models/User.js';
import { getPaymentStatus } from '../services/paymentGatewayService.js';
import { enqueue, getPosition } from '../services/queueService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('validar-comprovante')
        .setDescription('ADMIN - Validar comprovante de pagamento')
        .addStringOption(option =>
            option
                .setName('ordem-id')
                .setDescription('ID do pedido para validar')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('aprovado')
                .setDescription('Aprovar ou Rejeitar?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motivo')
                .setDescription('Motivo da decisao')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({
                    content: 'Apenas administradores podem usar este comando',
                    flags: 64
                });
                return;
            }

            const ordemId = interaction.options.getString('ordem-id');
            const aprovado = interaction.options.getBoolean('aprovado');
            const motivo = interaction.options.getString('motivo') || 'Sem motivo informado';

            const order = await Order.findOne({ orderId: ordemId });

            if (!order) {
                await interaction.reply({ content: 'Pedido nao encontrado', flags: 64 });
                return;
            }

            if (order.status !== 'comprovante-enviado') {
                await interaction.reply({ content: 'Pedido nao esta aguardando validacao', flags: 64 });
                return;
            }

            if (aprovado) {
                if (order.gatewayPaymentId) {
                    try {
                        const gw = await getPaymentStatus(order.gatewayPaymentId);
                        order.gatewayStatus = gw.status;
                        await order.save();
                        if (gw.status !== 'approved') {
                            await interaction.reply({ content: `Gateway indica status: ${gw.status}. Aprove manualmente apenas se conferiu o comprovante.`, flags: 64 });
                            return;
                        }
                    } catch (gwErr) {
                        await interaction.reply({ content: `Não foi possível consultar gateway (${gwErr.message}). Prosseguindo com validação manual.`, flags: 64 });
                    }
                }
                order.status = 'validado';
                order.validatedAt = new Date();
                order.validatedBy = interaction.user.username;
                order.validationNotes = motivo;

                // Afiliados removidos

                const client = await User.findOne({ userId: order.clientId });
                if (client) {
                    if (!client.orders) client.orders = [];
                    client.orders.push({
                        orderId: order.orderId,
                        service: order.service,
                        amount: order.finalPrice,
                        date: new Date()
                    });
                    client.totalSpent = (client.totalSpent || 0) + order.finalPrice;
                    await client.save();
                }

                await order.save();

                let posMsg = '';
                try {
                    const ticket = await enqueue({
                        orderId: order.orderId,
                        clientId: order.clientId,
                        clientName: order.clientName,
                        service: order.service,
                        guildId: interaction.guild.id,
                    });
                    const pos = await getPosition(ticket.queueId, interaction.guild.id);
                    posMsg = `\nSua posição na fila: ${pos}.`;
                } catch { }

                try {
                    const clientUser = await interaction.client.users.fetch(order.clientId);
                    const approvalEmbed = new EmbedBuilder()
                        .setColor(0x27AE60)
                        .setTitle('✅ Pagamento Validado!')
                        .addFields(
                            { name: 'ID do Pedido', value: `\`${order.orderId}\``, inline: false },
                            { name: 'Servico', value: order.service, inline: true },
                            { name: 'Valor', value: `R$ ${order.finalPrice.toFixed(2)}`, inline: true },
                            { name: 'Email de Envio', value: order.paymentEmail, inline: false },
                            { name: '📦 Próximo Passo', value: `Verifique seu email em até 1 hora. Se não houver retorno, procure suporte.${posMsg}`, inline: false }
                        )
                        .setTimestamp();
                    await clientUser.send({ embeds: [approvalEmbed] });
                } catch (err) {
                    console.warn('DM nao enviada:', err.message);
                }

                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0x27AE60)
                        .setTitle('✅ Comprovante Aprovado')
                        .addFields(
                            { name: 'Pedido', value: ordemId, inline: true },
                            { name: 'Cliente', value: order.clientName, inline: true },
                            { name: 'Valor', value: `R$ ${order.finalPrice.toFixed(2)}`, inline: true },
                            { name: '📦 Próximo Passo', value: `Use \`/entregar-produto ordem_id:${ordemId}\` para enviar o link de download`, inline: false }
                        )
                    ]
                });

            } else {
                order.status = 'rejeitado';
                order.rejectReason = motivo;
                order.rejectedAt = new Date();
                order.rejectedBy = interaction.user.username;
                await order.save();

                try {
                    const clientUser = await interaction.client.users.fetch(order.clientId);
                    const rejectionEmbed = new EmbedBuilder()
                        .setColor(0xE74C3C)
                        .setTitle('Comprovante Rejeitado')
                        .addFields(
                            { name: 'ID do Pedido', value: `\`${order.orderId}\``, inline: false },
                            { name: 'Motivo', value: motivo, inline: false },
                            { name: 'Acao', value: 'Tente enviar outro comprovante ou fale com suporte', inline: false }
                        )
                        .setTimestamp();
                    await clientUser.send({ embeds: [rejectionEmbed] });
                } catch (err) {
                    console.warn('DM nao enviada:', err.message);
                }

                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0xE74C3C)
                        .setTitle('Comprovante Rejeitado')
                        .addFields(
                            { name: 'Pedido', value: ordemId, inline: true },
                            { name: 'Motivo', value: motivo, inline: true }
                        )
                    ]
                });
            }

        } catch (error) {
            console.error('Erro ao validar comprovante:', error);
            await interaction.reply({ content: 'Erro: ' + error.message, flags: 64 });
        }
    }
};
