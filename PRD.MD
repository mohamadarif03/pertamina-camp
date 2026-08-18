# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Digital Tender Collaboration and Intelligent Document Automation
**Sistem Pengadaan Digital Terintegrasi – PT Pertamina Patra Niaga Regional Kalimantan**

---

## 1. DOKUMEN OVERVIEW & TUJUAN SISTEM

### 1.1 Tujuan Utama
[cite_start]Sistem ini dirancang untuk mendigitalkan, mempercepat, dan meningkatkan transparansi serta akurasi seluruh alur pengadaan barang/jasa di lingkungan PT Pertamina Patra Niaga Regional Kalimantan[cite: 1, 54]. [cite_start]Sistem ini mencakup otomatisasi validasi formulir (D1), pemantauan masa berlaku jaminan (D2), pelacakan status pengadaan real-time (D3), pemantauan SLA per tahapan (D4), ruang rapat Pre-Bid digital (D5), hub kolaborasi penilaian penawaran (D6), monitoring TKDN (D7), serta asisten AI untuk penyusunan draf dokumen dan berita acara (D8)[cite: 14, 15, 16, 17, 18, 19, 20, 21, 22].

### 1.2 Cakupan Subtopik Fitur
- [cite_start]**D1:** Doc Digital Form & Validation Engine [cite: 14, 15]
- [cite_start]**D2:** Jaminan Expiry Alert System (Bid Bond & Performance Bond) [cite: 14, 16]
- [cite_start]**D3:** Procurement Status Dashboard (FPP) [cite: 14, 17]
- [cite_start]**D4:** SLA Timer & Tracking per Fase [cite: 14, 18]
- [cite_start]**D5:** Digital Pre-Bid & Berita Acara Auto-Gen [cite: 14, 19]
- [cite_start]**D6:** Evaluation Collaboration Hub & Abnormal Price Detection [cite: 14, 20]
- [cite_start]**D7:** TKDN Real-Time Monitoring [cite: 14, 21]
- [cite_start]**D8:** Smart Doc & Berita Acara Assistant (AI Engine) 

---

## 2. ARSITEKTUR ROLE & MATRIKS HAK AKSES (PERMISSIONS)

[cite_start]Sistem memiliki **5 Role Utama Pengguna** dan **1 Engine Otomasi (AI/System Actor)**.

### 2.1 Definisi Role
1. [cite_start]**Submitter (Fungsi Peminta Pengadaan):** User dari fungsi/unit kerja internal Pertamina yang menginisiasi rencana pengadaan (PPL) dan menginput dokumen DP3 beserta lampirannya[cite: 251, 253, 257].
2. [cite_start]**Reviewer / Approver (Pejabat Berwenang & Pejabat DP3):** Atasan teknis atau Pejabat DP3 yang berwenang memeriksa, memberikan catatan revisi, dan menyetujui PPL, DP3, RKS, serta LHP[cite: 251, 254, 260, 262].
3. [cite_start]**Panitia Pengadaan (Procurement Officer / Buyer):** Pengelola utama eksekusi tender dari pembuatan RKS, fasilitator Pre-Bid, pengawas SLA, pemantau jaminan, hingga finalisasi LHP dan Kontrak/PO[cite: 250, 251, 262, 267].
4. [cite_start]**Tim Evaluator (Evaluator Teknis & Komersial):** Tim internal yang bertugas melakukan evaluasi penawaran vendor (kualifikasi, teknis, komersial) dan klarifikasi harga timpang[cite: 251, 252].
5. [cite_start]**Vendor / Penyedia Barang & Jasa (Eksternal):** Pihak ketiga peserta tender yang melakukan pendaftaran, pengunggahan sertifikat jaminan, partisipasi Pre-Bid, dan submit proposal penawaran.
6. [cite_start]**[System/AI Engine] Smart Doc & Automation Engine:** Aktor sistem yang mengeksekusi validasi otomatis, algoritma pendeteksi harga timpang, kalkulator SLA, dan penerbit draf dokumen AI[cite: 15, 16, 18, 19, 20, 22].

---

### 2.2 Matriks Akses Fitur Lintas Role (CRUD & Interaction Matrix)

> **Keterangan:** `C` = Create, `R` = Read, `U` = Update, `D` = Delete, `A` = Approve/Reject, `E` = Execute/Generate, `-` = Tidak Ada Akses.

