const express = require('express')

const drinkController = require('../controllers/drinks')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()

router.get('/', authMiddleware.checkAdminAuth, drinkController.getDrinks)

router.post(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkDrinkBody,
  drinkController.createDrink
)

router.post(
  '/image',
  authMiddleware.checkAdminAuth,
  storage.single('image'),
  drinkController.uploadDrinkPicture
)

router.put(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkDrinkBody,
  drinkController.updateDrink
)

router.delete('/', authMiddleware.checkAdminAuth, drinkController.deleteDrink)

module.exports = router
