import dayjs from 'dayjs';
import 'dayjs/locale/pt-br.js';

dayjs.locale('pt-br');

export function getFormattedDate(date = new Date()) {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
}

export function addDays(date, days) {
    return dayjs(date).add(days, 'day').toDate();
}

export function getDaysDifference(date1, date2) {
    return dayjs(date2).diff(dayjs(date1), 'day');
}

export function isDatePassed(date) {
    return dayjs(date).isBefore(dayjs());
}
