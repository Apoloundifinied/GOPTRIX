# 🎮 GOP TRIX BOT - Bot Discord Profissional

Bot Discord completo e modular para gerenciamento de parceiros, vendas de CFG, afiliados e agendamentos.

## ✨ Funcionalidades

### 🎫 Sistema de Tickets
- Criar tickets via botão
- Categorização automática
- Permissões personalizadas
- Fechamento de tickets

### 🤝 Sistema de Parceiros
- Registro de streamers
- ID de afiliado único
- Painel de perfil
- Relatórios de vendas

### 💰 Sistema de Vendas
- Processamento de vendas
- Cálculo automático de comissões (10%)
- Registro em banco de dados
- Follow-up automático após 5 dias

### 💸 Sistema de Saques
- Solicitação de saques
- Aprovação por admin
- Suporte a PIX, Transferência, Wallet
- Notificações automáticas

### 📅 Agendamentos
- Solicitar agendamento
- Aprovação manual
- Múltiplos tipos de serviço
- Notificações

### 👥 Sistema de Afiliados
- API REST para informações
- Consulta de vendas
- Dashboard de comissões
- Integração com Discord

### 🛡️ Painel Administrativo
- Visualizar parceiros
- Gerenciar saques e agendamentos
- Relatórios em tempo real
- Controle total do sistema

## 🚀 Requisitos

- Node.js >= 18.0.0
- MongoDB
- Discord Bot Token
- Client ID do App Discord

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd goptrix
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o `.env`:**
```env
TOKEN=seu_bot_token_aqui
CLIENT_ID=seu_client_id_aqui
CLIENT_SECRET=seu_client_secret_aqui
MONGO_URI=mongodb://localhost:27017/goptrix
PORT=3000
```

4. **Inicie o bot:**
```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
goptrix/
├── src/
│   ├── commands/          # Comandos slash
│   ├── events/            # Event handlers
│   ├── handlers/          # Command e Event loaders
│   ├── database/
│   │   ├── models/        # Schemas Mongoose
│   │   └── connection.js  # Conexão MongoDB
│   ├── services/          # Lógica de negócio
│   ├── utils/             # Funções auxiliares
│   ├── routes/            # Rotas Express
│   ├── structures/        # Classes customizadas
│   └── modals/            # Modals Discord
├── index.js               # Arquivo principal
├── package.json           # Dependências
└── .env                   # Variáveis de ambiente
```

## 🛠️ Comandos Disponíveis

### Usuário
- `/help` - Mostra todos os comandos
- `/criar-parceiro` - Crie uma conta de parceiro
- `/meu-perfil` - Veja seu perfil de parceiro
- `/vendas` - Veja suas vendas como afiliado
- `/solicitar-saque` - Solicite um saque
- `/agendar` - Solicite um agendamento

### Admin
- `/painel-admin` - Acesse o painel administrativo
- `/processar-venda` - Processe uma venda
- `/aprovar-saque` - Aprove saques pendentes
- `/aprovar-agendamento` - Aprove agendamentos
- `/relatorio` - Gere relatórios

## 🌐 API REST

A API está disponível em `http://localhost:3000/api`

### Endpoints

#### GET `/api/affiliate/:affiliateId`
Obter informações do afiliado
```json
{
  "success": true,
  "affiliate": {
    "id": "AFF-12345678",
    "name": "StreamerName",
    "balance": 1000,
    "totalSales": 5,
    "totalCommission": 500
  }
}
```

#### GET `/api/affiliates`
Listar todos os afiliados (Admin)

#### GET `/api/stats`
Obter estatísticas gerais

#### GET `/api/health`
Verificar status da API

## 📊 Modelos de Dados

### User
- `discordId` - ID do Discord
- `username` - Nome de usuário
- `email` - Email
- `affiliateId` - ID do afiliado (se houver)

### Streamer
- `discordId` - ID do Discord
- `username` - Nome do streamer
- `affiliateId` - ID único de afiliado
- `balance` - Saldo disponível
- `totalSales` - Total de vendas
- `totalCommission` - Comissão total
- `status` - Status (active/inactive/suspended)

### Sale
- `saleId` - ID único da venda
- `clientId` - ID do cliente
- `price` - Valor da venda
- `affiliateId` - ID do afiliado (se houver)
- `affiliateCommission` - Comissão do afiliado (10% por padrão)
- `followUpDate` - Data para follow-up
- `followUpSent` - Se follow-up foi enviado

### Withdraw
- `withdrawId` - ID único
- `streamerId` - ID do streamer
- `amount` - Valor do saque
- `method` - Método (pix/bank/wallet)
- `status` - Status (pending/approved/rejected/completed)

### Schedule
- `scheduleId` - ID único
- `clientId` - ID do cliente
- `requestedTime` - Horário solicitado
- `service` - Tipo de serviço
- `status` - Status (pending/approved/rejected/completed)

### Ticket
- `ticketId` - ID único
- `channelId` - ID do canal Discord
- `clientId` - ID do cliente
- `type` - Tipo de ticket
- `status` - Status (open/in-progress/closed)

## ⚙️ Configuração

### Roles Necessárias no Discord
- `Admin` - Para acessar comandos administrativos

### Canais Necessários
- `logs-vendas` - Para logs de vendas
- `logs-gerais` - Para logs gerais
- `logs-erros` - Para logs de erros

Crie automaticamente ou manualmente para melhor funcionamento.

## 🤖 Scheduler

O bot roda um scheduler a cada 6 horas para:
- Verificar follow-ups pendentes
- Enviar mensagens pós-compra aos clientes

## 🔐 Segurança

- Tokens armazenados em `.env`
- Permissões verificadas para comandos admin
- Validação de dados de entrada
- Erros logados adequadamente

## 📝 Logs

Os logs são salvos em canais Discord específicos:
- **logs-vendas**: Registro de todas as vendas
- **logs-gerais**: Eventos gerais do sistema
- **logs-erros**: Erros e exceções

## 🤝 Contribuição

Para contribuir com o projeto, faça um fork, crie uma branch e abra um pull request.

## 📄 Licença

MIT

## 🆘 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para GOP TRIX**
