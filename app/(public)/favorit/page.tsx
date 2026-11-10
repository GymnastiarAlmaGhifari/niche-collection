"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavoritesStore } from "@/store/favorites-store";
import { getPublishedProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/catalog";
import { Heart, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritPage() {
  const { favorites } = useFavoritesStore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getPublishedProducts().then((allProducts) => {
      const filtered = allProducts.filter((p) => favorites.includes(p.id));
      setFavoriteProducts(filtered);
    });
  }, [favorites]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors duration-200">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Favorit</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-500 mb-3">
          <Heart className="h-3.5 w-3.5 fill-current" />
          Wishlist Pribadi
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Produk Favorit Anda
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          Daftar kurasi produk yang telah Anda tandai untuk dibeli nanti.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20 sm:py-24 bg-card/60 rounded-3xl border border-dashed border-border/70 p-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-1">Belum Ada Favorit</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Jelajahi kurasi katalog kami dan klik ikon hati pada produk yang Anda sukai.
          </p>
          <Link href="/katalog">
            <Button className="rounded-full px-6 h-11 text-xs font-bold gap-2">
              <span>Buka Katalog Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 stagger-children">
          {favoriteProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
