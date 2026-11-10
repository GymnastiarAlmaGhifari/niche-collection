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

  const formatPrice = (price?: number | null, currency: string = "IDR") => {
    if (price === null || price === undefined) return t("checkPrice", lang);
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getMarketplaceTag = (mp: string = "") => {
    const map: Record<string, string> = {
      amazon: "Amazon",
      shopee: "Shopee",
      tokopedia: "Tokopedia",
      lazada: "Lazada",
      temu: "Temu",
    };
    return map[mp.toLowerCase()] || mp.toUpperCase();
  };

  const getMarketplaceColor = (mp: string = "") => {
    const map: Record<string, string> = {
      shopee: "bg-[#EE4D2D] text-white",
      tokopedia: "bg-[#03AC0E] text-white",
      amazon: "bg-[#FF9900] text-slate-950 font-bold",
      lazada: "bg-[#0F146D] text-white",
      temu: "bg-[#FB6514] text-white",
    };
    return map[mp.toLowerCase()] || "bg-black/75 text-white";
  };

  // Safe link destination: fallback to ID if slug is not defined
  const productHref = product.slug ? `/produk/${product.slug}` : `/produk/${product.id}`;

  // =====================
  // LIST VIEW MODE
  // =====================
  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden rounded-2xl border border-border/60 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col h-full bg-card">
        <CardContent className="p-0 flex flex-col sm:flex-row h-full">
          {/* Image & Floating Overlays */}
          <Link
            href={productHref}
            className="relative w-full sm:w-56 h-56 bg-muted shrink-0 block overflow-hidden no-underline"
          >
            {product.images && product.images[0]?.driveId ? (
              <img
                src={getImageUrl(product.images[0].driveId, "w400")}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs font-medium">
                No Image
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-semibold tracking-wider shadow-sm">
                #{product.productNumber}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm ${getMarketplaceColor(product.marketplace)}`}
              >
                {getMarketplaceTag(product.marketplace)}
              </span>
              <button
                onClick={toggleFavorite}
                className={`p-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                  favorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-500"
                }`}
                title={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-all duration-200 ${favorite ? "fill-current" : ""} ${heartAnimating ? "heart-pulse" : ""}`}
                />
              </button>
            </div>
          </Link>

          {/* Product Details */}
          <div className="p-5 flex flex-col flex-1 pl-5 sm:pl-7">
            <Link href={productHref} className="no-underline">
              <h3 className="font-heading font-bold text-base sm:text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug cursor-pointer">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="mt-auto flex flex-col gap-3 pt-2">
              <div className="flex items-end justify-between">
                <div>
                  {(product.rating != null || product.soldCount != null) && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium">
                      {product.rating != null && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="font-bold text-foreground">
                            {product.rating.toFixed(1)}
                          </span>
                          {product.ratingCount != null && (
                            <span className="text-muted-foreground font-normal">
                              ({product.ratingCount})
                            </span>
                          )}
                        </div>
                      )}
                      {product.soldCount != null && (
                        <>
                          {product.rating != null && (
                            <span className="text-muted-foreground/50 mx-1">•</span>
                          )}
                          <span className="text-muted-foreground">
                            {product.soldCount}+ {t("sold", lang)}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link href={productHref} className="no-underline">
                  <button className="w-full h-9.5 inline-flex items-center justify-center rounded-xl border border-border/80 bg-background text-xs font-bold text-foreground shadow-xs hover:bg-muted hover:border-primary/40 active:scale-98 transition-all cursor-pointer">
                    {t("detail", lang)}
                  </button>
                </Link>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <button className="w-full h-9.5 inline-flex items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 active:scale-98 transition-all gap-1.5 cursor-pointer">
                    <span>{t("goTo", lang)} {getMarketplaceTag(product.marketplace)}</span>
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // =====================
  // GRID VIEW MODE (Default)
  // =====================
  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/60 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative h-full flex flex-col bg-card cursor-default">
      {/* Image Container */}
      <Link
        href={productHref}
        className="relative aspect-square w-full bg-muted/60 block overflow-hidden no-underline"
      >
        {product.images && product.images[0]?.driveId ? (
          <img
            src={getImageUrl(product.images[0].driveId, "w600")}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs font-medium">
            No Image
          </div>
        )}

        {/* Floating Top Left Badge: Product Number */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-semibold tracking-wider shadow-sm">
            #{product.productNumber}
          </span>
        </div>

        {/* Floating Top Right: Platform Tag + Heart */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm ${getMarketplaceColor(product.marketplace)}`}
          >
            {getMarketplaceTag(product.marketplace)}
          </span>
          <button
            onClick={toggleFavorite}
            className={`p-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              favorite
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-red-500"
            }`}
            title={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-200 ${favorite ? "fill-current" : ""} ${heartAnimating ? "heart-pulse" : ""}`}
            />
          </button>
        </div>
      </Link>

      {/* Card Body */}
      <CardContent className="p-4 sm:p-4.5 flex flex-col flex-1">
        <Link href={productHref} className="no-underline">
          <h3 className="font-heading font-bold text-sm sm:text-base mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          {/* Rating and Sales */}
          {(product.rating != null || product.soldCount != null) && (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {product.rating != null && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="font-bold text-foreground">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.ratingCount != null && (
                    <span className="text-muted-foreground text-[11px] font-normal">
                      ({product.ratingCount})
                    </span>
                  )}
                </div>
              )}
              {product.soldCount != null && (
                <>
                  {product.rating != null && (
                    <span className="text-muted-foreground/50 mx-0.5">•</span>
                  )}
                  <span className="text-muted-foreground text-[11px]">
                    {product.soldCount}+ {t("sold", lang)}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-heading font-extrabold text-base sm:text-lg text-primary">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* Two Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link href={productHref} className="no-underline">
              <button className="w-full h-9 inline-flex items-center justify-center rounded-xl border border-border/80 bg-background text-xs font-bold text-foreground shadow-xs hover:bg-muted hover:border-primary/40 active:scale-98 transition-all cursor-pointer">
                {t("detail", lang)}
              </button>
            </Link>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <button className="w-full h-9 inline-flex items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 active:scale-98 transition-all gap-1 cursor-pointer">
                <span>{t("goTo", lang)} {getMarketplaceTag(product.marketplace)}</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
