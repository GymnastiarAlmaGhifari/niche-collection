"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, ExternalLink, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { deleteProductAction, getAdminProductsAction } from "@/actions/product";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Product } from "@/types/catalog";

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAdminProductsAction().then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setFetching(false);
    }).catch(() => setFetching(false));
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setLoading(id);
      const res = await deleteProductAction(id);
      setLoading(null);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
        toast.success("Produk dihapus", { description: "Terhapus dari database" });
        router.refresh();
      } else {
        toast.error("Gagal menghapus", { description: res.error });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Produk</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, atau hapus produk dari database.</p>
        </div>
        <Link href="/admin/produk/baru">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari produk..." 
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">No.</th>
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fetching ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Memuat data produk...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <span>Tidak ada produk yang ditemukan.</span>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{p.productNumber}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted shrink-0 overflow-hidden border border-border/50 relative">
                          {p.images && p.images[0]?.driveId ? (
                            <img
                              src={getImageUrl(p.images[0].driveId, "w100")}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="max-w-[240px]">
                          <div className="font-semibold truncate text-foreground">{p.name}</div>
                          {p.slug && (
                            <div className="text-[11px] text-muted-foreground truncate font-mono">
                              /produk/{p.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted uppercase tracking-wider text-muted-foreground">
                        {p.marketplace || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.categoryId}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className={p.status === 'published' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}>
                        {p.status || 'draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link href={p.slug ? `/produk/${p.slug}` : `/produk/${p.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Lihat Halaman Publik">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/produk/${p.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Edit Produk">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                          onClick={() => handleDelete(p.id)}
                          disabled={loading === p.id}
                          title="Hapus Produk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
