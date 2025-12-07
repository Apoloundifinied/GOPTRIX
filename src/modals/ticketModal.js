import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js';

export function createTicketModal() {
    const modal = new ModalBuilder()
        .setCustomId('ticket-modal')
        .setTitle('Abrir Ticket de Suporte');

    const nameInput = new TextInputBuilder()
        .setCustomId('ticket-name')
        .setLabel('Seu Nome')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const emailInput = new TextInputBuilder()
        .setCustomId('ticket-email')
        .setLabel('Seu Email')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const affiliateInput = new TextInputBuilder()
        .setCustomId('ticket-affiliate')
        .setLabel('ID do Afiliado (opcional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('ticket-description')
        .setLabel('Descrição do Problema')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(emailInput),
        new ActionRowBuilder().addComponents(affiliateInput),
        new ActionRowBuilder().addComponents(descriptionInput)
    );

    return modal;
}
