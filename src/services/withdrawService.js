import Withdraw from '../database/models/Withdraw.js';
import Streamer from '../database/models/Streamer.js';

export async function createWithdrawRequest(withdrawData) {
    try {
        const withdraw = await Withdraw.create(withdrawData);
        return withdraw;
    } catch (error) {
        console.error('Erro ao criar solicitação de saque:', error);
        throw error;
    }
}

export async function getPendingWithdraws() {
    try {
        const withdraws = await Withdraw.find({ status: 'pending' });
        return withdraws;
    } catch (error) {
        console.error('Erro ao obter saques pendentes:', error);
        throw error;
    }
}

export async function approveWithdraw(withdrawId, approvedBy) {
    try {
        const withdraw = await Withdraw.findOneAndUpdate(
            { withdrawId },
            {
                status: 'approved',
                approvedBy,
                approvalDate: new Date()
            },
            { new: true }
        );

        // Atualizar saldo do streamer
        await Streamer.findOneAndUpdate(
            { discordId: withdraw.streamerId },
            { $inc: { balance: -withdraw.amount } }
        );

        return withdraw;
    } catch (error) {
        console.error('Erro ao aprovar saque:', error);
        throw error;
    }
}

export async function rejectWithdraw(withdrawId, rejectionReason) {
    try {
        const withdraw = await Withdraw.findOneAndUpdate(
            { withdrawId },
            {
                status: 'rejected',
                rejectionReason
            },
            { new: true }
        );
        return withdraw;
    } catch (error) {
        console.error('Erro ao rejeitar saque:', error);
        throw error;
    }
}

export async function completeWithdraw(withdrawId) {
    try {
        const withdraw = await Withdraw.findOneAndUpdate(
            { withdrawId },
            {
                status: 'completed',
                completedAt: new Date()
            },
            { new: true }
        );
        return withdraw;
    } catch (error) {
        console.error('Erro ao completar saque:', error);
        throw error;
    }
}
