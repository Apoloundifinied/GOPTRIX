import express from 'express';
import { getStreamerByAffiliateId, getAllStreamers } from '../services/streamerService.js';
import { getSalesByAffiliate } from '../services/saleService.js';
import { formatCurrency } from '../utils/generators.js';

const router = express.Router();

// GET - Informações do afiliado
router.get('/affiliate/:affiliateId', async (req, res) => {
    try {
        const { affiliateId } = req.params;

        const streamer = await getStreamerByAffiliateId(affiliateId);

        if (!streamer) {
            return res.status(404).json({ error: 'Afiliado não encontrado' });
        }

        const sales = await getSalesByAffiliate(affiliateId);

        res.json({
            success: true,
            affiliate: {
                id: streamer.affiliateId,
                name: streamer.username,
                balance: streamer.balance,
                formattedBalance: formatCurrency(streamer.balance),
                totalSales: streamer.totalSales,
                totalCommission: streamer.totalCommission,
                formattedCommission: formatCurrency(streamer.totalCommission),
                status: streamer.status,
            },
            sales: sales.map(s => ({
                id: s.saleId,
                client: s.clientName,
                value: s.price,
                commission: s.affiliateCommission,
                date: s.createdAt,
            })),
        });
    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
});

// POST - Registrar nova venda via API
router.post('/post-sale', async (req, res) => {
    try {
        const { affiliateId, clientName, value, cfgFile } = req.body;

        if (!affiliateId || !clientName || !value) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const streamer = await getStreamerByAffiliateId(affiliateId);
        if (!streamer) {
            return res.status(404).json({ error: 'Afiliado não encontrado' });
        }

        // Aqui você integraria com o serviço de venda
        res.json({
            success: true,
            message: 'Venda registrada com sucesso',
            affiliate: streamer.affiliateId,
        });

    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
});

// GET - Listar todos os afiliados (admin)
router.get('/affiliates', async (req, res) => {
    try {
        const streamers = await getAllStreamers();

        res.json({
            success: true,
            affiliates: streamers.map(s => ({
                id: s.affiliateId,
                name: s.username,
                balance: s.balance,
                totalCommission: s.totalCommission,
            })),
        });

    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
}); export default router;
