/**
 * 📦 CATÁLOGO CENTRALIZADO DE PRODUTOS
 * Todos os produtos disponíveis na loja
 */

export const PRODUCTS_CATALOG = {
    otim_basic: {
        id: 'otim-basic',
        name: 'Otimização Básica',
        category: 'Otimização',
        subcategory: 'Método Manual',
        price: 49,
        description: 'Otimização básica do sistema operacional',
        emoji: '📊',
        details: 'Limpeza e otimização básica',
        type: 'service'
    },

    otim_sovietic: {
        id: 'otim-sovietic',
        name: 'Sovietic Method',
        category: 'Otimização',
        subcategory: 'Método Avançado',
        price: 89,
        description: 'Método Sovietic - Otimização profissional avançada',
        emoji: '🔧',
        details: 'Otimização avançada com resultados comprovados',
        type: 'service'
    },

    otim_avancada: {
        id: 'otim-avancada',
        name: 'Otimização Avançada (Ao Vivo)',
        category: 'Otimização',
        subcategory: 'Ao Vivo',
        price: 129,
        description: 'Otimização avançada ao vivo com suporte',
        emoji: '💻',
        details: 'Sessão ao vivo de otimização via atendimento',
        type: 'service_live'
    },

    otim_ultra_bios: {
        id: 'otim-ultra-bios',
        name: 'Otimização Ultra + BIOS',
        category: 'Otimização',
        subcategory: 'Ao Vivo',
        price: 199,
        description: 'Otimização Ultra com ajustes de BIOS',
        emoji: '⚡',
        details: 'Máxima performance com ajustes avançados',
        type: 'service_live_bios'
    }
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
