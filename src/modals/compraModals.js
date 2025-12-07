import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const comprarComDescontoModal = new ModalBuilder()
    .setCustomId('compra-com-desconto-modal')
    .setTitle('🛒 Compra com Desconto (5% OFF)');

const streamerIdInput = new TextInputBuilder()
    .setCustomId('streamer-id-input')
    .setLabel('ID do Streamer (Afiliado)')
    .setPlaceholder('Ex: AFF-ABC123DEF')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const servicoInput = new TextInputBuilder()
    .setCustomId('servico-input')
    .setLabel('Tipo de Serviço')
    .setPlaceholder('Ex: CFG, Otimização, Consultoria')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const valorInput = new TextInputBuilder()
    .setCustomId('valor-input')
    .setLabel('Valor Original (R$)')
    .setPlaceholder('Ex: 100.00')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const nomeClienteInput = new TextInputBuilder()
    .setCustomId('nome-cliente-input')
    .setLabel('Seu Nome')
    .setPlaceholder('Seu nome completo')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const emailInput = new TextInputBuilder()
    .setCustomId('email-input')
    .setLabel('Seu Email')
    .setPlaceholder('seu@email.com')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

comprarComDescontoModal.addComponents(
    new ActionRowBuilder().addComponents(streamerIdInput),
    new ActionRowBuilder().addComponents(servicoInput),
    new ActionRowBuilder().addComponents(valorInput),
    new ActionRowBuilder().addComponents(nomeClienteInput),
    new ActionRowBuilder().addComponents(emailInput)
);

export const comprarSemDescontoModal = new ModalBuilder()
    .setCustomId('compra-sem-desconto-modal')
    .setTitle('🛒 Compra Direta');

const servicoInput2 = new TextInputBuilder()
    .setCustomId('servico-input2')
    .setLabel('Tipo de Serviço')
    .setPlaceholder('Ex: CFG, Otimização')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const valorInput2 = new TextInputBuilder()
    .setCustomId('valor-input2')
    .setLabel('Valor (R$)')
    .setPlaceholder('Ex: 100.00')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const nomeClienteInput2 = new TextInputBuilder()
    .setCustomId('nome-cliente-input2')
    .setLabel('Seu Nome')
    .setPlaceholder('Seu nome completo')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const emailInput2 = new TextInputBuilder()
    .setCustomId('email-input2')
    .setLabel('Seu Email')
    .setPlaceholder('seu@email.com')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

comprarSemDescontoModal.addComponents(
    new ActionRowBuilder().addComponents(servicoInput2),
    new ActionRowBuilder().addComponents(valorInput2),
    new ActionRowBuilder().addComponents(nomeClienteInput2),
    new ActionRowBuilder().addComponents(emailInput2)
);
