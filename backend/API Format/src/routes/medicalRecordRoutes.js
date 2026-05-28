const express = require('express');
const router = express.Router();
const { createMedicalRecord, updateMedicalRecord } = require('../controllers/medicalRecordController');

router.post('/', createMedicalRecord);
router.put('/:id', updateMedicalRecord);

module.exports = router;
