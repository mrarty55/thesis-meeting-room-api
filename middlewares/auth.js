const jwt = require('jsonwebtoken')

exports.checkAuth = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined)
      return res.status(401).json({ message: 'Unauthorised' })
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.credentials = { id: decodedToken.id, username: decodedToken.username || '' }
    next()
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Failed to authenticate' })
  }
}

exports.checkAdminAuth = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined)
      return res.status(401).json({ message: 'Unauthorised' })
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.credentials = {
      id: decodedToken.id,
      username: decodedToken.username || '',
      role: decodedToken.role || 0,
    }
    next()
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Failed to authenticate' })
  }
}
