import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Order from '../database/models/Order.js';
import { generateDeliveryLink, sendDeliveryToClient } from '../services/deliveryService.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';

export default {
    data: new SlashCommandBuilder()
        .setName('entregar-produto')
        .setDescription('📦 Entregar produto ao cliente com link de download (Admin)')
        .addStringOption(option =>
            option
                .setName('ordem_id')
                .setDescription('ID da ordem a entregar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('link_download')
                .setDescription('Link de download do produto (deixe em branco para usar placeholder)')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            // Verificar se é admin
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (!interaction.member.roles.cache.has(adminRole?.id)) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui permissão para usar este comando!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const orderId = interaction.options.getString('ordem_id');
            let customLink = interaction.options.getString('link_download');

            // Buscar ordem
            const order = await Order.findOne({ orderId });

            if (!order) {
                const errorEmbed = createErrorEmbed('❌ Erro', `Ordem **${orderId}** não encontrada!`);
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Verificar se já foi entregue
            if (order.deliveryLink) {
                const errorEmbed = createErrorEmbed('⚠️ Aviso', `Este produto já foi entregue anteriormente!`);
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Se não forneceu link, usar placeholder
            if (!customLink) {
                customLink = 'https://seu-servidor.com/downloads/produtos/[ADICIONAR_LINK_DEPOIS]';
            }

            // Gerar link único de entrega
            const result = await generateDeliveryLink(orderId);

            if (!result.success) {
                const errorEmbed = createErrorEmbed('❌ Erro', `Erro ao gerar link: ${result.error}`);
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Atualizar ordem com link customizado se fornecido
            if (customLink && !customLink.includes('[ADICIONAR_LINK_DEPOIS]')) {
                await Order.updateOne({ orderId }, { deliveryLink: customLink });
                result.deliveryLink = customLink;
            }

            // Enviar link ao cliente
            const clientResult = await sendDeliveryToClient(
                interaction.client,
                order.clientId,
                order,
                result.deliveryLink
            );

            // Responder ao admin
            const successEmbed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Produto Entregue com Sucesso!')
                .addFields([
                    {
                        name: '📦 Ordem',
                        value: `\`${orderId}\``,
                        inline: true
                    },
                    {
                        name: '🎁 Produto',
                        value: order.service,
                        inline: true
                    },
                    {
                        name: '👤 Cliente',
                        value: order.clientName,
                        inline: true
                    },
                    {
                        name: '💰 Valor',
                        value: `R$ ${order.finalPrice.toFixed(2)}`,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: order.paymentEmail,
                        inline: true
                    },
                    {
                        name: '🔗 Link Único',
                        value: result.deliveryLink,
                        inline: false
                    },
                    {
                        name: '✉️ DM Enviado',
                        value: clientResult.success ? '✅ Sim' : '❌ Erro ao enviar',
                        inline: true
                    }
                ])
                .setFooter({ text: 'Cliente notificado com sucesso!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

            // Log
            console.log(`✅ Produto entregue: ${orderId} -> ${order.clientName}`);

        } catch (error) {
            console.error('Erro ao entregar produto:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', `${error.message}`);
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
