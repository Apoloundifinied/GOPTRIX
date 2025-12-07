import express from 'express';
import { getAllStreamers } from '../services/streamerService.js';

const router = express.Router();

// GET - Estatísticas gerais
router.get('/stats', async (req, res) => {
    try {
        const streamers = await getAllStreamers();

        let totalBalance = 0;
        let totalCommissions = 0;
        let totalSales = 0;

        streamers.forEach(s => {
            totalBalance += s.balance;
            totalCommissions += s.totalCommission;
            totalSales += s.totalSales;
        });

        res.json({
            success: true,
            stats: {
                totalStreamers: streamers.length,
                totalBalance,
                totalCommissions,
                totalSales,
            },
        });

    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
});// GET - Health check
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

export default router;
