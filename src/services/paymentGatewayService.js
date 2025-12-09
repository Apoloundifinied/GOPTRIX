import axios from 'axios';

const MP_BASE_URL = 'https://api.mercadopago.com';

export async function createPixPayment({ amount, description, payerEmail, externalReference, idempotencyKey }) {
    const accessToken = process.env.ACESS_TOKEN_MERCADO_PAGO;
    if (!accessToken) throw new Error('ACESS_TOKEN_MERCADO_PAGO não configurado');

    const url = `${MP_BASE_URL}/v1/payments`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Idempotency-Key': idempotencyKey || externalReference,
    };

    const body = {
        transaction_amount: Number(amount),
        description,
        payment_method_id: 'pix',
        external_reference: externalReference,
        binary_mode: true,
        notification_url: process.env.MP_NOTIFICATION_URL || undefined,
        payer: { email: payerEmail },
    };

    try {
        const { data } = await axios.post(url, body, { headers });
        const paymentId = data.id;
        const status = data.status;
        const qrCode = data.point_of_interaction?.transaction_data?.qr_code || null;
        const qrBase64 = data.point_of_interaction?.transaction_data?.qr_code_base64 || null;
        const ticketUrl = data.point_of_interaction?.transaction_data?.ticket_url || null;
        return { paymentId, status, qrCode, qrBase64, ticketUrl };
    } catch (err) {
        const status = err.response?.status;
        const resp = err.response?.data;
        throw new Error(`MercadoPago  error ${status}: ${JSON.stringify(resp)}`);
    }
}

export async function getPaymentStatus(paymentId) {
    const accessToken = process.env.ACESS_TOKEN_MERCADO_PAGO;
    if (!accessToken) throw new Error('ACESS_TOKEN_MERCADO_PAGO não configurado');

    const url = `${MP_BASE_URL}/v1/payments/${paymentId}`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const { data } = await axios.get(url, { headers });
    return {
        status: data.status,
        status_detail: data.status_detail,
        external_reference: data.external_reference || null,
        transaction_amount: data.transaction_amount || null,
        payer_email: data.payer?.email || null,
    };
}

export default { createPixPayment, getPaymentStatus };
