import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
    const commandsPath = join(__dirname, '../commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = await import(`file://${filePath}`);

        if (command.default?.data && command.default?.execute) {
            client.commands.set(command.default.data.name, command.default);
            commands.push(command.default.data.toJSON());
        }
    }

    return commands;
}

export async function registerCommands(client, commands) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log(`🔄 Registrando ${commands.length} comando(s) slash...`);

        // Registrar globalmente (pode levar até 1 hora)
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });

        console.log(`✅ ${commands.length} comando(s) slash registrado(s) globalmente!`);

        // Registrar também por guild (instantâneo)
        const guilds = await client.guilds.fetch();
        console.log(`📡 Registrando em ${guilds.size} servidor(s)...`);

        for (const [, guild] of guilds) {
            try {
                await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), {
                    body: commands,
                });
                console.log(`  ✅ Comandos registrados em: ${guild.name}`);
            } catch (guildError) {
                console.error(`  ⚠️ Erro ao registrar em ${guild.name}:`, guildError.message);
            }
        }

        console.log('✅ Todos os comandos registrados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
}
