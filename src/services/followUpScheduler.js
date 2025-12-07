import cron from 'node-cron';
import { getPendingFollowUps, markFollowUpSent } from '../services/saleService.js';
import { createSuccessEmbed } from '../utils/embedBuilders.js';

export function startFollowUpScheduler(client) {
    // Executa a cada 6 horas
    cron.schedule('0 */6 * * *', async () => {
        try {
            console.log('⏰ Verificando follow-ups pendentes...');

            const pendingFollowUps = await getPendingFollowUps();

            if (pendingFollowUps.length === 0) {
                console.log('✅ Nenhum follow-up pendente');
                return;
            }

            for (const sale of pendingFollowUps) {
                try {
                    const user = await client.users.fetch(sale.clientId);

                    const followUpEmbed = createSuccessEmbed(
                        '✨ Agradecimento pela Compra!',
                        `Olá ${sale.clientName}!\n\nAgradecemos sua compra de **CFG** há alguns dias!\n\nSe tiver alguma dúvida ou precisar de suporte, não hesite em entrar em contato conosco.\n\nÉ um prazer tê-lo como cliente! 🎮`
                    );

                    await user.send({ embeds: [followUpEmbed] });
                    await markFollowUpSent(sale.saleId);

                    console.log(`✅ Follow-up enviado para ${sale.clientName}`);

                } catch (error) {
                    console.error(`Erro ao enviar follow-up para ${sale.clientName}:`, error);
                }
            }

            console.log(`✅ ${pendingFollowUps.length} follow-up(s) processado(s)`);

        } catch (error) {
            console.error('❌ Erro no scheduler de follow-up:', error);
        }
    });

    console.log('✅ Scheduler de follow-up iniciado!');
}
