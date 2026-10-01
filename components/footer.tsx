import Link from "next/link";
import { getConfig } from "@/lib/data";

export function Footer() {
  const config = getConfig();

  return (
    <footer className="border-t bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl text-primary mb-4">{config.siteName}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {config.footer.aboutText}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {config.footer.affiliateDisclaimer}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/katalog" className="hover:text-primary">Semua Produk</Link></li>
              <li><Link href="/tentang" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="hover:text-primary">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kebijakan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {config.footer.policyLinks.map((link, i) => (
                <li key={i}><Link href={link.href} className="hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
