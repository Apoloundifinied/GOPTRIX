import { SlashCommandBuilder } from 'discord.js';
import { getPendingWithdraws } from '../services/withdrawService.js';
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('saques-pendentes')
        .setDescription('📋 Lista todos os saques pendentes de aprovação (Admin)'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            // Check if user is admin
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (!interaction.member.roles.has(adminRole?.id)) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui permissão para usar este comando!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const pendingWithdraws = await getPendingWithdraws();

            if (pendingWithdraws.length === 0) {
                const infoEmbed = createInfoEmbed('📋 Saques Pendentes', 'Nenhum saque pendente de aprovação.');
                await interaction.editReply({ embeds: [infoEmbed] });
                return;
            }

            let description = '';
            pendingWithdraws.forEach((withdraw, index) => {
                description += `\n**${index + 1}. ${withdraw.streamerName}**\n`;
                description += `   └─ ID: \`${withdraw.withdrawId}\`\n`;
                description += `   └─ Valor: ${formatCurrency(withdraw.amount)}\n`;
                description += `   └─ Método: ${withdraw.method}\n`;
                description += `   └─ Solicitado: ${new Date(withdraw.createdAt).toLocaleDateString('pt-BR')}\n`;
            });

            const embed = createInfoEmbed(
                `📋 Saques Pendentes (${pendingWithdraws.length})`,
                description
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao listar saques pendentes:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao listar saques pendentes!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
