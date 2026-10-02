import { getPublishedProducts, getCategories } from "@/lib/data";
import { CatalogClient } from "@/app/(public)/katalog/catalog-client";
import { notFound } from "next/navigation";

export default async function SubKategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  
  let subCategory = null;
  let parentCategory = null;

  for (const cat of categories) {
    if (cat.subCategories) {
      const found = cat.subCategories.find((s: any) => s.slug === slug);
      if (found) {
        subCategory = found;
        parentCategory = cat;
        break;
      }
    }
  }
  
  if (!subCategory || !parentCategory) {
    notFound();
  }

  const allProducts = await getPublishedProducts();
  const products = allProducts.filter(p => p.subCategoryId === subCategory.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">{subCategory.name}</h1>
      <p className="text-muted-foreground mb-8">Kumpulan produk terbaik dalam sub-kategori {subCategory.name}</p>
      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
