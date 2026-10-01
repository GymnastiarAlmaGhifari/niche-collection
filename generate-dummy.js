const fs = require('fs');
const path = require('path');

const config = {
  siteName: "Niche Collection",
  tagline: "Kurasi Produk Terpilih, Lintas Marketplace",
  heroTitle: "Produk Pilihan, Harga Terjangkau",
  heroSubtitle: "Kami cari, uji, dan pilih produk terbaik dari Shopee, Amazon, Temu, Tokopedia, dan Lazada — supaya Anda tidak perlu bingung lagi.",
  heroBannerDriveId: null,
  metaDescription: "KurasiNiche adalah tempat terbaik menemukan produk berkualitas yang sudah diuji dan dipilih oleh kurator kami.",
  ogImageDriveId: null,
  social: {
    tiktok: "https://tiktok.com/@kurasiniche",
    facebook: "https://facebook.com/kurasiniche",
    whatsapp: "https://wa.me/628123456789",
    email: "halo@kurasiniche.com"
  },
  footer: {
    aboutText: "KurasiNiche lahir dari keresahan mencari produk berkualitas di tengah ribuan ulasan palsu. Kami menyeleksi dan menguji produk agar Anda tinggal pilih yang terbaik.",
    contactEmail: "halo@kurasiniche.com",
    affiliateDisclaimer: "Situs ini menggunakan tautan afiliasi. Kami mungkin menerima komisi jika Anda membeli produk melalui tautan kami, tanpa biaya tambahan bagi Anda.",
    policyLinks: [
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { label: "Syarat & Ketentuan", href: "/disclaimer" }
    ]
  }
};

const categories = [
  {
    id: "cat-rumah",
    name: "Rumah & Dapur",
    slug: "rumah-dapur",
    icon: "Home",
    order: 1,
    subCategories: [
      { id: "sub-lampu", name: "Lampu & Pencahayaan", slug: "lampu-pencahayaan" },
      { id: "sub-alat-masak", name: "Alat Masak", slug: "alat-masak" },
      { id: "sub-dekorasi", name: "Dekorasi", slug: "dekorasi" }
    ]
  },
  {
    id: "cat-gadget",
    name: "Gadget & Aksesoris",
    slug: "gadget-aksesoris",
    icon: "Smartphone",
    order: 2,
    subCategories: [
      { id: "sub-audio", name: "Audio & Headphone", slug: "audio-headphone" },
      { id: "sub-charger", name: "Charger & Powerbank", slug: "charger-powerbank" },
      { id: "sub-wearable", name: "Wearables", slug: "wearables" }
    ]
  },
  {
    id: "cat-fashion",
    name: "Fashion Pria & Wanita",
    slug: "fashion",
    icon: "Shirt",
    order: 3,
    subCategories: [
      { id: "sub-tas", name: "Tas & Dompet", slug: "tas-dompet" },
      { id: "sub-jam", name: "Jam Tangan", slug: "jam-tangan" },
      { id: "sub-aksesoris", name: "Aksesoris Fashion", slug: "aksesoris-fashion" }
    ]
  }
];

const generateProducts = () => {
  const products = [];
  let idCounter = 1;

  const templates = [
    { cat: "cat-rumah", sub: "sub-lampu", name: "Lampu Meja LED Minimalis 3 Mode", slug: "lampu-meja-led-minimalis-3-mode", price: 189000, badges: ["Terlaris", "Hemat Listrik"], marketplace: "shopee" },
    { cat: "cat-rumah", sub: "sub-alat-masak", name: "Wajan Anti Lengket Marble Coating", slug: "wajan-anti-lengket-marble", price: 250000, badges: ["Premium", "BPA Free"], marketplace: "tokopedia" },
    { cat: "cat-rumah", sub: "sub-dekorasi", name: "Rak Dinding Ambalan Kayu Jati", slug: "rak-dinding-kayu-jati", price: 120000, badges: ["Estetik", "Lokal"], marketplace: "lazada" },
    
    { cat: "cat-gadget", sub: "sub-audio", name: "TWS Earbuds Bluetooth 5.3 ANC", slug: "tws-earbuds-bluetooth-53-anc", price: 399000, badges: ["Rekomendasi", "Audio Jernih"], marketplace: "tokopedia" },
    { cat: "cat-gadget", sub: "sub-charger", name: "Kepala Charger GaN 65W Fast Charging", slug: "charger-gan-65w-fast-charging", price: 215000, badges: ["Fast Charge", "Ringkas"], marketplace: "shopee" },
    { cat: "cat-gadget", sub: "sub-wearable", name: "Smartwatch Fitness Tracker AMOLED", slug: "smartwatch-fitness-amoled", price: 549000, badges: ["Layar Tajam", "Tahan Air"], marketplace: "amazon" },
    
    { cat: "cat-fashion", sub: "sub-tas", name: "Slingbag Kanvas Anti Air", slug: "slingbag-kanvas-anti-air", price: 145000, badges: ["Kasual", "Waterproof"], marketplace: "shopee" },
    { cat: "cat-fashion", sub: "sub-jam", name: "Jam Tangan Analog Minimalis Pria", slug: "jam-tangan-analog-minimalis", price: 299000, badges: ["Elegan", "Klasik"], marketplace: "tokopedia" },
    { cat: "cat-fashion", sub: "sub-aksesoris", name: "Kacamata Hitam Polarized UV400", slug: "kacamata-hitam-polarized-uv400", price: 95000, badges: ["Outdoor", "Trendy"], marketplace: "temu" }
  ];

  // We need 24 products, we have 9 templates. We'll loop and vary slightly.
  for (let i = 0; i < 24; i++) {
    const template = templates[i % templates.length];
    const isFeatured = i < 6; // First 6 are featured
    const productNumber = i + 1;
    
    products.push({
      id: `prod-${productNumber.toString().padStart(3, '0')}`,
      productNumber: `${productNumber}`,
      slug: `${template.slug}-${productNumber}`,
      name: `${template.name} V${Math.floor(i / templates.length) + 1}`,
      categoryId: template.cat,
      subCategoryId: template.sub,
      price: template.price + (i * 5000),
      originalPrice: template.price + (i * 5000) + 50000,
      currency: 'IDR',
      rating: 4.5 + (Math.random() * 0.5),
      ratingCount: 100 + Math.floor(Math.random() * 900),
      shortDescription: `Produk berkualitas dari kategori ${template.cat}. Sangat cocok untuk kebutuhan sehari-hari dengan desain modern.`,
      curatorReview: "Kami sudah menguji produk ini secara langsung. Kualitas materialnya sangat baik dan sesuai dengan harga yang ditawarkan. Sangat direkomendasikan untuk Anda yang mencari keseimbangan antara harga dan fungsi.",
      specs: [
        { label: "Warna", value: i % 2 === 0 ? "Hitam" : "Putih" },
        { label: "Garansi", value: "1 Tahun" },
        { label: "Kondisi", value: "Baru" }
      ],
      images: [
        { driveId: "1A2B3C4D5E6F7G8H9I0J", alt: "Gambar Produk Utama" },
        { driveId: "2B3C4D5E6F7G8H9I0J1K", alt: "Gambar Produk Samping" }
      ],
      videoDriveId: null,
      affiliateUrl: "https://shope.ee/abcXYZ123",
      marketplace: template.marketplace,
      badges: template.badges,
      isFeatured: isFeatured,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return products;
};

const catalogData = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  config: config,
  categories: categories,
  products: generateProducts(),
  revisions: []
};

const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'catalog.json'), JSON.stringify(catalogData, null, 2));
console.log('Successfully generated data/catalog.json');
