# 🛠️ Guia Completo de Configuração - GOP TRIX BOT

## 📋 Checklist Inicial

- [ ] Node.js >= 18 instalado
- [ ] MongoDB rodando
- [ ] Bot Discord criado
- [ ] Repositório clonado

## 🔧 Passo 1: Criar Bot Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome: **GOP TRIX BOT**
4. Vá para "Bot" → "Add Bot"
5. Copie o **TOKEN** (está em "TOKEN")
6. Em "OAUTH2" → "General", copie o **CLIENT_ID**
7. Copie também o **CLIENT_SECRET**

## 🔐 Permissões do Bot

Vá para `OAuth2` → `URL Generator` e selecione:

**Scopes:**
- `bot`
- `applications.commands`

**Permissions:**
- Send Messages
- Embed Links
- Manage Messages
- Manage Channels
- Create Public Threads
- Create Private Threads
- Send Messages in Threads
- Read Message History

Copie a URL gerada e use para convidar o bot ao seu servidor.

## 📦 Passo 2: Instalar Dependências

```bash
npm install
```

## 🗄️ Passo 3: Configurar MongoDB

### Opção 1: MongoDB Local
```bash
# Windows (com MongoDB instalado)
mongod
```

### Opção 2: MongoDB Atlas (Cloud)
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta
3. Crie um cluster
4. Obtenha a connection string: `mongodb+srv://user:pass@cluster.mongodb.net/goptrix`

## ⚙️ Passo 4: Configurar .env

O arquivo `.env` já existe no seu projeto. Preencha com:

```env
TOKEN=seu_bot_token_aqui
CLIENT_ID=seu_client_id_aqui
CLIENT_SECRET=seu_client_secret_aqui
MONGO_URI=mongodb://localhost:27017/goptrix
PORT=3000
```

## 🛠️ Passo 5: Configurar Canais Discord

Crie os seguintes canais no seu servidor:

1. **logs-vendas** - Categoria: `LOGS` - Tipo: `Texto`
2. **logs-gerais** - Categoria: `LOGS` - Tipo: `Texto`
3. **logs-erros** - Categoria: `LOGS` - Tipo: `Texto`
4. **ticket-categoria** - Tipo: `Categoria`
5. **botoes** - Categoria: `GERAL` - Tipo: `Texto` (para botão de tickets)

## 👥 Passo 6: Criar Roles

Crie as seguintes roles:

1. **Admin** - Para administradores
2. **Staff** - Para staff
3. **Streamer** - Para parceiros
4. **Membro** - Padrão para novos membros

## 🚀 Passo 7: Iniciar o Bot

```bash
npm start
```

Ou para desenvolvimento:
```bash
npm run dev
```

Você deve ver:
```
🚀 Iniciando GOP TRIX BOT...
✅ Database conectado com sucesso!
📋 Carregando comandos...
✅ Eventos carregados com sucesso!
✅ GOP TRIX BOT está online!
```

## 📍 Passo 8: Publicar Botão de Ticket

No canal `botoes`, use:

```bash
# Use um comando customizado ou mensagem
```

Você pode enviar uma mensagem embed com botão via comando Discord ou direto.

## ✅ Testes Básicos

1. Use `/help` para ver todos os comandos
2. Clique em "Abrir Ticket de Suporte"
3. Preencha o formulário
4. Veja o ticket criado
5. Use `/criar-parceiro` para criar uma conta de parceiro

## 🐛 Troubleshooting

### Bot não conecta
- Verifique o TOKEN no `.env`
- Verifique se o bot está convidado para o servidor
- Verifique as permissões do bot

### Comandos não aparecem
- Reinicie o bot
- Use `/` no Discord e aguarde carregar
- Verifique se o bot tem permissão de criar comandos

### Banco de dados não conecta
- Verifique se MongoDB está rodando
- Verifique a MONGO_URI
- Teste a conexão manualmente

### Erros de permissão
- Certifique-se de que o bot tem permissões de gerenciador
- Verifique roles e canais

## 📊 Dados de Teste

### Criar Parceiro de Teste
```
/criar-parceiro username:TestStreamer
```

### Processar Venda de Teste
```
/processar-venda cliente:João valor:100 affiliado:AFF-12345678
```

### Solicitar Saque de Teste
```
/solicitar-saque valor:50 metodo:pix detalhes:123.456.789-00
```

## 🔗 URLs Importantes

- **API Health**: `http://localhost:3000/api/health`
- **Stats**: `http://localhost:3000/api/stats`
- **Afiliado**: `http://localhost:3000/api/affiliate/:affiliateId`

## 🚨 Monitoramento

### Verificar Logs
```bash
# No Discord
# Vá para canal #logs-vendas ou #logs-gerais
```

### Verificar Status da API
```bash
curl http://localhost:3000/api/health
```

## 🔄 Updates e Manutenção

### Fazer Backup
```bash
# MongoDB
mongodump --out ./backup
```

### Restaurar Backup
```bash
mongorestore ./backup
```

## 📚 Recursos Úteis

- [Discord.js Docs](https://discord.js.org/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)

## 🎯 Próximos Passos

1. Customize as cores dos embeds
2. Adicione mais tipos de serviços
3. Integre com sistema de pagamento real
4. Configure webhooks para notificações
5. Implante em um servidor 24/7

---

**Para suporte, abra uma issue no repositório!**
