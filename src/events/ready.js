export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Bot ${client.user.tag} está online!`);
        console.log(`🔗 Servidores conectados: ${client.guilds.cache.size}`);
        console.log(`👥 Usuários registrados: ${client.users.cache.size}`);

        client.user.setActivity('GOP TRIX | /help', { type: 'WATCHING' });

        console.log('═'.repeat(50));
        console.log('✅ Bot pronto para receber comandos!');
        console.log('═'.repeat(50));
    },
};
