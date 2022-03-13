const bookingModel = require('../models/booking')
const rentModel = require('../models/rent')
const roomModel = require('../models/room')
const equipmentModel = require('../models/equipment')
const drinkModel = require('../models/drink')

exports.getBookingReport = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingReport()

    return res
      .status(200)
      .json({ message: 'Booking report data retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving booking report data' })
  }
}

exports.getRentReport = async (req, res) => {
  try {
    const rents = await rentModel.getRentReport()

    return res.status(200).json({ message: 'Rent report retrieved', rents })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving rent report data' })
  }
}

exports.getRevenueReport = async (req, res) => {
  try {
    const revenue = await bookingModel.getRevenueReport()

    return res
      .status(200)
      .json({ message: 'Revenue report retrieved', revenue })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving revenue report data' })
  }
}

exports.getRoomReport = async (req, res) => {
  try {
    const rooms = await roomModel.getRoomReport()

    return res.status(200).json({ message: 'Room report retrieved', rooms })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving room report data' })
  }
}

exports.getEquipmentReport = async (req, res) => {
  try {
    const equipments = await equipmentModel.getEquipmentReport()

    return res
      .status(200)
      .json({ message: 'Equipment report date retrieved', equipments })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving equipment report data' })
  }
}

exports.getDrinkReport = async (req, res) => {
  try {
    const drinks = await drinkModel.getDrinkReport()

    return res
      .status(200)
      .json({ message: 'Drink report date retrieved', drinks })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving drink report data' })
  }
}

exports.getDashboard = async (req, res) => {
  try {
    const summary = await bookingModel.getDashboardSummary()
    const rooms = await roomModel.getRoomReport()
    const drinks = await drinkModel.getDrinkReport()
    const statusRatio = await bookingModel.getStatusRatio()

    return res
      .status(200)
      .json({
        message: 'Retrieved dashboard data',
        dashboard: { summary, rooms, drinks, statusRatio },
      })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving dashboard data' })
  }
}
