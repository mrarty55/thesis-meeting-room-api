const express = require('express')

const router = express.Router()

const userRouter = require('./users')
const adminRouter = require('./admins')
const roomRouter = require('./rooms')
const drinkRouter = require('./drinks')
const equipmentRouter = require('./equipments')
const bookingRouter = require('./booking')
const rentRouter = require('./rents')
const reportRouter = require('./reports')
const settingRouter = require('./settings')

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'h3ll0, fr13nd!' })
})

router.use('/users', userRouter)

router.use('/admins', adminRouter)

router.use('/rooms', roomRouter)

router.use('/drinks', drinkRouter)

router.use('/equipments', equipmentRouter)

router.use('/bookings', bookingRouter)

router.use('/rents', rentRouter)

router.use('/reports', reportRouter)

router.use('/settings', settingRouter)

module.exports = router
