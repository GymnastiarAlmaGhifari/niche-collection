export default function TentangPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-4xl font-bold mb-6 text-primary">Tentang Niche Collection</h1>
      
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Niche Collection lahir dari keresahan sederhana: mencari produk berkualitas di marketplace kini terasa seperti mencari jarum di tumpukan jerami. Dengan ribuan pilihan, ulasan palsu, dan deskripsi produk yang membingungkan, proses belanja online seringkali justru memakan waktu dan melelahkan.
        </p>
        <p>
          Kami hadir sebagai kurator independen yang mendedikasikan waktu untuk meneliti, membandingkan, dan menguji berbagai produk lintas marketplace seperti Shopee, Tokopedia, Amazon, Lazada, dan Temu. Misi kami adalah menyajikan daftar pilihan terbaik untuk Anda—produk yang benar-benar memberikan nilai tambah, berkualitas baik, dan harganya masuk akal.
        </p>
        
        <h2 className="font-heading text-2xl font-bold text-foreground mt-12 mb-4">Bagaimana Kami Memilih Produk?</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Riset Mendalam:</strong> Kami membaca ratusan ulasan riil dari berbagai platform untuk menyaring produk abal-abal.</li>
          <li><strong>Komparasi Harga:</strong> Kami memastikan produk yang masuk daftar memiliki harga terbaik di kelasnya.</li>
          <li><strong>Uji Langsung:</strong> Sebisa mungkin, kami membeli dan menguji produk secara langsung sebelum merekomendasikannya.</li>
          <li><strong>Kurasi Lintas Platform:</strong> Kami tidak terikat pada satu marketplace, sehingga rekomendasi kami selalu objektif.</li>
        </ul>
        
        <div className="bg-accent/30 p-6 rounded-2xl mt-8">
          <p className="text-foreground font-medium italic">
            "Waktu Anda terlalu berharga untuk dihabiskan menelusuri ratusan halaman marketplace. Biarkan kami yang menyeleksinya, Anda tinggal memilih yang terbaik."
          </p>
        </div>
      </div>
    </div>
  );
}
