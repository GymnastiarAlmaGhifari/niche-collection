"use client";
import { useState, useMemo } from "react";
import { Product, Category } from "@/types/catalog";
import { useUIStore } from "@/store/ui-store";
import { useLangStore } from "@/store/lang-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Hash } from "lucide-react";

export function CatalogClient({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
  const { viewMode, searchQuery, setSearchQuery, searchNumber, setSearchNumber } = useUIStore();
  const { lang } = useLangStore();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNumber = searchNumber === "" || p.productNumber === searchNumber || p.productNumber.includes(searchNumber);
      const matchCat = selectedCat === "all" || p.categoryId === selectedCat;
      const matchMarketplace = selectedMarketplace === "all" || p.marketplace.toLowerCase() === selectedMarketplace.toLowerCase();
      
      return matchName && matchNumber && matchCat && matchMarketplace;
    });
  }, [initialProducts, searchQuery, searchNumber, selectedCat, selectedMarketplace]);

  const marketplaces = ["all", "shopee", "amazon", "tokopedia", "lazada", "temu"];
  
  const text = {
    allCats: lang === 'id' ? "Semua Kategori" : "All Categories",
    searchName: lang === 'id' ? "Cari nama produk..." : "Search product name...",
    searchNum: lang === 'id' ? "No. Produk" : "Product No.",
    noProducts: lang === 'id' ? "Tidak ada produk yang ditemukan." : "No products found.",
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={text.searchName}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-[150px]">
          <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={text.searchNum}
            className="pl-9"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
        </div>
        <select 
          className="flex h-10 w-full sm:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
        >
          <option value="all">{text.allCats}</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Marketplace Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {marketplaces.map(mp => (
          <button
            key={mp}
            onClick={() => setSelectedMarketplace(mp)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedMarketplace === mp 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {mp === 'all' ? (lang === 'id' ? 'Semua Platform' : 'All Platforms') : mp.charAt(0).toUpperCase() + mp.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl">
          <p className="text-muted-foreground">{text.noProducts}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
