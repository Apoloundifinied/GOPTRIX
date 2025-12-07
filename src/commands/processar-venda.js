import { SlashCommandBuilder } from 'discord.js';
import { createSaleWithFollowUp } from '../services/saleService.js';
import { getStreamerByAffiliateId } from '../services/streamerService.js';
import { generateSaleId } from '../utils/generators.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';

export default {
    data: new SlashCommandBuilder()
        .setName('processar-venda')
        .setDescription('💰 Processa uma venda de CFG')
        .addStringOption(option =>
            option
                .setName('cliente')
                .setDescription('Nome do cliente')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('valor')
                .setDescription('Valor da venda em BRL')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('affiliado')
                .setDescription('ID do afiliado (opcional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const clientName = interaction.options.getString('cliente');
            const price = interaction.options.getNumber('valor');
            const affiliateId = interaction.options.getString('affiliado') || null;

            // Validate price
            if (price <= 0) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'O valor deve ser maior que 0!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Calculate commission (10% for affiliate)
            const affiliateCommission = affiliateId ? price * 0.10 : 0;

            const saleData = {
                saleId: generateSaleId(),
                clientName,
                price,
                product: 'CFG',
                affiliateId,
                affiliateCommission,
                status: 'completed',
                ticketId: null,
            };

            const sale = await createSaleWithFollowUp(saleData);

            const successEmbed = createSuccessEmbed(
                '✅ Venda Processada',
                `Venda registrada com sucesso!\n\n**ID da Venda:** \`${sale.saleId}\`\n**Cliente:** ${clientName}\n**Valor:** R$ ${price.toFixed(2)}\n**Afiliado:** ${affiliateId || 'Nenhum'}\n**Comissão:** R$ ${affiliateCommission.toFixed(2)}`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Log to logs channel
            const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-vendas');
            if (logsChannel) {
                const logEmbed = createSuccessEmbed('💰 Nova Venda', `${clientName} - R$ ${price.toFixed(2)}`);
                await logsChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error('Erro ao processar venda:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao processar venda!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
