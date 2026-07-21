# Project-Scoped Rules

Aturan berikut wajib diikuti oleh setiap agent yang bekerja pada *workspace* ini:

1. **Update Roadmap & Checkpoint:**
   Setiap kali Anda selesai melakukan generasi kode skala besar, mengimplementasikan fitur, melakukan *refactor*, atau mengubah konfigurasi penting dalam project ini, Anda **WAJIB** mencatat perubahan tersebut di file `.agents/roadmap.md` pada bagian **Changelog & Checkpoints**.
   Sertakan informasi tentang: 
   - Tanggal pengerjaan.
   - Fitur atau perubahan yang dilakukan.
   - Daftar file utama yang diubah atau dibuat.

2. **Pahami Alur Proyek:**
   Sebelum membuat perubahan arsitektur atau jika Anda merasa ragu dengan alur sistem, bacalah `.agents/roadmap.md` terlebih dahulu untuk menyesuaikan *context* Anda dengan state proyek terbaru.

3. **Wajib Baca DESIGN.md Sebelum Mengerjakan UI:**
   Sebelum membuat, mengedit, atau mereview kode yang berhubungan dengan tampilan (komponen React, layout, CSS, Tailwind), Anda **WAJIB** membaca `.agents/DESIGN.md`. File tersebut berisi:
   - Brand token system (warna, font, radius)
   - Blacklist AI Slop — pola desain dan copy yang dilarang
   - Component patterns yang sudah disepakati
   - Animation & interaction rules
   - Copy voice & quality checklist
   
   Melanggar panduan di `DESIGN.md` dianggap sebagai output yang gagal, meskipun secara teknis kode berjalan dengan benar.

4. **Protokol Mitosis (Orkestrasi Subagent):**
   Jika mendapati tugas berskala besar yang memiliki pemisahan tanggung jawab yang jelas (seperti backend API vs. animasi frontend) atau kompleksitas riset yang tinggi, agen utama **sangat disarankan** memecah tugas tersebut dengan meluncurkan subagent spesialis (`define_subagent` & `invoke_subagent`). Subagent harus:
   - Diberikan *system prompt* yang fokus (misal: *Backend API Architect* atau *Framer Motion Developer*).
   - Mematuhi penuh aturan `.agents/AGENTS.md` dan `.agents/DESIGN.md`.
   - Melaporkan hasil kerjanya secara modular ke agen utama sebelum dilakukan integrasi kode.

5. **Konteks Istilah "Open Design" di Workspace Ini (PENTING):**
   Jika Anda melihat referensi "open-design", ketahuilah bahwa istilah ini merujuk pada 3 dimensi berbeda di workspace lokal ini:
   - **Project Folder:** Folder repositori lokal di `C:\Users\Ki\Documents\WORKING\open-design` yang menjalankan Daemon Hono API di port `7456` (dideteksi dinamis oleh system dashboard).
   - **MCP Server:** Toolkit MCP bernama `open-design` yang aktif di runtime AI assistant.
   - **Design Style Reference:** Konseptual gaya visual gelap-kontras-neon yang terinspirasi dari `https://open-design.ai/`, yang menjadi basis penulisan file `.agents/DESIGN.md` kita. JANGAN tertukar dengan codebase backend Laravel milik kita.

