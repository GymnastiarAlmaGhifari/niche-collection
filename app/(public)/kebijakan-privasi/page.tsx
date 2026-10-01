export default function KebijakanPrivasiPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-4xl font-bold mb-6 text-primary">Kebijakan Privasi</h1>
      
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Privasi Anda sangat penting bagi kami di KurasiNiche. Dokumen Kebijakan Privasi ini menguraikan jenis informasi pribadi yang kami terima dan kumpulkan, serta bagaimana informasi tersebut digunakan.
        </p>
        
        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">1. Pelacakan Klik Afiliasi</h2>
        <p>
          Ketika Anda mengklik tombol untuk membeli produk (menuju marketplace), sistem kami mencatat aktivitas klik tersebut untuk keperluan statistik internal. Data yang dicatat hanya berupa jumlah klik pada suatu produk dan hash anonim dari alamat IP (hanya disimpan sementara selama 24 jam untuk mencegah spam klik ganda). Kami <strong>tidak</strong> mengumpulkan nama, alamat, atau informasi identitas pribadi apa pun.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">2. Cookies dan Penyimpanan Lokal (Local Storage)</h2>
        <p>
          Situs ini menggunakan <em>Local Storage</em> pada browser Anda semata-mata untuk meningkatkan kenyamanan Anda saat menggunakan situs. Misalnya, untuk menyimpan:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Preferensi tampilan katalog (Grid atau List view).</li>
          <li>Daftar produk favorit yang Anda simpan.</li>
        </ul>
        <p>
          Data ini hanya tersimpan di perangkat Anda dan tidak dikirimkan ke server kami.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">3. Data Pihak Ketiga (Marketplace)</h2>
        <p>
          Perlu diingat bahwa saat Anda beralih ke situs marketplace (seperti Shopee, Tokopedia, dll.), Anda tunduk pada Kebijakan Privasi dari masing-masing platform tersebut. Kami tidak memiliki kendali atau tanggung jawab atas bagaimana marketplace memproses data transaksi Anda.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">4. Perubahan Kebijakan</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui setiap perubahan.
        </p>
      </div>
    </div>
  );
}
