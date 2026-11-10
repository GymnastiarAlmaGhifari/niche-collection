"use client";

import { useState } from "react";
import { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ArrowUpRight, Check } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites-store";
import { toast } from "sonner";

export function ProductDetailActions({ product }: { product: Product }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);
  const [copied, setCopied] = useState(false);

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(product.id);
      toast.info("Dihapus dari favorit", { description: product.name });
    } else {
      addFavorite(product.id);
      toast.success("Disimpan ke favorit", { description: product.name });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || `Lihat ${product.name} di Niche Collection`,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Tautan disalin ke clipboard!", { description: url });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error("Gagal menyalin tautan");
    }
  };

  const getMarketplaceName = (mp: string = "") => {
    const map: Record<string, string> = {
      amazon: "Amazon",
      shopee: "Shopee",
      tokopedia: "Tokopedia",
      lazada: "Lazada",
      temu: "Temu",
    };
    return map[mp.toLowerCase()] || mp.charAt(0).toUpperCase() + mp.slice(1);
  };

  const outboundUrl = product.affiliateUrl || `/pergi/${product.slug || product.id}`;

  return (
    <div className="flex flex-col gap-3.5 mb-10">
      {/* Primary Marketplace CTA Button */}
      <a
        href={outboundUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="no-underline w-full"
      >
        <Button
          size="lg"
          className="w-full h-14 rounded-2xl text-base font-bold shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 group cursor-pointer bg-primary text-primary-foreground"
        >
          <span>Beli di {getMarketplaceName(product.marketplace)}</span>
          <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </Button>
      </a>

      {/* Secondary Actions: Simpan + Bagikan */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={toggleFavorite}
          className={`h-12 rounded-2xl text-sm font-semibold border-border/80 transition-all duration-200 cursor-pointer ${
            favorite
              ? "border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
              : "hover:border-primary/40 hover:text-primary hover:bg-muted/50"
          }`}
        >
          <Heart
            className={`mr-2 h-4 w-4 transition-all duration-200 ${
              favorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{favorite ? "Tersimpan" : "Simpan"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleShare}
          className="h-12 rounded-2xl text-sm font-semibold border-border/80 hover:border-primary/40 hover:text-primary hover:bg-muted/50 transition-all duration-200 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Bagikan</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

