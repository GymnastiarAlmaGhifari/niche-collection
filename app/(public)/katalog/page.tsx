import { getPublishedProducts, getCategories } from "@/lib/data";
import { CatalogClient } from "./catalog-client";

export default function KatalogPage() {
  const products = getPublishedProducts();
  const categories = getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Katalog Produk</h1>
      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
