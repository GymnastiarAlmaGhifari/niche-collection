import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { getProducts } from "@/lib/data";
import { Redis } from "@upstash/redis";

export const revalidate = 0; // Disable cache

export default async function AdminDashboard() {
  const products = await getProducts();
  const publishedCount = products.filter(p => p.status === 'published').length;
  const draftCount = products.filter(p => p.status === 'draft').length;

  let todayClicks = 0;
  let totalClicks = 0;

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const today = new Date().toISOString().split("T")[0];
    todayClicks = (await redis.get<number>(`clicks:daily:${today}`)) || 0;

    for (const p of products) {
      const c = await redis.get<number>(`clicks:product:${p.id}`);
      if (c) totalClicks += c;
    }
  } catch (error) {
    console.error("Failed to fetch redis stats:", error);
  }

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
            <div className="text-2xl font-bold">{todayClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari kunjungan link afiliasi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Klik Afiliasi</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Akumulasi semua produk
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