| Kode Module / Fitur Utama | Submitter | Approver | Panitia | Evaluator | Vendor | AI / System |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **M1: Form DP3 & Validation (D1)** | CRUD | R / A | R | R | - | E (Validate) |
| **M2: Jaminan Expiry Alert (D2)** | - | R | C/R/U | R | C/R/U (Upload) | E (Alert Pager) |
| **M3: Procurement Dashboard (D3)** | R (Own) | R (Unit) | R (All) | R (Assigned) | R (Public/Own) | E (Status Sync) |
| **M4: SLA Timer & Tracking (D4)** | R | R (Monitor) | C/R/U (Config) | R | R (Countdown) | E (Timer/Trigger) |
| **M5: Digital Pre-Bid & Auto-BA (D5)** | R | R | Host (C/R/U) | R | Participate (C/R) | E (Auto-BA PDF) |
| **M6: Evaluation Hub & Price Check (D6)** | - | R / A | R / Consolidate | C/R/U (Score) | - | E (Detect Timpang) |
| **M7: Real-Time Monitoring TKDN (D7)** | C/R/U | R | R / Verify | R | C/R/U (Data) | E (Compliance Check) |
| **M8: Smart Doc AI Assistant (D8)** | R / Assist | R / Diff View | C/R/U / Assist | R | - | E (LLM Draft/Diff) |

---

## 3. RINCIAN MODUL FITUR SISTEM TERATUR BERDASARKAN SUBTOPIK

### MODUL 1: Digital Form & Real-Time Validation Engine (Subtopik D1 & D7)

#### Fitur 1.1: DP3 Form Builder & Document Attachment Center
* [cite_start]**Deskripsi:** Form dinamis untuk menginput informasi Dokumen Pendukung Pemilihan (DP3)[cite: 251, 259].
* **Input Data/Bidang:**
  * [cite_start]Nama Pekerjaan, Fungsi Peminta, HPS/Owner Estimate (OE), Bill of Quantity (BoQ)[cite: 254, 256].
  * [cite_start]Risk Assessment & Penetapan Denda, Purchase Requisition (PR), Izin Prinsip, Pakta Integritas, Justifikasi Pengadaan[cite: 256].
  * [cite_start]Form A1, A2, B1 TKDN (Sesuai regulasi TKDN)[cite: 256].
  * [cite_start]Form Checklist HC TAD (Khusus untuk pekerjaan Tenaga Kerja Alih Daya, Borongan, dan Konsultan)[cite: 256].
* [cite_start]**Role Pengguna:** Submitter (CRUD) [cite: 253][cite_start], Reviewer/Approver (Review/Approve) [cite: 254][cite_start], Panitia (Read)[cite: 251].

#### Fitur 1.2: Real-time Form Validation Engine
* [cite_start]**Deskripsi:** Engine otomatis yang memvalidasi kelengkapan data dan konsistensi antar-dokumen sebelum di-submit[cite: 15].
* **Aksi Otomatis:**
  * [cite_start]Memeriksa keberadaan seluruh lampiran wajib berdasarkan jenis pekerjaan (Contoh: Pekerjaan TAD Wajib menyertakan Checklist HC TAD)[cite: 256].
  * Kalkulasi persentase kelengkapan berkas (*Completeness Score Card* 0–100%).
  * [cite_start]Menampilkan *Visual Error Indicator* jika ada kolom mandatory yang belum terisi[cite: 15].
* [cite_start]**Role Pengguna:** System (Execute)[cite: 15], Submitter (Read/Fix error).

---

### MODUL 2: Jaminan Expiry Alert System (Subtopik D2)

#### Fitur 2.1: Bid Bond & Performance Bond Vault
* [cite_start]**Deskripsi:** Repositori terpusat untuk menyimpan, memverifikasi, dan mencatat masa berlaku dokumen Jaminan Penawaran (*Bid Bond*) dan Jaminan Pelaksanaan (*Performance Bond*)[cite: 14, 16].
* [cite_start]**Input Data:** Nomor Jaminan, Bank/Penerbit, Nilai Jaminan, Tanggal Terbit, Tanggal Kedaluwarsa, File Scan Jaminan[cite: 16].
* [cite_start]**Role Pengguna:** Vendor (Upload/Submit), Panitia Pengadaan (Verify/Manage), Evaluator (Read).

#### Fitur 2.2: Expiry Alert Radar Widget & Escalation Notification
* [cite_start]**Deskripsi:** Dashboard radar peringatan kedaluwarsa dengan *Timer Countdown* dan notifikasi bertingkat[cite: 16].
* **Aksi Otomatis & Trigger:**
  * [cite_start]Indikator Warna Status: **Hijau** (>30 hari), **Kuning** (14–30 hari), **Merah** (<14 hari / Kedaluwarsa)[cite: 16].
  * [cite_start]E-mail & In-App Notification otomatis pada H-30, H-14, H-7, dan H-3 sebelum jaminan habis[cite: 16].
  * [cite_start]*Auto-freeze* aksi vendor jika jaminan kedaluwarsa belum diperbarui[cite: 16].
