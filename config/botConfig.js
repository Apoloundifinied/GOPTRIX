// config/botConfig.js
export const BOT_CONFIG = {
    // Cores dos Embeds
    colors: {
        success: '0x2ecc71',
        error: '0xe74c3c',
        info: '0x3498db',
        warning: '0xf39c12',
    },

    // Comissão de Afiliado (em percentual)
    affiliateCommission: 0.10, // 10%

    // Follow-up (em dias)
    followUpDays: 5,

    // Scheduler
    followUpCheckInterval: '0 */6 * * *', // A cada 6 horas

    // Nomes de Canais
    channels: {
        logs_vendas: 'logs-vendas',
        logs_gerais: 'logs-gerais',
        logs_erros: 'logs-erros',
        botoes: 'botoes',
    },

    // Nomes de Roles
    roles: {
        admin: 'Admin',
        staff: 'Staff',
        streamer: 'Streamer',
        membro: 'Membro',
    },

    // Tipos de Ticket
    ticketTypes: {
        support: 'support',
        sales: 'sales',
        optimization: 'optimization',
        other: 'other',
    },

    // Tipos de Serviço
    serviceTypes: [
        { name: 'Otimização de PC', value: 'Otimização de PC' },
        { name: 'Consultoria', value: 'Consultoria' },
        { name: 'Suporte Técnico', value: 'Suporte Técnico' },
    ],

    // Métodos de Saque
    withdrawMethods: {
        pix: 'PIX',
        bank: 'Transferência Bancária',
        wallet: 'Carteira Digital',
    },

    // Status
    statuses: {
        active: 'active',
        inactive: 'inactive',
        suspended: 'suspended',
    },

    // Mensagens Padrão
    messages: {
        welcome: 'Bem-vindo ao GOP TRIX BOT!',
        ticketCreated: 'Ticket criado com sucesso!',
        saleProcessed: 'Venda processada com sucesso!',
        error: 'Ocorreu um erro ao processar sua solicitação.',
    },
};

export default BOT_CONFIG;
