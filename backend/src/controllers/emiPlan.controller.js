const emiPlanService = require('../services/emiPlan.service')

async function selectEmiPlan(req, res, next) {
  try {
    const result = await emiPlanService.selectEmiPlan(req.params.emiPlanId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = { selectEmiPlan }
