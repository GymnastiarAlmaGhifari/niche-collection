import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { getProducts } from "@/lib/data";

export default function AdminDashboard() {
  const products = getProducts();
  const publishedCount = products.filter(p => p.status === 'published').length;
  const draftCount = products.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Ringkasan aktivitas Niche Collection hari ini.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCount} Publik, {draftCount} Draft
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klik Afiliasi (Hari Ini)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% dari kemarin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klik Afiliasi (7 Hari)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata 172 per hari
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Teratas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Shopee</div>
            <p className="text-xs text-muted-foreground mt-1">
              45% dari total klik
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 shrink-0">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Memperbarui Produk: "Lampu Meja LED"</p>
                    <p className="text-sm text-muted-foreground">Admin merubah harga produk.</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i * 2 + 1} jam lalu
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
