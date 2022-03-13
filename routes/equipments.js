const express = require('express')

const equipmentController = require('../controllers/equipments')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()

router.get(
  '/',
  authMiddleware.checkAdminAuth,
  equipmentController.getEquipments
)

router.post(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkEquipmentBody,
  equipmentController.createEquipment
)

router.post(
  '/image',
  authMiddleware.checkAdminAuth,
  storage.single('image'),
  equipmentController.uploadEquipmentPicture
)

router.put(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkEquipmentBody,
  equipmentController.updateEquipment
)

router.delete(
  '/',
  authMiddleware.checkAdminAuth,
  equipmentController.deleteEquipment
)

module.exports = router
