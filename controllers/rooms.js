const roomModel = require('../models/room')

exports.getRooms = async (req, res) => {
  try {
    const rooms = await roomModel.getRooms()
    return res.status(200).json({ message: 'Rooms retrived', rooms })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving rooms' })
  }
}

exports.getRoomsPublic = async (req, res) => {
  try {
    const rooms = await roomModel.getRooms()
    return res.status(200).json({ message: 'Rooms retrived', rooms })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving rooms' })
  }
}

exports.createRoom = async (req, res) => {
  try {
    const roomId = await roomModel.createRoom({
      name: req.body.name,
      description: req.body.description,
      hourlyRate: req.body.hourlyRate,
      shiftRate: req.body.shiftRate,
      capacity: req.body.capacity,
      image: req.body.image || '',
    })
    return res.status(201).json({ message: 'Room created', roomId: roomId[0] })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating room' })
  }
}

exports.uploadRoomPicture = (req, res) => {
  try {
    const image = `${req.secure ? 'https' : 'http'}://${req.get(
      'host'
    )}/images/${req.file.filename}`
    return res.status(200).json({ message: 'Image uploaded', image })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error uploading image' })
  }
}

exports.updateRoom = async (req, res) => {
  try {
    await roomModel.updateRoom({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      hourlyRate: req.body.hourlyRate,
      shiftRate: req.body.shiftRate,
      capacity: req.body.capacity,
      image: req.body.image || '',
    })
    return res.status(200).json({ message: 'Room updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating room' })
  }
}

exports.deleteRoom = async (req, res) => {
  try {
    await roomModel.deleteRoom({ id: req.body.id })
    return res.status(200).json({ message: 'Room deleted' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error deleting room' })
  }
}
