import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getAllCategories, getProductsByCategory, formatPrice } from '../database/catalog.js';

export default {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('🛍️ Abrir a loja GOP TRIX com todos os produtos disponíveis'),

    async execute(interaction) {
        try {
            const categories = getAllCategories();

            // Criar embed principal
            const mainEmbed = new EmbedBuilder()
                .setColor('#7289DA')
                .setTitle('🛍️ LOJA GOP TRIX - CATÁLOGO COMPLETO')
                .setDescription('Bem-vindo à loja oficial! Selecione uma categoria para ver os produtos.')
                .addFields([
                    {
                        name: '📂 Categorias Disponíveis:',
                        value: categories.map((cat, i) => `${i + 1}. ${cat}`).join('\n'),
                        inline: false
                    }
                ])
                .setFooter({ text: 'Clique em uma categoria abaixo para começar!' })
                .setTimestamp();

            // Criar botões de categorias (máx 5 por linha)
            const rows = [];
            const buttonsPerRow = 5;

            for (let i = 0; i < categories.length; i += buttonsPerRow) {
                const row = new ActionRowBuilder();
                const categorySlice = categories.slice(i, i + buttonsPerRow);

                categorySlice.forEach(category => {
                    let emoji = '📦';
                    if (category === 'CFG') emoji = '⚙️';
                    if (category === 'Otimização') emoji = '🔧';
                    if (category === 'Cliente') emoji = '💾';

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`categoria-${category.toLowerCase()}`)
                            .setLabel(category)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(emoji)
                    );
                });

                rows.push(row);
            }

            await interaction.reply({
                embeds: [mainEmbed],
                components: rows
            });

        } catch (error) {
            console.error('Erro ao abrir loja:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Erro')
                .setDescription(`Erro ao abrir a loja: ${error.message}`)
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed] });
        }
    }
};
