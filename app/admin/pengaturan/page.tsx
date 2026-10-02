"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye, EyeOff, Shield, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminPengaturanPage() {
  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification email
  const [notifEmail, setNotifEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Password baru tidak cocok!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter!");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password berhasil diubah!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Gagal mengubah password.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notifEmail.trim()) {
      toast.error("Email tidak boleh kosong!");
      return;
    }

    setSavingEmail(true);

    try {
      const res = await fetch("/api/admin/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email notifikasi diperbarui!");
      } else {
        toast.error(data.error || "Gagal menyimpan email.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Pengaturan akun admin dan notifikasi.</p>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Saat Ini</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Baru</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>
            <Button type="submit" disabled={savingPassword}>
              <Save className="mr-2 h-4 w-4" />
              {savingPassword ? "Menyimpan..." : "Ubah Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveEmail} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Penerima Notifikasi</label>
              <Input
                type="email"
                value={notifEmail}
                onChange={e => setNotifEmail(e.target.value)}
                placeholder="admin@nichecollection.com"
              />
              <p className="text-xs text-muted-foreground">
                Email ini digunakan untuk menerima pesan dari halaman Kontak (via Resend).
              </p>
            </div>
            <Button type="submit" disabled={savingEmail}>
              <Save className="mr-2 h-4 w-4" />
              {savingEmail ? "Menyimpan..." : "Simpan Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Password dan email disimpan di Environment Variables pada hosting Anda (Vercel). 
            Untuk mengubahnya secara permanen, buka <strong>Vercel Dashboard → Settings → Environment Variables</strong> dan perbarui nilai <code>ADMIN_PASSWORD</code> atau <code>NOTIFICATION_EMAIL</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
