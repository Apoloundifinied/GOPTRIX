/**
 * Animation Utilities for Discord Embeds
 * Provides animated loading states, progress bars, and enhanced formatting
 */

/**
 * Create an animated loading embed
 * @param {string} title - Title of the embed
 * @param {string} description - Description/status text
 * @returns {Object} EmbedBuilder configuration
 */
export function createLoadingEmbed(title, description) {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const randomSpinner = spinner[Math.floor(Math.random() * spinner.length)];

    return {
        color: 0x3498db,
        title: `${randomSpinner} ${title}`,
        description: description || '⏳ Processando...',
        timestamp: new Date()
    };
}

/**
 * Create a success embed with animation
 * @param {string} title - Title of the embed
 * @param {string} description - Success message
 * @param {Array} fields - Optional fields array
 * @returns {Object} EmbedBuilder configuration
 */
export function createSuccessEmbed(title, description, fields = []) {
    return {
        color: 0x2ecc71,
        title: `✅ ${title}`,
        description: description,
        fields: fields,
        timestamp: new Date(),
        thumbnail: {
            url: 'https://media.giphy.com/media/l0HlJy9x8FZo0XO1i/giphy.gif'
        }
    };
}

/**
 * Create an error embed with animation
 * @param {string} title - Title of the embed
 * @param {string} description - Error message
 * @returns {Object} EmbedBuilder configuration
 */
export function createErrorEmbed(title, description) {
    return {
        color: 0xe74c3c,
        title: `❌ ${title}`,
        description: description,
        timestamp: new Date()
    };
}

/**
 * Create a progress bar embed for tracking operations
 * @param {number} current - Current progress
 * @param {number} total - Total progress amount
 * @param {string} label - Progress label
 * @returns {string} Formatted progress bar
 */
export function createProgressBar(current, total, label = 'Progresso') {
    const percentage = Math.round((current / total) * 100);
    const filledBars = Math.round((percentage / 10));
    const emptyBars = 10 - filledBars;

    const bar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);
    const progressBar = `
        ${label}: ${percentage}%
        [${bar}]
        ${current}/${total}
    `;

    return progressBar.trim();
}

/**
 * Create an info embed with animation
 * @param {string} title - Title of the embed
 * @param {string} description - Info message
 * @param {Array} fields - Optional fields array
 * @returns {Object} EmbedBuilder configuration
 */
export function createInfoEmbed(title, description, fields = []) {
    return {
        color: 0x3498db,
        title: `ℹ️ ${title}`,
        description: description,
        fields: fields,
        timestamp: new Date()
    };
}

/**
 * Create a warning embed with animation
 * @param {string} title - Title of the embed
 * @param {string} description - Warning message
 * @returns {Object} EmbedBuilder configuration
 */
export function createWarningEmbed(title, description) {
    return {
        color: 0xf39c12,
        title: `⚠️ ${title}`,
        description: description,
        timestamp: new Date()
    };
}

/**
 * Create an animated transaction embed
 * @param {string} type - Type of transaction (sale, withdrawal, order)
 * @param {Object} data - Transaction data
 * @returns {Object} EmbedBuilder configuration
 */
export function createTransactionEmbed(type, data) {
    const icons = {
        sale: '💰',
        withdrawal: '🏧',
        order: '📦',
        commission: '🎁'
    };

    const icon = icons[type] || '💳';

    return {
        color: 0x9b59b6,
        title: `${icon} Transação ${type.toUpperCase()}`,
        description: `**Status**: ${data.status}`,
        fields: [
            { name: 'ID', value: data.id || 'N/A', inline: true },
            { name: 'Valor', value: `R$ ${data.amount || '0.00'}`, inline: true },
            { name: 'Data', value: new Date().toLocaleDateString('pt-BR'), inline: true }
        ],
        timestamp: new Date()
    };
}

/**
 * Create a profile card embed with animation
 * @param {Object} user - User data
 * @returns {Object} EmbedBuilder configuration
 */
