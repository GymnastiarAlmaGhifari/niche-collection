import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getConfig, getCategories, getFeaturedProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const config = await getConfig();
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/50 via-accent/20 to-background py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <Badge
            className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 cursor-default transition-colors duration-200"
            variant="secondary"
          >
            {config.tagline}
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-7 leading-[1.1] tracking-tight">
            {config.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>
          <Link href="/katalog">
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-base font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
              Lihat Semua Produk
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-10 text-center">
          Jelajahi Kategori
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 stagger-children">
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/kategori/${cat.slug}`} className="no-underline">
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer h-full flex flex-col items-center justify-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent text-primary flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <span className="text-xl sm:text-2xl font-bold">
                    {cat.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10 sm:mb-12">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                Produk Pilihan Kurator
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Produk terbaik yang sudah kami uji dan seleksi
              </p>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:flex text-primary text-sm font-semibold hover:text-primary/80 items-center gap-1 transition-colors duration-200 group no-underline"
            >
              Lihat Lainnya{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 stagger-children">
            {featuredProducts.slice(0, 5).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/katalog">
              <Button
                variant="outline"
                className="w-full h-12 cursor-pointer hover:border-primary/50 hover:text-primary transition-all duration-200"
              >
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
