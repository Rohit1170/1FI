const express = require('express')
const productController = require('../controllers/product.controller')

const router = express.Router()

router.get('/', productController.listProducts)
router.get('/:slug', productController.getProduct)
router.get('/:slug/variants/:variantId/emi-plans', productController.getVariantEmiPlans)

module.exports = router
