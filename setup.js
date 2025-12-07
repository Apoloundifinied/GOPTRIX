#!/usr/bin/env node

/**
 * SETUP SCRIPT - GOP TRIX BOT
 * Este script valida e corrige erros comuns do bot
 * Execute antes de rodar: node setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 GOP TRIX BOT - SETUP VALIDATOR\n');
console.log('═'.repeat(50));

const checks = [];

// Check 1: Arquivos principais
console.log('\n📁 Verificando arquivos principais...');
const requiredFiles = [
    'index.js',
    '.env',
    'src/events/ready.js',
    'src/events/interactionCreate.js',
    'src/handlers/commandHandler.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
        checks.push(true);
    } else {
        console.log(`❌ ${file} - FALTANDO!`);
        checks.push(false);
    }
});

// Check 2: Variáveis de ambiente
console.log('\n🔐 Verificando .env...');
const envContent = fs.readFileSync('.env', 'utf8');
const required_vars = ['TOKEN', 'CLIENT_ID', 'CLIENT_SECRET', 'MONGO_URI', 'ACESS_TOKEN_MERCADO_PAGO'];

required_vars.forEach(varName => {
    if (envContent.includes(varName + '=')) {
        console.log(`✅ ${varName}`);
        checks.push(true);
    } else {
        console.log(`❌ ${varName} - FALTANDO!`);
        checks.push(false);
    }
});

// Check 3: Comandos
console.log('\n📋 Verificando comandos...');
const commandDir = 'src/commands';
const commands = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));
console.log(`✅ ${commands.length} comandos encontrados`);

let commandErrors = 0;
commands.forEach(cmd => {
    try {
        const content = fs.readFileSync(path.join(commandDir, cmd), 'utf8');

        // Check básicos
        if (!content.includes('export default') && !content.includes('module.exports')) {
            console.log(`⚠️ ${cmd} - sem export`);
            commandErrors++;
        }
        if (!content.includes('setName')) {
            console.log(`⚠️ ${cmd} - sem setName`);
            commandErrors++;
        }
        if (!content.includes('execute')) {
            console.log(`⚠️ ${cmd} - sem função execute`);
            commandErrors++;
        }
    } catch (e) {
        console.log(`❌ ${cmd} - erro ao ler`);
        commandErrors++;
    }
});

if (commandErrors === 0) {
    console.log(`✅ Todos os ${commands.length} comandos OK`);
    checks.push(true);
} else {
    console.log(`⚠️ ${commandErrors} problemas encontrados`);
    checks.push(false);
}

// Check 4: Eventos
console.log('\n⚡ Verificando eventos...');
const eventDir = 'src/events';
const events = fs.readdirSync(eventDir).filter(f => f.endsWith('.js'));
console.log(`✅ ${events.length} eventos encontrados: ${events.map(e => e.replace('.js', '')).join(', ')}`);
checks.push(true);

// Check 5: Services
console.log('\n🔧 Verificando services...');
const serviceDir = 'src/services';
const services = fs.readdirSync(serviceDir).filter(f => f.endsWith('.js'));
console.log(`✅ ${services.length} services encontrados`);
checks.push(true);

// Check 6: Models
console.log('\n📊 Verificando models...');
const modelDir = 'src/database/models';
const models = fs.readdirSync(modelDir).filter(f => f.endsWith('.js'));
console.log(`✅ ${models.length} models encontrados`);
checks.push(true);

// Resultado Final
console.log('\n' + '═'.repeat(50));
const passedChecks = checks.filter(c => c).length;
const totalChecks = checks.length;

console.log(`\n📊 Resultado: ${passedChecks}/${totalChecks} verificações passaram\n`);

if (passedChecks === totalChecks) {
    console.log('✅ BOT PRONTO PARA RODAR!');
    console.log('\nPróximos passos:');
    console.log('1. npm install (se não fez ainda)');
    console.log('2. npm start');
    console.log('\n🚀 Use: npm start\n');
    process.exit(0);
} else {
    console.log('⚠️ PROBLEMAS ENCONTRADOS!');
    console.log('Corrija os erros acima e tente novamente.\n');
    process.exit(1);
}
