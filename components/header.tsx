"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, List, Globe, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { getCategories, getConfig } from "@/lib/data";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Category } from "@/types/catalog";
import { t } from "@/lib/translate";

export function Header() {
  const pathname = usePathname();
  const { viewMode, toggleViewMode } = useUIStore();
  const { lang, toggleLang } = useLangStore();
  const { favorites } = useFavoritesStore();

  const [config, setConfig] = useState<any>({ siteName: "Niche Collection" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getConfig().then(setConfig);
    getCategories().then(setCategories);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-xs">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2.5 group no-underline"
        >
          <img
            src="/icon.webp"
            alt="Niche Collection"
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-[#112240] dark:text-slate-100 text-lg sm:text-xl tracking-tight">
                Niche
              </span>
              <span className="font-heading font-black text-[#f58220] text-lg sm:text-xl tracking-tight">
                Collection
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider hidden sm:block mt-0.5">
              Curated Affiliate Hub
            </span>
          </div>
        </Link>

        {/* Header Action Tools */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="font-semibold text-xs px-2.5 h-9 rounded-xl gap-1.5 hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all duration-200 cursor-pointer"
            title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === "id" ? "ID" : "EN"}</span>
          </Button>

          {/* Grid / List View Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleViewMode}
            title={t("switchView", lang)}
            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all duration-200 cursor-pointer"
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>

          {/* Favorites Wishlist Link with Counter */}
          <Link href="/favorit" className="no-underline">
            <Button
              variant="ghost"
              size="icon"
              title={t("myFavorites", lang)}
              className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 active:bg-red-100 transition-all duration-200 relative cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              {mounted && favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-scale-in">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Sub-Header Categories Pill Navigation */}
      <div className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link
            href="/katalog"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 no-underline shrink-0 ${
              pathname === "/katalog"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>{t("allProducts", lang)}</span>
          </Link>

          {categories.map((cat) => {
            const isActive = pathname === `/kategori/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 no-underline shrink-0 ${
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
