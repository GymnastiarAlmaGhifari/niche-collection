"use client";
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Video, ExternalLink, Loader2 } from "lucide-react";
import { Product } from "@/types/catalog";

export default function AdminMediaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Collect all media (images + videos) from products
  const mediaItems: { productName: string; type: "image" | "video"; driveId: string; alt: string }[] = [];

  products.forEach((p) => {
    if (p.images) {
      p.images.forEach((img) => {
        if (img.driveId) {
          mediaItems.push({ productName: p.name, type: "image", driveId: img.driveId, alt: img.alt });
        }
      });
    }
    if (p.videoDriveId) {
      mediaItems.push({ productName: p.name, type: "video", driveId: p.videoDriveId, alt: `Video ${p.name}` });
    }
  });

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Galeri Media</h1>
        <p className="text-muted-foreground mt-1">
          Daftar semua gambar & video dari Google Drive yang digunakan di produk. Total: {mediaItems.length} media.
        </p>
      </div>

      {mediaItems.length === 0 ? (
        <div className="border rounded-md bg-card p-8 text-center text-muted-foreground">
          <p>Belum ada media. Tambahkan produk dengan Google Drive ID untuk melihat preview di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item, i) => (
            <Card key={i} className="overflow-hidden group">
              <div className="relative aspect-square bg-muted">
                {item.type === "image" ? (
                  <img
                    src={`https://drive.google.com/thumbnail?id=${item.driveId}&sz=w300`}
                    alt={item.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-card">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  {item.type === "image" ? (
                    <span className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> IMG
                    </span>
                  ) : (
                    <span className="bg-red-500/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Video className="h-3 w-3" /> VID
                    </span>
                  )}
                </div>
                <a
                  href={`https://drive.google.com/file/d/${item.driveId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate">{item.productName}</p>
                <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                  ID: {item.driveId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
