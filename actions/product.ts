"use server";

import { getCatalogFile, updateCatalogFile } from "@/lib/github";
import { Product } from "@/types/catalog";
import fs from "fs/promises";
import path from "path";

// In a fully static remote-only app, we rely strictly on GitHub as source of truth.
// But during local development or Vercel runtime, the Next.js API can also update the local file directly if needed,
// though pushing to GitHub triggers Vercel redeploy which is the pure Git CMS way.

export async function addProductAction(productData: any) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    // Add new product
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productNumber: productData.productNumber,
      name: productData.name,
      categoryId: "home", // hardcoded for demo or passed from form
      subCategoryId: "decor", // hardcoded for demo
      marketplace: productData.marketplace,
      price: parseInt(productData.price),
      originalPrice: productData.originalPrice ? parseInt(productData.originalPrice) : undefined,
      rating: 5.0,
      ratingCount: 1,
      soldCount: 10,
      affiliateUrl: productData.affiliateUrl,
      images: [
        { driveId: productData.mainImageId, isPrimary: true }
      ],
      videoDriveId: productData.videoId || undefined,
      shortDescription: productData.shortDescription,
      curatorReview: productData.curatorReview,
      status: productData.status,
      badges: ["Baru"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    file.content.products.unshift(newProduct); // Add to top

    // Update GitHub
    const res = await updateCatalogFile(
      file.content, 
      file.sha, 
      `Add product: ${newProduct.name}`
    );

    if (!res.success) {
      throw new Error("Failed to commit to GitHub");
    }

    // Also update local file during development so we don't have to wait for redeploy
    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function editProductAction(id: string, productData: any) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const index = file.content.products.findIndex((p: Product) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    // Update existing
    const existing = file.content.products[index];
    file.content.products[index] = {
      ...existing,
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    // Update GitHub
    const res = await updateCatalogFile(
      file.content, 
      file.sha, 
      `Update product: ${existing.name}`
    );

    if (!res.success) {
      throw new Error("Failed to commit to GitHub");
    }

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const product = file.content.products.find((p: Product) => p.id === id);
    if (!product) throw new Error("Product not found");

    file.content.products = file.content.products.filter((p: Product) => p.id !== id);

    // Update GitHub
    const res = await updateCatalogFile(
      file.content, 
      file.sha, 
      `Delete product: ${product.name}`
    );

    if (!res.success) {
      throw new Error("Failed to commit to GitHub");
    }

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: error.message };
  }
}