* [cite_start]**Role Pengguna:** Panitia Pengadaan (Monitor/Manage), Vendor (Receive Alert/Update), System (Execute Trigger)[cite: 16].

---

### MODUL 3: Procurement Status Dashboard - FPP (Subtopik D3)

#### Fitur 3.1: End-to-End Procurement Lifecycle Tracker
* [cite_start]**Deskripsi:** Dashboard pemantauan status permintaan pengadaan secara real-time dari tahap pendaftaran PPL hingga penerbitan Kontrak/PO[cite: 17, 251, 266].
* **Tahapan yang Dilacak (15 Stage Tracking):**
  1. [cite_start]Pemeriksaan PPL, DP3 & Project Request [cite: 251]
  2. [cite_start]Rapat Pra-Tender [cite: 251]
  3. [cite_start]Penyiapan Dokumen Pemilihan [cite: 251]
  4. [cite_start]Pengumuman Tender/Undangan [cite: 251]
  5. [cite_start]Pendaftaran & Pemasukan Penawaran [cite: 251]
  6. [cite_start]Penilaian Kualifikasi [cite: 251]
  7. [cite_start]Penjelasan Tender / Pre-Bid Meeting [cite: 251]
  8. [cite_start]Pre-Bid Meeting Field/Site Visit (jika ada) [cite: 251]
  9. [cite_start]Pembukaan & Evaluasi Penawaran [cite: 251]
  10. [cite_start]Negosiasi & Klarifikasi Harga Timpang [cite: 251]
  11. [cite_start]Penegasan Harga [cite: 251]
  12. [cite_start]LHP & Usulan Penetapan Pemenang [cite: 251]
  13. [cite_start]Pengumuman Pemenang [cite: 251]
  14. [cite_start]Penunjukan Pemenang [cite: 251]
  15. [cite_start]Finalisasi Kontrak / Release PO [cite: 251, 267]
* [cite_start]**Role Pengguna:** Dibuka untuk **Semua Role** (Submitter, Approver, Panitia, Evaluator, Vendor) dengan tingkat detail filter yang disesuaikan[cite: 17].

---

### MODUL 4: SLA Timer & Tracking per Fase (Subtopik D4)

#### Fitur 4.1: Dynamic SLA Countdown Configurator
* [cite_start]**Deskripsi:** Penentuan batas waktu (*Service Level Agreement*) untuk setiap tahapan pengadaan[cite: 18].
* **Fungsionalitas:**
  * [cite_start]Pengaturan durasi standar per tahapan (misal: Tahap Review DP3 max 3 hari, Tahap Evaluasi max 7 hari)[cite: 18].
  * [cite_start]Visualisasi *Real-time Countdown Progress Bar* pada header halaman proyek[cite: 18].
* [cite_start]**Role Pengguna:** Panitia Pengadaan (Configurator/Manage), All Internal Roles (Monitor)[cite: 18].

#### Fitur 4.2: SLA Bottleneck Warning & Delay Log
* [cite_start]**Deskripsi:** Sistem deteksi dini keterlambatan yang mencatat log hambatan jika suatu proses melebihi target SLA[cite: 18].
* **Aksi Otomatis:**
  * [cite_start]Mengirim *Warning E-mail* kepada Approver / Panitia jika waktu tersisa <24 jam[cite: 18].
  * [cite_start]Pencatatan otomatis *Reason for Delay* jika waktu SLA terlampaui (*overdue*)[cite: 18].
* [cite_start]**Role Pengguna:** System (Execute)[cite: 18], Approver & Panitia (Respond/Update).

---

### MODUL 5: Digital Pre-Bid Workspace & Auto-BA Engine (Subtopik D5)

#### Fitur 5.1: Pre-Bid Interactive Workspace & Q&A Forum
* [cite_start]**Deskripsi:** Ruang rapat penjelasan tender (*Aanwijzing*) secara digital yang memfasilitasi tanya-jawab terstruktur[cite: 19, 251].
* **Fungsionalitas:**
  * [cite_start]Vendor mengajukan pertanyaan terikat pada nomor pasal/bab RKS[cite: 19, 251].
  * [cite_start]Panitia memberikan jawaban resmi, penyesuaian adendum RKS, atau klarifikasi teknis secara tertulis[cite: 19].
  * [cite_start]Threading diskusi yang dapat diunduh & ditinjau oleh seluruh peserta[cite: 19].
