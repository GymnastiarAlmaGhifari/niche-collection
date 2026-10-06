export interface SiteConfig {
  siteName: string
  tagline: string
  heroTitle: string
  heroSubtitle: string
  heroBannerDriveId: string | null
  metaDescription: string
  ogImageDriveId: string | null
  social: {
    tiktok: string
    facebook: string
    whatsapp: string
    email: string
  }
  footer: {
    aboutText: string
    contactEmail: string
    affiliateDisclaimer: string
    policyLinks: { label: string; href: string }[]
  }
}

export interface SubCategory {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order: number
  subCategories: SubCategory[]
}

export interface ProductImage {
  driveId: string
  alt: string
}

export interface ProductSpec {
  label: string
  value: string
}

export type Marketplace = 'amazon' | 'shopee' | 'temu' | 'tokopedia' | 'lazada'

export interface Product {
  id: string
  productNumber: string
  slug: string
  name: string
  categoryId: string
  subCategoryId: string
  price?: number | null
  originalPrice?: number | null
  currency: 'IDR' | 'USD'
  rating?: number | null
  ratingCount?: number | null
  soldCount?: number | null
  shortDescription: string
  curatorReview: string
  specs: ProductSpec[]
  images: ProductImage[]
  videoDriveId?: string | null
  affiliateUrl: string
  marketplace: Marketplace
  badges: string[]
  isFeatured: boolean
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface RevisionEntry {
  id: string
  timestamp: string
  author: string
  action: 'create' | 'update' | 'delete' | 'rollback' | 'config'
  target: string
  message: string
  commitSha?: string
}

export interface CatalogData {
  version: string
  lastUpdated: string
  config: SiteConfig
  categories: Category[]
  products: Product[]
  revisions: RevisionEntry[]
}
