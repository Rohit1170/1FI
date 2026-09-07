export interface EMIPlan {
  id: string
  monthlyPayment: number
  tenureMonths: number
  interestRate: number // annual percentage
  cashback: number // in rupees
}

export interface ProductVariant {
  id: string
  storage: string // e.g., "128GB", "256GB"
  color: string
  imageUrl: string
  images?: string[]
  mrp: number
  price: number // selling price
  emiPlans: EMIPlan[]
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  variants: ProductVariant[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, { cache: 'no-store' })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to load product: ${response.status}`)

  return response.json()
}

export async function getAllProducts(): Promise<Pick<Product, 'id' | 'name' | 'slug' | 'brand' | 'description'>[]> {
  const response = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' })

  if (!response.ok) throw new Error(`Failed to load products: ${response.status}`)

  return response.json()
}
