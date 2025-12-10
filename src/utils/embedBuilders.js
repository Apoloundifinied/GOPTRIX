import { EmbedBuilder } from 'discord.js';
export const EMOJI = {
    arrows: '<:alliancearrows6:914460560362467368>',
    crown: '<:w_coroa:914460560173694986>',
    verified: '<:verified:920277765935202334>',
    bug: '<:bugmeme:854852198952468500>'
};

export function createSuccessEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: 'GOP TRIX BOT' })
        .setTimestamp();
}

export function createErrorEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: 'GOP TRIX BOT' })
        .setTimestamp();
}

export function createInfoEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: 'GOP TRIX BOT' })
        .setTimestamp();
}

export function createWarningEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(0xf39c12)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: 'GOP TRIX BOT' })
        .setTimestamp();
}
