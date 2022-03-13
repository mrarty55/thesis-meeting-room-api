const equipmentModel = require('../models/equipment')

exports.getEquipments = async (req, res) => {
  try {
    const equipments = await equipmentModel.getEquipments()
    return res.status(200).json({ message: 'Equipments retrieved', equipments })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving equipments' })
  }
}

exports.createEquipment = async (req, res) => {
  try {
    const equipmentId = await equipmentModel.createEquipment({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
    })
    return res
      .status(201)
      .json({ message: 'Equipment created', equipmentId: equipmentId[0] })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating equipment' })
  }
}

exports.uploadEquipmentPicture = (req, res) => {
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

exports.updateEquipment = async (req, res) => {
  try {
    await equipmentModel.updateEquipment({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
    })
    return res.status(200).json({ message: 'Equipment updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating equipment' })
  }
}

exports.deleteEquipment = async (req, res) => {
  try {
    await equipmentModel.deleteEquipment({ id: req.body.id })
    return res.status(200).json({ message: 'Equipment deleted' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error deleting equipment' })
  }
}
