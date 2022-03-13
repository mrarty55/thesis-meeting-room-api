const drinkModel = require('../models/drink')

exports.getDrinks = async (req, res) => {
  try {
    const drinks = await drinkModel.getDrinks()
    return res.status(200).json({ message: 'Drinks retrieved', drinks })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving drinks' })
  }
}

exports.createDrink = async (req, res) => {
  try {
    const drinkId = await drinkModel.createDrink({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
    })
    return res
      .status(201)
      .json({ message: 'Drink created', drinkId: drinkId[0] })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating drink' })
  }
}

exports.uploadDrinkPicture = (req, res) => {
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

exports.updateDrink = async (req, res) => {
  try {
    await drinkModel.updateDrink({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
    })
    return res.status(200).json({ message: 'Drink updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating drink' })
  }
}

exports.deleteDrink = async (req, res) => {
  try {
    await drinkModel.deleteDrink({ id: req.body.id })
    return res.status(200).json({ message: 'Drink deleted' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error deleting drink' })
  }
}
