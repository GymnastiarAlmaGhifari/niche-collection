"use client";
import Link from "next/link";
import { Search, Heart, LayoutGrid, List, Globe, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { getCategories, getConfig } from "@/lib/data";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Category } from "@/types/catalog";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 flex items-center">
          <img src="/logo.png" alt={config.siteName || "Niche Collection"} className="h-10 sm:h-12 w-auto object-contain" />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <Button variant="ghost" size="sm" onClick={toggleLang} className="font-semibold text-xs sm:text-sm px-2">
            <Globe className="h-4 w-4 mr-1" /> {lang === 'id' ? 'ID' : 'EN'}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleViewMode} title={`Ubah ke mode ${viewMode === 'grid' ? 'list' : 'grid'}`}>
            {viewMode === "grid" ? <List className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
          </Button>
          <Link href="/favorit">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Categories Nav (Mobile scrollable, Desktop inline) */}
      <div className="container mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar border-t md:border-none">
        <Link href="/katalog" className="text-sm font-medium whitespace-nowrap hover:text-primary transition-colors">
          {lang === 'id' ? 'Semua Produk' : 'All Products'}
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/kategori/${cat.slug}`} className="text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
            {cat.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
