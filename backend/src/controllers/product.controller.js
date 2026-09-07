const productService = require('../services/product.service')

async function listProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.params.slug)
    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

async function getVariantEmiPlans(req, res, next) {
  try {
    const emiPlans = await productService.getVariantEmiPlans(req.params.slug, req.params.variantId)
    res.status(200).json(emiPlans)
  } catch (error) {
    next(error)
  }
}

module.exports = { listProducts, getProduct, getVariantEmiPlans }
