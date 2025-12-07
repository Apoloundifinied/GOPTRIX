import { SlashCommandBuilder } from 'discord.js';
import { createWithdrawRequest } from '../services/withdrawService.js';
import { getStreamer, updateStreamerBalance } from '../services/streamerService.js';
import { generateWithdrawId } from '../utils/generators.js';
import { createSuccessEmbed, createErrorEmbed, createWarningEmbed } from '../utils/embedBuilders.js';
import { formatCurrency } from '../utils/generators.js';

export default {
    data: new SlashCommandBuilder()
        .setName('solicitar-saque')
        .setDescription('💸 Solicite um saque de seus ganhos')
        .addNumberOption(option =>
            option
                .setName('valor')
                .setDescription('Valor que deseja sacar em BRL')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('metodo')
                .setDescription('Método de saque (pix, bank, wallet)')
                .setRequired(true)
                .addChoices(
                    { name: 'PIX', value: 'pix' },
                    { name: 'Transferência Bancária', value: 'bank' },
                    { name: 'Carteira Digital', value: 'wallet' }
                )
        )
        .addStringOption(option =>
            option
                .setName('detalhes')
                .setDescription('Detalhes da transferência (chave PIX, conta, etc)')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const amount = interaction.options.getNumber('valor');
            const method = interaction.options.getString('metodo');
            const details = interaction.options.getString('detalhes');

            const streamer = await getStreamer(interaction.user.id);

            if (!streamer) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'Você não possui uma conta de parceiro!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            if (amount <= 0) {
                const errorEmbed = createErrorEmbed('❌ Erro', 'O valor deve ser maior que 0!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            if (amount > streamer.balance) {
                const errorEmbed = createErrorEmbed(
                    '❌ Saldo Insuficiente',
                    `Seu saldo é de ${formatCurrency(streamer.balance)}, mas você solicitou ${formatCurrency(amount)}`
                );
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            const withdrawId = generateWithdrawId();

            const withdraw = await createWithdrawRequest({
                withdrawId,
                streamerId: interaction.user.id,
                streamerName: streamer.username,
                amount,
                method,
                methodDetails: details,
                status: 'pending',
            });

            const successEmbed = createSuccessEmbed(
                '✅ Saque Solicitado',
                `Sua solicitação de saque foi registrada!\n\n**ID do Saque:** \`${withdrawId}\`\n**Valor:** ${formatCurrency(amount)}\n**Método:** ${method}\n\nSeu saque será processado em breve.`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Notify admins
            const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin' || role.name === 'admin');
            if (adminRole) {
                const channel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-gerais');
                if (channel) {
                    const notificationEmbed = createWarningEmbed(
                        '💸 Nova Solicitação de Saque',
                        `**Streamer:** ${streamer.username}\n**Valor:** ${formatCurrency(amount)}\n**Método:** ${method}\n**ID:** ${withdrawId}`
                    );
                    await channel.send({ embeds: [notificationEmbed] });
                }
            }

        } catch (error) {
            console.error('Erro ao solicitar saque:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao solicitar saque!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
