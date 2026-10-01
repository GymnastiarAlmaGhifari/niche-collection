# PRD — KurasiNiche

> **Kurasi Produk Terpilih, Lintas Marketplace, Tanpa Ribet.**

## Daftar Isi

1. [Ringkasan & Tujuan Aplikasi](#1-ringkasan--tujuan-aplikasi)
2. [Batasan Pembuatan Sistem (Versi Awal MVP)](#2-batasan-pembuatan-sistem-versi-awal-mvp)
3. [Daftar Halaman & Struktur Menu](#3-daftar-halaman--struktur-menu-pages--routing)
4. [Pedoman UI/UX & Design System](#4-pedoman-uiux--design-system)
5. [Pembagian Hak Akses Pengguna](#5-pembagian-hak-akses-pengguna)
6. [Alur Kerja dan Fitur Utama](#6-alur-kerja-dan-fitur-utama)
7. [Alur Navigasi & Arsitektur Layout](#7-alur-navigasi--arsitektur-layout)
8. [Kebutuhan Non-Fungsional](#8-kebutuhan-non-fungsional-seo-keamanan--performa)
9. [Panduan Bahasa, Copywriting, & Data Dummy](#9-panduan-bahasa-copywriting--data-dummy)
10. [Fondasi Teknis](#10-fondasi-teknis-untuk-tim-pengembang--programmer--ai)
11. [Tahapan Pengerjaan & Task Breakdown](#11-tahapan-pengerjaan--task-breakdown-actionable-work-breakdown-structure)
12. [Master Starter Prompt](#12-master-starter-prompt-siap-coding-untuk-ai-agent)

---

---


## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: KurasiNiche — *Kurasi Produk Terpilih, Lintas Marketplace, Tanpa Ribet.*
- **Penjelasan Singkat**: KurasiNiche adalah situs kurasi produk afiliasi lintas marketplace (Amazon, Shopee, Temu, Tokopedia, Lazada) yang ultra-ringan dan sepenuhnya statis, dilengkapi panel admin kustom (`/admin`) untuk mengelola katalog, mengatur tampilan situs, dan melacak klik afiliasi — tanpa perlu database konvensional.
- **Masalah yang Diselesaikan**:
  - Audiens dari TikTok, Facebook, dan WhatsApp sering keluar dari aplikasi untuk mencari rekomendasi produk, lalu tersesat di marketplace yang penuh iklan dan pilihan membingungkan.
  - Kurator konten kesulitan mengelola ratusan link afiliasi yang terpencar di berbagai platform dan tidak bisa memantau link mana yang benar-benar menghasilkan klik.
  - Situs afiliasi yang beredar umumnya berat (banyak plugin, iklan, database), sehingga lambat diakses dari perangkat mobile kelas menengah — padahal mayoritas trafik datang dari HP.
  - Pengelolaan konten biasanya butuh developer untuk sekadar mengganti banner, kategori, atau menambah produk baru.
- **Pengguna Aplikasi**:
  - **Pengunjung Publik**: Masyarakat umum (kebanyakan dari media sosial) yang ingin melihat kurasi produk lintas kategori, membandingkan produk, menyimpan favorit, lalu diklik menuju marketplace.
  - **Admin / Kurator**: 1–2 orang pengelola konten (pemilik situs + tim) yang bertugas menambah produk, mengatur kategori, mengubah banner/header/footer, dan memantau statistik klik.
- **Target Keberhasilan**:
  - Lighthouse Performance ≥ 95 dan LCP < 1.5s di koneksi mobile 4G.
  - Waktu publikasi produk baru dari form admin hingga tampil di situs publik ≤ 3 menit (melalui auto-deploy GitHub → Vercel).
  - Zero database query cost (100% statis) sehingga biaya hosting tetap di tier gratis.
  - Minimal 60% pengunjung mobile menggunakan toggle Grid/List dan 25% menekan tombol afiliasi dalam 30 detik pertama.

---


## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*

### ✅ Yang Dikerjakan:
- Katalog publik statis dengan mode Grid & List, filter kategori 2-level, pencarian instan sisi klien, dan pagination statis.
- Halaman detail produk dengan galeri swipeable, tabel spesifikasi, ulasan kurator, dan tombol afiliasi utama.
- Halaman perantara redirect (`/pergi/[id]`) dengan pelacakan jumlah klik per produk.
- Daftar favorit pengunjung (disimpan di browser via localStorage) dan tombol bagikan ke sosial media.
- Panel admin kustom (`/admin`) dengan login Username & Password (via Environment Variables) dan role admin.
- Modul admin: Kelola Produk (CRUD), Kelola Kategori & Sub-kategori, Konfigurasi Header/Footer, Kelola Media, Riwayat Perubahan & Rollback, Statistik Klik Afiliasi.
- Integrasi GitHub REST API untuk commit `catalog.json` yang memicu auto-deploy.
- Notifikasi Email ke kurator saat proses simpan/deploy berhasil atau gagal.


### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Registrasi & login untuk pengunjung umum (hanya admin yang punya akun).
- Sistem komentar, rating dari pengunjung, atau forum diskusi.
- Multi-bahasa (hanya Bahasa Indonesia).
- Integrasi pembayaran langsung di situs (semua transaksi terjadi di marketplace).
- Sinkronisasi harga otomatis dari marketplace (harga diinput manual oleh kurator).
- Aplikasi mobile native (web responsive sudah cukup).
- Multi-role granular (hanya role `admin`; belum ada `editor`, `viewer`, dsb).

---


## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*

### A. Public Area (Tanpa Login)
- `/` (Beranda): Hero banner dari konfigurasi JSON, kategori unggulan, produk terpilih (featured), dan CTA ke katalog.
- `/katalog` (Katalog Lengkap): Grid/List produk dengan filter kategori 2-level, search instan, toggle view, dan pagination statis.
- `/kategori/[slug]`: Katalog terfilter khusus satu kategori utama.
- `/sub-kategori/[slug]`: Katalog terfilter khusus satu sub-kategori.
- `/produk/[id]`: Halaman detail produk (galeri, spesifikasi, ulasan kurator, tombol afiliasi).
- `/pergi/[id]` (Halaman Perantara Redirect): Halaman transit singkat ("Mengarahkan Anda ke Shopee...") yang mencatat klik lalu redirect ke marketplace.
- `/favorit`: Daftar produk favorit yang disimpan pengunjung di browser.
- `/tentang` (Tentang Kami): Deskripsi misi kurasi dan tim.
- `/disclaimer` (Disclaimer Afiliasi): Penjelasan bahwa situs menerima komisi dari marketplace.
- `/kebijakan-privasi`: Kebijakan data pengunjung (tracking klik anonim, cookies).
- `/kontak`: Formulir kontak sederhana + tautan email & sosial media.


### B. Admin / Kurator Area (Setelah Login)
- `/admin/login` (Login Admin): Form Username & Password sederhana.
- `/admin` (Dashboard Utama): Ringkasan statistik — total produk, produk draft, klik hari ini, klik 7 hari terakhir, aktivitas terakhir.
- `/admin/produk` (Kelola Produk): Tabel produk dengan search, filter status (published/draft), filter kategori, aksi Edit & Hapus.
- `/admin/produk/baru`: Form tambah produk baru (nama, niche, sub-niche, harga, rating, link afiliasi, ID Google Drive gambar/video, dsb).
- `/admin/produk/[id]/edit`: Form edit produk dengan tombol "Simpan & Deploy".
- `/admin/kategori`: Kelola Kategori & Sub-kategori Navbar (tambah/edit/hapus/reorder dengan drag & drop).
- `/admin/konten`: Form Konfigurasi Header (judul, sub-judul, banner), Footer (tentang, kontak, disclaimer), dan meta SEO global.
- `/admin/media`: Kelola Galeri Media Produk — daftar ID Google Drive yang dipakai, preview thumbnail, deteksi link yang rusak.
- `/admin/statistik`: Statistik Klik Afiliasi detail (per produk, per kategori, per marketplace, grafik tren 30 hari, ekspor CSV).
- `/admin/riwayat`: Riwayat Perubahan Data (log commit), dengan tombol Rollback ke versi tertentu.
- `/admin/pengaturan`: Ubah password admin, kelola email notifikasi, dan lihat info deployment terakhir.

---


## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna**: Pendekatan *editorial warm-neutral* untuk memberi kesan kurasi berkelas sekaligus nyaman dilihat lama.
  - Primary (Aksen Kurasi): `HSL(24, 90%, 55%)` — oranye terracotta, dipakai untuk CTA tombol afiliasi & highlight.
  - Primary Dark: `HSL(24, 85%, 42%)` — hover state tombol.
  - Secondary (Support): `HSL(160, 40%, 38%)` — hijau sage, dipakai untuk badge kategori & label status.
  - Background: `HSL(36, 33%, 97%)` — cream hangat, tidak putih menyilaukan.
  - Surface: `HSL(0, 0%, 100%)` — putih untuk kartu di atas background cream.
  - Text Primary: `HSL(20, 14%, 15%)`
  - Text Muted: `HSL(20, 8%, 45%)`
  - Border: `HSL(30, 15%, 88%)`
- **Tipografi**:
  - Heading: **'Plus Jakarta Sans'** (700/800), tracking sedikit rapat (`-0.02em`) untuk kesan modern-editorial.
  - Body: **'Inter'** (400/500), line-height 1.65 untuk kenyamanan baca.
  - Harga & Rating: gunakan **'Inter'] tabular-nums** atau 'JetBrains Mono' agar angka rata rapi.
- **Aturan Komponen**:
  - Sudut membulat `rounded-2xl` untuk kartu, `rounded-full` untuk tombol & badge.
  - Kartu biasa: `shadow-sm`; saat hover: `shadow-md` + `translate-y-[-2px]` transisi 200ms ease-out.
  - Tombol utama CTA afiliasi: `bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition-all` dengan ikon eksternal (Lucide `ArrowUpRight`).
  - Badge kategori: `bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-medium`.
  - Skeleton loading untuk gambar menggunakan shimmer halus berwarna `bg-border/50`.
- **Nuansa & Vibe**: Editorial-magazine, hangat, banyak whitespace, tegas di gambar produk. Micro-animations halus (fade-in produk saat scroll, tombol afiliasi berdenyut lembut saat sudah dilihat user > 10 detik). Toggle Grid/List berubah instan dengan animasi morph. Fokus utama mobile-first: navbar sticky yang ramah jempol, kartu besar untuk Grid mode.

---


## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Publik (Tanpa Login) | Admin / Kurator (Login) |
| :--- | :---: | :---: |
| Beranda, Katalog, Detail Produk | ✅ | ✅ |
| Halaman Perantara Redirect (`/pergi/[id]`) | ✅ | ✅ |
| Daftar Favorit, Bagikan Sosial Media | ✅ | ✅ |
| Halaman Statis (Tentang, Disclaimer, Kebijakan, Kontak) | ✅ | ✅ |
| `/admin/login` | ✅ (form login) | ✅ |
| `/admin` & seluruh sub-rute admin | ❌ (redirect ke login) | ✅ |
| Kelola Produk (Tambah/Edit/Hapus) | ❌ | ✅ |
| Kelola Kategori & Konfigurasi Konten | ❌ | ✅ |
| Riwayat Perubahan & Rollback | ❌ | ✅ |
| Statistik Klik Afiliasi | ❌ | ✅ |
| Unggah/Referensi Media Google Drive | ❌ | ✅ |

*Catatan: Aplikasi ini memiliki dua jenis akses saja — Publik (tanpa login) dan Admin tunggal (via Environment Variables). Untuk versi awal, tidak ada pembedaan sub-role.*

---


## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*


### A. Modul Katalog Produk Publik
1. **Cara Kerja**: Pengunjung membuka `/katalog`, melihat seluruh produk dalam mode Grid (default di mobile) dengan gambar besar dan judul singkat. Menggeser toggle di navbar mengubah ke mode List (thumbnail kiri, detail spesifikasi, rating, harga, dan tombol afiliasi di kanan).
2. **Aturan Sistem**:
   - Produk dengan `status: "draft"` tidak pernah ditampilkan di area publik.
   - Pagination statis: 16 produk per halaman di mode Grid, 20 produk per halaman di mode List.
   - Toggle view disimpan di localStorage agar preferensi pengunjung bertahan di kunjungan berikutnya.
   - Semua gambar menggunakan komponen `<Image>` dengan `loading="lazy"` kecuali gambar pertama (hero) yang `priority`.


### B. Modul Filter Kategori 2-Level & Pencarian Instan
1. **Cara Kerja**: Navbar menampilkan dropdown kategori utama; saat di-hover (desktop) atau di-tap (mobile) muncul sub-kategori. Pengunjung juga bisa mengetik di search bar, dan produk tersaring instan dalam < 100ms tanpa reload.
2. **Aturan Sistem**:
   - Pencarian mencocokkan `name`, `shortDescription`, dan `badges` (case-insensitive).
   - Search menggunakan Zustand store dengan debounce 150ms.
   - Filter kategori & search bekerja bersamaan (AND logic).
   - URL query `?q=...&cat=...&sub=...` disinkronkan agar bisa dibagikan/di-bookmark.


### C. Modul Daftar Favorit & Bagikan Sosial
1. **Cara Kerja**: Pengunjung menekan ikon hati di kartu produk untuk menyimpan ke daftar favorit yang tersimpan di browser. Tombol "Bagikan" memunculkan pilihan WhatsApp, Facebook, dan salin tautan.
2. **Aturan Sistem**:
   - Favorit disimpan di localStorage dengan key `kurasiniche:favorites`.
   - Tidak ada sinkronisasi lintas perangkat (karena tanpa login).
   - Tombol bagikan menggunakan Web Share API bila tersedia; fallback ke modal dengan tombol manual.


### D. Modul Halaman Perantara Redirect & Pelacakan Klik
1. **Cara Kerja**: Saat pengunjung menekan tombol afiliasi di halaman detail, mereka diarahkan ke `/pergi/[id]`. Halaman ini menampilkan komponen transisi singkat ("Mengarahkan Anda ke Shopee...") sambil mencatat klik, lalu melakukan `window.location.replace` ke URL marketplace.
2. **Aturan Sistem**:
   - Pencatatan klik dikirim ke endpoint `/api/track` (POST) yang menulis counter ke **Upstash Redis** (Vercel KV) agar tidak perlu commit Git per klik.
   - Setelah 800ms, redirect otomatis; tersedia tombol "Lanjut ke Marketplace" jika redirect otomatis gagal.
   - Data mentah klik di Redis kemudian disinkronkan (cron harian) ke `analytics.json` di repositori GitHub untuk backup dan pembacaan di dashboard statistik.
   - Redirect menggunakan `nofollow sponsored noopener` untuk mematuhi pedoman SEO afiliasi.


### E. Modul Kelola Produk (Admin CRUD)
1. **Cara Kerja**: Admin mengakses `/admin/produk`, menekan "Tambah Produk Baru", mengisi form (nama, kategori, sub-kategori, harga, rating, link afiliasi, ID Google Drive gambar/video utama + galeri, spesifikasi, ulasan kurator, badges). Menekan "Simpan & Deploy" memicu commit ke GitHub.
2. **Aturan Sistem**:
   - Validasi semua field dengan Zod (nama min 4 karakter, harga > 0, `affiliateUrl` wajib URL valid, minimal 1 ID gambar).
   - Setiap perubahan menyimpan revisi baru di `revisions[]` dengan timestamp, author, dan commit SHA.
   - Status `draft` bisa disimpan tanpa commit ke branch `main` — hanya akan dirilis bersama perubahan berikutnya (opsional, lihat Task 2.4).
   - Field `affiliateUrl` harus mengarah ke domain salah satu dari: `amazon.*`, `shopee.*`, `temu.*`, `tokopedia.*`, `lazada.*`.


### F. Modul Kelola Kategori & Konfigurasi Header/Footer
1. **Cara Kerja**: Admin membuka `/admin/kategori` untuk menambah/mengubah/menghapus kategori & sub-kategori dengan drag-to-reorder. Admin membuka `/admin/konten` untuk mengubah judul hero, sub-judul, banner, footer, dan meta SEO.
2. **Aturan Sistem**:
   - Setiap kategori punya `order` (integer) sebagai urutan tampil di navbar.
   - Sub-kategori dimiliki oleh satu kategori; menghapus kategori akan menolak jika masih ada produk yang terkait (harus dipindah dulu).
   - Perubahan di `/admin/konten` langsung tercermin di seluruh halaman publik setelah deploy.


### G. Modul Kelola Galeri Media
1. **Cara Kerja**: Admin membuka `/admin/media` untuk melihat semua ID Google Drive yang dipakai beserta preview thumbnail. Ada indikator status: `OK`, `Thumbnail gagal dimuat`, atau `Tidak terpakai`.
2. **Aturan Sistem**:
   - Thumbnail Google Drive diakses via `https://drive.google.com/thumbnail?id={FILE_ID}&sz=w1000`.
   - Sistem melakukan health check (HEAD request) minimal saat halaman /admin/media dibuka untuk menandai file yang sudah dipublikasikan.
   - Ada tombol "Ganti" untuk menukar ID gambar di semua produk yang memakai ID lama.
   - Jika file tidak lagi publik, admin diberi banner peringatan.


### H. Modul Riwayat Perubahan & Rollback
1. **Cara Kerja**: Admin membuka `/admin/riwayat` untuk melihat daftar commit ke `catalog.json` beserta pesan perubahan. Menekan "Rollback" pada sebuah versi akan menjadikan `catalog.json` kembali seperti versi tersebut, lalu commit sebagai revisi baru.
2. **Aturan Sistem**:
   - Rollback selalu *forward-only* — riwayat tidak dihapus, hanya dibuat commit baru dengan pesan `rollback: ke revisi {id}`.
   - Setiap rollback mengirim notifikasi email.
   - Riwayat diambil langsung dari GitHub Commits API (200 commit terakhir).


### I. Modul Statistik Klik Afiliasi
1. **Cara Kerja**: Admin membuka `/admin/statistik` untuk melihat dashboard angka klik — hari ini, 7 hari, 30 hari; leaderboard 10 produk paling diklik; breakdown per marketplace; dan grafik garis tren 30 hari. Ada tombol ekspor CSV.
2. **Aturan Sistem**:
   - Sumber data: endpoint Redis (Upstash) real-time + `analytics.json` (backup harian).
   - Klik unik dihitung per IP hash yang di-anonymize (SHA-256 + salt) dalam rentang 24 jam (menghindari spam klik berulang).
   - Grafik dirender dengan Recharts (ringan, tree-shakeable).


### J. Modul Notifikasi Email
1. **Cara Kerja**: Setiap kali admin menekan "Simpan & Deploy", sistem mengirim email ke alamat notifikasi berisi status (Berhasil/Gagal), ringkasan perubahan, dan link ke commit GitHub.
2. **Aturan Sistem**:
   - Provider email: **Resend** (free tier 100 email/hari cukup untuk MVP).
   - Template email minimal dengan styling konsisten dengan design system.
   - Jika commit gagal 3 kali berturut-turut, sistem mengirim email peringatan khusus ke admin.

---


## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*


### Arsitektur Layout (Persisten)
- **Public Layout**: Header/navbar sticky di atas (logo + toggle Grid/List + dropdown 2-level + search) dan Footer lengkap (tentang, kontak, disclaimer afiliasi, tautan kebijakan).
- **Admin Layout**: Sidebar kiri (fixed, collapsible di mobile) berisi menu produk, kategori, konten, media, statistik, riwayat, pengaturan; Header kecil di atas dengan breadcrumb, indikator "Deploy terakhir", dan menu profil admin.


### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung dari TikTok/FB/WA] --> B[Beranda /]
    B --> C{Pilih Aksi}
    C -->|Lihat Katalog| D[/katalog]
    C -->|Klik Kategori| E[/kategori/slug]
    D --> F[Filter 2-Level + Search Instan]
    E --> F
    F --> G[Toggle Grid / List]
    G --> H[Klik Kartu Produk]
    H --> I[/produk/id]
    I --> J{Tombol Afiliasi?}
    J -->|Ya| K[/pergi/id - Catat Klik -> Redis]
    K --> L[Redirect ke Marketplace Amazon/Shopee/Temu]
    I -->|Simpan Favorit| M[localStorage]
    M --> N[/favorit - Halaman Favorit]
    I -->|Bagikan| O[Web Share API -> WA/FB/Salin Link]

    P[Admin / Kurator] --> Q[/admin/login]
    Q --> R{Kredensial Valid?}
    R -->|Tidak| Q
    R -->|Ya| S[/admin Dashboard]
    S --> T{Pilih Modul}
    T -->|Produk| U[/admin/produk CRUD]
    T -->|Kategori| V[/admin/kategori]
    T -->|Konten| W[/admin/konten - Header/Footer]
    T -->|Media| X[/admin/media]
    T -->|Statistik| Y[/admin/statistik]
    T -->|Riwayat| Z[/admin/riwayat + Rollback]
    U --> AA[Form Simpan & Deploy]
    V --> AA
    W --> AA
    X --> AA
    AA --> AB[Next.js API Route -> GitHub REST API]
    AB --> AC[Commit catalog.json ke Branch main]
    AC --> AD[Vercel Auto-Deploy 1-3 Menit]
    AD --> AE[Email Notifikasi ke Kurator]
    AB -->|Gagal| AF[Email Notifikasi Gagal]
```

---


## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**: Wajib menggunakan `generateMetadata()` dinamis di setiap halaman produk/kategori (title, description, canonical, OG image via Google Drive thumbnail). Sitemap otomatis (`sitemap.xml`) dan `robots.txt` disediakan statis. Schema.org `Product` JSON-LD disematkan di halaman detail. Tautan afiliasi memakai `rel="nofollow sponsored noopener"`.
- **Keamanan**: Login admin memakai hash password (bcrypt) di Environment Variables, proteksi rate-limit 5 percobaan login / 15 menit. Seluruh API Routes admin dilindungi middleware NextAuth. Token GitHub disimpan di server-only env (tidak pernah terekspos ke client). Sanitasi input dari form admin (nama produk, deskripsi) dengan `sanitize-html` untuk mencegah XSS. Validasi schema input dengan Zod di server actions. CSRF token otomatis dari NextAuth.
- **Performa**: Target Lighthouse ≥ 95 (Mobile). Semua halaman publik dirender SSG (`export const dynamic = 'force-static'`). Gambar dari Google Drive diproksi via Cloudflare Page Rules (`Cache Everything`, `Edge TTL 1 bulan`). Bundle JS dipisah per-route (Next.js code-splitting default), Recharts diimpor dengan dynamic import agar tidak membebani katalog. Font di-self-host via `next/font` untuk menghindari FOUT.
- **Observabilitas**: Semua error commit GitHub & Redis dilog ke `console.error` yang tersimpan di Vercel Logs, dan direkap ke email notifikasi saat kegagalan.

---


## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, hangat, dan membumi. Menggunakan kata "Anda" dan "Kami". Hindari jargon pemasaran berlebihan; fokus pada alasan kurasi ("Kenapa produk ini?"). Tombol CTA memakai kata kerja konkret: "Lihat di Shopee", "Buka di Amazon", "Simpan ke Favorit".
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks aplikasi.


### Contoh Data Dummy — Produk
```json
{
  "id": "prod-001",
  "slug": "lampu-meja-led-minimalis-3-mode",
  "name": "Lampu Meja LED Minimalis 3 Mode Dimmer",
  "categoryId": "cat-rumah",
  "subCategoryId": "sub-lampu",
  "price": 189000,
  "originalPrice": 279000,
  "currency": "IDR",
  "rating": 4.8,
  "ratingCount": 1240,
  "shortDescription": "Cocok untuk meja kerja WFH, 3 mode cahaya hangat-netral-dingin, hemat daya USB-C.",
  "curatorReview": "Kami sudah pakai 3 bulan untuk sesi kerja malam. Cahaya hangatnya lembut, tidak bikin mata cepat lelah. Kualitas build-nya jauh di atas ekspektasi untuk harga segini.",
  "specs": [
    { "label": "Daya", "value": "9 Watt" },
    { "label": "Konektor", "value": "USB-C" },
    { "label": "Mode Cahaya", "value": "Hangat, Netral, Dingin" },
    { "label": "Material", "value": "Aluminium Alloy + ABS" }
  ],
  "images": [
    { "driveId": "1A2B3C4D5E6F7G8H9I0J", "alt": "Lampu meja tampak depan" },
    { "driveId": "2B3C4D5E6F7G8H9I0J1K", "alt": "Detail tombol dimmer" }
  ],
  "videoDriveId": "3C4D5E6F7G8H9I0J1K2L",
  "affiliateUrl": "https://shope.ee/abcXYZ123",
  "marketplace": "shopee",
  "badges": ["Terlaris", "Hemat Listrik"],
  "isFeatured": true,
  "status": "published",
  "createdAt": "2025-01-14T08:00:00Z",
  "updatedAt": "2025-01-22T10:30:00Z"
}
```


### Contoh Data Dummy — Kategori & Config
```json
{
  "categories": [
    {
      "id": "cat-rumah",
      "name": "Rumah & Dapur",
      "slug": "rumah-dapur",
      "icon": "Home",
      "order": 1,
      "subCategories": [
        { "id": "sub-lampu", "name": "Lampu & Pencahayaan", "slug": "lampu-pencahayaan" },
        { "id": "sub-alat-masak", "name": "Alat Masak", "slug": "alat-masak" }
      ]
    },
    {
      "id": "cat-gadget",
      "name": "Gadget & Aksesoris",
      "slug": "gadget-aksesoris",
      "icon": "Smartphone",
      "order": 2,
      "subCategories": [
        { "id": "sub-audio", "name": "Audio & Headphone", "slug": "audio-headphone" }
      ]
    }
  ],
  "config": {
    "siteName": "KurasiNiche",
    "tagline": "Kurasi Produk Terpilih, Lintas Marketplace",
    "heroTitle": "Produk Pilihan, Harga Terjangkau",
    "heroSubtitle": "Kami cari, uji, dan pilih produk terbaik dari Shopee, Amazon, Temu, Tokopedia, dan Lazada — supaya Anda tidak perlu bingung lagi."
  }
}
```

---


## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Bahasa & Framework**: **Next.js 15 (App Router)** + **TypeScript**. Halaman publik dirender SSG (`force-static`), API Routes & Server Actions untuk admin CMS.
- **Tampilan Antarmuka (UI)**: **Tailwind CSS** + **shadcn/ui** + **Lucide Icons** + **Radix** (bawaan shadcn). Animasi micro dengan **Framer Motion** ringan (impor lazy).
- **State Management**: **Zustand** untuk store publik (toggle view, search query, filter kategori, daftar favorit) dan store form admin (draft produk sebelum submit).
- **Autentikasi**: **NextAuth.js (Credentials Provider)** dengan satu akun admin (username & password dari `.env`), password di-hash dengan **bcrypt**. Sesi berbasis JWT.
- **Sumber Data**: File `data/catalog.json` di repositori GitHub (single source of truth). Dibaca langsung oleh halaman publik saat build (SSG) — **tanpa database konvensional**.
- **Integrasi CMS**: **GitHub REST API** (`octokit/rest`) untuk membaca & menulis `catalog.json`, dengan commit message terstruktur. Token disimpan server-side saja.
- **Storage Klik**: **Upstash Redis** (dipasang via Vercel Marketplace) untuk counter klik real-time. Backup harian ke `data/analytics.json` melalui Vercel Cron.
- **Media Hosting**: **Google Drive** (folder publik) dikoordinasikan dengan **Cloudflare** (Page Rules: Cache Everything, Edge TTL 1 bulan). Gambar diakses via `https://drive.google.com/thumbnail?id={ID}&sz=w1200`.
- **Notifikasi Email**: **Resend** (free tier) untuk email transaksional status deploy.
- **Deployment**: **Vercel** (auto-deploy dari GitHub). Cron job Vercel untuk backup klik harian.


### Struktur Skema Data (TypeScript — `data/catalog.json`)
```typescript
// types/catalog.ts — Single Source of Truth untuk data JSON di repositori

export interface SiteConfig {
  siteName: string
  tagline: string
  heroTitle: string
  heroSubtitle: string
  heroBannerDriveId: string | null
  metaDescription: string
  ogImageDriveId: string | null
  social: {
    tiktok: string
    facebook: string
    whatsapp: string
    email: string
  }
  footer: {
    aboutText: string
    contactEmail: string
    affiliateDisclaimer: string
    policyLinks: { label: string; href: string }[]
  }
}

export interface SubCategory {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string          // Nama ikon Lucide
  order: number
  subCategories: SubCategory[]
}

export interface ProductImage {
  driveId: string
  alt: string
}

export interface ProductSpec {
  label: string
  value: string
}

export type Marketplace = 'amazon' | 'shopee' | 'temu' | 'tokopedia' | 'lazada'

export interface Product {
  id: string
  slug: string
  name: string
  categoryId: string
  subCategoryId: string
  price: number
  originalPrice?: number
  currency: 'IDR' | 'USD'
  rating: number
  ratingCount: number
  shortDescription: string
  curatorReview: string
  specs: ProductSpec[]
  images: ProductImage[]
  videoDriveId?: string | null
  affiliateUrl: string
  marketplace: Marketplace
  badges: string[]
  isFeatured: boolean
  status: 'published' | 'draft'
  createdAt: string         // ISO 8601
  updatedAt: string         // ISO 8601
}

export interface RevisionEntry {
  id: string
  timestamp: string
  author: string
  action: 'create' | 'update' | 'delete' | 'rollback' | 'config'
  target: string            // Contoh: "product:prod-001"
  message: string
  commitSha?: string
}

export interface CatalogData {
  version: string           // Contoh: "1.0.0"
  lastUpdated: string
  config: SiteConfig
  categories: Category[]
  products: Product[]
  revisions: RevisionEntry[]
}

// analytics.json — Backup klik harian dari Redis
export interface AnalyticsSnapshot {
  date: string              // YYYY-MM-DD
  totalClicks: number
  perProduct: Record<string, number>       // { productId: count }
  perMarketplace: Record<Marketplace, number>
  perCategory: Record<string, number>      // { categoryId: count }
}

export interface AnalyticsData {
  lastSyncedAt: string
  snapshots: AnalyticsSnapshot[]
}
```


### Variabel Lingkungan (`.env.example`)
```env
# Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Autentikasi Admin (NextAuth Credentials)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-dengan-openssl-rand-base64-32
ADMIN_USERNAME=kurator
ADMIN_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuv...  # bcrypt hash

# Integrasi GitHub CMS
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=username-github-anda
GITHUB_REPO=kurasiniche
GITHUB_BRANCH=main
GITHUB_DATA_PATH=data/catalog.json
GITHUB_ANALYTICS_PATH=data/analytics.json

# Upstash Redis untuk Click Tracking
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxx

# Notifikasi Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NOTIFICATION_EMAIL=kurator@kurasiniche.com
NOTIFICATION_FROM=no-reply@kurasiniche.com

# Cloudflare (opsional, untuk cache purge via API)
CLOUDFLARE_ZONE_ID=xxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxx
```

---


## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut, dikelompokkan per Milestone Fase. Setiap fase dirancang selesai 1 putaran penuh sebelum lanjut ke fase berikutnya.*


### Tahap 1: Fondasi UI/UX & Seluruh Halaman Publik + Admin (Dummy Data)
*Tujuan: Membangun 100% antarmuka visual lengkap dan responsif, memakai `data/catalog.json` dummy, sebelum menyentuh autentikasi & integrasi GitHub.*
- [ ] **Task 1.1 (Setup Proyek & Design System)**: Inisialisasi Next.js 15 App Router + TypeScript, pasang Tailwind CSS, shadcn/ui, Lucide Icons, Zustand, Framer Motion. Definisikan CSS variables sesuai Bab 4 (Primary HSL 24/90/55, Background cream, dll). Pasang font Plus Jakarta Sans & Inter via `next/font`. Buat komponen base: Button, Card, Input, Dialog, Badge, Dropdown, Tabs, Skeleton.
- [ ] **Task 1.2 (Data Dummy & Types)**: Buat file `types/catalog.ts` (skema dari Bab 10) dan `data/catalog.json` berisi minimal 3 kategori utama (Rumah & Dapur, Gadget & Aksesoris, Fashion), 6 sub-kategori, dan 24 produk dummy bergaya Bahasa Indonesia (contoh dari Bab 9). Semua harga IDR, rating realistis, `affiliateUrl` dummy.
- [ ] **Task 1.3 (Public Layout & Navbar Sticky)**: Buat `app/(public)/layout.tsx` dengan Header sticky (logo KurasiNiche, toggle Grid/List via Zustand, dropdown 2-level kategori, search bar interaktif) dan Footer lengkap. Pastikan dropdown responsif mobile (drawer) dan desktop (hover).
- [ ] **Task 1.4 (Halaman Beranda `/`)**: Render hero banner dari `config` JSON, seksi kategori unggulan, dan grid produk `isFeatured: true`. Tambahkan micro-animation fade-in saat scroll.
- [ ] **Task 1.5 (Halaman Katalog `/katalog`)**: Bangun grid/list produk dengan toggle, dropdown filter 2-level, search instan (debounce 150ms via Zustand), dan pagination statis (16 produk/halaman grid, 20/halaman list). Sinkronkan query param `?q=&cat=&sub=&page=`.
- [ ] **Task 1.6 (Halaman Kategori `/kategori/[slug]` & Sub `/sub-kategori/[slug]`)**: Rute dinamis yang memfilter katalog berdasarkan kategori/sub-kategori dan menampilkan judul + deskripsi terfilter.
- [ ] **Task 1.7 (Halaman Detail Produk `/produk/[id]`)**: Bangun galeri swipeable (Embla Carousel), video opsional (embed Google Drive), tabel spesifikasi, ulasan kurator, badge marketplace, tombol afiliasi utama, tombol favorit, dan tombol bagikan (Web Share API + fallback).
- [ ] **Task 1.8 (Halaman Perantara Redirect `/pergi/[id]`)**: UI transisi 800ms dengan pesan "Mengarahkan Anda ke {Marketplace}..." dan tombol manual "Lanjut ke Marketplace". Belum mencatat klik (dicatat di Task 3.1).
- [ ] **Task 1.9 (Halaman Favorit `/favorit`)**: Baca daftar ID dari localStorage `kurasiniche:favorites` via Zustand persist, render ulang grid produk, tampilkan empty state jika kosong.
- [ ] **Task 1.10 (Halaman Statis)**: `/tentang`, `/disclaimer`, `/kebijakan-privasi`, `/kontak` — semua konten lengkap dengan copywriting Bahasa Indonesia, bukan placeholder.
- [ ] **Task 1.11 (Admin Layout & Login UI)**: Buat `app/admin/layout.tsx` dengan sidebar kiri collapsible (menu: Dashboard, Produk, Kategori, Konten, Media, Statistik, Riwayat, Pengaturan) dan header kecil. Bangun halaman `/admin/login` (form User & Password) dengan styling konsisten — belum terhubung NextAuth.
- [ ] **Task 1.12 (Admin Dashboard & Produk Dummy)**: Bangun `/admin` (kartu ringkasan statistik + list aktivitas terakhir), `/admin/produk` (tabel produk dengan search, filter status, aksi Edit/Hapus, modal konfirmasi hapus), `/admin/produk/baru` & `/admin/produk/[id]/edit` (form lengkap + preview thumbnail ID Google Drive + tombol "Simpan & Deploy").
- [ ] **Task 1.13 (Admin Modul Administratif Dummy)**: Bangun `/admin/kategori` (drag-to-reorder), `/admin/konten` (form header/footer/SEO), `/admin/media` (tabel preview + indikator status), `/admin/statistik` (Recharts dummy), `/admin/riwayat` (list riwayat + tombol rollback), `/admin/pengaturan` (form ganti password & email). Semua dengan dummy state interaktif.


### Tahap 2: Autentikasi, GitHub CMS, & Data Binding Dinamis
*Tujuan: Menghidupkan panel admin dengan autentikasi nyata, integrasi GitHub REST API, dan mengganti seluruh dummy data dengan data dinamis dari `catalog.json`.*
- [ ] **Task 2.1 (NextAuth Credentials & Middleware)**: Pasang NextAuth.js Credentials Provider dengan bcrypt hash dari `.env`. Konfigurasi `middleware.ts` untuk melindungi seluruh rute `/admin/*` kecuali `/admin/login`. Implementasi rate-limit login (5 percobaan / 15 menit) via Upstash Redis.
- [ ] **Task 2.2 (GitHub API Client)**: Buat `lib/github.ts` memakai `octokit/rest` dengan fungsi `readCatalog()`, `writeCatalog(data, message)`, `readAnalytics()`, `writeAnalytics()`, dan `listCommits(limit)`. Semua operasi server-side dengan token dari `.env`. Implementasi retry logic 3x dengan exponential backoff.
- [ ] **Task 2.3 (Server Actions untuk CRUD Produk)**: Buat Server Actions `createProduct`, `updateProduct`, `deleteProduct` dengan validasi Zod lengkap. Setiap aksi menambah entry baru ke `revisions[]` dan memanggil `writeCatalog()`. Setelah commit sukses, revalidasi tag halaman publik (`revalidateTag('catalog')`).
- [ ] **Task 2.4 (Server Actions Konfigurasi & Kategori)**: Buat `updateConfig` (header/footer/SEO), `createCategory`, `updateCategory`, `deleteCategory` (tolak hapus jika masih dipakai produk), dan `reorderCategories`. Semua memicu `writeCatalog()` + notifikasi.
- [ ] **Task 2.5 (Riwayat & Rollback)**: Bangun Server Action `rollbackToRevision(commitSha)` yang mengambil `catalog.json` dari commit tersebut via GitHub API, menjadikannya konten baru, dan commit sebagai revisi baru. Tampilkan konfirmasi dialog.
- [ ] **Task 2.6 (Frontend Data Binding)**: Ganti seluruh dummy data di halaman publik (Task 1.3–1.10) dengan data hasil `readCatalog()` saat build SSG. Pastikan `generateStaticParams` menulis semua produk/kategori agar prerender. Cache JSON dengan `unstable_cache` (tag: `catalog`).
- [ ] **Task 2.7 (Admin Data Binding)**: Ganti seluruh tabel & form admin (Task 1.11–1.13) dengan data asli dari `readCatalog()` dan wire-up Server Actions. Tambahkan toast feedback (shadcn `sonner`) setelah submit.
- [ ] **Task 2.8 (Upload Media Workflow)**: Buat komponen khusus input ID Google Drive yang memvalidasi format + memunculkan live preview thumbnail via `drive.google.com/thumbnail?id=...`. Beri pilihan "Tambah ID ke Galeri" berulang dan reorder drag & drop.


### Tahap 3: Integrasi Pihak Ketiga, Pelacakan, SEO, & Deployment
*Tujuan: Menghidupkan click tracking, notifikasi email, optimasi SEO/performa, dan rilis ke produksi.*
- [ ] **Task 3.1 (Click Tracking & Redirect)**: Buat endpoint `POST /api/track` yang menulis counter ke Upstash Redis (key: `click:{productId}:{yyyy-mm-dd}` + set IP hash untuk unique). Integrasikan ke halaman `/pergi/[id]` — saat mount, kirim `track` lalu setelah 800ms `window.location.replace(affiliateUrl)`. Tambahkan atribut `rel="nofollow sponsored noopener"`.
- [ ] **Task 3.2 (Backup Klik & Dashboard Statistik)**: Buat Vercel Cron `/api/cron/sync-analytics` (harian jam 23:50 WIB) yang membaca Redis, menulis snapshot ke `data/analytics.json` via GitHub API, dan membersihkan Redis lama. Sambungkan halaman `/admin/statistik` dengan data Redis live + snapshot historis. Implementasi ekspor CSV.
- [ ] **Task 3.3 (Notifikasi Email via Resend)**: Buat `lib/notify.ts` dengan template email sukses & gagal deploy (React Email + Resend). Panggil dari setiap Server Action commit ke GitHub. Tambahkan alert khusus jika commit gagal 3x berturut-turut.
- [ ] **Task 3.4 (SEO & Metadata Dinamis)**: Implementasi `generateMetadata()` di `/produk/[id]`, `/kategori/[slug]`, `/sub-kategori/[slug]`, `/katalog`. Buat `app/sitemap.ts` dan `app/robots.ts` yang membaca `catalog.json`. Sematkan JSON-LD `Product` schema di detail produk. Pastikan OG image menggunakan thumbnail Google Drive.
- [ ] **Task 3.5 (Keamanan & Sanitasi)**: Sanitasi semua input teks admin dengan `sanitize-html` sebelum disimpan. Audit token exposure di client (pastikan variabel GitHub & Resend hanya server-side). Aktifkan CSP header via `next.config.js`. Validasi ulang semua Zod schema di server side.
- [ ] **Task 3.6 (Konfigurasi Cloudflare & Google Drive)**: Dokumentasikan & setup Page Rules Cloudflare (Cache Everything untuk domain Drive, Edge TTL 1 bulan, Security Level Low). Pastikan folder Drive "Anyone with link" & test akses cross-browser. Opsional: Cloudflare Worker untuk proxy versi `lh3.googleusercontent.com`.
- [ ] **Task 3.7 (Optimasi Performa & Lighthouse)**: Audit dengan Lighthouse mobile — target ≥ 95. Kompresi gambar via Cloudflare Polish (jika tersedia), dynamic import untuk Recharts & Framer Motion di admin, `priority` hanya untuk hero image, preview bundle size dengan `@next/bundle-analyzer`.
- [ ] **Task 3.8 (End-to-End Testing & Bugfix)**: Uji seluruh user journey: pengunjung dari mobile → filter → detail → tombol afiliasi → redirect & klik tercatat; admin → login → tambah produk → commit sukses → email masuk → situs publik ter-update. Uji skenario gagal (token GitHub invalid, Drive ID rusak, Redis down). Perbaiki responsif mobile/tablet.
- [ ] **Task 3.9 (Production Build & Deployment)**: Setel `.env.production` di Vercel, verifikasi `npm run build` sukses tanpa warning error. Deploy ke Vercel, hubungkan custom domain, pasang Google Search Console, verifikasi email notifikasi terkirim dari production. Publikasikan ke TikTok/Facebook/WhatsApp.

---


## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / GitHub Copilot / Roo Code / dll.) untuk memulai pengerjaan:*

```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.
Saya ingin membangun aplikasi bernama **KurasiNiche** berdasarkan dokumen PRD yang ada di @PRD.md.

MODE EKSEKUSI: "PHASE" (Bertahap per Fase / Milestone)

ATURAN EKSEKUSI (WAJIB DIPATUHI):
1. JANGAN PERNAH membuat semua kode atau file sekaligus dalam satu waktu agar tidak terjadi error, tidak kehabisan token, dan tidak merusak konsistensi kode.
2. Pahami dokumen PRD secara menyeluruh, khususnya Bab 11 (Tahapan Pengerjaan). Setiap "Tahap" adalah satu Fase penuh.
3. Kerjakan MULAI DARI TAHAP 1 secara TUNTAS — selesaikan SELURUH Task 1.1 sampai Task 1.13 dalam satu putaran kerja penuh. Jangan berhenti di tengah fase.
4. Setelah TAHAP 1 selesai 100%, BERHENTI. Laporkan secara ringkas:
   - Daftar file & folder yang dibuat.
   - Cara menjalankan proyek (`npm install`, `npm run dev`).
   - Fitur apa saja yang sudah berfungsi (katalog, toggle grid/list, detail produk, favorit, share, admin UI dummy).
   - Apa yang BELUM dikerjakan (sesuai yang ada di Tahap 2 & 3).
5. Setelah melapor, TUNGGU konfirmasi eksplisit dari saya sebelum masuk ke TAHAP 2. Jangan lanjut sendiri.
6. Setelah saya konfirmasi, kerjakan TAHAP 2 sampai tuntas (Task 2.1–2.8), lalu berhenti & lapor lagi. Begitu seterusnya untuk TAHAP 3.
7. Selalu patuhi Tech Stack (Bab 10), Skema Data TypeScript, Pedoman UI/UX (Bab 4), dan gunakan Bahasa Indonesia yang membumi untuk copy di seluruh UI. Data dummy WAJIB berbahasa Indonesia (contoh dari Bab 9), JANGAN gunakan Lorem Ipsum.

SPESIFIKASI KUNCI YANG HARUS DIPATUHI:
- Situs statis 100% (SSG) dengan sumber data `data/catalog.json` di repositori GitHub.
- Panel admin kustom `/admin` dengan NextAuth Credentials (username & password dari Environment Variables).
- Integrasi GitHub REST API untuk commit `catalog.json` (auto-deploy Vercel).
- Click tracking via Upstash Redis + redirect perantara `/pergi/[id]`.
- Notifikasi email via Resend.
- Media Google Drive + Cloudflare caching.
- DILARANG membuat halaman "Placeholder" atau "Sedang dalam pengembangan". Semua halaman di Bab 3 wajib dibangun penuh dengan data dummy yang lengkap.

Jika kamu sudah membaca dan memahami PRD, silakan berikan ringkasan singkat pemahamanmu (maksimal 10 poin) dan tanyakan kesiapan saya untuk mulai mengeksekusi TAHAP 1 secara penuh!
```
