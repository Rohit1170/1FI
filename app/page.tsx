'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Check, ChevronDown, Info, Loader2, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { getProductBySlug, type EMIPlan, type Product, type ProductVariant } from '@/lib/products'

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

function Header() {
  return (
    <header className="border-b border-border/70 bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="1Fi Marketplace home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">1F</span>
          <span className="text-lg font-semibold tracking-tight text-foreground">1Fi <span className="font-normal text-muted-foreground">Marketplace</span></span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <span>Smartphone deals</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure EMI</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">No hidden fees</span>
      </div>
    </header>
  )
}

function ProductGallery({ product, variant }: { product: Product; variant: ProductVariant }) {
  const [activeImage, setActiveImage] = useState(0)
  const gallery = variant.images && variant.images.length > 0 ? variant.images : [variant.imageUrl, variant.imageUrl, variant.imageUrl]
  return (
    <div className="space-y-3">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40 p-8 sm:p-12">
        <img src={gallery[activeImage]} alt={`${product.name} ${variant.color}`} className="h-full w-full object-contain" />
        <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">New arrival</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {gallery.map((image, index) => (
          <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-xl border-2 bg-muted/40 p-2 transition ${activeImage === index ? 'border-primary' : 'border-transparent'}`} aria-label={`View product image ${index + 1}`}>
            <img src={image} alt="" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

function VariantSelector({ product, selectedVariant, onChange }: { product: Product; selectedVariant: ProductVariant; onChange: (variant: ProductVariant) => void }) {
  const colors = [...new Set(product.variants.map((variant) => variant.color))]
  const storageOptions = [...new Set(product.variants.map((variant) => variant.storage))]
  return (
    <div className="space-y-5 border-y border-border py-5">
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-foreground">Color <span className="font-normal text-muted-foreground">/ {selectedVariant.color}</span></p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const colorVariant = product.variants.find((variant) => variant.color === color && variant.storage === selectedVariant.storage) || product.variants.find((variant) => variant.color === color)
            return <button key={color} onClick={() => colorVariant && onChange(colorVariant)} className={`rounded-lg border px-3 py-2 text-sm transition ${selectedVariant.color === color ? 'border-primary bg-primary/5 font-medium text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>{color}</button>
          })}
        </div>
      </div>
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-foreground">Storage <span className="font-normal text-muted-foreground">/ {selectedVariant.storage}</span></p>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((storage) => {
            const storageVariant = product.variants.find((variant) => variant.storage === storage && variant.color === selectedVariant.color) || product.variants.find((variant) => variant.storage === storage)
            return <button key={storage} onClick={() => storageVariant && onChange(storageVariant)} className={`rounded-lg border px-3 py-2 text-sm transition ${selectedVariant.storage === storage ? 'border-primary bg-primary/5 font-medium text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>{storage}</button>
          })}
        </div>
      </div>
    </div>
  )
}

function EMIPlanCard({ plan, selected, onSelect }: { plan: EMIPlan; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`relative w-full rounded-xl border p-4 text-left transition hover:border-primary/60 ${selected ? 'border-primary bg-primary/[0.04] ring-1 ring-primary' : 'border-border bg-card'}`} aria-pressed={selected}>
      {selected && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" /></span>}
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Monthly payment</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">{formatINR(plan.monthlyPayment)}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{plan.cashback ? `${formatINR(plan.cashback)} cashback` : 'Best value'}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{plan.tenureMonths} months</span><span className="h-1 w-1 rounded-full bg-border" /><span>{plan.interestRate}% p.a.</span>
      </div>
    </button>
  )
}

function EmptyState() {
  return <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"><Info className="h-5 w-5 text-muted-foreground" /></div><h1 className="text-lg font-semibold">No EMI plans available</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">We couldn&apos;t find financing options for this variant right now. Try another storage or color option.</p></div>
}

function ErrorState() {
  return <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-card p-10 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><Info className="h-5 w-5" /></div><h1 className="text-lg font-semibold">Product unavailable</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">We couldn&apos;t find that product. Check the URL or explore another device.</p><a href="/products/iphone-17-pro" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">View iPhone 17 Pro</a></div>
}

function LoadingState() {
  return <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /><p className="mt-3 text-sm text-muted-foreground">Loading product details...</p></div>
}

export default function Page() {
  const pathname = usePathname()
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const slug = pathname.split('/').filter(Boolean).pop() || 'iphone-17-pro'
    let cancelled = false

    setProduct(undefined)
    getProductBySlug(slug)
      .then((nextProduct) => {
        if (cancelled) return
        setProduct(nextProduct)
        setSelectedVariant(nextProduct?.variants[0] || null)
        setSelectedPlanId(nextProduct?.variants[0]?.emiPlans[0]?.id || null)
      })
      .catch(() => {
        if (cancelled) return
        setProduct(null)
      })

    return () => {
      cancelled = true
    }
  }, [pathname])

  const currentPlan = useMemo(() => selectedVariant?.emiPlans.find((plan) => plan.id === selectedPlanId), [selectedPlanId, selectedVariant])
  const variantChanged = (variant: ProductVariant) => { setSelectedVariant(variant); setSelectedPlanId(variant.emiPlans[0]?.id || null); setSubmitted(false) }

  const proceedWithPlan = async () => {
    if (!currentPlan) return
    setSubmitting(true)
    try {
      await fetch(`${API_BASE_URL}/emi-plans/${currentPlan.id}/select`, { method: 'POST' })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (product === undefined) return <><Header /><LoadingState /></>
  if (!product) return <><Header /><main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-5"><ErrorState /></main></>
  if (!selectedVariant || !selectedVariant.emiPlans.length) return <><Header /><main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-5"><EmptyState /></main></>

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-6 sm:py-8 lg:px-8">
        <a href="#product-details" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to marketplace</a>
        <div id="product-details" className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:gap-14">
          <ProductGallery product={product} variant={selectedVariant} />
          <section className="min-w-0">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">{product.brand} / Smartphone</p><h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{product.name}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{product.description}</p></div>
              <div className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs font-medium"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.8</div>
            </div>
            <div className="mb-6 flex items-end gap-3"><span className="text-2xl font-semibold tracking-tight">{formatINR(selectedVariant.price)}</span><span className="pb-0.5 text-sm text-muted-foreground line-through">{formatINR(selectedVariant.mrp)}</span><span className="mb-0.5 rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{Math.round((1 - selectedVariant.price / selectedVariant.mrp) * 100)}% off</span></div>
            <VariantSelector product={product} selectedVariant={selectedVariant} onChange={variantChanged} />
            <div className="mt-7 space-y-3"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Choose your EMI plan</h2><p className="mt-1 text-sm text-muted-foreground">Flexible plans, transparent pricing.</p></div><span className="hidden rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary sm:inline-flex"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Select one</span></div>
              <div className="grid gap-3">{selectedVariant.emiPlans.map((plan) => <EMIPlanCard key={`${selectedVariant.id}-${plan.id}`} plan={plan} selected={selectedPlanId === plan.id} onSelect={() => { setSelectedPlanId(plan.id); setSubmitted(false) }} />)}</div>
            </div>
            <button disabled={!currentPlan || submitted || submitting} onClick={proceedWithPlan} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100">{submitted ? <><Check className="h-4 w-4" /> Plan selected — we&apos;ll take it from here</> : submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</> : <>Proceed with selected plan <ChevronDown className="h-4 w-4 -rotate-90" /></>}</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">You&apos;ll review your details before anything is finalized.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
