const express = require('express');
const router = express.Router();
const { createPatient, getPatientById } = require('../controllers/patientController');

router.post('/', createPatient);
router.get('/:id', getPatientById);

module.exports = router;
