"use client";
import Link from "next/link";
import { Heart, LayoutGrid, List, Globe } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { getCategories, getConfig } from "@/lib/data";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Category } from "@/types/catalog";
import { t } from "@/lib/translate";

export function Header() {
  const { viewMode, toggleViewMode } = useUIStore();
  const { lang, toggleLang } = useLangStore();

  const [config, setConfig] = useState<any>({ siteName: "Niche Collection" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getConfig().then(setConfig);
    getCategories().then(setCategories);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2.5 group no-underline"
        >
          <img
            src="/icon.webp"
            alt="Niche Collection"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-heading font-extrabold text-[#112240] dark:text-slate-100 text-lg sm:text-xl tracking-tight -mb-1">
              Niche
            </span>
            <span className="font-heading font-extrabold text-[#f58220] text-lg sm:text-xl tracking-tight">
              Collection
            </span>
            {/* <span className="text-[#112240] dark:text-slate-300 text-[0.55rem] sm:text-[0.6rem] font-bold tracking-widest mt-0.5 uppercase">
              Best Collection Choice
            </span> */}
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="font-semibold text-xs sm:text-sm px-2.5 gap-1.5 hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all duration-200"
            title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          >
            <Globe className="h-4 w-4" /> {lang === "id" ? "ID" : "EN"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleViewMode}
            title={t("switchView", lang)}
            className="hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all duration-200"
          >
            {viewMode === "grid" ? (
              <List className="h-5 w-5" />
            ) : (
              <LayoutGrid className="h-5 w-5" />
            )}
          </Button>
          <Link href="/favorit" className="no-underline">
            <Button
              variant="ghost"
              size="icon"
              title={t("myFavorites", lang)}
              className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 active:bg-red-100 transition-all duration-200 relative"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Nav (Mobile scrollable, Desktop inline) */}
      <div className="container mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar border-t border-border/50">
        <Link
          href="/katalog"
          className="text-sm font-semibold whitespace-nowrap text-primary hover:text-primary/80 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full no-underline"
        >
          {t("allProducts", lang)}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full no-underline"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
