import { getPublishedProducts, getCategories } from "@/lib/data";
import { CatalogClient } from "@/app/(public)/katalog/catalog-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const allProducts = await getPublishedProducts();
  const products = allProducts.filter((p) => p.categoryId === category.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors duration-200">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <Link href="/katalog" className="hover:text-primary transition-colors duration-200">
          Katalog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
          <Folder className="h-3.5 w-3.5" />
          Kategori
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Kumpulan kurasi produk terbaik dalam kategori {category.name} lintas berbagai marketplace.
        </p>
      </div>

      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
