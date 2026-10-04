-- ============================================
-- Supabase Seed Data for Niche Collection
-- Jalankan di Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- PASTIKAN sudah menjalankan supabase-schema.sql terlebih dahulu!
-- ============================================

-- =====================
-- 1. SITE CONFIG
-- =====================
INSERT INTO site_config (id, site_name, tagline, hero_title, hero_subtitle, hero_banner_drive_id, meta_description, og_image_drive_id, social, footer)
VALUES (
  1,
  'Niche Collection',
  'Kurasi Produk Terpilih, Lintas Marketplace',
  'Produk Pilihan, Harga Terjangkau',
  'Kami cari, uji, dan pilih produk terbaik dari Shopee, Amazon, Temu, Tokopedia, dan Lazada — supaya Anda tidak perlu bingung lagi.',
  NULL,  -- hero_banner_drive_id: Ganti dengan Google Drive ID banner Anda
  'KurasiNiche adalah tempat terbaik menemukan produk berkualitas yang sudah diuji dan dipilih oleh kurator kami.',
  NULL,  -- og_image_drive_id: Ganti dengan Google Drive ID gambar OG Anda
  '{"tiktok": "https://tiktok.com/@kurasiniche", "facebook": "https://facebook.com/kurasiniche", "whatsapp": "https://wa.me/628123456789", "email": "halo@kurasiniche.com"}'::jsonb,
  '{"aboutText": "KurasiNiche lahir dari keresahan mencari produk berkualitas di tengah ribuan ulasan palsu. Kami menyeleksi dan menguji produk agar Anda tinggal pilih yang terbaik.", "contactEmail": "halo@kurasiniche.com", "affiliateDisclaimer": "Situs ini menggunakan tautan afiliasi. Kami mungkin menerima komisi jika Anda membeli produk melalui tautan kami, tanpa biaya tambahan bagi Anda.", "policyLinks": [{"label": "Kebijakan Privasi", "href": "/kebijakan-privasi"}, {"label": "Syarat & Ketentuan", "href": "/disclaimer"}]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  tagline = EXCLUDED.tagline,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  meta_description = EXCLUDED.meta_description,
  social = EXCLUDED.social,
  footer = EXCLUDED.footer,
  updated_at = now();


-- =====================
-- 2. CATEGORIES
-- =====================
INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
  ('cat-rumah',   'Rumah & Dapur',           'rumah-dapur',        'Home',       1),
  ('cat-gadget',  'Gadget & Aksesoris',      'gadget-aksesoris',   'Smartphone', 2),
  ('cat-fashion', 'Fashion Pria & Wanita',   'fashion',            'Shirt',      3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;


-- =====================
-- 3. SUB-CATEGORIES
-- =====================
INSERT INTO sub_categories (id, category_id, name, slug) VALUES
  -- Rumah & Dapur
  ('sub-lampu',      'cat-rumah',   'Lampu & Pencahayaan', 'lampu-pencahayaan'),
  ('sub-alat-masak', 'cat-rumah',   'Alat Masak',          'alat-masak'),
  ('sub-dekorasi',   'cat-rumah',   'Dekorasi',            'dekorasi'),
  -- Gadget & Aksesoris
  ('sub-audio',      'cat-gadget',  'Audio & Headphone',   'audio-headphone'),
  ('sub-charger',    'cat-gadget',  'Charger & Powerbank', 'charger-powerbank'),
  ('sub-wearable',   'cat-gadget',  'Wearables',           'wearables'),
  -- Fashion
  ('sub-tas',        'cat-fashion', 'Tas & Dompet',        'tas-dompet'),
  ('sub-jam',        'cat-fashion', 'Jam Tangan',          'jam-tangan'),
  ('sub-aksesoris',  'cat-fashion', 'Aksesoris Fashion',   'aksesoris-fashion')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;


-- =====================
-- 4. PRODUCTS (9 produk utama)
-- =====================
INSERT INTO products (id, product_number, slug, name, category_id, sub_category_id, price, original_price, currency, rating, rating_count, short_description, curator_review, affiliate_url, marketplace, badges, is_featured, status, video_drive_id) VALUES

-- PRODUK 1: Lampu Meja LED
('prod-001', '1', 'lampu-meja-led-minimalis-3-mode', 
 'Lampu Meja LED Minimalis 3 Mode', 
 'cat-rumah', 'sub-lampu', 
 189000, 239000, 'IDR', 4.8, 342,
 'Lampu meja LED modern dengan 3 mode pencahayaan (warm, daylight, cool). Hemat listrik dan cocok untuk belajar maupun bekerja.',
 'Kami sudah menggunakan lampu ini selama 3 bulan nonstop. Kualitas pencahayaannya sangat baik, tidak silau di mata, dan tombol sentuhnya responsif. Material plastik ABS-nya kokoh. Sangat recommended untuk pelajar dan pekerja remote.',
 'https://shope.ee/lampu-led-001',
 'shopee', ARRAY['Terlaris', 'Hemat Listrik'], true, 'published', NULL),

-- PRODUK 2: Wajan Anti Lengket
('prod-002', '2', 'wajan-anti-lengket-marble-coating',
 'Wajan Anti Lengket Marble Coating 28cm',
 'cat-rumah', 'sub-alat-masak',
 250000, 300000, 'IDR', 4.7, 518,
 'Wajan marble coating premium 28cm anti lengket tanpa minyak berlebih. Handle anti panas, cocok untuk masak sehari-hari.',
 'Marble coating-nya benar-benar anti lengket, bahkan telur bisa dimasak tanpa minyak. Handle-nya kokoh dan anti panas. Satu-satunya kekurangan: cukup berat. Tapi untuk daya tahan, ini juaranya di range harga segini.',
 'https://tokopedia.link/wajan-marble-002',
 'tokopedia', ARRAY['Premium', 'BPA Free'], true, 'published', NULL),

-- PRODUK 3: Rak Dinding Kayu Jati
('prod-003', '3', 'rak-dinding-ambalan-kayu-jati',
 'Rak Dinding Ambalan Kayu Jati 60cm',
 'cat-rumah', 'sub-dekorasi',
 120000, 170000, 'IDR', 4.6, 203,
 'Rak dinding ambalan dari kayu jati solid ukuran 60cm. Desain minimalis estetik, sudah termasuk bracket besi.',
 'Kayunya benar-benar jati asli, bukan MDF. Bracket besi-nya kuat menahan beban hingga 10kg. Finishing rapi dan natural. Sangat cocok untuk dekorasi ruang tamu atau kamar tidur bergaya Japandi.',
 'https://lazada.co.id/rak-jati-003',
 'lazada', ARRAY['Estetik', 'Lokal'], true, 'published', NULL),

-- PRODUK 4: TWS Earbuds ANC
('prod-004', '4', 'tws-earbuds-bluetooth-53-anc',
 'TWS Earbuds Bluetooth 5.3 ANC',
 'cat-gadget', 'sub-audio',
 399000, 499000, 'IDR', 4.9, 876,
 'True Wireless Stereo dengan Bluetooth 5.3 dan Active Noise Cancelling. Baterai tahan 8 jam, charging case 32 jam total.',
 'Noise cancelling-nya di harga segini luar biasa! Bisa mengurangi suara bising AC dan keramaian kafe. Bass-nya kuat tapi tidak mengalahkan vokal. Latency rendah, cocok juga untuk gaming mobile. Best buy di bawah 500 ribu.',
 'https://tokopedia.link/tws-anc-004',
 'tokopedia', ARRAY['Rekomendasi', 'Audio Jernih'], true, 'published', NULL),

-- PRODUK 5: Charger GaN 65W
('prod-005', '5', 'charger-gan-65w-fast-charging',
 'Kepala Charger GaN 65W Fast Charging',
 'cat-gadget', 'sub-charger',
 215000, 265000, 'IDR', 4.8, 654,
 'Charger GaN 65W dengan 2 port USB-C dan 1 USB-A. Bisa ngecas laptop, tablet, dan HP sekaligus. Ukuran super kecil.',
 'Teknologi GaN membuat charger ini 40% lebih kecil dari charger biasa. Bisa mengisi MacBook Air dari 0-50% dalam 30 menit. Mendukung PD 3.0 dan QC 4.0. Wajib punya untuk yang sering mobile.',
 'https://shope.ee/charger-gan-005',
 'shopee', ARRAY['Fast Charge', 'Ringkas'], true, 'published', NULL),

-- PRODUK 6: Smartwatch AMOLED
('prod-006', '6', 'smartwatch-fitness-tracker-amoled',
 'Smartwatch Fitness Tracker AMOLED',
 'cat-gadget', 'sub-wearable',
 549000, 699000, 'IDR', 4.7, 432,
 'Smartwatch dengan layar AMOLED 1.43 inci, 100+ sport modes, SpO2, heart rate, dan baterai tahan 14 hari.',
 'Layar AMOLED-nya sangat tajam dan terang, bahkan di bawah sinar matahari. Akurasi heart rate dan SpO2 cukup presisi dibandingkan oximeter medis. Baterai benar-benar tahan 12-14 hari dengan penggunaan normal. IP68 waterproof teruji.',
 'https://amazon.com/dp/smartwatch-006',
 'amazon', ARRAY['Layar Tajam', 'Tahan Air'], true, 'published', NULL),

-- PRODUK 7: Slingbag Kanvas
('prod-007', '7', 'slingbag-kanvas-anti-air',
 'Slingbag Kanvas Anti Air',
 'cat-fashion', 'sub-tas',
 145000, 195000, 'IDR', 4.5, 287,
 'Slingbag dari kanvas waterproof dengan resleting YKK. Muat tablet 8 inci, HP, dompet, dan kunci. Tali bisa disesuaikan.',
 'Material kanvas-nya tebal dan benar-benar anti air (sudah tes siram). Resleting YKK smooth dan tahan lama. Kompartemen-nya cukup banyak untuk ukuran sling bag. Cocok untuk daily use dan traveling ringan.',
 'https://shope.ee/slingbag-007',
 'shopee', ARRAY['Kasual', 'Waterproof'], false, 'published', NULL),

-- PRODUK 8: Jam Tangan Analog
('prod-008', '8', 'jam-tangan-analog-minimalis-pria',
 'Jam Tangan Analog Minimalis Pria',
 'cat-fashion', 'sub-jam',
 299000, 399000, 'IDR', 4.6, 165,
 'Jam tangan analog dengan desain minimalis Bauhaus. Case stainless steel 40mm, strap kulit sintetis premium.',
 'Desainnya clean dan elegan bergaya Bauhaus. Case stainless steel-nya tidak mudah tergores. Strap kulit sintetis-nya lembut dan tidak bikin iritasi. Mesin quartz Miyota akurat. Sangat cocok untuk outfit formal maupun kasual.',
 'https://tokopedia.link/jam-analog-008',
 'tokopedia', ARRAY['Elegan', 'Klasik'], false, 'published', NULL),

-- PRODUK 9: Kacamata Polarized
('prod-009', '9', 'kacamata-hitam-polarized-uv400',
 'Kacamata Hitam Polarized UV400',
 'cat-fashion', 'sub-aksesoris',
 95000, 145000, 'IDR', 4.5, 421,
 'Kacamata hitam polarized UV400 protection. Frame TR90 ultra ringan dan fleksibel. Lensa TAC anti glare.',
 'Polarized lens-nya benar-benar efektif mengurangi silau saat menyetir siang hari. Frame TR90-nya super ringan, nyaris tidak terasa saat dipakai. UV400 protection-nya sudah teruji. Di harga under 100 ribu, ini steal deal.',
 'https://temu.com/kacamata-009',
 'temu', ARRAY['Outdoor', 'Trendy'], false, 'published', NULL)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  product_number = EXCLUDED.product_number,
  category_id = EXCLUDED.category_id,
  sub_category_id = EXCLUDED.sub_category_id,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  rating = EXCLUDED.rating,
  rating_count = EXCLUDED.rating_count,
  short_description = EXCLUDED.short_description,
  curator_review = EXCLUDED.curator_review,
  affiliate_url = EXCLUDED.affiliate_url,
  marketplace = EXCLUDED.marketplace,
  badges = EXCLUDED.badges,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  updated_at = now();


-- =====================
-- 5. PRODUCT SPECS
-- =====================
-- Hapus specs lama dulu agar tidak duplikat
DELETE FROM product_specs WHERE product_id IN ('prod-001','prod-002','prod-003','prod-004','prod-005','prod-006','prod-007','prod-008','prod-009');

INSERT INTO product_specs (product_id, label, value) VALUES
  -- Lampu Meja LED
  ('prod-001', 'Daya', '5W'),
  ('prod-001', 'Mode Cahaya', '3 (Warm / Daylight / Cool)'),
  ('prod-001', 'Sumber Daya', 'USB Type-C'),
  ('prod-001', 'Material', 'Plastik ABS + Silikon'),
  ('prod-001', 'Garansi', '1 Tahun'),

  -- Wajan Marble Coating
  ('prod-002', 'Diameter', '28 cm'),
  ('prod-002', 'Coating', 'Marble Non-Stick'),
  ('prod-002', 'Material', 'Aluminium Alloy'),
  ('prod-002', 'Kompatibel', 'Gas, Listrik, Induksi'),
  ('prod-002', 'Berat', '850 gram'),

  -- Rak Dinding Kayu Jati
  ('prod-003', 'Ukuran', '60 x 15 x 2 cm'),
  ('prod-003', 'Material', 'Kayu Jati Solid'),
  ('prod-003', 'Kapasitas Beban', 'Maks 10 kg'),
  ('prod-003', 'Termasuk', 'Bracket besi + sekrup'),
  ('prod-003', 'Finishing', 'Natural Clear Coat'),

  -- TWS Earbuds ANC
  ('prod-004', 'Bluetooth', '5.3'),
  ('prod-004', 'ANC', 'Ya, hingga -35dB'),
  ('prod-004', 'Baterai Earbuds', '8 jam'),
  ('prod-004', 'Baterai Total', '32 jam (dengan case)'),
  ('prod-004', 'Waterproof', 'IPX5'),
  ('prod-004', 'Codec', 'AAC, SBC'),

  -- Charger GaN 65W
  ('prod-005', 'Daya Maksimal', '65W'),
  ('prod-005', 'Port', '2x USB-C + 1x USB-A'),
  ('prod-005', 'Protokol', 'PD 3.0, QC 4.0, PPS'),
  ('prod-005', 'Berat', '120 gram'),
  ('prod-005', 'Sertifikasi', 'FCC, CE, RoHS'),

  -- Smartwatch AMOLED
  ('prod-006', 'Layar', 'AMOLED 1.43"'),
  ('prod-006', 'Resolusi', '466 x 466 px'),
  ('prod-006', 'Baterai', '14 hari (normal), 7 hari (heavy)'),
  ('prod-006', 'Sensor', 'Heart Rate, SpO2, Accelerometer'),
  ('prod-006', 'Waterproof', 'IP68 / 5 ATM'),
  ('prod-006', 'Konektivitas', 'Bluetooth 5.2'),

  -- Slingbag Kanvas
  ('prod-007', 'Material', 'Canvas Waterproof 600D'),
  ('prod-007', 'Ukuran', '30 x 18 x 8 cm'),
  ('prod-007', 'Resleting', 'YKK'),
  ('prod-007', 'Muat', 'Tablet 8", HP, dompet, kunci'),
  ('prod-007', 'Warna', 'Hitam, Abu-abu, Army Green'),

  -- Jam Tangan Analog
  ('prod-008', 'Diameter Case', '40 mm'),
  ('prod-008', 'Material Case', 'Stainless Steel 316L'),
  ('prod-008', 'Strap', 'Kulit Sintetis Premium'),
  ('prod-008', 'Mesin', 'Quartz Miyota'),
  ('prod-008', 'Water Resist', '3 ATM'),

  -- Kacamata Polarized
  ('prod-009', 'Lensa', 'TAC Polarized'),
  ('prod-009', 'UV Protection', 'UV400'),
  ('prod-009', 'Frame', 'TR90 Ultra Ringan'),
  ('prod-009', 'Berat', '25 gram'),
  ('prod-009', 'Termasuk', 'Hard case + kain lap');


-- =====================
-- 6. PRODUCT IMAGES
-- =====================
-- Hapus images lama agar tidak duplikat
DELETE FROM product_images WHERE product_id IN ('prod-001','prod-002','prod-003','prod-004','prod-005','prod-006','prod-007','prod-008','prod-009');

-- CATATAN: Ganti 'GANTI_DENGAN_DRIVE_ID_ANDA' dengan Google Drive File ID asli Anda
-- Atau bisa juga menggunakan URL gambar langsung (lihat dokumentasi)

INSERT INTO product_images (product_id, drive_id, alt, sort_order) VALUES
  -- Lampu Meja LED
  ('prod-001', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Lampu Meja LED - Tampak Depan', 0),
  ('prod-001', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Lampu Meja LED - Tampak Samping', 1),

  -- Wajan Marble Coating
  ('prod-002', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Wajan Marble Coating - Tampak Atas', 0),
  ('prod-002', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Wajan Marble Coating - Detail Coating', 1),

  -- Rak Dinding
  ('prod-003', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Rak Dinding Kayu Jati - Tampilan', 0),

  -- TWS Earbuds
  ('prod-004', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'TWS Earbuds - Dengan Case', 0),
  ('prod-004', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'TWS Earbuds - Detail Earbuds', 1),

  -- Charger GaN
  ('prod-005', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Charger GaN 65W - Tampak Depan', 0),

  -- Smartwatch
  ('prod-006', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Smartwatch AMOLED - Tampak Depan', 0),
  ('prod-006', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Smartwatch AMOLED - Tampak Samping', 1),

  -- Slingbag
  ('prod-007', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Slingbag Kanvas - Tampak Depan', 0),

  -- Jam Tangan
  ('prod-008', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Jam Tangan Analog - Tampak Depan', 0),

  -- Kacamata
  ('prod-009', 'GANTI_DENGAN_DRIVE_ID_ANDA', 'Kacamata Polarized - Tampak Depan', 0);


-- =====================
-- SELESAI!
-- =====================
-- Setelah menjalankan query ini, data Anda sudah siap.
-- Jangan lupa ganti 'GANTI_DENGAN_DRIVE_ID_ANDA' dengan Drive ID gambar asli Anda.
-- Lihat dokumentasi lengkap di file panduan-aplikasi.md
