"use client";
import Link from "next/link";
import { Star, Heart, ExternalLink } from "lucide-react";
import { Product } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLangStore } from "@/store/lang-store";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { getImageUrl } from "@/lib/utils";
import { t } from "@/lib/translate";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { viewMode } = useUIStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { lang } = useLangStore();
  const favorite = isFavorite(product.id);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 300);
    if (favorite) removeFavorite(product.id);
    else addFavorite(product.id);
  };

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return t("checkPrice", lang);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getMarketplaceTag = (mp: string) => {
    const map: Record<string, string> = {
      amazon: "AMZ",
      shopee: "SHP",
      tokopedia: "TOPED",
      lazada: "LAZ",
      temu: "TEMU",
    };
    return map[mp] || mp.toUpperCase();
  };

  const getMarketplaceName = (mp: string) => {
    const map: Record<string, string> = {
      amazon: "Amazon",
      shopee: "Shopee",
      tokopedia: "Tokopedia",
      lazada: "Lazada",
      temu: "Temu",
    };
    return map[mp] || mp;
  };

  const getMarketplaceColor = (mp: string) => {
    const map: Record<string, string> = {
      shopee: "bg-[#EE4D2D]",
      tokopedia: "bg-[#42B549]",
      amazon: "bg-[#FF9900] text-black",
      lazada: "bg-[#6441A5]",
      temu: "bg-[#E55B2D]",
    };
    return map[mp] || "bg-black/80";
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col h-full cursor-default">
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-br-xl z-20 text-sm shadow-sm">
          #{product.productNumber}
        </div>
        <div
          className={`absolute top-0 right-0 ${getMarketplaceColor(product.marketplace)} text-white font-bold px-3 py-1.5 rounded-bl-xl z-20 text-xs shadow-sm`}
        >
          {getMarketplaceTag(product.marketplace)}
        </div>
        <CardContent className="p-0 flex flex-col sm:flex-row h-full">
          <Link
            href={`/produk/${product.slug}`}
            className="relative w-full sm:w-52 h-52 bg-muted shrink-0 block overflow-hidden no-underline"
          >
            {product.images[0]?.driveId ? (
              <img
                src={getImageUrl(product.images[0].driveId, "w400")}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                No Image
              </div>
            )}
            <button
              onClick={toggleFavorite}
              className={`absolute top-10 right-3 sm:top-3 sm:right-3 p-2.5 bg-background/90 backdrop-blur-sm rounded-full z-30 transition-all duration-200 hover:bg-background hover:scale-110 active:scale-95 ${
                favorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              title={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${favorite ? "fill-current" : ""} ${heartAnimating ? "heart-pulse" : ""}`}
              />
            </button>
          </Link>
          <div className="p-5 flex flex-col flex-1 pl-5 sm:pl-7">
            <div className="flex gap-2 flex-wrap mb-3">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="text-xs bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-default"
                >
                  {badge}
                </Badge>
              ))}
            </div>
            <Link href={`/produk/${product.slug}`} className="no-underline">
              <h3 className="font-heading font-semibold text-lg mb-2 hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {product.shortDescription}
            </p>

            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div>
                  {(product.rating != null || product.soldCount != null) && (
                    <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
                      {product.rating != null && (
                        <>
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {product.rating.toFixed(1)}
                          </span>
                          {product.ratingCount != null && (
                            <span className="text-muted-foreground text-xs font-normal">
                              ({product.ratingCount})
                            </span>
                          )}
                        </>
                      )}
                      {product.soldCount != null && (
                        <>
                          {product.rating != null && (
                            <span className="text-muted-foreground mx-1">
                              •
                            </span>
                          )}
                          <span className="text-muted-foreground text-xs">
                            {product.soldCount}+ {t("sold", lang)}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="font-bold text-xl text-primary">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/produk/${product.slug}`} className="no-underline">
                  <button className="w-full h-10 inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/30 active:bg-accent/80 transition-all duration-200 cursor-pointer">
                    {t("detail", lang)}
                  </button>
                </Link>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="w-full h-10 inline-flex items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/85 hover:shadow-md active:bg-primary/75 transition-all duration-200 gap-1.5 cursor-pointer">
                    {t("goTo", lang)}{" "}
                    {getMarketplaceName(product.marketplace)}
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
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
    <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative h-full flex flex-col cursor-default">
      <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-br-xl z-20 text-sm shadow-sm">
        #{product.productNumber}
      </div>
      <div
        className={`absolute top-0 right-0 ${getMarketplaceColor(product.marketplace)} text-white font-bold px-3 py-1.5 rounded-bl-xl z-20 text-xs shadow-sm`}
      >
        {getMarketplaceTag(product.marketplace)}
      </div>

      <Link
        href={`/produk/${product.slug}`}
        className="relative aspect-square w-full bg-muted block overflow-hidden no-underline"
      >
        {product.images[0]?.driveId ? (
          <img
            src={getImageUrl(product.images[0].driveId, "w600")}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={toggleFavorite}
          className={`absolute top-10 right-3 p-2.5 bg-background/90 backdrop-blur-sm rounded-full z-30 transition-all duration-200 hover:bg-background hover:scale-110 active:scale-95 ${
            favorite
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-red-500"
          }`}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${favorite ? "fill-current" : ""} ${heartAnimating ? "heart-pulse" : ""}`}
          />
        </button>
        <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
          {product.badges.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="text-[10px] py-0.5 bg-secondary/90 text-white border-none shadow-sm backdrop-blur-sm cursor-default"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </Link>

      <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={`/produk/${product.slug}`} className="no-underline">
          <h3 className="font-heading font-semibold text-sm sm:text-base mb-3 hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex flex-col gap-3">
          <div>
            {(product.rating != null || product.soldCount != null) && (
              <div className="flex items-center gap-1 mb-2 text-sm font-medium">
                {product.rating != null && (
                  <>
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.ratingCount != null && (
                      <span className="text-muted-foreground text-xs font-normal">
                        ({product.ratingCount})
                      </span>
                    )}
                  </>
                )}
                {product.soldCount != null && (
                  <>
                    {product.rating != null && (
                      <span className="text-muted-foreground mx-1 text-xs">
                        •
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {product.soldCount}+ {t("sold", lang)}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link href={`/produk/${product.slug}`} className="no-underline">
              <button className="w-full h-9 inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/30 active:bg-accent/80 transition-all duration-200 cursor-pointer">
                {t("detail", lang)}
              </button>
            </Link>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full h-9 inline-flex items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/85 hover:shadow-md active:bg-primary/75 transition-all duration-200 gap-1 cursor-pointer">
                {t("goTo", lang)}{" "}
                {getMarketplaceName(product.marketplace)}
                <ExternalLink className="h-3 w-3 opacity-70" />
              </button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
