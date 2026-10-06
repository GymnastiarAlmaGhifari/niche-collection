import { supabase } from '@/lib/supabase';
import { CatalogData, Product, Category } from '@/types/catalog';

// Helper to format Supabase product to match old Product type
function formatProduct(p: any): Product {
  return {
    id: p.id,
    productNumber: p.product_number,
    slug: p.slug,
    name: p.name,
    categoryId: p.category_id,
    subCategoryId: p.sub_category_id,
    price: p.price,
    originalPrice: p.original_price,
    currency: p.currency,
    rating: p.rating,
    ratingCount: p.rating_count,
    soldCount: p.sold_count,
    shortDescription: p.short_description,
    curatorReview: p.curator_review,
    affiliateUrl: p.affiliate_url,
    marketplace: p.marketplace,
    badges: p.badges || [],
    isFeatured: p.is_featured,
    status: p.status,
    videoDriveId: p.video_drive_id,
    images: p.product_images ? p.product_images.sort((a:any,b:any) => a.sort_order - b.sort_order).map((img: any) => ({
      driveId: img.drive_id,
      alt: img.alt
    })) : [],
    specs: p.product_specs ? p.product_specs.map((spec: any) => ({
      label: spec.label,
      value: spec.value
    })) : []
  } as Product;
}

export const getConfig = async () => {
  const { data } = await supabase.from('site_config').select('*').single();
  return {
    siteName: data?.site_name,
    tagline: data?.tagline,
    heroTitle: data?.hero_title,
    heroSubtitle: data?.hero_subtitle,
    heroBannerDriveId: data?.hero_banner_drive_id,
    metaDescription: data?.meta_description,
    ogImageDriveId: data?.og_image_drive_id,
    social: data?.social || {},
    footer: data?.footer || {}
  };
};

export const getCategories = async () => {
  const { data } = await supabase.from('categories').select('*, sub_categories(*)').order('sort_order', { ascending: true });
  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    order: c.sort_order,
    subCategories: c.sub_categories ? c.sub_categories.map((s: any) => ({
      id: s.id,
      name: s.name,
      slug: s.slug
    })) : []
  })) as Category[];
};

export const getProducts = async () => {
  const { data } = await supabase.from('products').select('*, product_images(*), product_specs(*)').order('created_at', { ascending: false });
  return (data || []).map(formatProduct);
};

export const getProductById = async (id: string) => {
  const { data } = await supabase.from('products').select('*, product_images(*), product_specs(*)').eq('id', id).single();
  return data ? formatProduct(data) : undefined;
};

export const getProductBySlug = async (slug: string) => {
  let { data } = await supabase.from('products').select('*, product_images(*), product_specs(*)').eq('slug', slug).single();
  if (!data) {
    const res = await supabase.from('products').select('*, product_images(*), product_specs(*)').eq('id', slug).single();
    data = res.data;
  }
  return data ? formatProduct(data) : undefined;
};

export const getFeaturedProducts = async () => {
  const { data } = await supabase.from('products').select('*, product_images(*), product_specs(*)').eq('is_featured', true).eq('status', 'published');
  return (data || []).map(formatProduct);
};

export const getPublishedProducts = async () => {
  const { data } = await supabase.from('products').select('*, product_images(*), product_specs(*)').eq('status', 'published').order('created_at', { ascending: false });
  return (data || []).map(formatProduct);
};
