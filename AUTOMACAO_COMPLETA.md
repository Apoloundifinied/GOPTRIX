# 🎯 SISTEMA DE AUTOMAÇÃO INTEGRADA - GOP TRIX BOT

## 📋 Visão Geral

O bot GOP TRIX agora está totalmente integrado com a estrutura do servidor, fornecendo:

1. **Boas-vindas Automáticas** - Mensagens ricas e animadas para novos membros
2. **Despedidas Automáticas** - Logs de saída com estatísticas do membro
3. **Auto-respostas por Canal** - Mensagens contextuais em canais específicos
4. **Animações Profissionais** - Embeds animados e formatação premium
5. **Sistema de Canais Inteligente** - Respostas baseadas no contexto

---

## 🎉 SISTEMA DE BOAS-VINDAS

### Localização
`src/events/guildMemberAdd.js`

### O Que Acontece
Quando um novo membro entra no servidor:

1. **DM Privada** com 4 embeds rápidos:
   - ✨ Welcome principal (roxo)
   - 🚀 Quick Start Guide (azul)
   - 📂 Server Structure (laranja)
   - 💡 Important Tips (teal)

2. **Botões de Ação Rápida**:
   - Como Comprar CFG
   - Virar Afiliado
   - Suporte

3. **Mensagem no Canal de Boas-vindas**:
   - Anúncio público da chegada
   - Convite para verificar DM

### Customização
Edite as funções `EmbedBuilder` no arquivo para:
- Mudar cores
- Adicionar/remover campos
- Alterar mensagens

---

## 👋 SISTEMA DE DESPEDIDAS

### Localização
`src/events/guildMemberRemove.js`

### O Que Acontece
Quando um membro sai do servidor:

1. **Embed de Despedida**:
   - Mensagem profissional
   - Convite para voltar

2. **Logs de Saída**:
   - Discord ID
   - Tempo no servidor
   - Duração formatada (dias/horas/minutos)

3. **Canal de Logs**:
   - Enviado para #logs-gerais ou #auditoria
   - Mantém histórico de atividade

### Customização
Edite `calculateMemberDuration()` para mudar o formato de tempo

---

## 🔗 AUTO-RESPOSTAS POR CANAL

### Localização
- Handler: `src/handlers/channelAutoResponseHandler.js`
- Event: `src/events/messageCreate.js`

### Canais Configurados

#### 1. #como-comprar-cfg
- Explica o processo de compra
- Destaca desconto de 5%
- Botões para /comprar e /comprar-pix

#### 2. #solicitar-saque
- Guia de solicitação de saque
- Informações: mínimo, tempo, método
- Botões para solicitar ou ver pendentes

#### 3. #abrir-ticket
- Tipos de tickets disponíveis
- Promessa de resposta em 2 horas
- Botão para abrir ticket

#### 4. #meu-link
- Painel de afiliados
- Explica como ganhar comissões (10%)
- Botões para perfil/vendas/ID

#### 5. #pedidos-pendentes (Staff Only)
- Dashboard de pedidos
- Comandos de validação
- Acesso restrito

#### 6. #painel-admin (Staff Only)
- Painel administrativo
- Estatísticas e relatórios
- Acesso restrito

### Como Funciona
1. User entra no canal
2. Bot detecta primeira mensagem
3. Envia embed automático + botões
4. Só envia uma vez por canal (para "onlyFirst: true")

### Adicionar Novo Canal
Edite `CHANNEL_RESPONSES` em `channelAutoResponseHandler.js`:

```javascript
'novo-canal': {
    embeds: [{ ... }],
    buttons: [{ ... }],
    onlyFirst: true,
    staffOnly: false
}
```

---

## ✨ SISTEMA DE ANIMAÇÕES

### Localização
`src/utils/animations.js`

### Funções Disponíveis

#### 1. `createLoadingEmbed(title, description)`
Cria embed com spinner animado

```javascript
import { createLoadingEmbed } from '../utils/animations.js';
const embed = createLoadingEmbed('Processando...', 'Por favor, aguarde');
```

#### 2. `createSuccessEmbed(title, description, fields)`
Embed com checkmark animado

```javascript
const embed = createSuccessEmbed('Sucesso!', 'Operação concluída', []);
```

#### 3. `createErrorEmbed(title, description)`
Embed com erro animado

```javascript
const embed = createErrorEmbed('Erro!', 'Algo deu errado');
```

#### 4. `createProgressBar(current, total, label)`
Barra de progresso formatada

```javascript
const bar = createProgressBar(50, 100, 'Download');
// Resultado: [█████░░░░░] 50%
```

#### 5. `createTransactionEmbed(type, data)`
Embed de transação (sale, withdrawal, order)

```javascript
const embed = createTransactionEmbed('sale', {
    id: 'SALE-123',
    status: 'Concluído',
    amount: '150.00'
});
```

#### 6. `createProfileEmbed(user)`
Card de perfil com animação

```javascript
const embed = createProfileEmbed({
    username: 'João',
    balance: '1500.00',
    commission: '300.00',
    sales: '10',
    affiliateId: 'AFF-12345'
});
```

#### 7. `createLeaderboardEmbed(title, entries)`
Ranking com medalhas

