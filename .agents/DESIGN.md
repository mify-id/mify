# DESIGN.md — mify Anti-Slop Design Constitution

> **Wajib dibaca oleh setiap agent sebelum menyentuh kode UI.**
> Dokumen ini adalah "taste guide" resmi untuk project mify.
> Keberadaannya untuk mencegah output desain yang generik, template-ish, dan tidak berkarakter — yang dikenal sebagai **AI Slop**.

---

## 🎯 Design Philosophy

mify bukan agensi digital biasa. Visual language-nya harus mencerminkan:

- **Precision over decoration** — setiap elemen ada alasannya
- **Tension by design** — kontras warna yang tajam, bukan harmoni yang membosankan
- **Alive, not animated** — interaksi terasa fisik dan nyata, bukan sekadar CSS transition
- **Editorial, not promotional** — layout seperti majalah teknik premium, bukan landing page SaaS biasa

---

## 🚫 Larangan Keras (AI Slop Blacklist)

Hal-hal berikut adalah **tanda-tanda AI Slop** yang DILARANG dipakai di project ini:

### Copy & Tone
- ❌ *"high-performance"*, *"blazing fast"*, *"stunning"*, *"seamless"*
- ❌ *"Transform your business"*, *"Take your brand to the next level"*
- ❌ *"Trusted by thousands of..."*, *"The future of..."*
- ❌ Kalimat yang bisa dipakai oleh brand lain mana pun tanpa modifikasi
- ✅ Ganti dengan klaim yang spesifik, terukur, dan kontekstual ke stack kita

### Layout & Struktur
- ❌ Tiga feature card identik berjejer (icon + judul + deskripsi)
- ❌ Hero section → Feature Grid → Testimonial → CTA (urutan default SaaS)
- ❌ Section dengan padding yang sama persis di setiap blok
- ❌ `text-center` di semua section heading
- ✅ Gunakan asymmetry, editorial hierarchy, dan tension antara elemen

### Visual & Estetika
- ❌ Gradien ungu-biru generik (`from-purple-500 to-blue-600`)
- ❌ Card dengan `border border-gray-200 rounded-lg shadow-sm` (template Tailwind default)
- ❌ Glassmorphism tanpa tujuan (`backdrop-blur` di mana-mana)
- ❌ Icon yang "menjelaskan dirinya sendiri" tanpa konteks visual
- ❌ Hero illustration/mockup yang bukan milik brand
- ✅ Semua visual harus lahir dari sistem token warna kita

### Animasi
- ❌ `animate-bounce` atau `animate-pulse` sebagai dekorasi
- ❌ Fade-in pada semua elemen secara bersamaan
- ❌ Hover scale yang sama di setiap tombol (`hover:scale-105`)
- ✅ Animasi harus punya *reason to exist* — respons terhadap aksi user

---

## 🎨 Brand Tokens (Sumber Kebenaran)

Semua warna, radius, dan font **hanya** diambil dari sini. Tidak ada hardcode hex lain.

```css
/* Didefinisikan di resources/css/app.css */
@theme {
  /* Warna Utama */
  --color-brand-blue: #1e4ae9;   /* Electric Royal Blue — dominan, authoritative */
  --color-brand-lime: #b5ff00;   /* Neon Lime — aksen, CTA, highlight penting */
  --color-brand-dark: #0f172a;   /* Slate Dark — background utama */

  /* Font Stack */
  --font-sans: 'Outfit', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;

  /* Radius */
  --radius-brand-card: 1.5rem; /* 24px — dipakai untuk semua card utama */
}
```

### Panduan Penggunaan Warna

| Token | Fungsi | JANGAN digunakan untuk |
|---|---|---|
| `brand-dark` | Background halaman, card pada dark section | Teks, border |
| `brand-blue` | Primary action, section highlight, badge | Dekorasi murni |
| `brand-lime` | CTA utama, aksen penting, hover state | Background section luas |
| `white/opacity` | Teks di atas dark, border tipis | Pengganti brand-lime |

### Opacity Scale yang Diizinkan

Untuk `white/X` dan `black/X`, gunakan skala yang konsisten:
- `white/5` — background sangat subtle
- `white/10` — border subtle
- `white/20` — elemen sekunder
- `white/60` — teks muted
- `white/70` — teks body
- `white/90` — teks hampir putih

---

## 🔤 Typography System

### Hierarki

