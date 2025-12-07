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
                `,
                fields: [
                    { name: '💡 Sistema de Desconto', value: 'Todos os clientes ganham 5% de desconto automático!', inline: false },
                    { name: '🎁 Comissão de Afiliado', value: 'Ganhe 10% em cada venda realizada por seu link', inline: false },
                    { name: '⚡ Processamento Rápido', value: 'PIX instantâneo - receba seus ganhos em segundos', inline: false }
                ],
                footer: { text: '© GOP TRIX | Sistema Profissional de Afiliação' }
            }
        ],
        buttons: [
            { label: 'Ver Comandos', style: ButtonStyle.Primary, emoji: '📋' },
            { label: 'Virar Afiliado', style: ButtonStyle.Success, emoji: '🤝' },
            { label: 'Abrir Suporte', style: ButtonStyle.Secondary, emoji: '🎧' }
        ],
        onlyFirst: true
    },

    'como-comprar-cfg': {
        embeds: [
            {
                color: 0x3498db,
                title: '🛒 COMO COMPRAR CFG',
                description: `
                    Bem-vindo ao canal de compras! Aqui você pode adquirir CFGs com desconto especial.

                    **Processo de Compra:**
                    1️⃣ Use o comando \`/comprar\` ou \`/comprar-pix\`
                    2️⃣ Escolha entre pagamento normal ou PIX
                    3️⃣ Receba o PIX (se PIX) ou processe a venda
                    4️⃣ Você ganhou desconto de 5% automaticamente! 🎉
                `,
                fields: [
                    { name: '💡 Dica 1', value: 'PIX é instantâneo - receba em segundos', inline: false },
                    { name: '💡 Dica 2', value: 'Desconto automático de 5% em todas as compras', inline: false },
                    { name: '💡 Dica 3', value: 'Afiliados ganham 10% de comissão', inline: false }
                ],
                thumbnail: { url: 'https://media.discordapp.net/attachments/1000000000000000000/1000000000000000000/shopping.png' }
            }
        ],
        buttons: [
            { label: 'Comprar Normal', style: ButtonStyle.Success, emoji: '💳' },
            { label: 'Comprar com PIX', style: ButtonStyle.Primary, emoji: '🔑' },
            { label: 'Dúvidas?', style: ButtonStyle.Secondary, emoji: '❓' }
        ],
        onlyFirst: true
    },

    'solicitar-saque': {
        embeds: [
            {
                color: 0x2ecc71,
                title: '💸 SOLICITAR SAQUE',
                description: `
                    Bem-vindo ao canal de saques! Aqui você pode solicitar a retirada de suas comissões.

                    **Processo de Saque:**
                    1️⃣ Use o comando \`/solicitar-saque\`
                    2️⃣ Especifique o valor e método (PIX)
                    3️⃣ Aguarde aprovação da staff
                    4️⃣ Receba seu saque! 🎉

                    **Informações Importantes:**
                    • Saques são processados em até 24 horas
                    • Valor mínimo: R$ 50,00
                    • PIX é nosso método padrão
                `,
                fields: [
                    { name: '⏱️ Tempo de Processamento', value: 'Até 24 horas', inline: true },
                    { name: '💰 Mínimo', value: 'R$ 50,00', inline: true },
                    { name: '💳 Método', value: 'PIX', inline: true }
                ],
                color: 0x27ae60
            }
        ],
        buttons: [
            { label: 'Solicitar Saque', style: ButtonStyle.Success, emoji: '💸' },
            { label: 'Ver Pendentes', style: ButtonStyle.Secondary, emoji: '📋' }
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

    'meu-link': {
        embeds: [
            {
                color: 0xf39c12,
                title: '🔗 MEU LINK DE AFILIADO',
                description: `
                    Bem-vindo ao painel de afiliados! Aqui você gerencia sua renda passiva.

                    **Como Funciona:**
                    1️⃣ Você recebe um ID de afiliado único
                    2️⃣ Clientes usam seu ID ao comprar
                    3️⃣ Você ganha 10% de comissão automaticamente
                    4️⃣ Saque suas comissões quando quiser

                    **Seu Painel:**
                    • Histórico de vendas
                    • Comissões acumuladas
                    • Conversões de clientes
                    • Relatórios detalhados
                `,
                fields: [
                    { name: '💰 Comissão', value: '10% por venda', inline: true },
                    { name: '🔄 Atualização', value: 'Em tempo real', inline: true },
                    { name: '🎯 Sem Limite', value: 'Ganhe ilimitado', inline: true }
                ]
            }
        ],
        buttons: [
            { label: 'Ver Perfil', style: ButtonStyle.Primary, emoji: '👤' },
            { label: 'Minhas Vendas', style: ButtonStyle.Success, emoji: '📊' },
            { label: 'Meu ID', style: ButtonStyle.Secondary, emoji: '🆔' }
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
                    ✅ Gerenciar status das transações

                    **Ações Disponíveis:**
                    • \`/validar-comprovante\` - Validar comprovante PIX
                    • \`/pedidos-pendentes\` - Listar pedidos
                    • \`/aprovar-saque\` - Aprovar saques
                    • \`/rejeitar-saque\` - Rejeitar saques
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

    'painel-admin': {
        embeds: [
            {
                color: 0x34495e,
                title: '👨‍💼 PAINEL ADMINISTRATIVO',
                description: `
                    **Canal Exclusivo da Administração**

                    Gerenciamento Completo do Servidor:
                    📊 Dashboard com estatísticas
                    💰 Gestão de saques
                    🎫 Gerenciamento de tickets
                    👥 Controle de afiliados

                    **Comandos Disponíveis:**
                    • \`/painel-admin\` - Ver dashboard
                    • \`/relatorio\` - Gerar relatórios
                    • \`/aprovar-saque\` - Aprovar saques
                    • \`/rejeitar-saque\` - Rejeitar saques
                `,
                fields: [
                    { name: '🔐 Acesso', value: 'Staff apenas', inline: true },
                    { name: '⚙️ Permissões', value: 'Totais', inline: true }
                ]
            }
        ],
        buttons: [
            { label: 'Abrir Painel', style: ButtonStyle.Primary, emoji: '📊' },
            { label: 'Ver Relatórios', style: ButtonStyle.Secondary, emoji: '📈' }
        ],
        onlyFirst: false,
        staffOnly: true
    }
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
                    embed.addField(field.name, field.value, field.inline || false);
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
