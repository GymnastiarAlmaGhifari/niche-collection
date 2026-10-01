"use client";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function PergiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  
  useEffect(() => {
    // In a real app this would fetch from an API or we pass it as Server Component 
    // but since we need client-side redirect logic easily, we do it here.
    const p = getProductBySlug(id);
    setProduct(p);
    
    if (p) {
      const timer = setTimeout(() => {
        window.location.replace(p.affiliateUrl);
      }, 1500); // Wait 1.5s to show transition
      return () => clearTimeout(timer);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Memuat data produk...</p>
      </div>
    );
  }

  const marketplaceName = product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <h1 className="font-heading text-2xl font-bold mb-3">
        Mengarahkan Anda ke {marketplaceName}...
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Anda sedang dialihkan ke halaman produk <strong>{product.name}</strong> di {marketplaceName}.
      </p>
      
      <Button 
        className="w-full rounded-full h-12" 
        onClick={() => window.location.replace(product.affiliateUrl)}
      >
        Lanjut ke Marketplace Sekarang
      </Button>
      
      <p className="mt-8 text-xs text-muted-foreground/60 max-w-xs mx-auto">
        Dengan melanjutkan, Anda setuju bahwa kami mungkin menerima komisi afiliasi tanpa biaya tambahan bagi Anda.
      </p>
    </div>
  );
}
