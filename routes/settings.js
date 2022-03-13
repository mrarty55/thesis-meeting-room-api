const express = require('express')

const router = express.Router()

const authMiddleware = require('../middlewares/auth')

const settingController = require('../controllers/settings')

router.get('/', settingController.getSettings)

router.put('/', authMiddleware.checkAdminAuth, settingController.updateSettings)

module.exports = router
