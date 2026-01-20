const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route
router.post('/', contactController.createContact);

// Admin routes
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
