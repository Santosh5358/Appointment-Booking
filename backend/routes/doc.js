const express = require('express');
const router = express.Router();
const doctorGetController = require('../controllers/doctorsGetController');


// Doctors Management (Admin)
router.get('/all', doctorGetController.getAllDoctors);
router.post('/all', doctorGetController.createDoctor);
router.put('/all/:id', doctorGetController.updateDoctorById);
router.delete('/all/:id', doctorGetController.deleteDoctor);

module.exports = router;