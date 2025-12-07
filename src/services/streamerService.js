import Streamer from '../database/models/Streamer.js';
import { generateAffiliateId } from '../utils/generators.js';

export async function createStreamer(streamerData) {
    try {
        const affiliateId = generateAffiliateId();
        const streamer = await Streamer.create({
            ...streamerData,
            affiliateId,
        });
        return streamer;
    } catch (error) {
        console.error('Erro ao criar streamer:', error);
        throw error;
    }
}

export async function getStreamer(discordId) {
    try {
        const streamer = await Streamer.findOne({ discordId });
        return streamer;
    } catch (error) {
        console.error('Erro ao obter streamer:', error);
        throw error;
    }
}

export async function getStreamerByAffiliateId(affiliateId) {
    try {
        const streamer = await Streamer.findOne({ affiliateId });
        return streamer;
    } catch (error) {
        console.error('Erro ao obter streamer por affiliate ID:', error);
        throw error;
    }
}

export async function updateStreamerBalance(discordId, amount) {
    try {
        const streamer = await Streamer.findOneAndUpdate(
            { discordId },
            { $inc: { balance: amount } },
            { new: true }
        );
        return streamer;
    } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        throw error;
    }
}

export async function getAllStreamers() {
    try {
        const streamers = await Streamer.find();
        return streamers;
    } catch (error) {
        console.error('Erro ao obter todos os streamers:', error);
        throw error;
    }
}

export async function getActiveStreamers() {
    try {
        const streamers = await Streamer.find({ status: 'active' });
        return streamers;
    } catch (error) {
        console.error('Erro ao obter streamers ativos:', error);
        throw error;
    }
}
