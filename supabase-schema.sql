-- ============================================
-- Supabase Schema for Niche Collection
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- Hapus tabel lama jika ada (Reset bersih)
DROP TABLE IF EXISTS product_specs CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sub_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT ('cat-' || extract(epoch from now())::bigint::text || '-' || floor(random() * 1000)::text),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Package',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sub-categories table
CREATE TABLE sub_categories (
  id TEXT PRIMARY KEY DEFAULT ('sub-' || extract(epoch from now())::bigint::text || '-' || floor(random() * 1000)::text),
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || extract(epoch from now())::bigint::text),
  product_number TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sub_category_id TEXT REFERENCES sub_categories(id) ON DELETE SET NULL,
  price NUMERIC,
  original_price NUMERIC,
  currency TEXT DEFAULT 'IDR',
  rating NUMERIC DEFAULT 5.0,
  rating_count INT DEFAULT 0,
  short_description TEXT,
  curator_review TEXT,
  affiliate_url TEXT NOT NULL,
  marketplace TEXT DEFAULT 'shopee',
  badges TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  video_drive_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product images table
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  drive_id TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0
);

-- Product specs table
CREATE TABLE product_specs (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Site config (single row)
CREATE TABLE site_config (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Niche Collection',
  tagline TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_banner_drive_id TEXT,
  meta_description TEXT,
  og_image_drive_id TEXT,
  social JSONB DEFAULT '{}',
  footer JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read sub_categories" ON sub_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_specs" ON product_specs FOR SELECT USING (true);
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);

-- Service role full access (for admin operations via service_role key)
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access sub_categories" ON sub_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_specs" ON product_specs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access site_config" ON site_config FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_marketplace ON products(marketplace);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_sub_categories_category ON sub_categories(category_id);
