import { SlashCommandBuilder } from 'discord.js';
import { createSaleWithFollowUp } from '../services/saleService.js';
import { getStreamerByAffiliateId } from '../services/streamerService.js';
import { generateSaleId } from '../utils/generators.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embedBuilders.js';

export default {
    data: new SlashCommandBuilder()
        .setName('confirmar-servico')
        .setDescription('💳 Confirma serviço prestado e credita comissão ao afiliado')
        .addStringOption(option =>
            option
                .setName('servico')
                .setDescription('Tipo de serviço (CFG, Otimização, Consultoria)')
                .setRequired(true)
                .addChoices(
                    { name: 'CFG', value: 'CFG' },
                    { name: 'Otimização de PC', value: 'Otimização de PC' },
                    { name: 'Consultoria', value: 'Consultoria' },
                    { name: 'Suporte Técnico', value: 'Suporte Técnico' }
                )
        )
        .addStringOption(option =>
            option
                .setName('cliente')
                .setDescription('Nome do cliente')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('valor')
                .setDescription('Valor do serviço em BRL')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('afiliado')
                .setDescription('ID do afiliado que prestou o serviço')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const service = interaction.options.getString('servico');
            const clientName = interaction.options.getString('cliente');
            const value = interaction.options.getNumber('valor');
            const affiliateId = interaction.options.getString('afiliado');

            // Validar valor
            if (value <= 0) {
                const errorEmbed = createErrorEmbed(' Erro', 'O valor deve ser maior que R$ 0,00!');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Validar afiliado existe
            const streamer = await getStreamerByAffiliateId(affiliateId);
            if (!streamer) {
                const errorEmbed = createErrorEmbed(' Erro', `Afiliado ${affiliateId} não encontrado!`);
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }

            // Calcular comissão (10%)
            const commission = value * 0.10;

            // Criar venda
            const saleData = {
                saleId: generateSaleId(),
                clientName,
                price: value,
                product: service,
                affiliateId,
                affiliateCommission: commission,
                status: 'completed',
                ticketId: null,
            };

            const sale = await createSaleWithFollowUp(saleData);

            // Resposta ao admin
            const successEmbed = createSuccessEmbed(
                ' Serviço Confirmado',
                `Serviço registrado com sucesso!\n\n**ID da Venda:** \`${sale.saleId}\`\n**Serviço:** ${service}\n**Cliente:** ${clientName}\n**Valor:** R$ ${value.toFixed(2)}\n**Afiliado:** ${affiliateId}\n**Comissão Creditada:** R$ ${commission.toFixed(2)}\n\n✅ Saldo do streamer foi atualizado!`
            );

            await interaction.editReply({ embeds: [successEmbed] });

            // Log em canal específico
            const logsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'logs-vendas');
            if (logsChannel) {
                const logEmbed = createSuccessEmbed(
                    '💳 Serviço Confirmado',
                    `**Serviço:** ${service}\n**Cliente:** ${clientName}\n**Valor:** R$ ${value.toFixed(2)}\n**Comissão:** R$ ${commission.toFixed(2)}\n**Afiliado:** ${affiliateId}`
                );
                await logsChannel.send({ embeds: [logEmbed] });
            }

            // Notificar streamer via DM
            try {
                const streamerUser = await interaction.client.users.fetch(streamer.discordId);
                const notificationEmbed = createSuccessEmbed(
                    '💰 Você Recebeu Comissão!',
                    `Uma nova comissão foi creditada na sua conta!\n\n**Serviço:** ${service}\n**Valor:** R$ ${value.toFixed(2)}\n**Sua Comissão (10%):** R$ ${commission.toFixed(2)}\n\n✅ Novo Saldo: R$ ${(streamer.balance + commission).toFixed(2)}`
                );
                await streamerUser.send({ embeds: [notificationEmbed] });
            } catch (dmError) {
                console.log(`Não foi possível enviar DM para streamer: ${dmError}`);
            }

        } catch (error) {
            console.error('Erro ao confirmar serviço:', error);
            const errorEmbed = createErrorEmbed('❌ Erro', 'Erro ao confirmar serviço!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
