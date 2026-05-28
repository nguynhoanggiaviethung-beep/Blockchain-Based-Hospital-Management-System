const express = require('express');
const router = express.Router();
const { createDoctor, getDoctorById } = require('../controllers/doctorController');

router.post('/', createDoctor);
router.get('/:id', getDoctorById);

module.exports = router;
