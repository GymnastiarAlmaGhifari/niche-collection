export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-4xl font-bold mb-6 text-primary">Disclaimer Afiliasi</h1>
      
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Transparansi adalah inti dari cara kami beroperasi di KurasiNiche. Oleh karena itu, kami ingin memberi tahu Anda bahwa situs ini menggunakan tautan afiliasi.
        </p>
        
        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">Apa Itu Tautan Afiliasi?</h2>
        <p>
          Ketika Anda mengklik tautan produk yang ada di situs ini dan melakukan pembelian di marketplace (seperti Shopee, Tokopedia, Amazon, dsb.), kami mungkin menerima komisi kecil dari marketplace tersebut. 
        </p>
        
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl my-6 text-foreground">
          <strong>Penting:</strong> Komisi ini <em>tidak menambah biaya sepeser pun</em> pada harga yang Anda bayar. Harga produk tetap sama, baik Anda menggunakan tautan kami maupun langsung mencarinya di marketplace.
        </div>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">Independensi Kurasi</h2>
        <p>
          Kami menjamin bahwa keberadaan program afiliasi ini tidak memengaruhi objektivitas ulasan kami. Kami hanya merekomendasikan produk yang menurut kami benar-benar bermanfaat, berkualitas tinggi, dan sepadan dengan harganya. 
        </p>
        <p>
          Jika suatu produk memiliki kekurangan, kami akan menyampaikannya secara jujur di bagian "Ulasan Kurator". Misi utama kami adalah membantu Anda berbelanja dengan cerdas, bukan sekadar mencari komisi.
        </p>

        <p className="mt-8">
          Jika Anda memiliki pertanyaan tentang kebijakan afiliasi kami, jangan ragu untuk menghubungi kami melalui halaman <a href="/kontak" className="text-primary hover:underline">Kontak</a>.
        </p>
      </div>
    </div>
  );
}