```javascript
const embed = createLeaderboardEmbed('Top Afiliados', [
    { name: 'João', value: '5000' },
    { name: 'Maria', value: '4500' }
]);
```

#### 8. `getPaymentAnimation(method)`
Array com estados de pagamento

```javascript
const frames = getPaymentAnimation('pix');
// ['⏳ Processando via pix...', '✅ Pagamento recebido!']
```

---

## 📊 ESTRUTURA DO SERVIDOR

```
🌟 INÍCIO
├── boas-vindas ..................... Welcome message auto
├── regras ........................... Regras do servidor
└── anúncios ......................... Comunicados

👥 CLIENTES
├── como-comprar-cfg ................ Auto-resposta com guia
├── abrir-ticket .................... Auto-resposta com tipos
├── pedidos-pendentes ............... Auto-resposta (staff)
└── meu-link ........................ Auto-resposta com painel

🤝 PARCEIROS
├── criar-parceiro .................. Info de afiliação
├── meu-link ........................ Dashboard (auto-resposta)
└── comissoes ........................ Informações de comissão

🎧 SUPORTE
├── abrir-ticket .................... Auto-resposta
├── faq ............................. Perguntas frequentes
└── erros ........................... Troubleshooting

👨‍💼 STAFF
├── painel-admin .................... Auto-resposta
├── solicitar-saque ................. Admin dashboard
└── saques-pendentes ................ Admin review

⚙️ SISTEMA
├── logs-gerais ..................... Despedidas automáticas
└── eventos ......................... Sistema de eventos
```

---

## 🚀 COMO USAR

### Para Desenvolvedores

#### Ativar Bot
```bash
npm start
```

#### Modo Desenvolvimento
```bash
npm run dev
```

#### Adicionar Novo Canal Auto-Resposta
1. Edite `src/handlers/channelAutoResponseHandler.js`
2. Adicione entrada em `CHANNEL_RESPONSES`
3. Restart o bot

#### Usar Animações em Comando
```javascript
import { createSuccessEmbed } from '../utils/animations.js';

// No seu comando:
const embed = createSuccessEmbed('Compra Realizada', 'Parabéns!', [
    { name: 'ID', value: 'SALE-12345', inline: true }
]);

await interaction.reply({ embeds: [embed] });
```

### Para Usuários

#### Novo Membro
1. Receba DM privada com guia completo
2. Clique nos botões para ações rápidas
3. Explore os canais do servidor

#### Comprar CFG
1. Acesse #como-comprar-cfg
2. Use /comprar-pix
3. Receba PIX key
4. Envie comprovante

#### Virar Afiliado
1. Acesse #meu-link
2. Use /criar-parceiro
3. Ganhe ID único (AFF-XXXXX)
4. Comece a vender!

#### Solicitar Saque
1. Acesse #solicitar-saque
2. Use /solicitar-saque
3. Aguarde aprovação (até 24h)
4. Receba via PIX

---

## 🎨 CORES DO SISTEMA

| Propósito | Hex | RGB |
|-----------|-----|-----|
| Primário | #9b59b6 | roxo |
| Info | #3498db | azul |
| Sucesso | #2ecc71 | verde |
| Aviso | #f39c12 | laranja |
| Erro | #e74c3c | vermelho |
| Neutro | #34495e | cinza |
| Destaque | #1abc9c | teal |

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### Novos Arquivos
- ✅ `src/events/guildMemberAdd.js` (atualizado)
- ✅ `src/events/guildMemberRemove.js` (novo)
- ✅ `src/events/messageCreate.js` (novo)
- ✅ `src/handlers/channelAutoResponseHandler.js` (novo)
- ✅ `src/utils/animations.js` (novo)

### Estrutura Total
```
goptrix/
├── src/
│   ├── commands/ (17 arquivos)
│   ├── database/
│   │   ├── connection.js
│   │   └── models/ (7 schemas)
│   ├── events/
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   ├── guildMemberAdd.js (✅ ATUALIZADO)
│   │   ├── guildMemberRemove.js (✅ NOVO)
│   │   └── messageCreate.js (✅ NOVO)
│   ├── handlers/
│   │   ├── commandHandler.js
│   │   ├── eventHandler.js
│   │   └── channelAutoResponseHandler.js (✅ NOVO)
│   ├── modals/
│   ├── routes/
│   ├── services/ (7 módulos)
│   ├── structures/
│   └── utils/
│       ├── animations.js (✅ NOVO)
│       ├── embedBuilders.js
│       ├── dateUtils.js
│       ├── generators.js
│       └── logger.js
├── config/
├── index.js
└── package.json
```

---

## 🔧 PRÓXIMOS PASSOS

### Sugeridos
1. ✅ Boas-vindas automáticas
2. ✅ Despedidas automáticas
3. ✅ Auto-respostas de canais
4. ✅ Sistema de animações
5. ⏳ Dashboard web interativo
6. ⏳ Notificações em tempo real
7. ⏳ Estatísticas avançadas
8. ⏳ Integrações externas

---

## 📞 SUPORTE

Para reportar bugs ou sugerir melhorias:
1. Abra um ticket em #abrir-ticket
2. Forneça detalhes do problema
3. Aguarde resposta em até 2 horas

---

**Desenvolvido com ❤️ para GOP TRIX**
**Sistema v2.0 - Automação Completa**
