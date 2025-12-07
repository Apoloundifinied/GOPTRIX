/**
 * Channel Update Event Handler
 * Triggers auto-responses when members interact with specific channels
 */

import { handleChannelAutoResponse } from '../handlers/channelAutoResponseHandler.js';

export default {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignore bot messages
            if (message.author.bot) return;

            // Check if message is in a configured channel
            const channelName = message.channel.name.toLowerCase();

            // List of channels that should trigger auto-responses
            const autoResponseChannels = [
                'boas-vindas',
                'como-comprar-cfg',
                'solicitar-saque',
                'abrir-ticket',
                'meu-link',
                'pedidos-pendentes',
                'painel-admin'
            ];

            // If first message in channel, send auto-response
            if (autoResponseChannels.includes(channelName)) {
                const messages = await message.channel.messages.fetch({ limit: 2 });

                // If this is the first user message (bot not counted)
                if (messages.size <= 1) {
                    await handleChannelAutoResponse(message);
                }
            }

        } catch (error) {
            console.error('Erro no event channelUpdate:', error);
        }
    }
};
