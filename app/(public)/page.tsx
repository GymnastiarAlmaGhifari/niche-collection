import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getConfig, getCategories, getFeaturedProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const config = getConfig();
  const categories = getCategories();
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-accent/30 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
            {config.tagline}
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            {config.heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {config.heroSubtitle}
          </p>
          <Link href="/katalog">
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-sm hover:shadow-md transition-all group">
              Lihat Semua Produk
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">Jelajahi Kategori</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/kategori/${cat.slug}`}>
              <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-center group cursor-pointer h-full flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-2">Produk Pilihan Kurator</h2>
              <p className="text-muted-foreground text-sm">Produk terbaik yang sudah kami uji dan seleksi</p>
            </div>
            <Link href="/katalog" className="hidden sm:flex text-primary text-sm font-semibold hover:underline items-center">
              Lihat Lainnya <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts.slice(0, 5).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/katalog">
              <Button variant="outline" className="w-full">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Need to import Badge, wait, let's just use Badge component from shadcn
import { Badge } from "@/components/ui/badge";