export function createProfileEmbed(user) {
    return {
        color: 0x2c3e50,
        title: `👤 ${user.username}'s Profile Card`,
        thumbnail: { url: user.avatar },
        fields: [
            { name: '💰 Balance', value: `R$ ${user.balance || '0.00'}`, inline: true },
            { name: '🎁 Total Commission', value: `R$ ${user.commission || '0.00'}`, inline: true },
            { name: '📊 Total Sales', value: user.sales || '0', inline: true },
            { name: '🆔 Affiliate ID', value: user.affiliateId || 'Not registered', inline: true },
            { name: '📅 Member Since', value: user.joinDate || 'N/A', inline: true },
            { name: '⭐ Status', value: user.status || 'Active', inline: true }
        ],
        footer: { text: '© GOP TRIX | Sistema Profissional' },
        timestamp: new Date()
    };
}

/**
 * Create an animated button panel embed
 * @param {string} title - Panel title
 * @param {string} description - Panel description
 * @param {Array} options - Array of options with emojis
 * @returns {Object} EmbedBuilder configuration
 */
export function createButtonPanelEmbed(title, description, options = []) {
    const optionText = options.map((opt, idx) => `${opt.emoji} **${idx + 1}.** ${opt.label}`).join('\n');

    return {
        color: 0x8e44ad,
        title: `🎯 ${title}`,
        description: `${description}\n\n${optionText}`,
        timestamp: new Date()
    };
}

/**
 * Create a leaderboard embed with animation
 * @param {string} title - Leaderboard title
 * @param {Array} entries - Array of {rank, name, value} objects
 * @returns {Object} EmbedBuilder configuration
 */
export function createLeaderboardEmbed(title, entries = []) {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    const leaderboard = entries
        .slice(0, 5)
        .map((entry, idx) => {
            const medal = medals[idx] || `#${idx + 1}`;
            return `${medal} **${entry.name}** - R$ ${entry.value}`;
        })
        .join('\n');

    return {
        color: 0xf1c40f,
        title: `🏆 ${title}`,
        description: leaderboard || 'Nenhuma entrada',
        timestamp: new Date()
    };
}

/**
 * Create a status indicator with animation
 * @param {string} status - Status text
 * @param {string} statusType - online, idle, dnd, offline
 * @returns {string} Formatted status string
 */
export function createStatusIndicator(status, statusType = 'online') {
    const indicators = {
        online: '🟢',
        idle: '🟡',
        dnd: '🔴',
        offline: '⚫'
    };

    return `${indicators[statusType] || '⚫'} **${status}**`;
}

/**
 * Add animated field to embed
 * @param {Object} embed - Embed object
 * @param {string} name - Field name with animation
 * @param {string} value - Field value
 * @param {boolean} inline - Inline status
 * @returns {Object} Updated embed
 */
export function addAnimatedField(embed, name, value, inline = false) {
    if (!embed.fields) {
        embed.fields = [];
    }

    embed.fields.push({
        name: `✨ ${name}`,
        value: value,
        inline: inline
    });

    return embed;
}

/**
 * Create a loading message with animation frames
 * @returns {Array} Array of animation frames
 */
export function getLoadingAnimation() {
    return [
        '```🔄 Carregando...     ```',
        '```🔄 Carregando..      ```',
        '```🔄 Carregando.       ```',
        '```🔄 Carregando        ```'
    ];
}

/**
 * Create a payment animation sequence
 * @param {string} method - Payment method (pix, cartao, etc)
 * @returns {Array} Array of animation states
 */
export function getPaymentAnimation(method = 'pix') {
    return [
        `⏳ Processando pagamento via ${method}...`,
        `⏳ Validando dados...`,
        `⏳ Aguardando confirmação...`,
        `✅ Pagamento recebido!`
    ];
}

export default {
    createLoadingEmbed,
    createSuccessEmbed,
    createErrorEmbed,
    createProgressBar,
    createInfoEmbed,
    createWarningEmbed,
    createTransactionEmbed,
    createProfileEmbed,
    createButtonPanelEmbed,
    createLeaderboardEmbed,
    createStatusIndicator,
    addAnimatedField,
    getLoadingAnimation,
    getPaymentAnimation
};
