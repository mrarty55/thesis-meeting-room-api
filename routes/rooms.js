const express = require('express')

const roomController = require('../controllers/rooms')

const authMiddleware = require('../middlewares/auth')
const formatMiddleware = require('../middlewares/format')

const storage = require('../config/storage')

const router = express.Router()

router.get('/', authMiddleware.checkAdminAuth, roomController.getRooms)

router.get('/public', roomController.getRoomsPublic)

router.post(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkRoomBody,
  roomController.createRoom
)

router.post(
  '/image',
  authMiddleware.checkAdminAuth,
  storage.single('image'),
  roomController.uploadRoomPicture
)

router.put(
  '/',
  authMiddleware.checkAdminAuth,
  formatMiddleware.checkRoomBody,
  roomController.updateRoom
)

router.delete('/', authMiddleware.checkAdminAuth, roomController.deleteRoom)

module.exports = router
