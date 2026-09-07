const mongoose = require('mongoose')

const subdocToJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id
    return ret
  },
}

const emiPlanSchema = new mongoose.Schema(
  {
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    monthlyPayment: { type: Number, required: true },
    cashback: { type: Number, default: 0 },
  },
  { toJSON: subdocToJSON }
)

const variantSchema = new mongoose.Schema(
  {
    storage: { type: String, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: undefined }, // optional gallery; falls back to [imageUrl] on the frontend
    price: { type: Number, required: true }, // selling price
    mrp: { type: Number, required: true },
    emiPlans: [emiPlanSchema],
  },
  { toJSON: subdocToJSON }
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    variants: [variantSchema],
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    toJSON: subdocToJSON,
  }
)

module.exports = mongoose.model('Product', productSchema)
