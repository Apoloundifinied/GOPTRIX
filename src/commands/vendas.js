import { SlashCommandBuilder } from 'discord.js';
import { getSalesByAffiliate } from '../services/saleService.js';
import { getStreamer } from '../services/streamerService.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vendas')
        .setDescription('📊 Veja suas vendas como afiliado'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const streamer = await getStreamer(interaction.user.id);

            if (!streamer) {
                const errorEmbed = createErrorEmbed(
                    '❌ Erro',
                    'Você não possui uma conta de parceiro!'
                );
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const sales = await getSalesByAffiliate(streamer.affiliateId);

            if (sales.length === 0) {
                const embed = createInfoEmbed(
                    '📊 Suas Vendas',
                    'Você ainda não tem vendas registradas!'
                );
                await interaction.editReply({ embeds: [embed] });
                return;
            }

            let salesText = '';
            let totalCommission = 0;

            sales.forEach(sale => {
                salesText += `• **${sale.clientName}** - ${formatCurrency(sale.price)} (Comissão: ${formatCurrency(sale.affiliateCommission)})\n`;
                totalCommission += sale.affiliateCommission;
            });

            const embed = createInfoEmbed(
                '📊 Suas Vendas',
                `Total de vendas: **${sales.length}**\nComissão total: **${formatCurrency(totalCommission)}**`
            )
                .addFields({ name: 'Vendas', value: salesText || 'Nenhuma venda', inline: false });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao obter vendas:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao obter vendas!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
