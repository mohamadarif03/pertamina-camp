# PRODUCT REQUIREMENTS DOCUMENT
## Proyek 2 — Digital Tender Collaboration and Intelligent Document Automation

**Program:** Pertamina Camp 2026

**Mitra:** PT Pertamina Patra Niaga Regional Kalimantan x FILKOM UB

**Versi:** 2.0 — ruang lingkup resmi Proyek 2

---

## 1. Ringkasan Produk

Proyek ini membangun satu ruang kerja tender terpadu yang menghubungkan rapat pre-bid, evaluasi penawaran, pemantauan TKDN, dan penyusunan dokumen berbantuan AI. Produk tidak menggantikan SAPP PROMISE, SAPP DocGen, atau SmartGEP. Produk bertindak sebagai lapisan kolaborasi dan otomasi dokumen yang menerima konteks tender dari sistem tersebut dan menghasilkan dokumen yang siap direview.

### 1.1 Masalah

- Tanya-jawab pre-bid tersebar dan sulit ditelusuri ke pasal RKS.
- Penyusunan Berita Acara (BA) masih membutuhkan kompilasi manual.
- Evaluator teknis dan komersial bekerja pada dokumen dan catatan terpisah.
- Indikasi harga timpang serta kepatuhan TKDN tidak terlihat dalam satu konteks keputusan.
- Penyusunan BA, klarifikasi, dan LHP mengulang data yang sudah tersedia.

### 1.2 Tujuan

1. Menjadikan keputusan tender terlacak dari pertanyaan sampai dokumen final.
2. Mempercepat penyusunan BA dan LHP dengan human-in-the-loop AI.
3. Menyediakan workspace evaluasi bersama yang transparan dan dapat diaudit.
4. Memantau realisasi TKDN per vendor dan komponen secara aktual.

### 1.3 Batas Ruang Lingkup

Produk hanya mencakup subtopik resmi Proyek 2:

| Kode | Modul | Outcome utama |
|---|---|---|
| D5 | Digital Pre-Bid & Berita Acara Auto-Gen | Forum terstruktur, daftar hadir, keputusan, adendum, dan draf BA |
| D6 | Evaluation Collaboration Hub | Komparasi penawaran, scoring multi-evaluator, harga timpang, dan draf LHP |
| D7 | TKDN Real-Time Monitoring | Kalkulasi, bukti, verifikasi, gap, dan status kepatuhan TKDN |
| D8 | Smart Doc/Berita Acara Assistant | Draf berbasis data, ringkasan, diff, sumber, versi, dan approval |

Di luar ruang lingkup: pembuatan DP3/PPL, validasi dokumen awal D1, vault jaminan D2, dashboard status end-to-end D3, dan SLA tracker D4. Data dari tahap tersebut hanya boleh menjadi konteks tender, bukan modul produk.

---

## 2. Pengguna dan Hak Akses

| Role | Kewenangan utama |
|---|---|
| Panitia/Buyer | Membuka sesi pre-bid, menjawab pertanyaan, menandai keputusan/adendum, mengonsolidasikan evaluasi, mengelola draf BA dan LHP |
| Vendor | Mengisi kehadiran, mengajukan pertanyaan terkait pasal RKS, menanggapi klarifikasi, dan mengirim data/bukti TKDN |
| Evaluator | Membandingkan dokumen, memberi skor dan catatan, memverifikasi TKDN, dan menindaklanjuti harga timpang |
| Approver | Mereview perubahan, jejak keputusan, BA/LHP, dan memberi persetujuan atau mengembalikan revisi |
| AI Assistant | Menyusun draf dan ringkasan berbasis data tender; tidak dapat menerbitkan dokumen tanpa persetujuan manusia |

Prinsip akses: least privilege, segregasi tugas, audit trail, serta pemisahan catatan internal dari informasi vendor.

---

## 3. Kebutuhan Fungsional

### 3.1 D5 — Digital Pre-Bid & Auto-BA

- Pertanyaan wajib terikat pada bab/pasal RKS dan kategori teknis, komersial, atau administrasi.
- Vendor dapat mengisi daftar hadir dan mengirim pertanyaan selama sesi dibuka.
- Panitia dapat menjawab, meminta klarifikasi, menandai keputusan, dan menghubungkan perubahan ke adendum.
- Status pertanyaan: `Masuk`, `Dibahas`, `Terjawab`, `Menjadi Adendum`.
- Sistem menyusun draf BA dari metadata sesi, daftar hadir, Q&A terjawab, keputusan, dan perubahan.
- Pertanyaan belum terjawab menjadi action item, bukan keputusan final.
- Draf memiliki version history, reviewer, status, dan jejak persetujuan.
- Output target: BA Pre-Bid siap ekspor PDF/DOCX dan e-sign.

### 3.2 D6 — Evaluation Collaboration Hub

- Perbandingan berdampingan untuk persyaratan RKS/OE dan dokumen setiap vendor.
- Rubrik evaluasi dibedakan untuk administrasi, teknis, komersial, dan TKDN.
- Setiap evaluator memiliki skor, catatan privat tim, dan status penyelesaian.
- Sistem mengonsolidasikan skor dengan bobot yang terlihat dan terversi.
- Item penawaran dibandingkan terhadap OE/HPS; deviasi ditampilkan per item.
- Indikasi harga timpang memerlukan klarifikasi dan keputusan evaluator, bukan diskualifikasi otomatis.
- Panitia dapat menyusun draf LHP berisi metode, hasil, dissent, klarifikasi, dan rekomendasi.
- Approver dapat menerima, mengembalikan, dan memberi catatan pada LHP.

