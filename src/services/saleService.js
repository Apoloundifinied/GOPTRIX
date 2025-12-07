import Sale from '../database/models/Sale.js';
import Streamer from '../database/models/Streamer.js';
import { addDays } from '../utils/dateUtils.js';

export async function createSale(saleData) {
    try {
        const sale = await Sale.create(saleData);

        // Update affiliate commission if exists
        if (saleData.affiliateId) {
            await Streamer.findOneAndUpdate(
                { affiliateId: saleData.affiliateId },
                {
                    $inc: {
                        totalCommission: saleData.affiliateCommission,
                        balance: saleData.affiliateCommission,
                        totalSales: 1
                    }
                }
            );
        }

        return sale;
    } catch (error) {
        console.error('Erro ao criar venda:', error);
        throw error;
    }
}

export async function getSale(saleId) {
    try {
        const sale = await Sale.findOne({ saleId });
        return sale;
    } catch (error) {
        console.error('Erro ao obter venda:', error);
        throw error;
    }
}

export async function getSalesByAffiliate(affiliateId) {
    try {
        const sales = await Sale.find({ affiliateId });
        return sales;
    } catch (error) {
        console.error('Erro ao obter vendas do afiliado:', error);
        throw error;
    }
}

export async function getPendingFollowUps() {
    try {
        const sales = await Sale.find({
            followUpSent: false,
            followUpDate: { $lte: new Date() }
        });
        return sales;
    } catch (error) {
        console.error('Erro ao obter follow-ups pendentes:', error);
        throw error;
    }
}

export async function markFollowUpSent(saleId) {
    try {
        const sale = await Sale.findOneAndUpdate(
            { saleId },
            { followUpSent: true },
            { new: true }
        );
        return sale;
    } catch (error) {
        console.error('Erro ao marcar follow-up como enviado:', error);
        throw error;
    }
}

export async function createSaleWithFollowUp(saleData) {
    try {
        const followUpDate = addDays(new Date(), 5);
        const saleWithFollowUp = {
            ...saleData,
            followUpDate
        };

        return await createSale(saleWithFollowUp);
    } catch (error) {
        console.error('Erro ao criar venda com follow-up:', error);
        throw error;
    }
}
