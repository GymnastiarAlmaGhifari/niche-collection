"use client";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { getImageUrl } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { viewMode } = useUIStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) removeFavorite(product.id);
    else addFavorite(product.id);
  };

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "Harga Cek di Toko";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const getMarketplaceTag = (mp: string) => {
    const map: Record<string, string> = {
      amazon: 'AMZ', shopee: 'SHP', tokopedia: 'TOPED', lazada: 'LAZ', temu: 'TEMU'
    };
    return map[mp] || mp.toUpperCase();
  };

  const getMarketplaceName = (mp: string) => {
    const map: Record<string, string> = {
      amazon: 'Amazon', shopee: 'Shopee', tokopedia: 'Tokopedia', lazada: 'Lazada', temu: 'Temu'
    };
    return map[mp] || mp;
  };

  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 relative flex flex-col h-full">
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-xl z-20 text-sm shadow-sm">
          #{product.productNumber}
        </div>
        <div className="absolute top-0 right-0 bg-black/80 text-white font-bold px-3 py-1 rounded-bl-xl z-20 text-xs shadow-sm">
          {getMarketplaceTag(product.marketplace)}
        </div>
        <CardContent className="p-0 flex flex-col sm:flex-row h-full">
          <Link href={`/produk/${product.slug}`} className="relative w-full sm:w-48 h-48 bg-muted shrink-0 block overflow-hidden">
            {product.images[0]?.driveId ? (
              <img 
                src={getImageUrl(product.images[0].driveId, 'w400')} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No Image</div>
            )}
            <button 
              onClick={toggleFavorite}
              className="absolute top-8 right-2 sm:top-2 sm:right-2 p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary z-30"
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-primary text-primary' : ''}`} />
            </button>
          </Link>
          <div className="p-4 flex flex-col flex-1 pl-4 sm:pl-6">
            <div className="flex gap-2 flex-wrap mb-2">
              {product.badges.map(badge => (
                <Badge key={badge} variant="secondary" className="text-xs bg-secondary/10 text-secondary hover:bg-secondary/20">
                  {badge}
                </Badge>
              ))}
            </div>
            <Link href={`/produk/${product.slug}`}>
              <h3 className="font-heading font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
            
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <div>
                  {(product.rating != null || product.soldCount != null) && (
                    <div className="flex items-center gap-1 mb-1 text-sm font-medium">
                      {product.rating != null && (
                        <>
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-yellow-600">{product.rating.toFixed(1)}</span>
                          {product.ratingCount != null && (
                            <span className="text-muted-foreground text-xs font-normal">({product.ratingCount})</span>
                          )}
                        </>
                      )}
                      {product.soldCount != null && (
                        <>
                          {product.rating != null && <span className="text-muted-foreground mx-1">•</span>}
                          <span className="text-muted-foreground text-xs">{product.soldCount}+ terjual</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="font-semibold text-lg text-primary">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/produk/${product.slug}`}>
                  <button className="w-full h-9 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    Detail
                  </button>
                </Link>
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  <button className="w-full h-9 inline-flex items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                    Ke {getMarketplaceName(product.marketplace)}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid Mode
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
      <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-xl z-20 text-sm shadow-sm">
        #{product.productNumber}
      </div>
      <div className="absolute top-0 right-0 bg-black/80 text-white font-bold px-3 py-1 rounded-bl-xl z-20 text-xs shadow-sm">
        {getMarketplaceTag(product.marketplace)}
      </div>
      
      <Link href={`/produk/${product.slug}`} className="relative aspect-square w-full bg-muted block overflow-hidden">
        {product.images[0]?.driveId ? (
          <img 
            src={getImageUrl(product.images[0].driveId, 'w600')} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No Image</div>
        )}
        <button 
          onClick={toggleFavorite}
          className="absolute top-8 right-2 p-2 bg-background/80 backdrop-blur rounded-full hover:text-primary z-30"
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
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <Link href={`/produk/${product.slug}`}>
          <h3 className="font-heading font-semibold text-base mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex flex-col gap-3">
          <div>
            {(product.rating != null || product.soldCount != null) && (
              <div className="flex items-center gap-1 mb-1.5 text-sm font-medium">
                {product.rating != null && (
                  <>
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-yellow-600">{product.rating.toFixed(1)}</span>
                    {product.ratingCount != null && (
                      <span className="text-muted-foreground text-xs font-normal">({product.ratingCount})</span>
                    )}
                  </>
                )}
                {product.soldCount != null && (
                  <>
                    {product.rating != null && <span className="text-muted-foreground mx-1 text-xs">•</span>}
                    <span className="text-muted-foreground text-xs">{product.soldCount}+ terjual</span>
                  </>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-lg text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link href={`/produk/${product.slug}`}>
              <button className="w-full h-8 inline-flex items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                Detail
              </button>
            </Link>
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
              <button className="w-full h-8 inline-flex items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                Ke {getMarketplaceName(product.marketplace)}
              </button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
