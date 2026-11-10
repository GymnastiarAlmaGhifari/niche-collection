"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Hash, PackageOpen, SlidersHorizontal, ArrowUpDown, X, Sparkles } from "lucide-react";
import { t } from "@/lib/translate";

export function CatalogClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const {
    viewMode,
    searchQuery,
    setSearchQuery,
    searchNumber,
    setSearchNumber,
  } = useUIStore();
  const { lang } = useLangStore();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((p) => {
      const matchName =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchNumber =
        searchNumber === "" ||
        p.productNumber === searchNumber ||
        p.productNumber.includes(searchNumber);
      const matchCat = selectedCat === "all" || p.categoryId === selectedCat;
      const matchMarketplace =
        selectedMarketplace === "all" ||
        (p.marketplace && p.marketplace.toLowerCase() === selectedMarketplace.toLowerCase());

      return matchName && matchNumber && matchCat && matchMarketplace;
    });

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "popular":
        result = [...result].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [initialProducts, searchQuery, searchNumber, selectedCat, selectedMarketplace, sortBy]);

  const marketplaces = [
    { key: "all", name: t("allPlatforms", lang), color: "#f58220" },
    { key: "shopee", name: "Shopee", color: "#EE4D2D" },
    { key: "amazon", name: "Amazon", color: "#FF9900" },
    { key: "tokopedia", name: "Tokopedia", color: "#03AC0E" },
    { key: "lazada", name: "Lazada", color: "#0F146D" },
    { key: "temu", name: "Temu", color: "#FB6514" },
  ];

  const isFiltering =
    searchQuery.trim() !== "" ||
    searchNumber.trim() !== "" ||
    selectedCat !== "all" ||
    selectedMarketplace !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSearchNumber("");
    setSelectedCat("all");
    setSelectedMarketplace("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Search & Filter Bar - Clean, Minimalist & Unified */}
      <div className="bg-card/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-border/60 shadow-sm space-y-4">
        {/* Top Input Row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchProduct", lang)}
              className="pl-10 pr-9 h-11 bg-background/80 rounded-xl border-border/70 hover:border-primary/40 focus:border-primary transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Product Number Input */}
          <div className="relative w-full md:w-[150px]">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("productNo", lang)}
              className="pl-10 h-11 bg-background/80 rounded-xl border-border/70 hover:border-primary/40 focus:border-primary transition-all duration-200 font-mono text-sm"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-[200px]">
            <select
              aria-label="Pilih Kategori"
              className="h-11 w-full rounded-xl border border-border/70 bg-background/80 px-4 text-sm font-medium hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer appearance-none"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">{t("allCategories", lang)}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-[180px] relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              aria-label="Urutkan Produk"
              className="h-11 w-full rounded-xl border border-border/70 bg-background/80 pl-10 pr-4 text-sm font-medium hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring transition-colors cursor-pointer appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">{lang === "id" ? "Terbaru" : "Newest"}</option>
              <option value="price-asc">{lang === "id" ? "Harga Terendah" : "Price: Low to High"}</option>
              <option value="price-desc">{lang === "id" ? "Harga Tertinggi" : "Price: High to Low"}</option>
              <option value="rating">{lang === "id" ? "Rating Tertinggi" : "Highest Rating"}</option>
              <option value="popular">{lang === "id" ? "Paling Laris" : "Most Popular"}</option>
            </select>
          </div>
        </div>

        {/* Marketplace Filter Pills - Minimalist & Elegant */}
        <div className="pt-3 border-t border-border/40 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {marketplaces.map((mp) => {
            const isSelected = selectedMarketplace === mp.key;
            return (
              <button
                key={mp.key}
                onClick={() => setSelectedMarketplace(mp.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background shadow-sm scale-[1.02]"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                }`}
              >
                {mp.key !== "all" ? (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: mp.color }}
                  />
                ) : (
                  <Sparkles className="h-3 w-3 shrink-0 opacity-70" />
                )}
                <span>{mp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status Bar (Shows only when filter is active or search applied) */}
      <div className="flex items-center justify-between px-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <span>
            {lang === "id"
              ? `Menampilkan ${filteredProducts.length} dari ${initialProducts.length} produk`
              : `Showing ${filteredProducts.length} of ${initialProducts.length} products`}
          </span>
        </div>
        {isFiltering && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>{lang === "id" ? "Reset Filter" : "Reset Filter"}</span>
          </button>
        )}
      </div>

      {/* Product Grid / List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 sm:py-24 bg-card/50 rounded-2xl border border-dashed border-border/70 p-6">
          <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <PackageOpen className="h-7 w-7" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-1">
            {t("noProductsFound", lang)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            {lang === "id"
              ? "Coba ubah kata kunci pencarian atau pilih platform lain."
              : "Try changing your search keyword or selecting another platform."}
          </p>
          {isFiltering && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              {lang === "id" ? "Tampilkan Semua Produk" : "Show All Products"}
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 stagger-children"
              : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 stagger-children"
          }
        >
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
