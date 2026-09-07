const express = require('express')
const emiPlanController = require('../controllers/emiPlan.controller')

const router = express.Router()

router.post('/:emiPlanId/select', emiPlanController.selectEmiPlan)

module.exports = router
