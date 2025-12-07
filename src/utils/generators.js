import { v4 as uuidv4 } from 'uuid';

export function generateAffiliateId() {
    return `AFF-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateSaleId() {
    return `SALE-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateWithdrawId() {
    return `WITHDRAW-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateScheduleId() {
    return `SCHEDULE-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateTicketId() {
    return `TICKET-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export function parseAffiliateId(input) {
    return input?.trim().toUpperCase() || null;
}
