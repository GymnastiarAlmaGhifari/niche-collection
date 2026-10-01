"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/data";
import { deleteProductAction } from "@/actions/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminProdukPage() {
  const [products, setProducts] = useState(getProducts());
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setLoading(id);
      const res = await deleteProductAction(id);
      setLoading(null);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
        toast.success("Produk dihapus", { description: "Perubahan disave ke GitHub" });
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
          <p className="text-muted-foreground mt-1">Tambah, edit, atau hapus produk dari katalog.</p>
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
                <th className="px-4 py-3 font-medium">Nama Produk</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground font-mono">#{p.productNumber}</td>
                  <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoryId}</td>
                  <td className="px-4 py-3 text-muted-foreground">Rp {p.price.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className={p.status === 'published' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/produk/${p.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => handleDelete(p.id)}
                        disabled={loading === p.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
