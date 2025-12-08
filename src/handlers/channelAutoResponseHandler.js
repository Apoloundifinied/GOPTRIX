/**
 * Channel Auto-Response Handler
 * Automatically sends contextual messages when users visit specific channels
 *
 * This runs on guildMemberUpdate when members join channels
 */

import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createInfoEmbed, createButtonPanelEmbed } from '../utils/animations.js';

/**
 * Auto-response configurations for specific channels
 */
const CHANNEL_RESPONSES = {
    'boas-vindas': {
        embeds: [
            {
                color: 0x9b59b6,
                title: '✨ BEM-VINDO AO GOP TRIX ✨',
                description: `
                    🎉 Bem-vindo ao servidor oficial de otimizações!

                    **Aqui você encontra:**
                    🛠️ **Otimizações de PC** — Básica, Avançada, Ultra + BIOS
                    💳 **Pagamento PIX** — QR code direto pelo bot
                    ⏳ **Fila de Atendimento** — Acompanhamento transparente
                    🎫 **Suporte** — Tickets privados com a equipe

                    **Para começar:**
                    1. Use \`/help\` para ver ações disponíveis
                    2. Abra \`/loja\` para escolher sua otimização
                    3. Pague via PIX e envie \`/enviar-comprovante\`
                    4. Aguarde aprovação e acompanhe com \`/fila-status\`
                `,
                fields: [
                    { name: '📧 Pós-compra', value: 'Verifique seu email em até 1 hora após a compra. Se não houver retorno, procure suporte.', inline: false },
                    { name: '🔒 Segurança', value: 'Não compartilhe dados sensíveis em público. A equipe orientará envio seguro.', inline: false }
                ],
                footer: { text: '© GOP TRIX | Otimizações Profissionais' }
            }
        ],
        buttons: [
            { label: 'Ver Comandos', style: ButtonStyle.Primary, emoji: '📋' },
            { label: 'Abrir Suporte', style: ButtonStyle.Secondary, emoji: '🎧' }
        ],
        onlyFirst: true
    },

    'como-comprar-otimizacao': {
        embeds: [
            {
                color: 0x3498db,
                title: '🛒 COMO COMPRAR OTIMIZAÇÃO',
                description: `
                    Bem-vindo ao canal de compras! Aqui você adquire otimizações profissionais.

                    **Processo de Compra:**
                    1️⃣ Use \`/loja\` e selecione sua otimização
                    2️⃣ Informe seu email no modal
                    3️⃣ Pague via PIX com o QR/copia-e-cola exibido
                    4️⃣ Envie o comprovante usando \`/enviar-comprovante\`
                    5️⃣ Após aprovação do admin, você entra na fila automaticamente
                `,
                fields: [
                    { name: '💡 Dica 1', value: 'Use sempre o QR gerado pelo bot no momento da compra.', inline: false },
                    { name: '💡 Dica 2', value: 'Guarde seu orderId para consultas e suporte.', inline: false },
                    { name: '💡 Dica 3', value: 'Após aprovação, consulte \`/fila-status\` para acompanhar.', inline: false }
                ],
                thumbnail: { url: 'https://media.discordapp.net/attachments/1000000000000000000/1000000000000000000/shopping.png' }
            }
        ],
        buttons: [
            { label: 'Abrir Loja', style: ButtonStyle.Primary, emoji: '🛒' },
            { label: 'Dúvidas?', style: ButtonStyle.Secondary, emoji: '❓' }
        ],
        onlyFirst: true
    },



    'abrir-ticket': {
        embeds: [
            {
                color: 0x9b59b6,
                title: '🎫 ABRIR TICKET',
                description: `
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
                `,
                fields: [
                    { name: '⏰ Tempo de Resposta', value: 'Até 2 horas', inline: true },
                    { name: '✅ Taxa de Resolução', value: '98%', inline: true }
                ],
                thumbnail: { url: 'https://media.discordapp.net/attachments/1000000000000000000/1000000000000000000/support.png' }
            }
        ],
        buttons: [
            { label: 'Abrir Ticket', style: ButtonStyle.Danger, emoji: '🎫' },
            { label: 'Ver Meus Tickets', style: ButtonStyle.Secondary, emoji: '📋' }
        ],
        onlyFirst: true
    },



    'pedidos-pendentes': {
        embeds: [
            {
                color: 0xe74c3c,
                title: '📦 PEDIDOS PENDENTES',
                description: `
                    **Canal Administrativo - Acesso Restrito**

                    Aqui você pode:
                    ✅ Validar comprovantes de pagamento
                    ✅ Aprovar pedidos pendentes
                    ✅ Gerenciar status e fila de atendimento

                    **Ações Disponíveis:**
                        • \`/validar-comprovante\` - Validar comprovante PIX
                        • \`/fila-lista\` - Listar fila
                `,
                fields: [
                    { name: '⚙️ Sistema', value: 'Automático com validação manual', inline: false }
                ]
            }
        ],
        buttons: [
            { label: 'Pedidos Pendentes', style: ButtonStyle.Danger, emoji: '📋' },
            { label: 'Validar Comprovante', style: ButtonStyle.Success, emoji: '✅' }
        ],
        onlyFirst: false,
        staffOnly: true
    },


};

