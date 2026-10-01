"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getConfig } from "@/lib/data";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export default function KontakPage() {
  const config = getConfig();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12">
        
        <div>
          <h1 className="font-heading text-4xl font-bold mb-4 text-primary">Hubungi Kami</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Punya pertanyaan seputar produk, ingin merekomendasikan produk, atau sekadar ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email</h3>
                <p className="text-muted-foreground mb-1">Untuk kolaborasi dan pertanyaan umum.</p>
                <a href={`mailto:${config.social.email}`} className="text-primary hover:underline font-medium">
                  {config.social.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">WhatsApp</h3>
                <p className="text-muted-foreground mb-1">Respon cepat di jam kerja (09.00 - 17.00 WIB).</p>
                <a href={config.social.whatsapp} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-bold mb-6">Kirim Pesan</h2>
          
          {sent ? (
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Pesan Berhasil Terkirim!</h3>
              <p>Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Kirim Pesan Lain</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Lengkap</label>
                <Input placeholder="Budi Santoso" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Alamat Email</label>
                <Input type="email" placeholder="budi@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topik</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Pertanyaan Produk</option>
                  <option>Rekomendasi Produk</option>
                  <option>Kolaborasi Bisnis</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pesan</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Tuliskan pesan Anda di sini..."
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Pesan Sekarang"}
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