* [cite_start]**Role Pengguna:** Vendor (Participate/Ask) [cite: 251][cite_start], Panitia Pengadaan (Host/Answer) [cite: 19][cite_start], Submitter/Evaluator/Approver (Read Only)[cite: 19].

#### Fitur 5.2: Auto-Gen Berita Acara Pre-Bid Engine
* [cite_start]**Deskripsi:** Generator otomatis yang mengompilasi seluruh transkrip Q&A dan adendum menjadi draf Berita Acara (BA) Pre-Bid terformat.
* **Fungsionalitas:**
  * [cite_start]Tombol `[Generate BA Pre-Bid]` yang mengekstrak daftar hadir digital, ringkasan Q&A, dan perubahan RKS.
  * [cite_start]Ekspor otomatis ke format PDF resmi siap e-Signature[cite: 19, 266].
* [cite_start]**Role Pengguna:** Panitia Pengadaan (Trigger/Manage) [cite: 19][cite_start], Vendor (Digital Sign/Approval) [cite: 266][cite_start], System (Generate).

---

### MODUL 6: Evaluation Collaboration Hub & Abnormal Price Engine (Subtopik D6)

#### Fitur 6.1: Side-by-Side Comparison Workspace
* [cite_start]**Deskripsi:** Workspace interaktif untuk mengevaluasi dokumen kualifikasi, teknis, dan komersial beberapa vendor secara berdampingan.
* **Fungsionalitas:**
  * [cite_start]Layar *Split-Screen View* yang menampilkan berkas penawaran Vendor A, Vendor B, dan Matriks Acuan RKS/OE.
  * [cite_start]Penginputan skor teknis & catatan evaluasi kualifikasi.
* [cite_start]**Role Pengguna:** Tim Evaluator (Score/Evaluate) [cite: 20][cite_start], Panitia Pengadaan (Consolidate) [cite: 20][cite_start], Approver (Review).

#### Fitur 6.2: Abnormal Price (Harga Timpang) Detection Engine
* [cite_start]**Deskripsi:** Algoritma cerdas yang menganalisis rincian penawaran harga vendor terhadap *Owner Estimate* (OE) / HPS.
* **Aksi Otomatis:**
  * [cite_start]Deteksi otomatis jika harga item penawaran vendor **<80%** dari OE (Indikasi Harga Timpang) atau **>100%** OE.
  * [cite_start]Menampilkan *Highlight* warna merah pada item harga timpang dalam tabel komparasi.
  * [cite_start]Memicu pengeluaran Form Klarifikasi Harga Timpang Otomatis untuk ditinjau Evaluator.
* [cite_start]**Role Pengguna:** System (Execute Detection) [cite: 20][cite_start], Tim Evaluator (Clarify/Verify).

#### Fitur 6.3: Consolidated Scoring Matrix & LHP Generator
* [cite_start]**Deskripsi:** Perhitungan bobot nilai gabungan (Teknis + Komersial) dan rekapitulasi Laporan Hasil Pemilihan (LHP).
* **Fungsionalitas:**
  * [cite_start]Kalkulasi otomatis skor akhir berdasarkan rumus pembobotan.
  * [cite_start]Penyusunan draf LHP dan rekomendasi pemenang tender.
* [cite_start]**Role Pengguna:** Tim Evaluator (Input) [cite: 20][cite_start], Panitia (Consolidate/Submit) [cite: 20, 251][cite_start], Approver (Approve Winner)[cite: 20, 251, 254].

---

### MODUL 7: Real-Time Monitoring TKDN (Subtopik D7)

#### Fitur 7.1: TKDN Compliance Dashboard & Calculator
* [cite_start]**Deskripsi:** Dashboard pemantauan capaian Tingkat Komponen Dalam Negeri (TKDN) pada proyek pengadaan[cite: 21, 256].
* **Fungsionalitas:**
  * [cite_start]Validasi pengisian Form A1, A2, B1 TKDN dari vendor[cite: 256].
  * [cite_start]Pembandingan capaian TKDN penawaran terhadap *Roadmap Target TKDN Pertamina* (misal: min 25% / 75%)[cite: 256].
  * [cite_start]Penandaan status Kepatuhan: `Di atas Roadmap` atau `Di bawah Roadmap`[cite: 256].
* [cite_start]**Role Pengguna:** Vendor (Input Data) [cite: 256][cite_start], Tim Evaluator & Panitia (Verify/Monitor) [cite: 21][cite_start], Submitter (Read)[cite: 256].

