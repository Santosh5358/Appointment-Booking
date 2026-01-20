const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Public routes
router.get('/', doctorController.getDoctorProfile);

// Admin routes
router.put('/', doctorController.updateDoctorProfile);
router.post('/work-samples', doctorController.addWorkSample);
router.delete('/work-samples/:sampleId', doctorController.removeWorkSample);

router.post('/login', doctorController.login);
router.post('/signup', doctorController.signup);
router.get('/By', doctorController.getDoctorById);


// Doctors Management (Admin)
// router.get('/all', doctorController.getAllDoctors);
// router.post('/all', doctorController.createDoctor);
// router.put('/all/:id', doctorController.updateDoctorById);
// router.delete('/all/:id', doctorController.deleteDoctor);

module.exports = router;
