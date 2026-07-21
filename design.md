# REFERENSI KITA ADALAH DARI https://open-design.ai/
# Systemify ID - Design System & UI Guidelines

Dokumen ini merupakan panduan desain awal untuk proyek kita, merujuk pada referensi visual dari `references/design.png`. Panduan ini menyertakan kelas-kelas utilitas Tailwind CSS untuk memudahkan implementasi konsisten di seluruh aplikasi.

## 1. Konsep Utama (Core Concept)
Gaya desain (*design language*) yang akan kita bangun mengusung tema **Modern, Bold, dan Dynamic Agency**. Tampilan ini memadukan warna kontras tinggi yang memberikan kesan energik, berani, profesional, namun tetap kekinian (*playful*).

## 2. Palet Warna & Konfigurasi CSS (Color Palette & Variables)
Konfigurasi tema warna di Tailwind CSS v4 (`resources/css/app.css`):

```css
@theme {
  --color-brand-blue: #1e4ae9;
  --color-brand-lime: #b5ff00;
  --color-brand-dark: #0f172a;
  
  --radius-brand-card: 1.5rem; /* 24px */
}
```

### Daftar Utilitas Warna:
- **Primary Blue:** `bg-brand-blue` | `text-brand-blue` (Biru elektrik solid)
- **Accent Lime/Neon Green:** `bg-brand-lime` | `text-brand-lime` (Hijau limau neon kontras tinggi)
- **Neutral White/Off-White:** `bg-white` | `text-white`
- **Dark/Slate:** `bg-brand-dark` | `text-brand-dark` (Slate-900 untuk keterbacaan teks di atas warna terang)

## 3. Tipografi (Typography)
- **Font Utama (Outfit/Inter):** Gunakan utility `font-sans`.
- **Hero Headings (Display):**
  - Utility: `text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]`
- **Section Titles:**
  - Utility: `text-3xl md:text-4xl font-bold tracking-tight leading-snug`
- **Body Text:**
  - Utility: `text-base text-white/80 leading-relaxed`
- **Text Highlighting (Efek Stabilo):**
  - Teks gelap di atas lime: `<span class="text-brand-dark bg-brand-lime px-2 py-0.5 rounded">Teks Highlight</span>`
  - Teks lime di atas biru: `<span class="text-brand-lime">Teks Highlight</span>`

## 4. Komponen & Kelas UI (UI Components & Classes)

### A. Instagram-Style Card Container (Rasio 4:5)
Kartu utama yang merepresentasikan pos media sosial seperti di `design.png`.
- **Outer Shell (Blue Background):** 
  ```html
  <div class="w-full max-w-sm aspect-[4/5] bg-brand-blue text-white rounded-[24px] p-6 shadow-xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
    <!-- Konten di sini -->
  </div>
  ```
- **Card Variant (Accent Lime):**
  ```html
  <div class="w-full max-w-sm aspect-[4/5] bg-brand-lime text-brand-dark rounded-[24px] p-6 shadow-xl border border-brand-dark/5 flex flex-col justify-between relative overflow-hidden">
    <!-- Konten di sini -->
  </div>
  ```

### B. Card Mockup Header (Instagram Profile Style)
- **Header HTML:**
  ```html
  <div class="flex items-center gap-3 border-b border-white/10 pb-4">
    <!-- Profile Circle Mockup -->
    <div class="w-10 h-10 rounded-full bg-white/20 border border-white/10 flex items-center justify-center">
      <div class="w-6 h-6 rounded-full bg-white/40"></div>
    </div>
    <!-- Profile Text Mockup -->
    <div class="flex flex-col gap-1.5">
      <div class="w-20 h-2.5 bg-white/30 rounded-full"></div>
      <div class="w-12 h-1.5 bg-white/20 rounded-full"></div>
    </div>
  </div>
  ```

### C. Sticker & Pill Badges (Fitur/Poin Penting)
- **White Pill Sticker (Di atas background biru):**
  ```html
  <span class="inline-flex items-center gap-1.5 bg-white text-brand-dark font-bold px-4 py-2 rounded-full text-xs md:text-sm shadow-md border border-slate-100 hover:scale-105 transition-transform duration-200 cursor-default">
    <!-- Icon di sini -->
    Grow melalui media sosial
  </span>
  ```
- **Lime Pill Sticker (Di atas background biru):**
  ```html
  <span class="inline-flex items-center gap-1.5 bg-brand-lime text-brand-dark font-bold px-4 py-2 rounded-full text-xs md:text-sm shadow-md hover:scale-105 transition-transform duration-200 cursor-default">
    <!-- Icon di sini -->
    Data over guesswork
  </span>
  ```

### D. Mockup Footer (Engagement Bar)
- **Footer HTML:**
  ```html
  <div class="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
    <div class="flex gap-4">
      <!-- Heart Icon -->
      <button class="text-white hover:text-red-500 transition-colors"><Heart class="w-6 h-6" /></button>
      <!-- Message Icon -->
      <button class="text-white hover:text-brand-lime transition-colors"><MessageCircle class="w-6 h-6" /></button>
      <!-- Send Icon -->
      <button class="text-white hover:text-brand-lime transition-colors"><Send class="w-6 h-6" /></button>
    </div>
    <!-- Bookmark Icon -->
    <button class="text-white hover:text-brand-lime transition-colors"><Bookmark class="w-6 h-6" /></button>
  </div>
  ```

### E. Aksen Dekoratif (Sparkles & Arrows)
- **Sparkle Icon Placement:**
  - `class="absolute top-18 right-6 text-brand-lime animate-pulse w-8 h-8"`
- **Decorative Hand-Drawn Arrow:**
  - `class="absolute bottom-18 left-8 text-white opacity-85 rotate-[-12deg] w-12 h-12"`

## 5. Panduan Transisi & Efek Mikro (Transitions & Micro-interactions)
- **Hover scale:** `hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out` untuk kartu interaktif.
- **Hover sticker:** `hover:-translate-y-0.5 hover:rotate-1 transition-all duration-200` untuk memberikan efek sticker fisik yang dinamis saat disentuh.
- **Glassmorphism Overlay:** `bg-white/10 backdrop-blur-md border border-white/20` untuk efek modern transparan.
