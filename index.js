require('dotenv').config()

const app = require('./app')

const port = process.env.API_PORT || 4100

const environment = process.env.NODE_ENV || 'development'

app.listen(port, () => {
  console.log(`API running at port ${port} in ${environment}`)
})
