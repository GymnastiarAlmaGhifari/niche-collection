import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, ArrowUpRight, Share2, Heart, Play, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "./product-gallery";

/**
 * Determines the type & embed URL from a videoDriveId value.
 * Supports:
 *  - Google Drive file IDs  → embedded via drive.google.com/file/d/.../preview
 *  - YouTube video IDs or full URLs → embedded via youtube-nocookie.com
 *  - Direct video URLs (.mp4, .webm, etc.) → rendered with <video> tag
 */
function getVideoEmbed(videoDriveId: string): { type: 'iframe' | 'video'; src: string } | null {
  if (!videoDriveId) return null;
  const v = videoDriveId.trim();

  // YouTube full URL
  const ytMatch = v.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (ytMatch) {
    return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0` };
  }
  // YouTube ID only (11 chars, alphanumeric + dash/underscore)
  if (/^[\w-]{11}$/.test(v)) {
    return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${v}?rel=0` };
  }
  // Direct video URL
  if (/^https?:\/\/.+\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(v)) {
    return { type: 'video', src: v };
  }
  // Default: treat as Google Drive file ID
  return { type: 'iframe', src: `https://drive.google.com/file/d/${v}/preview` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product || product.status !== 'published') {
    notFound();
  }

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "Cek di Toko";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const videoEmbed = product.videoDriveId ? getVideoEmbed(product.videoDriveId) : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 max-w-5xl animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors duration-200">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/katalog" className="hover:text-primary transition-colors duration-200">
          Katalog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-none font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        {/* Left: Gallery + Video */}
        <div className="w-full space-y-6 sm:space-y-8">
          <ProductGallery images={product.images} />

          {/* Video Section */}
          {videoEmbed && (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/50 bg-muted/20">
                <Play className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-sm font-semibold">Video Produk</h3>
              </div>
              <div className="relative aspect-video w-full bg-black">
                {videoEmbed.type === 'iframe' ? (
                  <iframe
                    src={videoEmbed.src}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`Video ${product.name}`}
                  />
                ) : (
                  <video
                    src={videoEmbed.src}
                    className="absolute inset-0 w-full h-full object-contain"
                    controls
                    preload="metadata"
                    playsInline
                  >
                    Browser Anda tidak mendukung pemutar video.
                  </video>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex gap-2 flex-wrap mb-5">
            {product.badges.map(badge => (
              <span key={badge} className="px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold cursor-default transition-colors duration-200 hover:bg-secondary/20">
                {badge}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-5 leading-tight tracking-tight">
            {product.name}
          </h1>

          {(product.rating != null || product.soldCount != null) && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-7">
              {product.rating != null && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-semibold">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg">{product.rating.toFixed(1)}</span>
                  </div>
                  {product.ratingCount != null && (
                    <div className="text-muted-foreground text-sm">
                      {product.ratingCount} Ulasan
                    </div>
                  )}
                </div>
              )}
              {product.soldCount != null && (
                <div className="flex items-center gap-2">
                  {product.rating != null && <div className="w-1.5 h-1.5 rounded-full bg-border" />}
                  <div className="text-muted-foreground text-sm font-medium">
                    {product.soldCount}+ Terjual
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-3 mb-10">
            <span className="text-3xl sm:text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through mb-1">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-12">
            <Link href={`/pergi/${product.slug}`} target="_blank" rel="nofollow sponsored noopener">
              <Button size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
                Beli di {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
                <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-full hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer">
                <Heart className="mr-2 h-4 w-4" /> Simpan
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-full hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" /> Bagikan
              </Button>
            </div>
          </div>

          {/* Review & Specs */}
          <div className="space-y-10">
            <div>
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Ulasan Kurator
              </h3>
              <div className="bg-muted/20 rounded-2xl p-5 sm:p-6 border border-border/30">
                <p className="text-muted-foreground leading-relaxed">
                  {product.curatorReview}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Spesifikasi Singkat</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between sm:flex-col bg-muted/15 rounded-xl px-4 py-3 border border-border/20 hover:border-border/40 transition-colors duration-200">
                    <span className="text-muted-foreground text-sm">{spec.label}</span>
                    <span className="font-medium text-sm text-right sm:text-left mt-0 sm:mt-1">{spec.value}</span>
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
