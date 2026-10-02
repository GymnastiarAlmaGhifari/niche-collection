import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import catalogData from "@/data/catalog.json";

export async function GET() {
  try {
    // 1. Config
    await supabaseAdmin.from('site_config').upsert({
      id: 1,
      site_name: catalogData.config.siteName,
      tagline: catalogData.config.tagline,
      hero_title: catalogData.config.heroTitle,
      hero_subtitle: catalogData.config.heroSubtitle,
      hero_banner_drive_id: catalogData.config.heroBannerDriveId,
      meta_description: catalogData.config.metaDescription,
      og_image_drive_id: catalogData.config.ogImageDriveId,
      social: catalogData.config.social,
      footer: catalogData.config.footer,
    });

    // 2. Categories
    for (const cat of catalogData.categories) {
      await supabaseAdmin.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sort_order: cat.order,
      });

      // 3. Subcategories
      for (const sub of cat.subCategories) {
        await supabaseAdmin.from('sub_categories').upsert({
          id: sub.id,
          category_id: cat.id,
          name: sub.name,
          slug: sub.slug,
        });
      }
    }

    // 4. Products
    for (const prod of catalogData.products) {
      const { data: prodData, error: prodErr } = await supabaseAdmin.from('products').upsert({
        id: prod.id,
        product_number: prod.productNumber,
        slug: prod.slug,
        name: prod.name,
        category_id: prod.categoryId,
        sub_category_id: prod.subCategoryId,
        price: prod.price,
        original_price: prod.originalPrice,
        currency: prod.currency,
        rating: prod.rating,
        rating_count: prod.ratingCount,
        short_description: prod.shortDescription,
        curator_review: prod.curatorReview,
        affiliate_url: prod.affiliateUrl,
        marketplace: prod.marketplace,
        badges: prod.badges,
        is_featured: prod.isFeatured,
        status: prod.status,
        video_drive_id: prod.videoDriveId,
      }).select();

      if (prodErr) console.error("Error inserting product:", prod.name, prodErr);

      // Images
      for (const [idx, img] of prod.images.entries()) {
        await supabaseAdmin.from('product_images').insert({
          product_id: prod.id,
          drive_id: img.driveId,
          alt: img.alt,
          sort_order: idx
        });
      }

      // Specs
      for (const spec of prod.specs) {
        await supabaseAdmin.from('product_specs').insert({
          product_id: prod.id,
          label: spec.label,
          value: spec.value
        });
      }
    }

    return NextResponse.json({ success: true, message: "Migration completed!" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
