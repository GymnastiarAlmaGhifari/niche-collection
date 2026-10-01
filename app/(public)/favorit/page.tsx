"use client";
import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/store/favorites-store";
import { getPublishedProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/catalog";
import { Heart } from "lucide-react";

export default function FavoritPage() {
  const { favorites } = useFavoritesStore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const allProducts = getPublishedProducts();
    const filtered = allProducts.filter(p => favorites.includes(p.id));
    setFavoriteProducts(filtered);
  }, [favorites]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8 flex items-center">
        <Heart className="mr-3 h-8 w-8 text-primary" /> Favorit Saya
      </h1>
      
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Belum ada produk favorit.</p>
          <p className="text-sm text-muted-foreground">Jelajahi katalog dan klik ikon hati untuk menyimpannya di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {favoriteProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
