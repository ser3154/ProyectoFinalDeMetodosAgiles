const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// pago
router.post('/pay', paypalController.createPayment);

// retoron de paypal
router.get('/complete-order', paypalController.completePayment);
router.get('/cancel-order', paypalController.cancelPayment);

module.exports = router;