import translate from "translate";

// Use Google's free translation engine
translate.engine = "google";

// In-memory cache to avoid redundant translations within a session
const cache = new Map<string, string>();

/**
 * Translate a single text string from Indonesian to English.
 * Returns the translated string, or the original if translation fails.
 */
export async function translateText(
  text: string,
  from: string = "id",
  to: string = "en"
): Promise<string> {
  if (!text || text.trim() === "") return text;

  const cacheKey = `${from}:${to}:${text}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const result = await translate(text, { from, to });
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text
  }
}

/**
 * Translate multiple text strings in a batch (serially to avoid rate limits).
 * Returns an object mapping original key->translated text.
 */
export async function translateBatch(
  texts: Record<string, string>,
  from: string = "id",
  to: string = "en"
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(texts)) {
    result[key] = await translateText(value, from, to);
  }

  return result;
}

/**
 * UI dictionary — static strings used across the frontend.
 * Each entry has 'id' (Indonesian) and 'en' (English) versions.
 * The English translations are system-provided, not admin-entered.
 */
export const uiDictionary: Record<string, { id: string; en: string }> = {
  // Header
  allProducts: { id: "Semua Produk", en: "All Products" },
  switchView: { id: "Ubah tampilan", en: "Switch view" },

  // Homepage
  viewAllProducts: { id: "Lihat Semua Produk", en: "View All Products" },
  exploreCategories: { id: "Jelajahi Kategori", en: "Explore Categories" },
  curatorPicks: { id: "Produk Pilihan Kurator", en: "Curator's Picks" },
  curatorPicksDesc: {
    id: "Produk terbaik yang sudah kami uji dan seleksi",
    en: "The best products we've tested and curated",
  },
  viewMore: { id: "Lihat Lainnya", en: "View More" },

  // Catalog
  catalogTitle: { id: "Katalog Produk", en: "Product Catalog" },
  allCategories: { id: "Semua Kategori", en: "All Categories" },
  searchProduct: { id: "Cari nama produk...", en: "Search product name..." },
  productNo: { id: "No. Produk", en: "Product No." },
  noProductsFound: {
    id: "Tidak ada produk yang ditemukan.",
    en: "No products found.",
  },
  allPlatforms: { id: "Semua Platform", en: "All Platforms" },

  // Product Card
  detail: { id: "Detail", en: "Detail" },
  goTo: { id: "Ke", en: "Go to" },
  sold: { id: "terjual", en: "sold" },
  checkPrice: { id: "Harga Cek di Toko", en: "Check Price in Store" },

  // Product Detail
  home: { id: "Beranda", en: "Home" },
  catalog: { id: "Katalog", en: "Catalog" },
  reviews: { id: "Ulasan", en: "Reviews" },
  curatorReview: { id: "Ulasan Kurator", en: "Curator Review" },
  briefSpecs: { id: "Spesifikasi Singkat", en: "Brief Specifications" },
  buyAt: { id: "Beli di", en: "Buy at" },
  save: { id: "Simpan", en: "Save" },
  share: { id: "Bagikan", en: "Share" },
  productVideo: { id: "Video Produk", en: "Product Video" },
  noImage: { id: "Tidak ada gambar", en: "No image" },
  videoNotSupported: {
    id: "Browser Anda tidak mendukung pemutar video.",
    en: "Your browser does not support the video player.",
  },

  // Favorites
  myFavorites: { id: "Favorit Saya", en: "My Favorites" },
  noFavorites: {
    id: "Belum ada produk favorit.",
    en: "No favorite products yet.",
  },
  noFavoritesDesc: {
    id: "Jelajahi katalog dan klik ikon hati untuk menyimpannya di sini.",
    en: "Browse the catalog and click the heart icon to save items here.",
  },

  // Footer
  links: { id: "Tautan", en: "Links" },
  aboutUs: { id: "Tentang Kami", en: "About Us" },
  contact: { id: "Kontak", en: "Contact" },
  policies: { id: "Kebijakan", en: "Policies" },

  // Contact
  contactUs: { id: "Hubungi Kami", en: "Contact Us" },
  contactDesc: {
    id: "Punya pertanyaan, saran, atau ingin merekomendasikan produk untuk kami kurasi? Jangan ragu untuk menghubungi kami melalui form di bawah ini.",
    en: "Have a question, suggestion, or want to recommend a product for us to curate? Don't hesitate to reach out through the form below.",
  },
  email: { id: "Email", en: "Email" },
  location: { id: "Lokasi", en: "Location" },
  locationDesc: {
    id: "Online & Berbasis Remote",
    en: "Online & Remote-Based",
  },
  yourName: { id: "Nama Anda", en: "Your Name" },
  yourEmail: { id: "Email Anda", en: "Your Email" },
  subject: { id: "Subjek", en: "Subject" },
  message: { id: "Pesan", en: "Message" },
  sendMessage: { id: "Kirim Pesan", en: "Send Message" },
  sending: { id: "Mengirim...", en: "Sending..." },
  messageSent: { id: "Pesan terkirim!", en: "Message sent!" },
  messageSentDesc: {
    id: "Terima kasih, kami akan membalas pesan Anda secepatnya.",
    en: "Thank you, we'll reply to your message as soon as possible.",
  },
  sendFailed: {
    id: "Gagal mengirim pesan.",
    en: "Failed to send message.",
  },
  questionPlaceholder: {
    id: "Pertanyaan tentang produk X",
    en: "Question about product X",
  },
  writeMessage: {
    id: "Tulis pesan Anda di sini...",
    en: "Write your message here...",
  },

  // Category page
  bestProducts: {
    id: "Kumpulan produk terbaik dalam kategori",
    en: "Best curated products in category",
  },
  bestSubProducts: {
    id: "Kumpulan produk terbaik dalam sub-kategori",
    en: "Best curated products in sub-category",
  },
};

/**
 * Get a UI string based on current language.
 */
export function t(key: string, lang: "id" | "en"): string {
  const entry = uiDictionary[key];
  if (!entry) return key;
  return entry[lang] || entry["id"];
}
