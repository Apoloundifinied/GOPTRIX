import Schedule from '../database/models/Schedule.js';

export async function createSchedule(scheduleData) {
    try {
        const schedule = await Schedule.create(scheduleData);
        return schedule;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
    }
}

export async function getPendingSchedules() {
    try {
        const schedules = await Schedule.find({ status: 'pending' });
        return schedules;
    } catch (error) {
        console.error('Erro ao obter agendamentos pendentes:', error);
        throw error;
    }
}

export async function approveSchedule(scheduleId, approvedBy) {
    try {
        const schedule = await Schedule.findOneAndUpdate(
            { scheduleId },
            {
                status: 'approved',
                approvedBy,
                approvalDate: new Date()
            },
            { new: true }
        );
        return schedule;
    } catch (error) {
        console.error('Erro ao aprovar agendamento:', error);
        throw error;
    }
}

export async function rejectSchedule(scheduleId) {
    try {
        const schedule = await Schedule.findOneAndUpdate(
            { scheduleId },
            { status: 'rejected' },
            { new: true }
        );
        return schedule;
    } catch (error) {
        console.error('Erro ao rejeitar agendamento:', error);
        throw error;
    }
}

export async function completeSchedule(scheduleId) {
    try {
        const schedule = await Schedule.findOneAndUpdate(
            { scheduleId },
            { status: 'completed' },
            { new: true }
        );
        return schedule;
    } catch (error) {
        console.error('Erro ao completar agendamento:', error);
        throw error;
    }
}