```
Display / Hero H1    → font-extrabold, tracking-tight, text-5xl–7xl
Section H2           → font-extrabold, text-4xl–5xl
Component H3         → font-black, text-2xl–3xl
Card H4              → font-bold, text-xl
Body Large           → font-normal, text-lg–xl, text-white/70, leading-relaxed
Body Small           → font-medium, text-sm, text-white/70
Label / Eyebrow      → font-black, text-xs, uppercase, tracking-widest
Caption / Meta       → font-semibold, text-[10px]–xs, text-white/40
```

### Aturan Typography

- **Eyebrow label** selalu uppercase + tracking-widest + warna aksen (lime/blue) — dipakai sebelum H2
- **H1** boleh punya satu kata/frasa yang di-highlight dengan background `brand-lime/10` + border + slight rotation
- **Jangan center semua** — biarkan section tertentu left-aligned untuk menciptakan editorial tension
- **Line-height** heading: `leading-[1.05]` atau `leading-tight` — bukan `leading-normal`

---

## 🧩 Component Patterns

### Card

```jsx
// ✅ BENAR — Card dengan identitas
<div className="bg-white/5 hover:bg-white/10 border border-white/10
                hover:border-brand-blue/30 rounded-[24px] p-8
                group transition-all duration-300 relative overflow-hidden">
  {/* Accent glow — WAJIB ada di setiap card */}
  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full
                  bg-brand-blue/10 blur-xl group-hover:bg-brand-blue/20 transition-all" />
  ...
</div>

// ❌ SALAH — Card generik
<div className="border border-gray-200 rounded-lg p-6 shadow-sm">
  ...
</div>
```

### Button / CTA

```jsx
// ✅ Primary CTA — selalu rounded-full, selalu ada shadow lime
<button className="px-8 py-4 bg-brand-lime text-brand-dark font-extrabold
                   rounded-full hover:scale-[1.03] active:scale-[0.97]
                   transition-all duration-200
                   shadow-[0_4px_25px_rgba(181,255,0,0.25)]">
  Call To Action
</button>

// ✅ Secondary CTA — ghost dengan border white/10
<button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white
                   font-bold rounded-full border border-white/10
                   hover:border-white/20 transition-all duration-200">
  Secondary Action
</button>

// ❌ JANGAN — Button biru polos tanpa karakter
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click
</button>
```

### Badge / Pill

```jsx
// ✅ Eyebrow badge sebelum section heading
<span className="bg-brand-blue text-white font-extrabold text-xs
                 px-3 py-1.5 rounded-full uppercase tracking-wider">
  Section Label
</span>

// ✅ Sticker badge (untuk card content)
<span className="inline-flex items-center gap-1 bg-brand-lime text-brand-dark
                 font-bold px-3 py-1.5 rounded-full text-xs
                 hover:-translate-y-0.5 hover:rotate-1 transition-all duration-200">
  <Check className="w-3 h-3" /> Badge Text
</span>
```

### Section Divider

Setiap section perlu identitas visual yang membedakannya:

```jsx
// ✅ Dark overlay section (Services, About)
<section className="bg-brand-dark/50 relative py-24 border-t border-b
                    border-white/5 overflow-hidden">

// ✅ Full transparent section (Hero, Contact)
<section className="py-24 relative max-w-7xl mx-auto px-6 z-40">
```

---

## 📐 Layout Principles

### Grid System
- Container max: `max-w-7xl mx-auto px-6`
- Hero layout: `grid-cols-1 lg:grid-cols-12` — konten di `col-span-7`, visual di `col-span-5`
- Services: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- About: `grid-cols-1 md:grid-cols-3`

### Spacing Rhythm
- Section padding: `py-24` (standard) atau `py-32` (hero)
- Component gap internal: `gap-4` atau `gap-6`
- Section header ke konten: `mb-16`

### Layering & Depth

Selalu gunakan `z-index` yang terstruktur:
```
z-50  → Fixed header/nav
z-40  → Section content (di atas background effects)
z-30  → Hover state card
z-20  → Overlay elements
z-10  → Relative positioned elements
z-0   → Background decorators (grid, glow)
```

---

## ✨ Animation & Interaction Rules

### Micro-interaction Harus Ada Alasan

