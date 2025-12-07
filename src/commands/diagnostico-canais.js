import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('diagnostico-canais')
        .setDescription('🔍 Verifica acesso a todos os canais do servidor'),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });

        try {
            const guild = interaction.guild;
            const channels = guild.channels.cache;

            let diagnostico = '🔍 **DIAGNÓSTICO DE CANAIS**\n\n';
            diagnostico += `📊 Total de canais: ${channels.size}\n\n`;

            const botMember = await guild.members.fetch(interaction.client.user.id);
            const botPermissions = {
                viewChannel: botMember.permissions.has('ViewChannel'),
                sendMessages: botMember.permissions.has('SendMessages'),
                embedLinks: botMember.permissions.has('EmbedLinks'),
                manageMessages: botMember.permissions.has('ManageMessages'),
            };

            diagnostico += '🤖 **PERMISSÕES GLOBAIS DO BOT:**\n';
            diagnostico += `✅ Ver Canais: ${botPermissions.viewChannel ? 'SIM' : 'NÃO'}\n`;
            diagnostico += `✅ Enviar Mensagens: ${botPermissions.sendMessages ? 'SIM' : 'NÃO'}\n`;
            diagnostico += `✅ Incorporar Links: ${botPermissions.embedLinks ? 'SIM' : 'NÃO'}\n`;
            diagnostico += `✅ Gerenciar Mensagens: ${botPermissions.manageMessages ? 'SIM' : 'NÃO'}\n\n`;

            diagnostico += '📋 **ACESSO A CADA CANAL:**\n\n';

            const accessResults = [];

            for (const [, channel] of channels) {
                const canView = botMember.permissionsIn(channel).has('ViewChannel');
                const canSend = botMember.permissionsIn(channel).has('SendMessages');
                const canEmbed = botMember.permissionsIn(channel).has('EmbedLinks');

                let status = '✅';
                if (!canView) status = '❌ SEM ACESSO';
                else if (!canSend) status = '⚠️ NÃO PODE ENVIAR';
                else if (!canEmbed) status = '⚠️ NÃO PODE EMBED';

                accessResults.push({
                    name: channel.name,
                    type: channel.isDMBased() ? 'DM' : channel.isTextBased() ? 'TEXTO' : 'OUTRO',
                    status,
                    canView,
                    canSend,
                    canEmbed
                });
            }

            // Ordena por status (problemas primeiro)
            accessResults.sort((a, b) => {
                const order = { '❌ SEM ACESSO': 0, '⚠️ NÃO PODE ENVIAR': 1, '⚠️ NÃO PODE EMBED': 2, '✅': 3 };
                return order[a.status] - order[b.status];
            });

            // Mostrar primeiros 10 canais no diagnóstico
            let canaisTexto = '';
            for (let i = 0; i < Math.min(10, accessResults.length); i++) {
                const ch = accessResults[i];
                canaisTexto += `${ch.status} #${ch.name}\n`;
            }

            if (accessResults.length > 10) {
                canaisTexto += `\n... e mais ${accessResults.length - 10} canais`;
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🔍 Diagnóstico de Acesso a Canais')
                .setDescription(diagnostico + canaisTexto)
                .setFooter({ text: `Total analisado: ${accessResults.length} canais` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Log detalhado no console
            console.log('\n════════════════════════════════════════');
            console.log('🔍 DIAGNÓSTICO COMPLETO DE CANAIS');
            console.log('════════════════════════════════════════');

            for (const ch of accessResults) {
                console.log(`${ch.status} ${ch.type.padEnd(6)} #${ch.name.padEnd(20)} | Ver: ${ch.canView ? '✓' : '✗'} | Enviar: ${ch.canSend ? '✓' : '✗'} | Embed: ${ch.canEmbed ? '✓' : '✗'}`);
            }

            console.log('════════════════════════════════════════\n');

            // Verificar canais importantes específicos
            const importantChannels = ['admin-pagamentos', 'tickets', 'vendas', 'log', 'logs'];
            let missingChannels = '';

            for (const chName of importantChannels) {
                const found = accessResults.find(ch => ch.name.toLowerCase().includes(chName));
                if (!found) {
                    missingChannels += `❌ Não encontrado: #${chName}\n`;
                }
            }

            if (missingChannels) {
                console.log('⚠️ CANAIS NÃO ENCONTRADOS:');
                console.log(missingChannels);
            }

        } catch (error) {
            console.error('Erro ao verificar canais:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Erro')
                .setDescription(`Erro ao diagnosticar canais: ${error.message}`)
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
