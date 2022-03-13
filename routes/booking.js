const express = require('express')

const bookingController = require('../controllers/booking')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()

router.get('/', authMiddleware.checkAdminAuth, bookingController.getBooking)

router.get('/schedule', bookingController.getBookingSchedule)

router.post(
  '/',
  authMiddleware.checkAuth,
  formatMiddleware.checkBookingBody,
  bookingController.bookRooms
)

router.put(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkBookingUpdateBody,
  bookingController.updateBooking
)

router.get('/me', authMiddleware.checkAuth, bookingController.getBookingByUser)

router.get('/me/history', authMiddleware.checkAuth, bookingController.getAllBookingByUser)

router.get(
  '/pending',
  authMiddleware.checkAdminAuth,
  bookingController.getPendingBooking
)

router.get(
  '/confirmed',
  authMiddleware.checkAdminAuth,
  bookingController.getConfirmedBooking
)

router.post('/check', authMiddleware.checkAuth, bookingController.checkRooms)

router.post(
  '/deposit',
  authMiddleware.checkAuth,
  storage.single('deposit'),
  bookingController.uploadDepositStatement
)

router.patch(
  '/deposit',
  authMiddleware.checkAuth,
  formatMiddleware.checkDepositBody,
  bookingController.updateDepositStatement
)

router.patch(
  '/confirm',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkConfirmBookingBody,
  bookingController.confirmBooking
)

router.patch(
  '/cancel',
  authMiddleware.checkAdminAuth,
  bookingController.cancelBooking
)

router.patch(
  '/me/cancel',
  authMiddleware.checkAdminAuth,
  bookingController.cancelBookingByUser
)

router.get(
  '/data/form',
  bookingController.getBookingFormData
)

router.get(
  '/data/editForm',
  authMiddleware.checkAuth,
  bookingController.getBookingFormData
)

router.get(
  '/data/status',
  authMiddleware.checkAuth,
  bookingController.getBookingStatusData
)

module.exports = router
