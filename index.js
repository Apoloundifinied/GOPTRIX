import { Client, GatewayIntentBits, Collection } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './src/database/connection.js';
import { loadCommands, registerCommands } from './src/handlers/commandHandler.js';
import { loadEvents } from './src/handlers/eventHandler.js';
import { startFollowUpScheduler } from './src/services/followUpScheduler.js';
import apiRoutes from './src/routes/apiRoutes.js';
import mpWebhookRoutes from './src/routes/mpWebhook.js';

dotenv.config();
console.log('📌 Token carregado:', process.env.TOKEN ? '✅' : '❌');

// Initialize Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Initialize Commands Collection
client.commands = new Collection();

// Initialize Express Server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);
app.use('/api/mp', mpWebhookRoutes);
app.use('/webhooks/mercadopago', mpWebhookRoutes);

// Startup
async function startup() {
    try {
        console.log('🚀 Iniciando GOP TRIX BOT...\n');

        // Connect to MongoDB
        console.log('📦 Conectando ao banco de dados...');
        const dbConnected = await connectDatabase();
        if (!dbConnected) {
            console.error('❌ Falha ao conectar ao banco de dados');
            process.exit(1);
        }

        // Load Commands
        console.log('📋 Carregando comandos...');
        const commands = await loadCommands(client);

        // Load Events
        console.log('📡 Carregando eventos...');
        await loadEvents(client);

        // Login to Discord
        console.log('🔐 Conectando ao Discord...');
        await client.login(process.env.TOKEN);

        // Wait for bot to be ready
        await new Promise(resolve => {
            client.once('ready', resolve);
        });

        // Register Commands
        console.log('✍️ Registrando comandos slash...');
        await registerCommands(client, commands);

        // Start Follow-up Scheduler
        console.log('⏰ Iniciando scheduler...');
        startFollowUpScheduler(client);

        // Start Express Server
        const server = app.listen(PORT, () => {
            console.log(`\n✅ GOP TRIX BOT está online!`);
            console.log(`🌐 API rodando em http://localhost:${PORT}`);
            console.log(`🤖 Bot: ${client.user.tag}`);
            console.log('═'.repeat(50));
        });

        app.locals.client = client;

        // Tratamento de erro de porta
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Porta ${PORT} já está em uso!`);
                console.error('Tente matar o processo anterior com: taskkill /PID <PID> /F');
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar bot:', error);
        process.exit(1);
    }
}

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando bot...');
    await client.destroy();
    process.exit(0);
});

startup();
