import { SlashCommandBuilder } from 'discord.js';
import { createStreamer, getStreamer } from '../services/streamerService.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';
import Streamer from '../database/models/Streamer.js';

export default {
    data: new SlashCommandBuilder()
        .setName('criar-parceiro')
        .setDescription('🤝 Crie uma conta de parceiro')
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Seu nome de usuário/streamer')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const username = interaction.options.getString('username');

            // Check if already exists
            const existingStreamer = await getStreamer(interaction.user.id);
            if (existingStreamer) {
                const errorEmbed = createErrorEmbed(
                    '❌ Erro',
                    'Você já possui uma conta de parceiro!'
                );
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const streamer = await createStreamer({
                discordId: interaction.user.id,
                username: username,
            });

            const successEmbed = createSuccessEmbed(
                '✅ Parceiro Criado',
                `Bem-vindo ao programa de parceiros!\n\n**Seu ID de Afiliado:** \`${streamer.affiliateId}\`\n\nCompartilhe esse ID com seus clientes para ganhar comissões!`
            );

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Erro ao criar parceiro:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao criar parceiro!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
