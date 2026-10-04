"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { getProductById, getCategories } from "@/lib/data";
import { editProductAction } from "@/actions/product";
import { Product, Category } from "@/types/catalog";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [productNumber, setProductNumber] = useState("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [curatorReview, setCuratorReview] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [status, setStatus] = useState("published");
  const [marketplace, setMarketplace] = useState("shopee");
  const [mainImageId, setMainImageId] = useState("");
  const [videoId, setVideoId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  useEffect(() => {
    Promise.all([
      getProductById(id),
      getCategories()
    ]).then(([p, cats]) => {
      setProduct(p || null);
      setCategories(cats);
      
      if (p) {
        setProductNumber(p.productNumber);
        setName(p.name);
        setShortDescription(p.shortDescription || "");
        setCuratorReview(p.curatorReview || "");
        setAffiliateUrl(p.affiliateUrl);
        setPrice(p.price?.toString() || "");
        setOriginalPrice(p.originalPrice?.toString() || "");
        setStatus(p.status || "published");
        setMarketplace(p.marketplace || "shopee");
        setMainImageId(p.images?.[0]?.driveId || "");
        setVideoId(p.videoDriveId || "");
        setCategoryId(p.categoryId || cats[0]?.id || "");
        setSubCategoryId(p.subCategoryId || "");
      }
      setInitialLoad(false);
    });
  }, [id]);

  const selectedCategory = categories.find(c => c.id === categoryId);

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
      price: price ? parseInt(price) : null,
      originalPrice: originalPrice ? parseInt(originalPrice) : null,
      status,
      marketplace,
      categoryId,
      subCategoryId,
      images: [{ driveId: mainImageId, alt: name }],
      videoDriveId: videoId || null,
    });

    setLoading(false);

    if (res.success) {
      toast.success("Produk berhasil diperbarui!", {
        description: "Data tersimpan ke Supabase."
      });
      router.push("/admin/produk");
      router.refresh();
    } else {
      toast.error("Gagal memperbarui produk", {
        description: res.error
      });
    }
  };

  if (initialLoad) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  if (!product) {
    return (
      <div className="p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">Produk Tidak Ditemukan</h2>
        <p className="text-muted-foreground">ID &quot;{id}&quot; tidak cocok dengan produk manapun di database.</p>
        <Link href="/admin/produk">
          <Button><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Produk</Button>
        </Link>
      </div>
    );
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
                  <label className="text-sm font-medium">Link Afiliasi</label>
                  <Input required type="url" value={affiliateUrl} onChange={e=>setAffiliateUrl(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harga Jual (Rp) <span className="text-xs text-muted-foreground">— Opsional</span></label>
                    <Input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harga Coret (Rp) <span className="text-xs text-muted-foreground">— Opsional</span></label>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={categoryId} onChange={e => { setCategoryId(e.target.value); setSubCategoryId(""); }}>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {selectedCategory && selectedCategory.subCategories && selectedCategory.subCategories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sub-Kategori</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={subCategoryId} onChange={e=>setSubCategoryId(e.target.value)}>
                      <option value="">-- Pilih --</option>
                      {selectedCategory.subCategories.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> 
                  {loading ? "Menyimpan ke Database..." : "Simpan & Deploy"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary" />
                  <label className="text-sm font-medium">Media (Gambar & Video)</label>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>Gambar:</strong> Mendukung URL Langsung (contoh: <code>https://.../gambar.jpg</code>) atau <strong>Google Drive ID</strong> (contoh: <code>1A2B3C4D...</code>).
                    </p>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">URL / ID Gambar Utama</label>
                      <Input placeholder="URL gambar atau Google Drive ID" value={mainImageId} onChange={e=>setMainImageId(e.target.value)} />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>Video (Opsional):</strong> Mendukung beberapa sumber:
                    </p>
                    <ul className="text-xs text-muted-foreground mb-3 list-disc ml-4 space-y-1">
                      <li>Google Drive ID — contoh: <code className="bg-muted px-1 rounded">1A2B3C4D5E...</code></li>
                      <li>YouTube URL/ID — contoh: <code className="bg-muted px-1 rounded">https://youtu.be/abc123</code></li>
                      <li>URL Video Langsung — contoh: <code className="bg-muted px-1 rounded">https://example.com/video.mp4</code></li>
                    </ul>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">ID / URL Video</label>
                      <Input placeholder="Google Drive ID, YouTube URL/ID, atau URL video langsung" value={videoId} onChange={e=>setVideoId(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
