import { Redis } from "@upstash/redis";
import { getProducts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, TrendingUp } from "lucide-react";

export const revalidate = 0; // Disable cache for this page

export default async function AdminStatistikPage() {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const products = await getProducts();
  const clickData: { id: string, name: string, clicks: number }[] = [];
  let totalClicksAllTime = 0;

  // Fetch click counts for all products
  for (const product of products) {
    try {
      const clicks = await redis.get<number>(`clicks:product:${product.id}`);
      const count = clicks || 0;
      totalClicksAllTime += count;
      
      clickData.push({
        id: product.id,
        name: product.name,
        clicks: count,
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Sort top products
  clickData.sort((a, b) => b.clicks - a.clicks);
  const topProducts = clickData.slice(0, 10);

  // Fetch daily clicks for the last 7 days
  const dailyClicks: { date: string, clicks: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    try {
      const clicks = await redis.get<number>(`clicks:daily:${dateStr}`);
      dailyClicks.push({
        date: dateStr,
        clicks: clicks || 0,
      });
    } catch(e) {
      dailyClicks.push({ date: dateStr, clicks: 0 });
    }
  }

  const todayClicks = dailyClicks[dailyClicks.length - 1].clicks;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistik Klik</h1>
        <p className="text-muted-foreground mt-1">Pantau performa afiliasi Anda secara real-time dari Upstash Redis.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Klik Hari Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Klik (Sepanjang Waktu)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicksAllTime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Produk Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center">
                  <div className="w-8 text-center font-bold text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 truncate pr-4 text-sm font-medium">{p.name}</div>
                  <div className="font-mono text-sm">{p.clicks} klik</div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-sm text-muted-foreground">Belum ada data.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Klik 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-2 pt-4">
              {dailyClicks.map((day) => {
                const max = Math.max(...dailyClicks.map(d => d.clicks), 1);
                const height = `${(day.clicks / max) * 100}%`;
                
                return (
                  <div key={day.date} className="flex flex-col flex-1 items-center gap-2 group relative">
                    <div className="w-full bg-primary/20 rounded-t-sm hover:bg-primary transition-all relative flex flex-col justify-end" style={{ height: '100%', minHeight: '24px' }}>
                      <div className="w-full bg-primary rounded-t-sm" style={{ height }}></div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {day.date.split('-')[2]}/{day.date.split('-')[1]}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.clicks}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
