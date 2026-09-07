const mongoose = require('mongoose')
const Product = require('../models/Product')
const { AppError } = require('../middleware/errorHandler')

async function getAllProducts() {
  return Product.find().select('-variants').sort({ createdAt: 1 })
}

async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug })

  if (!product) {
    throw new AppError(`Product not found: ${slug}`, 404)
  }

  return product
}

async function getVariantEmiPlans(slug, variantId) {
  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    throw new AppError('Variant not found for this product', 404)
  }

  const product = await Product.findOne({ slug })
  const variant = product && product.variants.id(variantId)

  if (!variant) {
    throw new AppError('Variant not found for this product', 404)
  }

  return variant.emiPlans
}

module.exports = { getAllProducts, getProductBySlug, getVariantEmiPlans }
