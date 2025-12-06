const paypalService = require('../services/paypal.js');

exports.createPayment = async (req, res) => {
    try {
        const { costo, nombre } = req.body; 

        const url = await paypalService.createOrder({
            total: costo,
            description: nombre,
            currency: 'USD'
        });

        res.json({ approvalUrl: url }); 
        
    } catch (error) {
        console.error('Error creando orden:', error);
        res.status(500).send('Error al crear la orden de pago');
    }
};

exports.completePayment = async (req, res) => {
    try {
        const { token } = req.query;
        
        const captureData = await paypalService.capturePayment(token);

        const transactionId = captureData.id;
        const amount = captureData.purchase_units[0].payments.captures[0].amount.value;


        res.redirect(`/confirmacion-reserva.html?numero=${transactionId}&status=success&monto=${amount}`);
    } catch (error) {
        console.error('Error capturando pago:', error);
        res.redirect('/reservarExperiencia.html?status=error');
    }
};

exports.cancelPayment = (req, res) => {
    res.redirect('/index.html?status=cancelled');
};