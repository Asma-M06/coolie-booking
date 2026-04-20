const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');

// Public Admin Routes
router.post('/login', adminController.loginAdmin);

// Protected Admin Routes
router.get('/profile', protectAdmin, adminController.getAdminProfile);
router.post('/logout', protectAdmin, adminController.logoutAdmin);

// Coolie Management
router.get('/coolie-requests', protectAdmin, adminController.getPendingCoolieRequests);
router.patch('/coolie-requests/:id', protectAdmin, adminController.updateCoolieStatus);
router.get('/coolies', protectAdmin, adminController.getAllCoolies);
router.delete('/coolies/:id', protectAdmin, adminController.deleteCoolie);

// Settings
router.patch('/profile', protectAdmin, adminController.updateAdminProfile);
router.patch('/password', protectAdmin, adminController.updateAdminPassword);
router.get('/stats', protectAdmin, adminController.getAdminDashboardStats);

module.exports = router;
