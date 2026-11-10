import { getPublishedProducts, getCategories } from "@/lib/data";
import { CatalogClient } from "./catalog-client";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

export default async function KatalogPage() {
  const products = await getPublishedProducts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Minimalist Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors duration-200">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Katalog</span>
      </nav>

      {/* Page Title & Subtitle */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Kurasi Teruji
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Katalog Produk
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Koleksi rekomendasi produk pilihan terbaik lintas platform e-commerce yang sudah diseleksi dan diuji kualitasnya.
        </p>
      </div>

      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
