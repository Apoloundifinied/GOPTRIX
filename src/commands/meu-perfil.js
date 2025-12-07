import { SlashCommandBuilder } from 'discord.js';
import { getStreamer } from '../services/streamerService.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('meu-perfil')
        .setDescription('👤 Veja seu perfil de parceiro'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const streamer = await getStreamer(interaction.user.id);

            if (!streamer) {
                const errorEmbed = createErrorEmbed(
                    '❌ Erro',
                    'Você não possui uma conta de parceiro! Use `/criar-parceiro` para criar uma.'
                );
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const profileEmbed = createInfoEmbed(
                '👤 Seu Perfil de Parceiro',
                `Informações da sua conta de parceiro`
            )
                .addFields(
                    { name: '📛 Nome', value: streamer.username, inline: true },
                    { name: '🆔 Affiliate ID', value: streamer.affiliateId, inline: true },
                    { name: '📊 Status', value: streamer.status, inline: true },
                    { name: '💰 Saldo', value: formatCurrency(streamer.balance), inline: true },
                    { name: '📈 Total de Vendas', value: String(streamer.totalSales), inline: true },
                    { name: '💸 Comissão Total', value: formatCurrency(streamer.totalCommission), inline: true }
                );

            await interaction.editReply({ embeds: [profileEmbed] });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao obter perfil!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
