#!/usr/bin/env node

/**
 * DIAGNÓSTICO DO BOT GOP TRIX
 * Verifica e exibe informações de debug
 */

import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║  🔍 DIAGNÓSTICO - GOP TRIX BOT                 ║');
console.log('╚════════════════════════════════════════════════╝\n');

console.log('📋 Verificações básicas:');
console.log(`  • TOKEN: ${TOKEN ? '✅ Carregado' : '❌ FALTANDO'}`);
console.log(`  • CLIENT_ID: ${CLIENT_ID ? '✅ Carregado' : '❌ FALTANDO'}`);

if (!TOKEN || !CLIENT_ID) {
    console.log('\n❌ Credenciais faltando no .env\n');
    process.exit(1);
}

client.once('ready', async () => {
    console.log('\n✅ Bot conectado ao Discord!\n');

    console.log('🤖 Informações do Bot:');
    console.log(`  • Nome: ${client.user.username}#${client.user.discriminator}`);
    console.log(`  • ID: ${client.user.id}`);
    console.log(`  • Verificado: ${client.user.verified ? '✅' : '❌'}`);

    console.log('\n🏘️ Servidores (Guilds):');
    const guilds = await client.guilds.fetch();
    if (guilds.size === 0) {
        console.log('  ❌ Bot não está em nenhum servidor!');
        console.log('\n  📌 Solução: Convide o bot com este link:');
        console.log(`  https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`);
    } else {
        console.log(`  • Total: ${guilds.size} servidor(s)`);
        guilds.forEach((guild) => {
            console.log(`    - ${guild.name} (ID: ${guild.id})`);
        });
    }

    console.log('\n⚙️ Comandos Slash Registrados:');
    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        const commands = await rest.get(Routes.applicationCommands(CLIENT_ID));
        console.log(`  • Total: ${commands.length} comando(s)`);
        if (commands.length === 0) {
            console.log('  ⚠️ Nenhum comando registrado! Execute: npm start');
        } else {
            commands.slice(0, 5).forEach((cmd) => {
                console.log(`    - /${cmd.name}`);
            });
            if (commands.length > 5) {
                console.log(`    ... e ${commands.length - 5} mais`);
            }
        }
    } catch (error) {
        console.log('  ❌ Erro ao buscar comandos:', error.message);
    }

    console.log('\n📊 Intents Habilitados:');
    const intentsArray = [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'DirectMessages',
        'MessageContent',
    ];
    intentsArray.forEach(intent => console.log(`  ✅ ${intent}`));

    console.log('\n🔐 Permissões Necessárias:');
    const requiredPerms = [
        'Send Messages',
        'Embed Links',
        'Read Message History',
        'Use Application Commands',
        'Manage Channels',
        'Manage Roles',
    ];
    requiredPerms.forEach(perm => console.log(`  ✅ ${perm}`));

    console.log('\n📝 Próximas ações se o bot não responde:');
    console.log('  1. Verifique se o bot está no servidor');
    console.log('  2. Verifique se os comandos estão registrados acima');
    console.log('  3. Teste com: /help');
    console.log('  4. Verifique permissões do bot no servidor');
    console.log('  5. Se ainda não funcionar, reinicie com: npm start\n');

    process.exit(0);
});

client.on('error', error => {
    console.error('❌ Erro de conexão:', error);
    process.exit(1);
});

console.log('🔐 Conectando ao Discord...');
client.login(TOKEN);

setTimeout(() => {
    console.log('\n❌ Timeout - Bot não conseguiu conectar\n');
    process.exit(1);
}, 15000);
