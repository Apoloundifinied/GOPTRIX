import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../database/models/User.js';

export default {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // ✨ MAIN WELCOME EMBED - Animated welcome with beautiful formatting
            const mainWelcomeEmbed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('✨ BEM-VINDO AO GOP TRIX ✨')
                .setDescription(`
                    🎉 Olá **${member.user.username}**!

                    Você entrou em um servidor profissional de vendas de CFG com sistema de afiliação completo.

                    Aqui você pode:
                    💰 **Comprar CFG** com desconto especial
                    🤝 **Virar afiliado** e ganhar comissões
                    📊 **Acompanhar vendas** em tempo real
                    💳 **Sacar suas comissões** via PIX
                `)
                .setThumbnail(member.user.displayAvatarURL())
                .setImage('https://media.discordapp.net/attachments/1084817700906229820/1084817725571592304/Sem_titulo_2022-04-15T005638.562.png')
                .setFooter({ text: '© GOP TRIX | Sistema Profissional de Afiliação', iconURL: member.guild.iconURL() })
                .setTimestamp();

            // 📋 QUICK START GUIDE EMBED
            const quickStartEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🚀 COMEÇE AQUI')
                .addFields(
                    {
                        name: '1️⃣ Explore os Canais',
                        value: '→ #boas-vindas | #como-comprar-cfg | #meu-link | #solicitar-saque',
                        inline: false
                    },
                    {
                        name: '2️⃣ Conheça os Comandos',
                        value: 'Use `/help` para ver todos os comandos disponíveis',
                        inline: false
                    },
                    {
                        name: '3️⃣ Crie seu Perfil',
                        value: 'Use `/meu-perfil` para acompanhar seu progresso',
                        inline: false
                    },
                    {
                        name: '4️⃣ Comece a Vender',
                        value: 'Use `/comprar-pix` ou `/comprar` para fazer suas primeiras vendas!',
                        inline: false
                    }
                )
                .setColor(0x2ecc71);

            // 🎯 CATEGORIES OVERVIEW EMBED
            const categoriesEmbed = new EmbedBuilder()
                .setColor(0xf39c12)
                .setTitle('📂 ESTRUTURA DO SERVIDOR')
                .addFields(
                    { name: '🌟 INÍCIO', value: 'Boas-vindas, regras e informações gerais', inline: true },
                    { name: '👥 CLIENTES', value: 'Área para compras e suporte', inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: '🤝 PARCEIROS', value: 'Gestão de afiliados e comissões', inline: true },
                    { name: '🎧 SUPORTE', value: 'Tickets e resolução de problemas', inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: '👨‍💼 STAFF', value: 'Painel administrativo e logs', inline: true },
                    { name: '⚙️ SISTEMA', value: 'Configurações e automações', inline: true }
                )
                .setColor(0xe74c3c);

            // 💡 TIPS EMBED
            const tipsEmbed = new EmbedBuilder()
                .setColor(0x1abc9c)
                .setTitle('💡 DICAS IMPORTANTES')
                .setDescription(`
                    ⚡ **PIX é nosso padrão** - Pagamentos rápidos e seguros

                    💳 **Desconto de 5%** - Clientes ganham desconto automático

                    🎁 **Comissões automáticas** - Ganhe 10% em cada venda como afiliado

                    🔒 **Segurança** - Use IDs únicos de afiliados em todas as operações

                    ⏰ **Follow-ups** - Receba lembretes automáticos sobre suas vendas
                `)
                .setFooter({ text: 'Leia os canais fixados para mais informações' });

            // 🎯 ACTION BUTTONS - Quick access to key channels
            const buttonsRow1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('📋 COMO COMPRAR')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/' + member.guild.id),
                    new ButtonBuilder()
                        .setLabel('🤝 VIRAR AFILIADO')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/' + member.guild.id),
                    new ButtonBuilder()
                        .setLabel('🆘 SUPORTE')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/' + member.guild.id)
                );

            const buttonsRow2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('/help')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setLabel('/meu-perfil')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setLabel('/criar-parceiro')
                        .setStyle(ButtonStyle.Secondary)
                );

            // Send beautiful DM with all embeds
            await member.send({
                embeds: [mainWelcomeEmbed, quickStartEmbed, categoriesEmbed, tipsEmbed],
                components: [buttonsRow1, buttonsRow2]
            });

            // 🎯 Send welcome message to the server's welcome channel (if it exists)
            const welcomeChannel = member.guild.channels.cache.find(
                ch => ch.name.includes('boas-vindas') || ch.name.includes('welcome')
            );

            if (welcomeChannel) {
                const serverWelcomeEmbed = new EmbedBuilder()
                    .setColor(0x9b59b6)
                    .setDescription(`
                        🎉 **${member.user.username}** acaba de entrar no servidor!

                        Bem-vindo ao **GOP TRIX** - Sistema Profissional de Afiliação 💰

                        Verifique sua DM para o guia de início rápido! ✨
                    `)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp();

                await welcomeChannel.send({ embeds: [serverWelcomeEmbed] });
            }

            // Register user in database
            await User.findOneAndUpdate(
                { discordId: member.id },
                {
                    discordId: member.id,
                    username: member.user.username,
                },
                { upsert: true, new: true }
            );

            console.log(`✅ Novo membro ${member.user.username} registrado com sucesso!`);

        } catch (error) {
            console.error('Erro ao processar novo membro:', error);
        }
    },
};
