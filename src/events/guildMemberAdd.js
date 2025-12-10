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

                    Você entrou no servidor oficial de **otimizações**.

                    Aqui você encontra:
                    🛠️ Otimizações de PC (Básica, Avançada, Ultra + BIOS)
                    💳 Pagamento PIX com QR direto pelo bot
                    ⏳ Fila de atendimento com posição transparente
                    🎫 Tickets privados de suporte
                `)
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: '© GOP TRIX | Otimizações Profissionais', iconURL: member.guild.iconURL() })
                .setTimestamp();

            // 📋 QUICK START GUIDE EMBED
            const quickStartEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🚀 COMEÇE AQUI')
                .addFields(
                    {
                        name: '1️⃣ Explore os Canais',
                        value: '→ #boas-vindas | #loja | #como-comprar-otimizacao | #enviar-comprovante | #abrir-ticket',
                        inline: false
                    },
                    {
                        name: '2️⃣ Conheça os Comandos',
                        value: 'Use `/help` para ver ações de compra, fila e suporte',
                        inline: false
                    },
                    {
                        name: '3️⃣ Compre sua Otimização',
                        value: 'Use `/loja`, pague via PIX com o QR, e envie `/enviar-comprovante`',
                        inline: false
                    },
                    {
                        name: '4️⃣ Acompanhe a Fila',
                        value: 'Após aprovação, você entra na fila automaticamente. Use `/fila-status`.',
                        inline: false
                    }
                );

            // 🎯 CATEGORIES OVERVIEW EMBED
            const categoriesEmbed = new EmbedBuilder()
                .setColor(0xf39c12)
                .setTitle('📂 ESTRUTURA DO SERVIDOR')
                .addFields(
                    { name: '🌟 INÍCIO', value: 'Boas-vindas, regras e anúncios', inline: true },
                    { name: '🧑‍💻 CLIENTES', value: 'Loja, como comprar, enviar comprovante, abrir ticket', inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: '⏳ FILA', value: 'Fila pública e canais de gestão da fila', inline: true },
                    { name: '🎧 SUPORTE', value: 'FAQ e canal de suporte', inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: '🛠️ STAFF', value: 'Pedidos, fila, logs e dashboard', inline: true }
                );

            // 💡 TIPS EMBED
            const tipsEmbed = new EmbedBuilder()
                .setColor(0x1abc9c)
                .setTitle('💡 DICAS IMPORTANTES')
                .setDescription(`
                    ⚡ PIX é o padrão — pague com o QR gerado pelo bot
                    📧 Pós-compra — verifique seu email em até 1 hora
                    🔒 Segurança — não compartilhe dados sensíveis em público
                    ⏳ Fila — acompanhe sua posição com \`/fila-status\`
                `);

            // 🎯 ACTION BUTTONS - Quick access to key channels
            const buttonsRow1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('📋 Ajuda')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('help-open'),
                    new ButtonBuilder()
                        .setLabel('🎫 Abrir Ticket')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('create-ticket')
                );

            let dmSent = false;
            try {
                await member.send({
                    embeds: [mainWelcomeEmbed, quickStartEmbed, categoriesEmbed, tipsEmbed],
                    components: [buttonsRow1]
                });
                dmSent = true;
            } catch (dmErr) {
                dmSent = false;
            }

            // 🎯 Send welcome message to the server's welcome channel (if it exists)
            const welcomeChannel = member.guild.channels.cache.find(
                ch => ch.name.includes('boas-vindas') || ch.name.includes('welcome')
            );

            if (welcomeChannel) {
                const serverWelcomeEmbed = new EmbedBuilder()
                    .setColor(0x9b59b6)
                    .setDescription(`
                        🎉 **${member.user.username}** acaba de entrar no servidor!

                        Bem-vindo ao **GOP TRIX** — Otimizações profissionais.
                        ${dmSent ? 'Verifique sua DM para o guia de início rápido.' : 'Ative DMs para receber o guia. Use `/help` e visite `#loja` para começar.'}
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
