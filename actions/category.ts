"use server";

import { getCatalogFile, updateCatalogFile } from "@/lib/github";
import { Category, SubCategory } from "@/types/catalog";
import fs from "fs/promises";
import path from "path";

async function triggerVercelDeploy() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return;
  try {
    await fetch(hookUrl, { method: "POST" });
  } catch (error) {
    console.error("Failed to trigger Vercel deployment:", error);
  }
}

export async function addCategoryAction(data: { name: string; icon: string }) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: data.icon || "Package",
      order: file.content.categories.length + 1,
      subCategories: [],
    };

    file.content.categories.push(newCategory);

    const res = await updateCatalogFile(file.content, file.sha, `Add category: ${newCategory.name}`);
    if (!res.success) throw new Error("Failed to commit to GitHub");

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    await triggerVercelDeploy();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editCategoryAction(id: string, data: { name: string; icon: string }) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const index = file.content.categories.findIndex((c: Category) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    file.content.categories[index] = {
      ...file.content.categories[index],
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: data.icon || file.content.categories[index].icon,
    };

    const res = await updateCatalogFile(file.content, file.sha, `Update category: ${data.name}`);
    if (!res.success) throw new Error("Failed to commit to GitHub");

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    await triggerVercelDeploy();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const cat = file.content.categories.find((c: Category) => c.id === id);
    if (!cat) throw new Error("Category not found");

    file.content.categories = file.content.categories.filter((c: Category) => c.id !== id);

    const res = await updateCatalogFile(file.content, file.sha, `Delete category: ${cat.name}`);
    if (!res.success) throw new Error("Failed to commit to GitHub");

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    await triggerVercelDeploy();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addSubCategoryAction(categoryId: string, data: { name: string }) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const catIndex = file.content.categories.findIndex((c: Category) => c.id === categoryId);
    if (catIndex === -1) throw new Error("Category not found");

    const newSub: SubCategory = {
      id: `sub-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    file.content.categories[catIndex].subCategories.push(newSub);

    const res = await updateCatalogFile(file.content, file.sha, `Add sub-category: ${newSub.name}`);
    if (!res.success) throw new Error("Failed to commit to GitHub");

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    await triggerVercelDeploy();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSubCategoryAction(categoryId: string, subId: string) {
  try {
    const file = await getCatalogFile();
    if (!file) throw new Error("Could not fetch catalog from GitHub");

    const catIndex = file.content.categories.findIndex((c: Category) => c.id === categoryId);
    if (catIndex === -1) throw new Error("Category not found");

    file.content.categories[catIndex].subCategories = file.content.categories[catIndex].subCategories.filter(
      (s: SubCategory) => s.id !== subId
    );

    const res = await updateCatalogFile(file.content, file.sha, `Delete sub-category from ${file.content.categories[catIndex].name}`);
    if (!res.success) throw new Error("Failed to commit to GitHub");

    if (process.env.NODE_ENV === "development") {
      const localPath = path.join(process.cwd(), "data", "catalog.json");
      await fs.writeFile(localPath, JSON.stringify(file.content, null, 2));
    }

    await triggerVercelDeploy();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
