import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Star, CheckCircle2, Play, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "./product-gallery";
import { ProductDetailActions } from "@/components/product-detail-actions";

/**
 * Determines the type & embed URL from a videoDriveId value.
 */
function getVideoEmbed(videoDriveId: string): { type: 'iframe' | 'video'; src: string } | null {
  if (!videoDriveId) return null;
  const v = videoDriveId.trim();

  // YouTube full URL
  const ytMatch = v.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (ytMatch) {
    return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0` };
  }
  // YouTube ID only (11 chars)
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

  if (!product) {
    notFound();
  }

  const formatPrice = (price?: number | null, currency: string = "IDR") => {
    if (price === null || price === undefined) return "Cek di Toko";
    if (currency === "USD") {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const videoEmbed = product.videoDriveId ? getVideoEmbed(product.videoDriveId) : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-5xl animate-fade-in-up">
      {/* Minimalist Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 sm:mb-8 overflow-x-auto no-scrollbar py-1">
        <Link href="/" className="hover:text-primary transition-colors duration-200 shrink-0">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
        <Link href="/katalog" className="hover:text-primary transition-colors duration-200 shrink-0">
          Katalog
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-none font-medium shrink-0">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-14">
        {/* Left: Gallery + Video */}
        <div className="w-full space-y-6">
          <ProductGallery images={product.images} />

          {/* Video Section */}
          {videoEmbed && (
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-muted/30">
                <Play className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Video Review Produk
                </h3>
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

        {/* Right: Info & Actions */}
        <div className="flex flex-col">
          {/* Platform & Product Number Bar */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full bg-black/80 dark:bg-white/10 text-white font-mono text-xs font-bold tracking-wider shadow-xs">
              #{product.productNumber}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {product.marketplace}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight tracking-tight text-foreground">
            {product.name}
          </h1>

          {/* Rating and Sales */}
          {(product.rating != null || product.soldCount != null) && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              {product.rating != null && (
                <div className="flex items-center gap-2 bg-yellow-500/10 dark:bg-yellow-500/20 px-3 py-1.5 rounded-xl text-yellow-600 dark:text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-sm">{product.rating.toFixed(1)}</span>
                  {product.ratingCount != null && (
                    <span className="text-muted-foreground text-xs font-normal">
                      ({product.ratingCount} Ulasan)
                    </span>
                  )}
                </div>
              )}
              {product.soldCount != null && (
                <div className="text-muted-foreground text-xs sm:text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-xl">
                  {product.soldCount}+ Terjual
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-muted/20 border border-border/40">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-0.5">
                Estimasi Harga
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive CTA & Buttons */}
          <ProductDetailActions product={product} />

          {/* Curator Review & Specifications */}
          <div className="space-y-6 pt-2 border-t border-border/40">
            {product.curatorReview && (
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Ulasan & Rekomendasi Kurator
                </h3>
                <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-5 border border-border/60 shadow-xs relative">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    "{product.curatorReview}"
                  </p>
                </div>
              </div>
            )}

            {product.shortDescription && (
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Deskripsi Produk
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground mb-3">
                  Spesifikasi Singkat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-muted/30 rounded-xl px-4 py-2.5 border border-border/40"
                    >
                      <span className="text-muted-foreground text-xs">{spec.label}</span>
                      <span className="font-semibold text-xs text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