### 3.3 D7 — TKDN Real-Time Monitoring

- Vendor mengisi nilai komponen dalam negeri dan luar negeri per item serta bukti.
- Sistem menghitung realisasi TKDN berbobot terhadap nilai penawaran.
- Dashboard menampilkan target, realisasi, gap, status bukti, dan verifikasi per vendor.
- Status kepatuhan: `Memenuhi`, `Perlu Verifikasi`, `Di Bawah Target`.
- Evaluator dapat menerima/menolak bukti dan mencatat alasan.
- Perubahan nilai atau bukti memperbarui kalkulasi dan audit trail.
- Hasil TKDN menjadi input evaluasi dan draf LHP.

### 3.4 D8 — Intelligent Document Automation

- AI hanya memakai sumber yang dipilih: RKS, Q&A, keputusan, scoring, klarifikasi, dan TKDN.
- Setiap hasil AI menampilkan sumber, waktu generasi, dan status `AI Draft`.
- Use case utama: ringkasan pre-bid, draf BA, draf klarifikasi, ringkasan evaluasi, dan draf LHP.
- Diff viewer menampilkan penambahan, penghapusan, dan alasan perubahan antarversi.
- Pengguna dapat menerima sebagian, menolak, atau mengedit hasil AI.
- Dokumen tidak dapat final tanpa reviewer manusia.
- Sistem menyimpan versi, komentar, author, dan approval trail.

---

## 4. Alur Utama

1. Panitia memilih tender dan membuka sesi pre-bid.
2. Vendor mengisi kehadiran dan mengirim pertanyaan berbasis pasal RKS.
3. Panitia menjawab serta menandai keputusan atau perubahan adendum.
4. AI menyusun draf BA; panitia mereview lalu mengirim ke approver.
5. Evaluator membandingkan dokumen dan harga, memberi skor, serta mengklarifikasi anomali.
6. Data TKDN vendor dihitung dan diverifikasi di workspace evaluasi.
7. AI menyusun draf LHP dari hasil evaluasi, klarifikasi, dan TKDN.
8. Approver memeriksa diff dan audit trail, lalu menyetujui atau mengembalikan dokumen.

---

## 5. Model Data Inti

- `Tender`: identitas, RKS, OE/HPS, jadwal, target TKDN.
- `PreBidSession`: waktu, status, agenda, peserta, daftar hadir.
- `Question`: vendor, pasal RKS, kategori, pertanyaan, jawaban, keputusan, status.
- `VendorBid`: vendor, dokumen, rincian harga, versi.
- `Evaluation`: evaluator, rubrik, skor, catatan, status.
- `PriceClarification`: item, deviasi, respons vendor, keputusan.
- `TKDNItem`: komponen, nilai DN/LN, bukti, verifikasi.
- `DocumentDraft`: jenis, sumber, versi, isi, diff, status, reviewer.
- `AuditEvent`: actor, role, aksi, objek, timestamp.

---

## 6. Persyaratan Nonfungsional

- RBAC dan segregasi catatan internal/vendor.
- Audit trail tidak dapat diubah dari UI.
- Enkripsi saat transit dan saat tersimpan.
- Autosave dan versioning dokumen.
- WCAG 2.1 AA, navigasi keyboard, dan tabel responsif.
- Setiap keputusan AI dapat dijelaskan melalui sumber yang digunakan.
- Integrasi API dengan SAPP PROMISE, DocGen, dan SmartGEP bila akses tersedia.
- Target performa tampilan utama <2,5 detik pada jaringan kantor standar.

---

## 7. MVP Kompetisi

MVP mendemonstrasikan satu tender yang sama dari awal sampai akhir:

1. Vendor mengirim pertanyaan berbasis pasal.
2. Panitia menjawab dan membuat draf BA.
3. Evaluator membandingkan harga dan memberi skor.
4. Vendor/evaluator memperbarui dan memverifikasi data TKDN.
5. AI menyusun draf LHP dengan sumber dan diff.
6. Approver mengesahkan atau mengembalikan dokumen.

Fitur D1–D4 tidak masuk demo utama.

---

## 8. Indikator Keberhasilan

- Waktu penyusunan draf BA berkurang minimal 60%.
- Seluruh pertanyaan dan keputusan dapat ditelusuri ke pasal RKS.
- 100% skor evaluator memiliki author dan timestamp.
- Seluruh indikasi harga timpang memiliki status klarifikasi.
- Seluruh nilai TKDN memiliki breakdown dan status bukti.
- Dokumen AI tidak dapat terbit tanpa review manusia.

---

## 9. Kriteria Penerimaan MVP

- Tidak ada menu atau klaim utama D1–D4.
- D5, D6, D7, dan D8 tersedia sebagai empat workspace yang terhubung.
- Perubahan Q&A, skor, dan TKDN tercermin pada draf terkait.
- BA dan LHP menampilkan status AI Draft, sumber, versi, dan reviewer.
- Semua aksi penting menghasilkan audit event.
- Aplikasi responsif dan dapat dibangun tanpa error TypeScript.
