export default function AdminPengaturanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Pengaturan akun admin dan notifikasi.</p>
      </div>
      <div className="border rounded-md bg-card p-8 text-center text-muted-foreground">
        <p>Form ubah password dan pengaturan email notifikasi (Resend) akan diaktifkan di Tahap 2 & 3.</p>
      </div>
    </div>
  );
}
