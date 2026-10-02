"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/data";
import { editProductAction } from "@/actions/product";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  // Instead of getProductBySlug handling all state, we get initial product
  const product = getProductBySlug(id);

  // Form State
  const [productNumber, setProductNumber] = useState(product?.productNumber || "");
  const [name, setName] = useState(product?.name || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [curatorReview, setCuratorReview] = useState(product?.curatorReview || "");
  const [affiliateUrl, setAffiliateUrl] = useState(product?.affiliateUrl || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || "");
  const [status, setStatus] = useState<string>(product?.status || "published");
  const [marketplace, setMarketplace] = useState<string>(product?.marketplace || "shopee");
  const [mainImageId, setMainImageId] = useState(product?.images[0]?.driveId || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!product) {
      toast.error("Produk tidak ditemukan");
      return;
    }

    const res = await editProductAction(product.id, {
      productNumber,
      name,
      shortDescription,
      curatorReview,
      affiliateUrl,
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
      status,
      marketplace,
      images: [{ driveId: mainImageId, alt: name }]
    });

    setLoading(false);

    if (res.success) {
      toast.success("Produk berhasil diperbarui", {
        description: "Commit telah dibuat dan auto-deploy sedang berjalan."
      });
      router.push("/admin/produk");
      router.refresh();
    } else {
      toast.error("Gagal memperbarui produk", {
        description: res.error
      });
    }
  };

  if (!product) {
    return <div className="p-10 text-center">Produk tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Produk</h1>
          <p className="text-muted-foreground">Perbarui data produk di bawah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm font-medium">No. Produk</label>
                    <Input required value={productNumber} onChange={e=>setProductNumber(e.target.value)} />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="text-sm font-medium">Nama Produk</label>
                    <Input required value={name} onChange={e=>setName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi Singkat</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={shortDescription} onChange={e=>setShortDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ulasan Kurator</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={curatorReview} onChange={e=>setCuratorReview(e.target.value)}
                  ></textarea>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link Afiliasi & Harga</label>
                  <Input required type="url" value={affiliateUrl} onChange={e=>setAffiliateUrl(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harga Jual (Rp)</label>
                    <Input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harga Coret (Rp)</label>
                    <Input type="number" value={originalPrice} onChange={e=>setOriginalPrice(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marketplace</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={marketplace} onChange={e=>setMarketplace(e.target.value)}>
                    <option value="shopee">Shopee</option>
                    <option value="tokopedia">Tokopedia</option>
                    <option value="amazon">Amazon</option>
                    <option value="lazada">Lazada</option>
                    <option value="temu">Temu</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> 
                  {loading ? "Menyimpan ke GitHub..." : "Simpan & Deploy"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary" />
                  <label className="text-sm font-medium">Upload Media (Google Drive)</label>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Situs ini 100% statis. Anda harus meng-upload gambar secara manual ke <strong>Google Drive</strong> Anda dengan akses <em>"Anyone with the link can view"</em>.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">ID Gambar Utama</label>
                  <Input required value={mainImageId} onChange={e=>setMainImageId(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
