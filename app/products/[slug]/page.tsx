import ProductPage from '@/app/page'

export default ProductPage

export function generateStaticParams() {
  return [
    { slug: 'iphone-17-pro' },
    { slug: 'samsung-s24-ultra' },
    { slug: 'oneplus-13' },
  ]
}

export const dynamicParams = true
