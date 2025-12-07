import { EmbedBuilder } from 'discord.js';

export default {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            // 👋 GOODBYE EMBED - Farewell message with animation
            const goodbyeEmbed = new EmbedBuilder()
                .setColor(0x95a5a6)
                .setTitle('👋 MEMBRO DESCONECTADO')
                .setDescription(`
                    **${member.user.username}** saiu do servidor GOP TRIX.

                    Esperamos vê-lo novamente em breve! 💫

                    Se você tinha operações pendentes, será possível recuperá-las na próxima volta.
                `)
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: '© GOP TRIX | Sistema Profissional de Afiliação', iconURL: member.guild.iconURL() })
                .setTimestamp();

            // 📊 LOGS EMBED - Statistics about member's activity
            const logsEmbed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('📊 REGISTROS DO MEMBRO')
                .addFields(
                    { name: '👤 Username', value: member.user.username, inline: true },
                    { name: '🆔 Discord ID', value: member.id, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: '📅 Membro desde', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: '⏱️ Tempo no servidor', value: calculateMemberDuration(member.joinedTimestamp), inline: true },
                    { name: '\u200b', value: '\u200b', inline: true }
                )
                .setColor(0x34495e);

            // 🔍 Find logs channel to post the event
            const logsChannel = member.guild.channels.cache.find(
                ch => ch.name.includes('logs') || ch.name.includes('auditoria')
            );

            if (logsChannel && logsChannel.permissionsFor(member.guild.members.me).has('SendMessages')) {
                await logsChannel.send({
                    embeds: [goodbyeEmbed, logsEmbed]
                });
            }

            console.log(`👋 Membro ${member.user.username} saiu do servidor`);

        } catch (error) {
            console.error('Erro ao processar saída de membro:', error);
        }
    },
};

/**
 * Calculate how long a member was in the server
 * @param {number} joinedTimestamp - Member join timestamp
 * @returns {string} Formatted duration string
 */
function calculateMemberDuration(joinedTimestamp) {
    const now = Date.now();
    const duration = now - joinedTimestamp;

    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
