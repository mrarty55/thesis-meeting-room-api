const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

const appRouter = require('./routes')

const app = express()

const corsProtector = cors({
  origin: process.env.APP_URL,
  credentials: true,
})

app.set('trust proxy', true)
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static(path.join(__dirname, 'uploads/images')))
app.use(corsProtector)
app.use('/v1', appRouter)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not found' })
})

module.exports = app