---

### MODUL 8: Smart Doc & AI Assistant Engine (Subtopik D8)

#### Fitur 8.1: AI Draft Generator (RKS & Contract Clauses)
* [cite_start]**Deskripsi:** Modul berbasis AI (LLM) yang membantu menyusun draf Rencana Kerja & Syarat-syarat (RKS) serta pasal-pasal Rancangan Kontrak secara presisi berdasarkan input parameter DP3[cite: 22, 258, 260].
* **Fungsionalitas:**
  * [cite_start]*Pulling Data DP3* otomatis ke dalam template RKS[cite: 259].
  * [cite_start]AI merekomendasikan draf pasal standar (SLA, Garansi, Denda, Keselamatan Kerja)[cite: 22, 256].
* [cite_start]**Role Pengguna:** Submitter & Panitia Pengadaan (Assist/Generate) [cite: 22][cite_start], System/AI (Execute Draft)[cite: 22].

#### Fitur 8.2: Document Diff-Viewer Engine
* [cite_start]**Deskripsi:** Fitur pembanding versi dokumen digital untuk melihat perubahan pasal RKS/Kontrak antar-revisi atau usulan AI[cite: 22, 262].
* **Fungsionalitas:**
  * [cite_start]Membandingkan Teks Asli vs Teks Revisi dengan penandaan warna (*Green = Addition, Red = Deletion*)[cite: 22].
* [cite_start]**Role Pengguna:** Approver / Reviewer & Panitia Pengadaan (Review Changes)[cite: 22, 262].

---

## 4. FITUR KONTRIBUSI MULTI-ROLE (SHARED FEATURES MATRIX)

Untuk memperjelas interaksi lintas *role*, berikut adalah daftar **Fitur Tunggal yang Membutuhkan Interaksi Lebih dari 1 Role**:

| Nama Fitur Shared | Role A & Aksesnya | Role B & Aksesnya | Role C & Aksesnya |
| :--- | :--- | :--- | :--- |
| **Workspace Pre-Bid (D5)** | [cite_start]**Vendor:** Input Pertanyaan [cite: 251] | [cite_start]**Panitia:** Jawab & Trigger Auto-BA [cite: 19] | [cite_start]**Approver/Submitter:** Read Transkrip [cite: 19] |
| **Jaminan Vault (D2)** | [cite_start]**Vendor:** Upload Sertifikat Jaminan  | [cite_start]**Panitia:** Akses Radar & Monitor Expired [cite: 16] | [cite_start]**Evaluator:** Cek Validitas Syarat  |
| **Evaluation Hub (D6)** | [cite_start]**Evaluator:** Scoring & Cek Price  | [cite_start]**Panitia:** Rekap & Terbitkan LHP  | [cite_start]**Approver:** Setujui Pemenang [cite: 20, 251, 254] |
| **SLA Tracking (D4)** | [cite_start]**Panitia:** Config Durasi [cite: 18] | [cite_start]**Internal Roles:** Monitoring Dashboard [cite: 18] | [cite_start]**Vendor:** Countdown Submission [cite: 18] |
| **Smart Doc Gen (D1/D8)**| [cite_start]**Submitter:** Input Parameter DP3 [cite: 253, 259] | [cite_start]**Panitia:** Edit Draf RKS AI [cite: 22, 262] | [cite_start]**Approver:** Diff-View & Sign [cite: 22, 262] |

---

## 5. DETAIL KEBUTUHAN KINERJA & NON-FUNGSIONAL (NFR)

1. [cite_start]**Security & Role-Based Access Control (RBAC):** Akses data dibatasi ketat berdasarkan autentikasi IDAMan Pertamina[cite: 253, 261].
2. [cite_start]**Audit Trail & Logging:** Setiap tindakan (Upload, Edit, Approve, Score Input, BA Generation) dicatat dalam *Immutable Audit Log* lengkap dengan Timestamp & User ID.
3. [cite_start]**Document Export & Standards:** Seluruh output dokumen (DP3, RKS, BA Pre-Bid, LHP, Kontrak) diekspor dalam format standar PDF/A dengan dukungan *e-Meterai* dan *Digital Signature*[cite: 19, 261, 266].
4. [cite_start]**Integration Capability:** Kemampuan integrasi data dengan ekosistem SAPP (SAPP Promise, SAPP DocGen, SAPP SmartGEP)[cite: 250, 252, 261, 263].

---

## 6. ALUR KERJA ANTAR-ROLE (END-TO-END WORKFLOW SUMMARY)