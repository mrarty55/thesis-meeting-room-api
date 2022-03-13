const express = require('express')

const rentController = require('../controllers/rents')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const router = express.Router()

router.post(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkRentBody,
  rentController.checkin
)

router.get('/', authMiddleware.checkAuth, rentController.getRents)

module.exports = router
