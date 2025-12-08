import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';

async function ensureRole(guild, name, permissions, color) {
    const existing = guild.roles.cache.find(r => r.name === name);
    if (existing) return existing;
    const role = await guild.roles.create({ name, permissions, color });
    return role;
}

async function ensureCategory(guild, name, overwrites) {
    const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === name);
    if (existing) return existing;
    return guild.channels.create({ name, type: ChannelType.GuildCategory, permissionOverwrites: overwrites });
}

async function ensureChannel(guild, name, type, parent, overwrites) {
    const existing = guild.channels.cache.find(c => c.name === name && c.type === type);
    if (existing) return existing;
    return guild.channels.create({ name, type, parent: parent?.id, permissionOverwrites: overwrites });
}

export default {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('Cria cargos e canais padronizados para o bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: 64 });
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.editReply({ content: 'Apenas administradores podem usar este comando.' });
            return;
        }

        const guild = interaction.guild;
        const everyone = guild.roles.everyone;

        const admin = await ensureRole(guild, 'Administrador', PermissionFlagsBits.Administrator, 0xff4757);
        const staff = await ensureRole(guild, 'Staff Otimização', (
            PermissionFlagsBits.ManageGuild |
            PermissionFlagsBits.ManageChannels |
            PermissionFlagsBits.ManageMessages |
            PermissionFlagsBits.ManageNicknames
        ), 0x1abc9c);
        const mod = await ensureRole(guild, 'Moderador', (
            PermissionFlagsBits.ManageMessages |
            PermissionFlagsBits.ManageNicknames |
            PermissionFlagsBits.ModerateMembers |
            PermissionFlagsBits.KickMembers
        ), 0xf1c40f);
        const support = await ensureRole(guild, 'Suporte', 0, 0x9b59b6);
        await ensureRole(guild, 'Cliente', 0, 0x2ecc71);
        await ensureRole(guild, 'Verificado', 0, 0x3498db);
        await ensureRole(guild, 'Muted', 0, 0x95a5a6);
        await ensureRole(guild, 'Ping', 0, 0xe67e22);
        await ensureRole(guild, 'VIP', 0, 0x8e44ad);

        const catEntrada = await ensureCategory(guild, '📥 Entrada', []);
        const catClientes = await ensureCategory(guild, '🧑‍💻 Clientes', []);
        const catFila = await ensureCategory(guild, '⏳ Fila e Atendimento', []);
        const catSuporte = await ensureCategory(guild, '🛟 Suporte', []);
        const catStaff = await ensureCategory(guild, '🛠️ Staff', [
            { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: admin.id, allow: [PermissionFlagsBits.ViewChannel] },
            { id: staff.id, allow: [PermissionFlagsBits.ViewChannel] }
        ]);
        const catPrivado = await ensureCategory(guild, '🔒 Atendimento Privado', [
            { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: admin.id, allow: [PermissionFlagsBits.ViewChannel] },
            { id: staff.id, allow: [PermissionFlagsBits.ViewChannel] },
            { id: support.id, allow: [PermissionFlagsBits.ViewChannel] }
        ]);

        await ensureChannel(guild, 'boas-vindas', ChannelType.GuildText, catEntrada, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'regras', ChannelType.GuildText, catEntrada, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
            { id: admin.id, allow: [PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'anuncios', ChannelType.GuildText, catEntrada, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
            { id: admin.id, allow: [PermissionFlagsBits.SendMessages] },
            { id: staff.id, allow: [PermissionFlagsBits.SendMessages] }
        ]);

        await ensureChannel(guild, 'loja', ChannelType.GuildText, catClientes, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'como-comprar-otimizacao', ChannelType.GuildText, catClientes, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'enviar-comprovante', ChannelType.GuildText, catClientes, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'abrir-ticket', ChannelType.GuildText, catClientes, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);

        await ensureChannel(guild, 'fila-status', ChannelType.GuildText, catFila, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'otimizacao-fila', ChannelType.GuildText, catFila, [
            { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: admin.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: staff.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'pedidos-pendentes', ChannelType.GuildText, catFila, [
            { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: admin.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: staff.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ]);

        await ensureChannel(guild, 'faq', ChannelType.GuildText, catSuporte, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
            { id: staff.id, allow: [PermissionFlagsBits.SendMessages] },
            { id: admin.id, allow: [PermissionFlagsBits.SendMessages] }
        ]);
        await ensureChannel(guild, 'suporte', ChannelType.GuildText, catSuporte, [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            { id: mod.id, allow: [PermissionFlagsBits.ManageMessages] },
            { id: staff.id, allow: [PermissionFlagsBits.ManageMessages] }
        ]);

        await ensureChannel(guild, 'admin-pedidos', ChannelType.GuildText, catStaff, []);
        await ensureChannel(guild, 'admin-fila', ChannelType.GuildText, catStaff, []);
        await ensureChannel(guild, 'admin-log', ChannelType.GuildText, catStaff, []);
        await ensureChannel(guild, 'dashboard-admin', ChannelType.GuildText, catStaff, []);

        await interaction.editReply({ content: 'Estrutura criada/atualizada com sucesso.' });
    }
};
