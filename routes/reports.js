const express = require('express')

const router = express.Router()

const authMiddleware = require('../middlewares/auth')

const reportController = require('../controllers/reports')

router.get(
  '/bookings',
  authMiddleware.checkAdminAuth,
  reportController.getBookingReport
)

router.get(
  '/rents',
  authMiddleware.checkAdminAuth,
  reportController.getRentReport
)

router.get(
  '/revenue',
  authMiddleware.checkAdminAuth,
  reportController.getRevenueReport
)

router.get(
  '/rooms',
  authMiddleware.checkAdminAuth,
  reportController.getRoomReport
)

router.get(
  '/equipments',
  authMiddleware.checkAdminAuth,
  reportController.getEquipmentReport
)

router.get(
  '/drinks',
  authMiddleware.checkAdminAuth,
  reportController.getDrinkReport
)

router.get(
  '/dashboard',
  authMiddleware.checkAdminAuth,
  reportController.getDashboard
)

module.exports = router
