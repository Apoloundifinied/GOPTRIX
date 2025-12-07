#!/bin/bash
# ✅ Script de Verificação Final - GOP TRIX BOT

echo "=================================================="
echo "🔍 Verificação Final - GOP TRIX BOT"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Função para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((failed++))
    fi
}

# 1. Verificar Node.js
echo "📦 Verificando Node.js..."
node -v > /dev/null 2>&1
check "Node.js instalado"

# 2. Verificar npm
echo ""
echo "📦 Verificando npm..."
npm -v > /dev/null 2>&1
check "npm instalado"

# 3. Verificar estrutura de pastas
echo ""
echo "📁 Verificando estrutura de pastas..."
[ -d "src/commands" ] && check "Pasta src/commands existe" || echo -e "${RED}❌ Pasta src/commands não encontrada${NC}"
[ -d "src/events" ] && check "Pasta src/events existe" || echo -e "${RED}❌ Pasta src/events não encontrada${NC}"
[ -d "src/services" ] && check "Pasta src/services existe" || echo -e "${RED}❌ Pasta src/services não encontrada${NC}"
[ -d "src/database" ] && check "Pasta src/database existe" || echo -e "${RED}❌ Pasta src/database não encontrada${NC}"
[ -d "src/routes" ] && check "Pasta src/routes existe" || echo -e "${RED}❌ Pasta src/routes não encontrada${NC}"

# 4. Verificar arquivos principais
echo ""
echo "📄 Verificando arquivos principais..."
[ -f "index.js" ] && check "index.js existe" || echo -e "${RED}❌ index.js não encontrado${NC}"
[ -f "package.json" ] && check "package.json existe" || echo -e "${RED}❌ package.json não encontrado${NC}"
[ -f ".env" ] && check ".env existe" || echo -e "${YELLOW}⚠️ .env não encontrado (crie um)${NC}"
[ -f "README.md" ] && check "README.md existe" || echo -e "${RED}❌ README.md não encontrado${NC}"

# 5. Verificar comandos
echo ""
echo "🎯 Verificando comandos..."
[ -f "src/commands/help.js" ] && check "help.js existe" || echo -e "${RED}❌ help.js não encontrado${NC}"
[ -f "src/commands/criar-parceiro.js" ] && check "criar-parceiro.js existe" || echo -e "${RED}❌ criar-parceiro.js não encontrado${NC}"
[ -f "src/commands/processar-venda.js" ] && check "processar-venda.js existe" || echo -e "${RED}❌ processar-venda.js não encontrado${NC}"
[ -f "src/commands/agendar.js" ] && check "agendar.js existe" || echo -e "${RED}❌ agendar.js não encontrado${NC}"
[ -f "src/commands/painel-admin.js" ] && check "painel-admin.js existe" || echo -e "${RED}❌ painel-admin.js não encontrado${NC}"

# 6. Verificar eventos
echo ""
echo "⚡ Verificando eventos..."
[ -f "src/events/ready.js" ] && check "ready.js existe" || echo -e "${RED}❌ ready.js não encontrado${NC}"
[ -f "src/events/interactionCreate.js" ] && check "interactionCreate.js existe" || echo -e "${RED}❌ interactionCreate.js não encontrado${NC}"
[ -f "src/events/guildMemberAdd.js" ] && check "guildMemberAdd.js existe" || echo -e "${RED}❌ guildMemberAdd.js não encontrado${NC}"

# 7. Verificar serviços
echo ""
echo "🔧 Verificando serviços..."
[ -f "src/services/ticketService.js" ] && check "ticketService.js existe" || echo -e "${RED}❌ ticketService.js não encontrado${NC}"
[ -f "src/services/saleService.js" ] && check "saleService.js existe" || echo -e "${RED}❌ saleService.js não encontrado${NC}"
[ -f "src/services/streamerService.js" ] && check "streamerService.js existe" || echo -e "${RED}❌ streamerService.js não encontrado${NC}"
[ -f "src/services/withdrawService.js" ] && check "withdrawService.js existe" || echo -e "${RED}❌ withdrawService.js não encontrado${NC}"
[ -f "src/services/followUpScheduler.js" ] && check "followUpScheduler.js existe" || echo -e "${RED}❌ followUpScheduler.js não encontrado${NC}"

# 8. Verificar modelos
echo ""
echo "💾 Verificando modelos..."
[ -f "src/database/models/User.js" ] && check "User.js existe" || echo -e "${RED}❌ User.js não encontrado${NC}"
[ -f "src/database/models/Streamer.js" ] && check "Streamer.js existe" || echo -e "${RED}❌ Streamer.js não encontrado${NC}"
[ -f "src/database/models/Sale.js" ] && check "Sale.js existe" || echo -e "${RED}❌ Sale.js não encontrado${NC}"
[ -f "src/database/models/Withdraw.js" ] && check "Withdraw.js existe" || echo -e "${RED}❌ Withdraw.js não encontrado${NC}"

# 9. Verificar documentação
echo ""
echo "📚 Verificando documentação..."
[ -f "SETUP.md" ] && check "SETUP.md existe" || echo -e "${RED}❌ SETUP.md não encontrado${NC}"
[ -f "EXAMPLES.md" ] && check "EXAMPLES.md existe" || echo -e "${RED}❌ EXAMPLES.md não encontrado${NC}"
[ -f "DEPLOYMENT.md" ] && check "DEPLOYMENT.md existe" || echo -e "${RED}❌ DEPLOYMENT.md não encontrado${NC}"
[ -f "PROJETO_RESUMO.md" ] && check "PROJETO_RESUMO.md existe" || echo -e "${RED}❌ PROJETO_RESUMO.md não encontrado${NC}"

# 10. Verificar .env
echo ""
echo "🔐 Verificando .env..."
if [ -f ".env" ]; then
    grep -q "TOKEN=" .env && check "TOKEN definido no .env" || echo -e "${YELLOW}⚠️ TOKEN não definido no .env${NC}"
    grep -q "CLIENT_ID=" .env && check "CLIENT_ID definido no .env" || echo -e "${YELLOW}⚠️ CLIENT_ID não definido no .env${NC}"
    grep -q "MONGO_URI=" .env && check "MONGO_URI definido no .env" || echo -e "${YELLOW}⚠️ MONGO_URI não definido no .env${NC}"
else
    echo -e "${YELLOW}⚠️ Arquivo .env não encontrado${NC}"
    echo "   Crie um .env com: TOKEN, CLIENT_ID, CLIENT_SECRET, MONGO_URI"
fi

# Resumo Final
echo ""
echo "=================================================="
echo -e "📊 Resumo Final"
echo "=================================================="
echo -e "${GREEN}✅ Passou: $passed${NC}"
echo -e "${RED}❌ Falhou: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo pronto! Bot está configurado corretamente!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Configure o .env com seus valores"
    echo "2. Execute: npm install"
    echo "3. Execute: npm start"
    echo "4. Use /help no Discord"
else
    echo -e "${RED}⚠️ Existem problemas a serem resolvidos${NC}"
    echo "Veja SETUP.md para instruções completas"
fi

echo ""
echo "=================================================="
