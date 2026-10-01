import { getPublishedProducts, getCategories } from "@/lib/data";
import { CatalogClient } from "@/app/(public)/katalog/catalog-client";
import { notFound } from "next/navigation";

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const products = getPublishedProducts().filter(p => p.categoryId === category.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-8">Kumpulan produk terbaik dalam kategori {category.name}</p>
      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
