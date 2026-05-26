const express = require('express');
const router = express.Router();
const { createVisit } = require('../controllers/visitController');

router.post('/', createVisit);

module.exports = router;
