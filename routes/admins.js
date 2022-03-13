const express = require('express')

const adminController = require('../controllers/admins')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()

// Get admin by id
router.get('/', authMiddleware.checkAdminAuth, adminController.getAdminById)

// Get all admins
router.get('/all', authMiddleware.checkAdminAuth, adminController.getAdmins)

// Get roles
router.get(
  '/roles',
  authMiddleware.checkAdminAuth,
  adminController.getAdminRoles
)

// Create admin
router.post(
  '/',
  formatMiddleware.checkAdminRegisterBody,
  adminController.createAdmin
)

// Upload admin image
router.post(
  '/image',
  authMiddleware.checkAdminAuth,
  storage.single('image'),
  adminController.uploadAdminPicture
)

// Update admin
router.put(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkAdminBody,
  adminController.updateAdmin
)

// Update password
router.patch(
  '/',
  authMiddleware.checkAdminAuth,
  adminController.updateAdminPassword
)

// Reset password
router.patch(
  '/reset',
  authMiddleware.checkAdminAuth,
  adminController.resetAdminPassword
)

// Delete admin
router.delete('/', authMiddleware.checkAdminAuth, adminController.deleteAdmin)

// Admin login
router.post('/login', formatMiddleware.checkLoginBody, adminController.login)

// Check admin auth
router.post('/auth', adminController.checkAdminAuth)

// Send password reset
router.post('/reset', adminController.requestPasswordReset)

// Verify token
router.post('/token', adminController.verifyResetToken)

module.exports = router
