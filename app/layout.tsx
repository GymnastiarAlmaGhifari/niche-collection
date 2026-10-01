import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Niche Collection",
  description: "Kurasi Produk Terpilih, Lintas Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}