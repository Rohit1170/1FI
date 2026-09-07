const express = require('express')
const cors = require('cors')

const productRoutes = require('./routes/product.routes')
const emiPlanRoutes = require('./routes/emiPlan.routes')
const { notFound } = require('./middleware/notFound')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

app.use('/api/products', productRoutes)
app.use('/api/emi-plans', emiPlanRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
