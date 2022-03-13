const multer = require('multer')

const MIME_TYPES = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
}

const fileFilter = (req, file, callback) => {
  const isValid = MIME_TYPES[file.mimetype]
  let err = null
  if (!isValid) {
    err = new Error('File type is not valid')
  }
  callback(err, isValid)
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPES[file.mimetype]
    callback(null, `${name}-${Date.now()}.${ext}`)
  },
})

module.exports = multer({
  storage,
  fileFilter,
})
