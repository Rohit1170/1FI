const mongoose = require('mongoose')
const Product = require('../models/Product')
const { AppError } = require('../middleware/errorHandler')

async function selectEmiPlan(emiPlanId) {
  if (!mongoose.Types.ObjectId.isValid(emiPlanId)) {
    throw new AppError('EMI plan not found', 404)
  }

  const product = await Product.findOne({ 'variants.emiPlans._id': emiPlanId })

  if (!product) {
    throw new AppError('EMI plan not found', 404)
  }

  let variant
  let emiPlan
  for (const v of product.variants) {
    const plan = v.emiPlans.id(emiPlanId)
    if (plan) {
      variant = v
      emiPlan = plan
      break
    }
  }

  if (!emiPlan) {
    throw new AppError('EMI plan not found', 404)
  }

  // No real payment processing — this just confirms the plan is valid and selectable.
  return {
    confirmed: true,
    message: 'EMI plan selected successfully',
    emiPlan: {
      id: emiPlan.id,
      tenureMonths: emiPlan.tenureMonths,
      interestRate: emiPlan.interestRate,
      monthlyPayment: emiPlan.monthlyPayment,
      cashback: emiPlan.cashback,
    },
    product: {
      name: product.name,
      storage: variant.storage,
      color: variant.color,
    },
  }
}

module.exports = { selectEmiPlan }
