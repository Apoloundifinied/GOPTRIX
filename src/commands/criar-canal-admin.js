import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('criar-canal-admin')
        .setDescription('🔧 Criar canal #admin-pagamentos (Owner Only)')
        .setDefaultMemberPermissions(0)
        .setDMPermission(false),

    async execute(interaction) {
        try {
            // Verificar se é o owner
            if (interaction.user.id !== interaction.guild.ownerId) {
                return await interaction.reply({
                    content: '❌ Apenas o dono do servidor pode usar este comando',
                    flags: 64
                });
            }

            await interaction.deferReply({ flags: 64 });

            // Verificar se canal já existe
            const existingChannel = interaction.guild.channels.cache.find(
                ch => ch.name === 'admin-pagamentos' && ch.isTextBased()
            );

            if (existingChannel) {
                return await interaction.editReply({
                    content: `✅ Canal <#${existingChannel.id}> já existe!`
                });
            }

            // Criar canal
            const channel = await interaction.guild.channels.create({
                name: 'admin-pagamentos',
                type: ChannelType.GuildText,
                topic: '📬 Notificações de comprovantes de pagamento PIX',
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'] // Ninguém pode ver por padrão
                    },
                    {
                        id: interaction.guild.ownerId,
                        allow: ['ViewChannel', 'SendMessages', 'ManageMessages']
                    }
                ]
            });

            // Enviar mensagem de boas-vindas
            await channel.send({
                content: `📬 **CANAL DE PAGAMENTOS**\n\nEste canal é para notificações de comprovantes de pagamento PIX.\n\n✅ Apenas administradores podem ver este canal.\n\nComandos relacionados:\n- \`/validar-comprovante\`\n- \`/entregar-produto\``
            });

            await interaction.editReply({
                content: `✅ Canal <#${channel.id}> criado com sucesso!\n\n📝 Permissões:\n- Apenas Owner e Admins podem ver\n- Recebe notificações de comprovantes`
            });

            console.log(`✅ Canal #admin-pagamentos criado em ${interaction.guild.name}`);

        } catch (error) {
            console.error('Erro ao criar canal:', error);
            await interaction.editReply({
                content: `❌ Erro ao criar canal: ${error.message}`
            });
        }
    }
};
