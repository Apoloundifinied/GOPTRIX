# 📝 Exemplos de Uso - GOP TRIX BOT

## 🔥 Comandos de Teste

### 1. Help
```
/help
```
Mostra todos os comandos disponíveis e botão para criar ticket.

### 2. Criar Parceiro
```
/criar-parceiro username:MeuStreamer
```
Respostas esperadas:
- ✅ Parceiro Criado com ID de Afiliado único (ex: AFF-XXXXX)

### 3. Meu Perfil
```
/meu-perfil
```
Mostra informações do perfil de parceiro incluindo ID, saldo, vendas, comissões.

### 4. Processar Venda de CFG
```
/processar-venda cliente:João valor:100 affiliado:AFF-12345678
```
- Valor: 100 BRL
- Comissão (10%): 10 BRL ✅ CREDITADA IMEDIATAMENTE
- Venda registrada com follow-up em 5 dias

### 4.1 Confirmar Serviço (CFG, Otimização, Consultoria)
```
/confirmar-servico servico:Otimização de PC cliente:Maria valor:500 afiliado:AFF-12345678
```
Opções de serviço:
- `CFG` - Arquivo de configuração
- `Otimização de PC` - Otimização de performance
- `Consultoria` - Consultoria técnica
- `Suporte Técnico` - Suporte ao cliente

**Resultado:**
- Comissão (10%) creditada automaticamente: R$ 50
- Streamer recebe notificação por DM
- Log enviado para #logs-vendas

### 5. Minhas Vendas
```
/vendas
```
Lista todas as vendas como afiliado.

### 6. Solicitar Saque
```
/solicitar-saque valor:50 metodo:pix detalhes:123.456.789-00
```
Opções de método:
- `pix` - Transferência PIX
- `bank` - Transferência Bancária
- `wallet` - Carteira Digital

### 7. Agendar
```
/agendar servico:Otimização_de_PC horario:14:30
```
Serviços disponíveis:
- Otimização de PC
- Consultoria
- Suporte Técnico

### 8. Fechar Ticket
No canal de ticket, use:
```
/fechar-ticket motivo:Problema resolvido
```

## 👨‍💼 Comandos Admin

### 1. Painel Admin
```
/painel-admin
```
Mostra:
- Total de parceiros
- Saldo total
- Comissões totais
- Saques pendentes
- Agendamentos pendentes

### 2. Aprovar Saque
```
/aprovar-saque withdraw_id:WITHDRAW-XXXXX
```

### 3. Aprovar Agendamento
```
/aprovar-agendamento schedule_id:SCHEDULE-XXXXX horario:14:30
```

### 4. Relatório
```
/relatorio tipo:streamers
```
ou
```
/relatorio tipo:balance
```

## 🌐 API REST

### Health Check
```bash
curl http://localhost:3000/api/health
```
Resposta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Obter Estatísticas
```bash
curl http://localhost:3000/api/stats
```
Resposta:
```json
{
  "success": true,
  "stats": {
    "totalStreamers": 5,
    "totalBalance": 500.00,
    "totalCommissions": 250.00,
    "totalSales": 10
  }
}
```

### Listar Afiliados
```bash
curl http://localhost:3000/api/affiliates
```
Resposta:
```json
{
  "success": true,
  "affiliates": [
    {
      "id": "AFF-12345678",
      "name": "StreamerName",
      "balance": 150.00,
      "totalCommission": 150.00
    }
  ]
}
```

### Dados de Afiliado
```bash
curl http://localhost:3000/api/affiliate/AFF-12345678
```
Resposta:
```json
{
  "success": true,
  "affiliate": {
    "id": "AFF-12345678",
    "name": "StreamerName",
    "balance": 150.00,
    "formattedBalance": "R$ 150,00",
    "totalSales": 2,
    "totalCommission": 150.00,
    "formattedCommission": "R$ 150,00",
    "status": "active"
  },
  "sales": [
    {
      "id": "SALE-87654321",
      "client": "Cliente1",
      "value": 100,
      "commission": 10,
      "date": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

## 🎫 Fluxo de Ticket

1. Usuário clica em "Abrir Ticket de Suporte"
2. Preenche modal:
   - Nome
   - Email
   - ID do Afiliado (opcional)
   - Descrição
3. Sistema cria:
   - Novo canal privado
   - Registro no banco de dados
   - Mensagem de boas-vindas
4. Admin pode responder no canal
5. Usar `/fechar-ticket` para encerrar
6. Canal é deletado após 5 segundos

## 💰 Fluxo de Venda

1. Admin executa `/processar-venda`
2. Sistema calcula comissão (10% do valor)
3. Registra no banco com follow-up
4. Log enviado para `#logs-vendas`
5. Após 5 dias, envia DM ao cliente
6. Afiliado recebe comissão no saldo

## 💸 Fluxo de Saque

1. Parceiro usa `/solicitar-saque`
2. Sistema valida saldo
3. Cria solicitação com status `pending`
4. Admin notificado em `#logs-gerais`
5. Admin usa `/aprovar-saque`
6. Saque marcado como aprovado
7. DM enviada ao parceiro
8. Saldo reduzido automaticamente

## 📊 Estrutura de Dados

### Sale Document
```json
{
  "saleId": "SALE-12345678",
  "clientName": "João",
  "price": 100,
  "affiliateId": "AFF-87654321",
  "affiliateCommission": 10,
  "status": "completed",
  "followUpDate": "2024-01-06",
  "followUpSent": false,
  "createdAt": "2024-01-01"
}
```

### Streamer Document
```json
{
  "discordId": "123456789",
  "username": "MeuStreamer",
  "affiliateId": "AFF-12345678",
  "balance": 150,
  "totalSales": 2,
  "totalCommission": 150,
  "status": "active"
}
```

### Withdraw Document
```json
{
  "withdrawId": "WITHDRAW-12345678",
  "streamerId": "123456789",
  "amount": 50,
  "method": "pix",
  "methodDetails": "123.456.789-00",
  "status": "pending"
}
```

## 🐛 Erros Comuns

### "Bot não encontra comando"
- Reinicie o bot
- Aguarde comandos carregar (até 1 minuto)
- Verifique permissões do bot

### "Erro ao conectar banco de dados"
- Verifique se MongoDB está rodando
- Confirme MONGO_URI no .env
- Teste com: `mongosh`

### "Permissão negada em comando admin"
- Usuário precisa ter role "Admin"
- Verifique case-sensitivity
- Role deve estar acima do bot na hierarquia

### "Ticket não criado"
- Bot precisa de permissão "Manage Channels"
- Verifique se categoria existe
- Confirme permissões no servidor

## ✅ Checklist de Teste

- [ ] Bot online e respondendo
- [ ] Comando /help funcionando
- [ ] Criar ticket via botão
- [ ] Criar parceiro com /criar-parceiro
- [ ] Processar venda com /processar-venda
- [ ] Solicitar saque com /solicitar-saque
- [ ] Aprovar saque com /aprovar-saque
- [ ] Consultar API /health
- [ ] Logs sendo registrados
- [ ] Follow-up scheduler ativo

---

**Tudo pronto? Comece a testar! 🚀**
