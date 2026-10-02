"use client";
import { getConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AdminKontenPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  const handleSave = () => {
    setLoading(true);
    // TODO: implement action
    setTimeout(() => {
      setLoading(false);
      toast.success("Fitur simpan konfigurasi ke DB belum diimplementasi sepenuhnya.");
    }, 1000);
  };

  if (!config) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Konfigurasi Situs</h1>
          <p className="text-muted-foreground mt-1">Atur teks, SEO, dan tampilan umum situs.</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identitas & Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Situs</label>
              <Input value={config.siteName || ""} onChange={(e) => setConfig({...config, siteName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline / Badge</label>
              <Input value={config.tagline || ""} onChange={(e) => setConfig({...config, tagline: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input value={config.heroTitle || ""} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={config.heroSubtitle || ""}
                onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer & Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tentang Kami (Footer)</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.footer?.aboutText || ""}
                  onChange={(e) => setConfig({...config, footer: {...config.footer, aboutText: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disclaimer Afiliasi</label>
                <textarea 
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.footer?.affiliateDisclaimer || ""}
                  onChange={(e) => setConfig({...config, footer: {...config.footer, affiliateDisclaimer: e.target.value}})}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
