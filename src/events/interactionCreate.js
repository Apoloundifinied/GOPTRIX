import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    AttachmentBuilder
} from 'discord.js';
import { EMOJI } from '../utils/embedBuilders.js';
import Ticket from '../database/models/Ticket.js';
import User from '../database/models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { getProductsByCategory, formatPrice, getProductById, getAllCategories } from '../database/catalog.js';
import { createPixPayment } from '../services/paymentGatewayService.js';

// Helpers
function sanitizeEmoji(raw) {
    return undefined; // emojis removidos totalmente
}

function extractProductIdFromCustomId(customId, userId) {
    const prefix = 'compra-modal-';
    if (!customId.startsWith(prefix)) return null;
    let remainder = customId.slice(prefix.length);
    if (userId && remainder.endsWith('-' + userId)) {
        remainder = remainder.slice(0, -1 * (userId.length + 1));
    }
    return remainder;
}

async function safeReply(interaction, options) {
    try {
        if (interaction.replied) return await interaction.editReply(options);
        if (interaction.deferred) return await interaction.editReply(options);
        return await interaction.reply(options);
    } catch (err) {
        try { await interaction.editReply(options); } catch (e) { }
    }
}

export default {
    name: 'interactionCreate',
    async execute(interaction) {
        const client = interaction.client;

        if (!interaction.guild) return;

        // COMMANDS
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ content: 'Comando não encontrado!', flags: 64 }).catch(() => { });
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Erro ao executar comando:', error);
                await safeReply(interaction, { content: 'Erro ao executar comando!', flags: 64 });
            }
            return;
        }

        // BUTTONS
        if (interaction.isButton()) {
            const id = interaction.customId;

            // CATEGORIA
            if (id.startsWith('categoria-')) {
                try {
                    const categoryName = id.replace('categoria-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    const products = getProductsByCategory(categoryName);

                    if (!products || products.length === 0) {
                        return await interaction.reply({ content: `Nenhum produto encontrado em ${categoryName}`, flags: 64 });
                    }

                    const categoryEmbed = new EmbedBuilder()
                        .setColor('#2ecc71')
                        .setTitle(`${categoryName}`)
                        .setDescription(`Produtos disponíveis em ${categoryName}`)
                        .setFooter({ text: 'Clique em um produto para comprar' })
                        .setTimestamp();

                    products.forEach(product => {
                        categoryEmbed.addFields({
                            name: `${product.name}`,
                            value: `${product.description || ''}\nPreço: ${formatPrice(product.price)}`,
                            inline: false
                        });
                    });

                    const productRows = [];
                    const productsPerRow = 2;

                    for (let i = 0; i < products.length; i += productsPerRow) {
                        const row = new ActionRowBuilder();
                        const productSlice = products.slice(i, i + productsPerRow);

                        productSlice.forEach(product => {
                            const btn = new ButtonBuilder()
                                .setCustomId(`comprar-produto-${product.id}`)
                                .setLabel(`${product.name} - ${formatPrice(product.price)}`)
                                .setStyle(ButtonStyle.Success);

                            row.addComponents(btn);
                        });

                        productRows.push(row);
                    }

                    const backRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('voltar-categorias')
                            .setLabel('Voltar às Categorias')
                            .setStyle(ButtonStyle.Secondary)
                    );

                    productRows.push(backRow);

                    await interaction.reply({ embeds: [categoryEmbed], components: productRows });
                } catch (error) {
                    console.error('Erro ao mostrar categoria:', error);
                    await interaction.reply({ content: 'Erro ao carregar categoria', flags: 64 }).catch(() => { });
                }
                return;
            }

            // VOLTAR CATEGORIAS
            if (id === 'voltar-categorias') {
                try {
                    const categories = getAllCategories();
                    const mainEmbed = new EmbedBuilder()
                        .setColor('#7289DA')
                        .setTitle('CATÁLOGO COMPLETO - GOP TRIX')
                        .setDescription('Selecione uma categoria para ver os produtos.')
                        .addFields([{ name: 'Categorias Disponíveis:', value: categories.map((cat, i) => `${i + 1}. ${cat}`).join('\n'), inline: false }])
                        .setFooter({ text: 'Clique em uma categoria abaixo para começar!' })
                        .setTimestamp();

                    const rows = [];
                    const buttonsPerRow = 5;

                    for (let i = 0; i < categories.length; i += buttonsPerRow) {
                        const row = new ActionRowBuilder();
                        const categorySlice = categories.slice(i, i + buttonsPerRow);

                        categorySlice.forEach(category => {
                            const btn = new ButtonBuilder()
                                .setCustomId(`categoria-${category.toLowerCase()}`)
                                .setLabel(category)
                                .setStyle(ButtonStyle.Primary);

                            row.addComponents(btn);
                        });

                        rows.push(row);
                    }

                    await interaction.reply({ embeds: [mainEmbed], components: rows });
                } catch (error) {
                    console.error('Erro ao voltar:', error);
                }
                return;
            }

            // COMPRAR PRODUTO
            if (id.startsWith('comprar-produto-')) {
                try {
                    const productId = id.replace('comprar-produto-', '');
                    const product = getProductById(productId);
                    if (!product) return await interaction.reply({ content: 'Produto não encontrado', flags: 64 });

                    const modal = new ModalBuilder()
                        .setCustomId(`compra-modal-${product.id}-${interaction.user.id}`)
                        .setTitle(`Comprar ${product.name}`);

                    const emailInput = new TextInputBuilder()
                        .setCustomId('email')
                        .setLabel('Email para recebimento')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(emailInput)
                    );

                    await interaction.showModal(modal);
                } catch (error) {
                    console.error('Erro ao abrir modal de compra:', error);
                    await safeReply(interaction, { content: 'Erro ao processar compra', flags: 64 });
                }
                return;
            }

            if (id === 'enviar-comprovante' || id.startsWith('enviar-comprovante-')) {
                await interaction.reply({ content: 'Use o comando /enviar-comprovante <ID> para enviar o comprovante.', flags: 64 }).catch(() => { });
                return;
            }

            if (id === 'create-ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('ticket-modal')
                    .setTitle('Abrir Ticket de Suporte');

                const nameInput = new TextInputBuilder().setCustomId('ticket-name').setLabel('Seu Nome').setStyle(TextInputStyle.Short).setRequired(true);
                const emailInput = new TextInputBuilder().setCustomId('ticket-email').setLabel('Seu Email').setStyle(TextInputStyle.Short).setRequired(true);
                const affiliateInput = new TextInputBuilder().setCustomId('ticket-affiliate').setLabel('ID do Afiliado (opcional)').setStyle(TextInputStyle.Short).setRequired(false);
                const descriptionInput = new TextInputBuilder().setCustomId('ticket-description').setLabel('Descrição do Problema').setStyle(TextInputStyle.Paragraph).setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(nameInput),
                    new ActionRowBuilder().addComponents(emailInput),
                    new ActionRowBuilder().addComponents(affiliateInput),
                    new ActionRowBuilder().addComponents(descriptionInput)
                );

                await interaction.showModal(modal);
                return;
            }
        }

        // MODALS
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('compra-modal-')) {
                try {
                    const Import = await import('../database/models/Order.js');
                    const Order = Import.default;

                    const email = interaction.fields.getTextInputValue('email');
                    const clientId = interaction.user.id;
                    const clientName = interaction.user.username;

                    const productId = extractProductIdFromCustomId(interaction.customId, interaction.user.id);
                    const product = getProductById(productId);
                    if (!product) return await interaction.reply({ content: 'Erro ao determinar produto. Tente novamente.', flags: 64 });

                    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    if (!emailValid) return await interaction.reply({ content: 'Email inválido', ephemeral: true });

                    const finalPrice = product.price;

                    const orderId = uuidv4();
                    const pixKey = process.env.PIX_KEY || 'chave-pix-padrao@example.com';

                    const order = new Order({
                        orderId,
                        clientId,
                        clientName,
                        service: product.name,
                        originalPrice: product.price,
                        finalPrice,
                        discount: 0,
                        affiliateId: null,
                        affiliateCommission: 0,
                        status: 'aguardando-comprovante',
                        pixKey,
                        paymentEmail: email,
                        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
                    });

                    await order.save();

                    let gatewayInfo = null;
                    try {
                        gatewayInfo = await createPixPayment({
                            amount: finalPrice,
                            description: `Compra ${product.name}`,
                            payerEmail: email,
                            externalReference: orderId,
                            idempotencyKey: orderId
                        });
                        order.gatewayPaymentId = gatewayInfo.paymentId;
                        order.gatewayProvider = 'mercadopago';
                        order.pixHash = gatewayInfo.qrCode || null;
                        await order.save();
                    } catch (gwErr) {
                        console.warn('Falha ao criar cobrança PIX na gateway:', gwErr.message);
                    }

                    const paymentEmbed = new EmbedBuilder()
                        .setColor(0x2ECC71)
                        .setTitle(`${EMOJI.verified} Pagamento PIX`)
                        .setDescription('Pedido criado. Efetue o pagamento via PIX e envie o comprovante.')
                        .addFields(
                            { name: 'ID do Pedido', value: `\`${orderId}\``, inline: false },
                            { name: 'Serviço', value: `${product.name}`, inline: true },
                            { name: 'Valor', value: `R$ ${finalPrice.toFixed(2).replace('.', ',')}`, inline: true },
                            ...(gatewayInfo?.qrCode ? [{ name: 'PIX Copia e Cola', value: `\`${gatewayInfo.qrCode}\``, inline: false }] : [{ name: 'Chave PIX', value: `\`${pixKey}\``, inline: false }]),
                            ...(gatewayInfo?.ticketUrl ? [{ name: 'Link do Boleto PIX', value: gatewayInfo.ticketUrl, inline: false }] : []),
                            { name: 'Prazo', value: '24 horas', inline: true },
                            { name: 'Após compra', value: 'Verifique seu email em até 1 hora. Se não houver retorno, procure suporte.', inline: false }
                        )
                        .setTimestamp();

                    const actionRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId(`enviar-comprovante-${orderId}`).setLabel('Enviar Comprovante').setStyle(ButtonStyle.Success)
                    );

                    const files = [];
                    if (gatewayInfo?.qrBase64) {
                        try {
                            const buf = Buffer.from(gatewayInfo.qrBase64, 'base64');
                            files.push(new AttachmentBuilder(buf, { name: `pix-${orderId}.png` }));
                        } catch { }
                    }
                    await interaction.reply({ embeds: [paymentEmbed], components: [actionRow], files });

                    try {
                        const user = await interaction.client.users.fetch(clientId);
                        await user.send({ embeds: [paymentEmbed], files });
                    } catch { }
                } catch (error) {
                    console.error('Erro ao processar compra:', error);
                    await interaction.reply({ content: 'Erro: ' + (error.message || error), flags: 64 }).catch(() => { });
                }
                return;
            }

            if (interaction.customId === 'ticket-modal') {
                await interaction.deferReply({ flags: 64 });

                const ticketId = `TICKET-${uuidv4().slice(0, 8).toUpperCase()}`;
                const clientName = interaction.fields.getTextInputValue('ticket-name');
                const clientEmail = interaction.fields.getTextInputValue('ticket-email');
                const affiliateId = interaction.fields.getTextInputValue('ticket-affiliate') || null;
                const description = interaction.fields.getTextInputValue('ticket-description');

                try {
                    const everyoneRole = interaction.guild.roles.everyone;
                    const botMember = interaction.guild.members.me;

                    const ticketChannel = await interaction.guild.channels.create({
                        name: `ticket-${ticketId.toLowerCase()}`,
                        type: 0,
                        topic: `Ticket: ${ticketId} | Cliente: ${clientName}`,
                        permissionOverwrites: [
                            { id: everyoneRole.id, deny: ['ViewChannel'] },
                            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
                            { id: botMember.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
                        ]
                    });

                    const staffRole = interaction.guild.roles.cache.find(r => /staff|suporte|moderador/i.test(r.name));
                    if (staffRole) await ticketChannel.permissionOverwrites.create(staffRole, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });

                    await Ticket.create({ ticketId, channelId: ticketChannel.id, clientId: interaction.user.id, clientName, affiliateId, type: 'support', status: 'open' });

                    await User.findOneAndUpdate(
                        { discordId: interaction.user.id },
                        { discordId: interaction.user.id, username: interaction.user.username, email: clientEmail, affiliateId },
                        { upsert: true, new: true }
                    );

                    const ticketEmbed = new EmbedBuilder()
                        .setColor(0x3498db)
                        .setTitle(`${EMOJI.arrows} Novo Ticket Aberto`)
                        .setDescription(`Bem-vindo ao suporte! Um de nossos staff entrará em contato em breve.`)
                        .addFields(
                            { name: 'ID do Ticket', value: ticketId, inline: true },
                            { name: 'Cliente', value: clientName, inline: true },
                            { name: 'Email', value: clientEmail, inline: true },
                            { name: 'Afiliado', value: affiliateId || 'Nenhum', inline: true },
                            { name: 'Descrição', value: description, inline: false }
                        )
                        .setFooter({ text: 'GOP TRIX BOT' })
                        .setTimestamp();

                    const closeButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('close-ticket').setLabel('Fechar Ticket').setStyle(ButtonStyle.Danger)
                    );

                    await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButton] });

                    await interaction.editReply({ content: `Ticket criado com sucesso!\nCanal: ${ticketChannel}`, flags: 64 });

                    const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-vendas');
                    if (logsChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor(0x2ecc71)
                            .setTitle(`${EMOJI.crown} Novo Ticket Aberto`)
                            .addFields(
                                { name: 'ID do Ticket', value: ticketId, inline: true },
                                { name: 'Cliente', value: clientName, inline: true },
                                { name: 'Afiliado', value: affiliateId || 'Nenhum', inline: true }
                            )
                            .setTimestamp();

                        await logsChannel.send({ embeds: [logEmbed] }).catch(() => { });
                    }
                } catch (error) {
                    console.error('Erro ao criar ticket:', error);
                    await interaction.editReply({ content: 'Erro ao criar ticket!', flags: 64 }).catch(() => { });
                }
                return;
            }
        }

        if (interaction.isStringSelectMenu()) {
            // future handlers...
        }
    }
};
