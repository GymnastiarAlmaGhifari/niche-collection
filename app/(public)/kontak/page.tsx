"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, MapPin, Send } from "lucide-react";

export default function KontakPage() {
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pesan.");
      }

      toast.success("Pesan terkirim!", {
        description: "Terima kasih, kami akan membalas pesan Anda secepatnya.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4 text-primary">Hubungi Kami</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Punya pertanyaan, saran, atau ingin merekomendasikan produk untuk kami kurasi? Jangan ragu untuk menghubungi kami melalui form di bawah ini.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-muted-foreground">halo@nichecollection.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lokasi</h3>
              <p className="text-muted-foreground">Online & Berbasis Remote<br/>Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Anda</label>
                <Input required value={name} onChange={e=>setName(e.target.value)} placeholder="Budi Santoso" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Anda</label>
                <Input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="budi@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subjek</label>
              <Input required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Pertanyaan tentang produk X" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesan</label>
              <textarea 
                required
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tulis pesan Anda di sini..."
                value={message}
                onChange={e=>setMessage(e.target.value)}
              ></textarea>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="mr-2 h-4 w-4" /> 
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
