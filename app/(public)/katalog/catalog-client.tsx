"use client";
import { useState, useMemo } from "react";
import { Product, Category } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Hash, PackageOpen } from "lucide-react";
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
  const [selectedMarketplace, setSelectedMarketplace] =
    useState<string>("all");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchName =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNumber =
        searchNumber === "" ||
        p.productNumber === searchNumber ||
        p.productNumber.includes(searchNumber);
      const matchCat = selectedCat === "all" || p.categoryId === selectedCat;
      const matchMarketplace =
        selectedMarketplace === "all" ||
        p.marketplace.toLowerCase() === selectedMarketplace.toLowerCase();

      return matchName && matchNumber && matchCat && matchMarketplace;
    });
  }, [initialProducts, searchQuery, searchNumber, selectedCat, selectedMarketplace]);

  const marketplaces = ["all", "shopee", "amazon", "tokopedia", "lazada", "temu"];

  const getMarketplaceColor = (mp: string, isActive: boolean) => {
    if (!isActive) return "";
    const colors: Record<string, string> = {
      all: "bg-primary text-primary-foreground",
      shopee: "bg-[#EE4D2D] text-white",
      amazon: "bg-[#FF9900] text-black",
      tokopedia: "bg-[#42B549] text-white",
      lazada: "bg-[#6441A5] text-white",
      temu: "bg-[#E55B2D] text-white",
    };
    return colors[mp] || "bg-primary text-primary-foreground";
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchProduct", lang)}
            className="pl-10 h-11 bg-background hover:border-primary/40 focus:border-primary transition-colors duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-[160px]">
          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("productNo", lang)}
            className="pl-10 h-11 bg-background hover:border-primary/40 focus:border-primary transition-colors duration-200"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
        </div>
        <select
          className="flex h-11 w-full sm:w-[220px] items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring hover:border-primary/40 transition-colors duration-200 cursor-pointer appearance-none"
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

      {/* Marketplace Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-border/50">
        {marketplaces.map((mp) => (
          <button
            key={mp}
            onClick={() => setSelectedMarketplace(mp)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              selectedMarketplace === mp
                ? `${getMarketplaceColor(mp, true)} shadow-sm scale-[1.02]`
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {mp === "all"
              ? t("allPlatforms", lang)
              : mp.charAt(0).toUpperCase() + mp.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border">
          <PackageOpen className="mx-auto h-14 w-14 text-muted-foreground/30 mb-5" />
          <p className="text-muted-foreground text-lg mb-1">
            {t("noProductsFound", lang)}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {lang === "id"
              ? "Coba ubah filter atau kata kunci pencarian."
              : "Try changing the filter or search keyword."}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6"
              : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
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
