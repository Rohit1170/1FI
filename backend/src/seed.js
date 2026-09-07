require('dotenv').config()

const { connectDB, mongoose } = require('./services/mongoose')
const Product = require('./models/Product')

// EMI math: monthlyPayment is a simple reducing-balance style estimate.
function buildEmiPlans(price) {
  return [
    { tenureMonths: 12, interestRate: 10.49, cashback: Math.round(price * 0.02), monthlyPayment: Math.round((price * 1.06) / 12) },
    { tenureMonths: 18, interestRate: 11.99, cashback: Math.round(price * 0.015), monthlyPayment: Math.round((price * 1.09) / 18) },
    { tenureMonths: 24, interestRate: 13.49, cashback: Math.round(price * 0.01), monthlyPayment: Math.round((price * 1.13) / 24) },
  ]
}

const products = [
  {
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    brand: 'Apple',
    description:
      'The latest flagship smartphone with advanced AI capabilities, stunning display, and exceptional camera system.',
    variants: [
      { storage: '256GB', color: 'Silver', mrp: 119999, price: 99999, imageUrl: '/images/products/iphone-17-pro/screen.webp', images: ['/images/products/iphone-17-pro/screen.webp', '/images/products/iphone-17-pro/front-back.webp', '/images/products/iphone-17-pro/camera.webp'] },
      { storage: '512GB', color: 'Silver', mrp: 139999, price: 119999, imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop' },
      { storage: '256GB', color: 'Black', mrp: 119999, price: 99999, imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop' },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    brand: 'Samsung',
    description:
      'Powerful flagship with stunning display, exceptional battery life, and Galaxy AI features.',
    variants: [
      { storage: '256GB', color: 'Phantom Black', mrp: 129999, price: 109999, imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=500&h=500&fit=crop' },
      { storage: '512GB', color: 'Phantom Black', mrp: 149999, price: 129999, imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=500&h=500&fit=crop' },
      { storage: '256GB', color: 'Titanium White', mrp: 129999, price: 109999, imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=500&h=500&fit=crop' },
    ],
  },
  {
    name: 'OnePlus 13',
    slug: 'oneplus-13',
    brand: 'OnePlus',
    description:
      'Fast performance meets elegant design. Premium flagship with powerful processor and exceptional display.',
    variants: [
      { storage: '256GB', color: 'Midnight Black', mrp: 64999, price: 54999, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop' },
      { storage: '512GB', color: 'Midnight Black', mrp: 79999, price: 69999, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop' },
      { storage: '256GB', color: 'Arctic Silver', mrp: 64999, price: 54999, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop' },
    ],
  },
]

async function main() {
  await connectDB()

  // Clean slate so the seed is repeatable.
  await Product.deleteMany({})

  const docs = products.map((productData) => ({
    ...productData,
    variants: productData.variants.map((variant) => ({
      ...variant,
      emiPlans: buildEmiPlans(variant.price),
    })),
  }))

  await Product.insertMany(docs)

  console.log(`Seeded ${products.length} products with variants and EMI plans.`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