/**
 * Process channel auto-responses
 * @param {Object} interaction - Discord interaction
 */
export async function handleChannelAutoResponse(interaction) {
    try {
        // Check if this is in a configured channel
        const channelName = interaction.channel.name.toLowerCase();
        const config = findChannelConfig(channelName);

        if (!config) return;

        // Check if staff only and user is not staff
        if (config.staffOnly && !interaction.member.roles.cache.some(role =>
            role.name.toLowerCase().includes('staff') ||
            role.name.toLowerCase().includes('admin') ||
            role.name.toLowerCase().includes('moderator')
        )) {
            return;
        }

        // Check if this message already exists (for "only first" channels)
        if (config.onlyFirst) {
            const existingMessages = await interaction.channel.messages.fetch({ limit: 10 });
            if (existingMessages.some(msg => msg.author.id === interaction.client.user.id)) {
                return;
            }
        }

        // Send configured embeds
        const embeds = config.embeds.map(embedData => {
            const embed = new EmbedBuilder();

            if (embedData.color) embed.setColor(embedData.color);
            if (embedData.title) embed.setTitle(embedData.title);
            if (embedData.description) embed.setDescription(embedData.description);
            if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail.url);
            if (embedData.footer) embed.setFooter(embedData.footer);

            if (embedData.fields) {
                embedData.fields.forEach(field => {
                    embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
                });
            }

            return embed;
        });

        // Build buttons if configured
        let components = [];
        if (config.buttons && config.buttons.length > 0) {
            const buttonRow = new ActionRowBuilder();

            config.buttons.forEach(btn => {
                // Special handling for "Abrir Ticket" button in abrir-ticket channel
                let customId = `channel-action-${channelName}-${btn.label.toLowerCase().replace(/\s/g, '-')}`;

                if (channelName === 'abrir-ticket' && btn.label === 'Abrir Ticket') {
                    customId = 'create-ticket';
                }

                buttonRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(btn.label)
                        .setStyle(btn.style)
                        .setEmoji(btn.emoji)
                        .setCustomId(customId)
                );
            });

            components.push(buttonRow);
        }

        // Send message
        await interaction.channel.send({
            embeds: embeds,
            components: components.length > 0 ? components : undefined,
            allowedMentions: { parse: [] }
        });

    } catch (error) {
        console.error('Erro ao processar auto-resposta de canal:', error);
    }
}

/**
 * Find channel configuration
 * @param {string} channelName - Name of the channel
 * @returns {Object|null} Channel configuration or null
 */
function findChannelConfig(channelName) {
    return CHANNEL_RESPONSES[channelName] || null;
}

export default {
    handleChannelAutoResponse,
    CHANNEL_RESPONSES
};
