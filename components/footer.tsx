import Link from "next/link";
import { getConfig } from "@/lib/data";

export async function Footer() {
  const config = await getConfig();

  return (
    <footer className="border-t border-border/50 bg-card mt-16">
      <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          <div>
            <h3 className="font-heading font-bold text-xl text-primary mb-5">
              {config.siteName}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {config.footer.aboutText}
            </p>
            <p className="text-xs text-muted-foreground/70 italic">
              {config.footer.affiliateDisclaimer}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">
              Tautan
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/katalog"
                  className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 group"
                >
                  <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">
              Kebijakan
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {config.footer?.policyLinks?.map((link: any, i: number) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-14 pt-8 text-center text-sm text-muted-foreground/70">
          &copy; {new Date().getFullYear()} {config.siteName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
