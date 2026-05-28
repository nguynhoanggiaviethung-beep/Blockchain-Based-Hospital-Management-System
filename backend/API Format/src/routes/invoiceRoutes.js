const express = require('express');
const router = express.Router();
const { createInvoice, makePayment } = require('../controllers/invoiceController');

router.post('/', createInvoice);
router.post('/payments', makePayment);

module.exports = router;
