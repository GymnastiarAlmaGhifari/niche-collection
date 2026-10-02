"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addCategoryAction(name: string, icon: string) {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `cat-${Date.now()}`;

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const order = (maxOrder && maxOrder.length > 0) ? (maxOrder[0].sort_order || 0) + 1 : 1;

    const { error } = await supabaseAdmin.from('categories').insert({
      id,
      name,
      slug,
      icon,
      sort_order: order
    });

    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editCategoryAction(id: string, name: string, icon: string) {
  try {
    const { error } = await supabaseAdmin.from('categories').update({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon
    }).eq('id', id);

    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addSubCategoryAction(categoryId: string, name: string) {
  try {
    const id = `sub-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { error } = await supabaseAdmin.from('sub_categories').insert({
      id,
      category_id: categoryId,
      name,
      slug
    });

    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editSubCategoryAction(categoryId: string, subId: string, name: string) {
  try {
    const { error } = await supabaseAdmin.from('sub_categories').update({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }).eq('id', subId);

    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSubCategoryAction(categoryId: string, subId: string) {
  try {
    const { error } = await supabaseAdmin.from('sub_categories').delete().eq('id', subId);
    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
