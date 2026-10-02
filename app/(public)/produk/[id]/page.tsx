import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, ArrowUpRight, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "./product-gallery";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product || product.status !== 'published') {
    notFound();
  }

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "Cek di Toko";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Beranda</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-primary">Katalog</Link>
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Gallery */}
        <div className="w-full">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex gap-2 flex-wrap mb-4">
            {product.badges.map(badge => (
              <span key={badge} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                {badge}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500 font-semibold">
              <Star className="h-5 w-5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <div className="text-muted-foreground text-sm">
              {product.ratingCount} Ulasan
            </div>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through mb-1">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            <Link href={`/pergi/${product.slug}`} target="_blank" rel="nofollow sponsored noopener">
              <Button size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all group">
                Beli di {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
                <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-full">
                <Heart className="mr-2 h-4 w-4" /> Simpan
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-full">
                <Share2 className="mr-2 h-4 w-4" /> Bagikan
              </Button>
            </div>
          </div>

          {/* Review & Specs */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-lg font-bold mb-3 flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-secondary" />
                Ulasan Kurator
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.curatorReview}
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold mb-3">Spesifikasi Singkat</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between sm:flex-col border-b sm:border-none pb-2 sm:pb-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-right sm:text-left">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
