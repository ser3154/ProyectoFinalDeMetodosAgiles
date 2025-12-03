const axios = require('axios');

// Función interna para obtener el token (no se exporta)
async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    });
    return response.data.access_token;
}

exports.createOrder = async (orderData) => {
    const accessToken = await generateAccessToken();
    
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: orderData.currency || 'USD',
                    value: orderData.total,
                },
                description: orderData.description
            }],
            application_context: {
                return_url: process.env.BASE_URL + '/api/paypal/complete-order',
                cancel_url: process.env.BASE_URL + '/api/paypal/cancel-order',
                brand_name: 'Tu Proyecto de Agiles',
                user_action: 'PAY_NOW'
            }
        })
    });

    return response.data.links.find(link => link.rel === 'approve').href;
};

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    return response.data;
};