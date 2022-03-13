const rentModel = require('../models/rent')

exports.getRents = async (req, res) => {
  try {
    const rents = await rentModel.getRents()

    return res.status(200).json({ message: 'Rents retrieved', rents })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving rents' })
  }
}

exports.checkin = async (req, res) => {
  try {
    const rentId = await rentModel.checkin({
      bookingId: req.body.bookingId,
      received: req.body.received,
      change: req.body.change,
      staffId: req.credentials.id,
    })

    return res.status(201).json({ message: 'Checkedin', rentId })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error checkin' })
  }
}
