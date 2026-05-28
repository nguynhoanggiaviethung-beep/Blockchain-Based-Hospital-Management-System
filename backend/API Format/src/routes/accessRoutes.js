const express = require('express');
const { grantAccess } = require('../controllers/accessController');

const router = express.Router();

router.post('/grant', grantAccess);

module.exports = router;
