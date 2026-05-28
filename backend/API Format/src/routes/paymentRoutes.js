const express = require('express');
const { makePayment } = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', makePayment);

module.exports = router;
