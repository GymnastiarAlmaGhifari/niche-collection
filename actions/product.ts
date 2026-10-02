"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { Product } from "@/types/catalog";
import { revalidatePath } from "next/cache";

export async function addProductAction(productData: any) {
  try {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { error } = await supabaseAdmin.from('products').insert({
      id,
      slug,
      product_number: productData.productNumber,
      name: productData.name,
      category_id: productData.categoryId || "home",
      sub_category_id: productData.subCategoryId || null,
      marketplace: productData.marketplace,
      price: productData.price ? parseInt(productData.price) : null,
      original_price: productData.originalPrice ? parseInt(productData.originalPrice) : null,
      currency: "IDR",
      rating: 5.0,
      rating_count: 1,
      affiliate_url: productData.affiliateUrl,
      short_description: productData.shortDescription,
      curator_review: productData.curatorReview,
      status: productData.status,
      is_featured: false,
      video_drive_id: productData.videoId || null,
      badges: ["Baru"]
    });

    if (error) throw error;

    if (productData.mainImageId) {
      await supabaseAdmin.from('product_images').insert({
        product_id: id,
        drive_id: productData.mainImageId,
        alt: productData.name,
        sort_order: 0
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function editProductAction(id: string, productData: any) {
  try {
    const { error } = await supabaseAdmin.from('products').update({
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      product_number: productData.productNumber,
      name: productData.name,
      category_id: productData.categoryId || "home",
      sub_category_id: productData.subCategoryId || null,
      marketplace: productData.marketplace,
      price: productData.price ? parseInt(productData.price) : null,
      original_price: productData.originalPrice ? parseInt(productData.originalPrice) : null,
      affiliate_url: productData.affiliateUrl,
      short_description: productData.shortDescription,
      curator_review: productData.curatorReview,
      status: productData.status,
      video_drive_id: productData.videoDriveId || null,
      updated_at: new Date().toISOString(),
    }).eq('id', id);

    if (error) throw error;

    // Update main image if provided in images[0]
    if (productData.images && productData.images.length > 0) {
      // For simplicity, just update the first image or insert if not exists
      const { data: existingImages } = await supabaseAdmin.from('product_images').select('id').eq('product_id', id).order('sort_order', { ascending: true }).limit(1);
      
      if (existingImages && existingImages.length > 0) {
        await supabaseAdmin.from('product_images').update({
          drive_id: productData.images[0].driveId,
          alt: productData.images[0].alt
        }).eq('id', existingImages[0].id);
      } else {
        await supabaseAdmin.from('product_images').insert({
          product_id: id,
          drive_id: productData.images[0].driveId,
          alt: productData.images[0].alt,
          sort_order: 0
        });
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}