```
hover:scale-[1.02]        → Hanya untuk primary card/CTA
hover:scale-105           → Hanya untuk icon atau badge kecil
hover:scale-110           → Hanya untuk icon tombol engagement (like, bookmark)
active:scale-[0.97]       → Selalu pasangkan dengan hover:scale pada CTA
hover:-translate-y-0.5    → Untuk badge/pill (efek "terangkat")
hover:rotate-1            → Untuk badge/sticker (efek "fisik")
group-hover:translate-x-1 → Untuk arrow icon di dalam card
```

### Timing
- Micro: `duration-200` (tombol, badge)
- Card hover: `duration-300` (card transform)
- Layout shift: `duration-500` (card rotate di hero)
- Easing default: `ease-out` untuk masuk, `ease-in-out` untuk idle

### Yang TIDAK boleh dianimasikan secara serampangan
- ❌ Seluruh section fade-in saat scroll (tanpa IntersectionObserver proper)
- ❌ Background pulse yang terus-menerus tanpa tujuan
- ❌ Text yang berkedip/bergerak sebagai dekorasi

---

## 🗣️ Copy Voice & Tone

### Karakteristik Suara mify

- **Confident, bukan arrogant** — klaim yang bisa dibuktikan dengan stack
- **Technical, tapi accessible** — menyebut nama teknologi spesifik, bukan abstrak
- **Direct, bukan salesy** — tidak perlu "!" di setiap kalimat
- **Opinionated** — punya sudut pandang tentang cara membangun web yang benar

### Formula Heading yang Efektif

```
✅ "We Build Digital Systems That Scale Your Business"
   → Spesifik: Digital Systems, Scale = terukur

✅ "Zero Client-Side Routing Lag"
   → Klaim teknis dengan cara kerja yang jelas (InertiaJS)

✅ "Engineering Premium Web Experiences"
   → Kata kerja aktif + outcome yang jelas

❌ "Transform Your Digital Presence"
   → Bisa dipakai oleh siapa saja, tidak ada substansi

❌ "The Future of Web Development"
   → Klaim kosong tanpa bukti

❌ "Your Success is Our Priority"
   → Template copy yang paling slop
```

### Deskripsi yang Baik
- Selalu sebut teknologi spesifik: *"Laravel, React 19, dan InertiaJS"* — bukan *"modern stack"*
- Jelaskan **mengapa** bukan hanya **apa**: *"Karena InertiaJS, tidak ada API terpisah yang perlu ditulis"*
- Maksimal 2 kalimat per blok deskripsi di card

---

## 🔍 Quality Checklist

Sebelum commit kode UI, jawab pertanyaan ini:

### Visual
- [ ] Apakah semua warna berasal dari brand token (`brand-blue`, `brand-lime`, `brand-dark`)?
- [ ] Apakah setiap card punya accent glow atau visual differentiator?
- [ ] Apakah ada minimal satu elemen yang terasa "tidak terduga" di setiap section?
- [ ] Apakah section-section punya ritme visual yang berbeda (bukan padding sama semua)?

### Interaksi
- [ ] Apakah setiap animasi punya alasan (respons user, bukan dekorasi)?
- [ ] Apakah hover dan active state konsisten dengan timing guide di atas?
- [ ] Apakah ada micro-interaction yang membuat komponen terasa "fisik"?

### Copy
- [ ] Apakah tidak ada kata-kata dari blacklist di atas?
- [ ] Apakah setiap klaim bisa didukung oleh stack yang kita gunakan?
- [ ] Apakah copy bisa dibedakan dari copy kompetitor?

### Teknis
- [ ] Apakah `z-index` mengikuti layering system di atas?
- [ ] Apakah semua section punya `relative` untuk isolasi z-index?
- [ ] Apakah tidak ada hardcode hex di luar brand token?

---

## 📎 Referensi & Inspirasi

Desain mify terinspirasi dari:
- **Editorial layout** majalah teknologi premium (Wired, MIT Technology Review)
- **Stark contrast aesthetics** dari brand Vercel & Linear
- **Physical badge/sticker** culture dari brand streetwear digital
- **Dark mode dengan aksen neon** dari terminal/IDE culture

Tapi semua itu **di-filter** melalui identitas brand kita:
→ Biru solid yang authoritative + Lime yang disrupting = Modern Indonesian Tech Agency

---

*Dokumen ini adalah living document. Update setiap kali ada keputusan desain baru yang disepakati.*
*Terakhir diperbarui: 30 Juni 2026*
