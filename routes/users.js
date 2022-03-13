const express = require('express')

const userController = require('../controllers/users')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()


// Get user by id
router.get('/', authMiddleware.checkAuth, userController.getUserById)

// Get all users
router.get('/all', authMiddleware.checkAdminAuth, userController.getUsers)

// Create user (register)
router.post(
  '/',
  formatMiddleware.checkUserRegisterBody,
  userController.createUser
)

// Update user info
router.put(
  '/',
  authMiddleware.checkAuth,
  formatMiddleware.checkUserBody,
  userController.updateUser
)

router.patch('/', authMiddleware.checkAuth, userController.updatePassword)

// Reset user password
router.patch('/reset', authMiddleware.checkAuth, userController.resetPassword)

// Delete user
router.delete('/', authMiddleware.checkAuth, userController.deleteUser)

// Upload user image
router.post(
  '/image',
  authMiddleware.checkAdminAuth,
  storage.single('image'),
  userController.uploadUserPicture
)

// User login
router.post('/login', formatMiddleware.checkLoginBody, userController.login)

// Authenticate user
router.post('/auth', userController.checkUserAuth)

// Send password reset email
router.post('/reset', userController.requestPasswordReset)

// Verify reset link
router.post('/token', userController.verifyResetToken)

module.exports = router
