const bookingModel = require('../models/booking')
const mailTransport = require('../config/mail')

exports.getBookingByUser = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingByUser({
      customerId: req.credentials.id,
    })

    return res.status(200).json({ message: 'Booking data retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving booking data' })
  }
}

exports.getAllBookingByUser = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookingByUser({
      customerId: req.credentials.id,
    })

    return res.status(200).json({message: 'Booking data retrived', bookings})
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving booking data' })
  }
}

exports.getBooking = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBooking()

    return res.status(200).json({ message: 'Booking data retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving booking data' })
  }
}

exports.getPendingBooking = async (req, res) => {
  try {
    const bookings = await bookingModel.getPendingBooking()

    return res
      .status(200)
      .json({ message: 'Pending booking data retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving pending booking data' })
  }
}

exports.getConfirmedBooking = async (req, res) => {
  try {
    const bookings = await bookingModel.getConfirmedBooking()

    return res
      .status(200)
      .json({ message: 'Confirmed booking data retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving confirmed booking data' })
  }
}

exports.getBookingSchedule = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingSchedule()

    return res
      .status(200)
      .json({ message: 'Booking schedule retrieved', bookings })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retrieving booking schedule data' })
  }
}

exports.bookRooms = async (req, res) => {
  try {
    const bookingId = await bookingModel.bookRooms({
      eventTitle: req.body.eventTitle,
      eventDescription: req.body.eventDescription,
      eventType: req.body.eventType,
      eventStatus: req.body.eventStatus,
      eventDate: req.body.eventDate,
      eventStartTime: req.body.eventStartTime,
      eventEndTime: req.body.eventEndTime,
      rooms: req.body.rooms,
      equipments: req.body.equipments,
      drinks: req.body.drinks,
      roomStyle: req.body.roomStyle,
      table: req.body.table,
      chair: req.body.chair,
      additionalNote: req.body.additionalNote,
      roomSubtotal: req.body.roomSubtotal,
      drinkSubtotal: req.body.drinkSubtotal,
      total: req.body.total,
      deposit: req.body.deposit,
      customer: req.credentials.id,
    })

    return res.status(201).json({ message: 'Room(s) booked', bookingId })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error booking rooms' })
  }
}

exports.checkRooms = async (req, res) => {
  try {
    let roomCount = 0
    for (room of req.body.rooms) {
      const bookedRoom = await bookingModel.checkRooms({
        roomId: room.id,
        date: req.body.eventDate,
        startTime: req.body.eventStartTime,
        endTime: req.body.eventEndTime,
      })
      if (bookedRoom.length > 0) {
        roomCount++
      }
    }
    if (roomCount > 0) {
      return res.status(403).json({ message: 'Room(s) not available' })
    }
    return res.status(200).json({ message: 'Room(s) available' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error checking rooms' })
  }
}

exports.uploadDepositStatement = (req, res) => {
  try {
    const deposit = `${req.secure ? 'https' : 'http'}://${req.get(
      'host'
    )}/images/${req.file.filename}`
    return res
      .status(200)
      .json({ message: 'Deposit statement uploaded', deposit })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error uploading deposit statement' })
  }
}

exports.updateDepositStatement = async (req, res) => {
  try {
    await bookingModel.updateDepositStatement({
      bookingId: req.body.bookingId,
      statement: req.body.depositStatement,
    })
    return res.status(200).json({ message: 'Updated deposit statement' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating deposit statement' })
  }
}

exports.updateBooking = async (req, res) => {
  try {
    await bookingModel.updateBooking({
      id: req.body.id,
      eventTitle: req.body.eventTitle,
      eventDescription: req.body.eventDescription,
      eventType: req.body.eventType,
      eventStatus: req.body.eventStatus,
      roomStyle: req.body.roomStyle,
      additionalNote: req.body.additionalNote,
    })

    return res.status(200).json({ message: 'Updated booking' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating booking' })
  }
}

exports.confirmBooking = async (req, res) => {
  try {
    await bookingModel.confirmBooking({
      bookingId: req.body.booking.id,
      staffId: req.credentials.id,
    })

    await mailTransport.sendMail({
      to: req.body.booking.customer.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ຢືນຢັນການຈອງຫ້ອງປະຊຸມ',
      html: `
      <p>ເຖິງທ່ານ ${req.body.booking.customer.firstName} ${req.body.booking.customer.lastName},</p>
      <p>ການຈອງຫ້ອງປະຊຸມລະຫັດ ${req.body.booking.id}, ຫົວຂໍ້ງານ "${req.body.booking.eventTitle}" ໄດ້ຮັບການຢືນຢັນແລ້ວ.</p>
      <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ</p>
      `,
    })

    return res.status(200).json({ message: 'Booking confirmed' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error confirming booking' })
  }
}

exports.cancelBooking = async (req, res) => {
  try {
    await bookingModel.cancelBooking({ bookingId: req.body.booking.id })

    await mailTransport.sendMail({
      to: req.body.booking.customer.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ຍົກເລີກການຈອງຫ້ອງປະຊຸມ',
      html: `
      <p>ເຖິງທ່ານ ${req.body.booking.customer.firstName} ${req.body.booking.customer.lastName},</p>
      <p>ການຈອງຫ້ອງປະຊຸມລະຫັດ ${req.body.booking.id}, ຫົວຂໍ້ງານ "${req.body.booking.eventTitle}" ໄດ້ຖືກຍົກເລີກແລ້ວ.</p>
      <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ</p>
      `,
    })

    return res.status(200).json({ message: 'Booking canceled' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error cancel booking' })
  }
}

exports.cancelBookingByUser = async (req, res) => {
  try {
    await bookingModel.cancelBooking({ bookingId: req.body.booking.id })

    return res.status(200).json({ message: 'Booking canceled' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error cancel booking' })
  }
}

exports.getBookingFormData = async (req, res) => {
  try {
    const eventTypes = await bookingModel.getEventTypes()
    const eventStatus = await bookingModel.getEventStatus()
    const roomStyles = await bookingModel.getRoomStyles()
    const rooms = await bookingModel.getRooms()
    const equipments = await bookingModel.getEquipments()
    const drinks = await bookingModel.getDrinks()
    return res.status(200).json({
      message: 'Booking form data retrived',
      eventTypes,
      eventStatus,
      roomStyles,
      rooms,
      equipments,
      drinks,
    })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retriving booking form data' })
  }
}

exports.getBookingEditFormData = async (req, res) => {
  try {
    const eventTypes = await bookingModel.getEventTypes()
    const eventStatus = await bookingModel.getEventStatus()
    const roomStyles = await bookingModel.getRoomStyles()
    return res.status(200).json({
      message: 'Booking form data retrived',
      eventTypes,
      eventStatus,
      roomStyles,
    })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retriving booking form data' })
  }
}

exports.getBookingStatusData = async (req, res) => {
  try {
    const bookingStatus = await bookingModel.getBookingStatus()
    return res
      .status(200)
      .json({ message: 'Booking status data retrieved', bookingStatus })
  } catch (error) {
    console.error(error.toString())
    return res
      .status(500)
      .json({ message: 'Error retriving booking form data' })
  }
}
