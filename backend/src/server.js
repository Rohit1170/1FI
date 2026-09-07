require('dotenv').config()

const app = require('./app')
const { connectDB } = require('./services/mongoose')

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`1Fi Marketplace API running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  })
