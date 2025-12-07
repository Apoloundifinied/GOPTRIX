/**
 * 📦 CATÁLOGO CENTRALIZADO DE PRODUTOS
 * Todos os produtos disponíveis na loja
 */

export const PRODUCTS_CATALOG = {
    // ═══════════════════════════════════════
    // 🎮 CFG - CONFIGURAÇÕES PRONTAS
    // ═══════════════════════════════════════
    cfg_clean: {
        id: 'cfg-clean',
        name: 'CFG Clean',
        category: 'CFG',
        subcategory: 'Configuração',
        price: 35,
        description: 'Configuração limpa e otimizada para máximas de desempenho',
        emoji: '⚙️',
        details: 'CFG padrão otimizada para FPS máximo',
        type: 'digital'
    },

    cfg_easync: {
        id: 'cfg-easync',
        name: 'CFG Easync',
        category: 'CFG',
        subcategory: 'Configuração',
        price: 50,
        description: 'Configuração Easync com renderização aprimorada',
        emoji: '⚡',
        details: 'CFG com Easync ativado para melhor sincronização',
        type: 'digital'
    },

    cfg_fps_pack: {
        id: 'cfg-fps-pack',
        name: 'CFG FPS Pack v1',
        category: 'CFG',
        subcategory: 'Otimização',
        price: 65,
        description: 'Pack completo de otimização FPS v1 com métodos comprovados',
        emoji: '🚀',
        details: 'CFG FPS Pack de Otimização v1 - Máximo desempenho',
        type: 'digital'
    },

    // ═══════════════════════════════════════
    // 🔧 OTIMIZAÇÃO - MÉTODOS DIVERSOS
    // ═══════════════════════════════════════
    otim_basic: {
        id: 'otim-basic',
        name: 'Otimização Básica',
        category: 'Otimização',
        subcategory: 'Método Manual',
        price: 0.12,
        description: 'Otimização básica do sistema operacional',
        emoji: '📊',
        details: 'Limpeza e otimização básica - Perfeito para iniciantes',
        type: 'service'
    },

    otim_sovietic: {
        id: 'otim-sovietic',
        name: 'Sovietic Method',
        category: 'Otimização',
        subcategory: 'Método Avançado',
        price: 55,
        description: 'Método Sovietic - Otimização profissional avançada',
        emoji: '🔴',
        details: 'Método Sovietic de otimização - Resultados garantidos',
        type: 'service'
    },

    otim_avancada: {
        id: 'otim-avancada',
        name: 'Otimização Avançada',
        category: 'Otimização',
        subcategory: 'Ao Vivo',
        price: 85,
        description: 'Otimização avançada ao vivo via Anydask - Suporte em tempo real',
        emoji: '💻',
        details: 'Otimização profissional com suporte ao vivo via Anydask',
        type: 'service_live'
    },

    otim_ultra_bios: {
        id: 'otim-ultra-bios',
        name: 'Otimização Ultra + BIOS',
        category: 'Otimização',
        subcategory: 'Ao Vivo',
        price: 150,
        description: 'Otimização Ultra com modificação de BIOS ao vivo via Anydask',
        emoji: '⚡🔧',
        details: 'Otimização Ultra + BIOS - Máxima performance com suporte ao vivo',
        type: 'service_live_bios'
    },

    // ═══════════════════════════════════════
    // 💾 CLIENTES & FERRAMENTAS
    // ═══════════════════════════════════════
    client_license: {
        id: 'client-license',
        name: 'Client',
        category: 'Cliente',
        subcategory: 'Software',
        price: 20,
        description: 'Client - License de uso',
        emoji: '📱',
        details: 'Client para uso pessoal',
        type: 'digital'
    },

    // ═══════════════════════════════════════
    // 📦 PACOTES ESPECIAIS
    // ═══════════════════════════════════════
    // Pode adicionar pacotes no futuro
};

/**
 * 🏷️ Obter produto por ID
 */
export function getProductById(productId) {
    return Object.values(PRODUCTS_CATALOG).find(p => p.id === productId);
}

/**
 * 📂 Agrupar produtos por categoria
 */
export function getProductsByCategory(category) {
    return Object.values(PRODUCTS_CATALOG).filter(p => p.category === category);
}

/**
 * 📊 Obter todas as categorias
 */
export function getAllCategories() {
    const categories = new Set();
    Object.values(PRODUCTS_CATALOG).forEach(p => {
        categories.add(p.category);
    });
    return Array.from(categories);
}

/**
 * 🔍 Buscar produto por nome (parcial)
 */
export function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(PRODUCTS_CATALOG).filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * 💰 Obter preço formatado
 */
export function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export default PRODUCTS_CATALOG;
