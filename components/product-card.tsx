"use client";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { viewMode } = useUIStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) removeFavorite(product.id);
    else addFavorite(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/produk/${product.slug}`}>
        <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
          <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-xl z-20 text-sm shadow-sm">
            #{product.productNumber}
          </div>
          <CardContent className="p-0 flex flex-col sm:flex-row h-full">
            <div className="relative w-full sm:w-48 h-48 bg-muted shrink-0">
              {product.images[0]?.driveId ? (
                <img 
                  src={`https://drive.google.com/thumbnail?id=${product.images[0].driveId}&sz=w400`} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No Image</div>
              )}
              <button 
                onClick={toggleFavorite}
                className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary z-10"
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
            <div className="p-4 flex flex-col flex-1 pl-4 sm:pl-6">
              <div className="flex gap-2 flex-wrap mb-2">
                {product.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="text-xs bg-secondary/10 text-secondary hover:bg-secondary/20">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.shortDescription}
              </p>
              
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1 text-sm text-yellow-500 font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs font-normal">({product.ratingCount})</span>
                  </div>
                  <div className="font-semibold text-lg text-primary">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid Mode
  return (
    <Link href={`/produk/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col relative">
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-xl z-20 text-sm shadow-sm">
          #{product.productNumber}
        </div>
        <div className="relative aspect-square w-full bg-muted">
          {product.images[0]?.driveId ? (
            <img 
              src={`https://drive.google.com/thumbnail?id=${product.images[0].driveId}&sz=w600`} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No Image</div>
          )}
          <button 
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary z-10"
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-primary text-primary' : ''}`} />
          </button>
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap z-10">
            {product.badges.map(badge => (
              <Badge key={badge} variant="secondary" className="text-[10px] py-0 bg-secondary/90 text-white border-none shadow-sm backdrop-blur">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto">
            <div className="flex items-center gap-1 mb-2 text-sm text-yellow-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs font-normal">({product.ratingCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
