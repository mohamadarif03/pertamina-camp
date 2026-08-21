# DESIGN SYSTEM — TenderFlow AI
## Proyek 2: D5, D6, D7, D8

## Arah visual

TenderFlow AI menggunakan estetika enterprise yang tenang, presisi, dan document-centric. Navy menunjukkan kepercayaan dan tata kelola; merah menjadi aksen keputusan; biru menandai kolaborasi; hijau menandai verifikasi; ungu hanya digunakan untuk hasil AI.

## Prinsip

1. **Decision first** — setiap layar menonjolkan keputusan atau tindakan berikutnya.
2. **Traceable by design** — pasal RKS, sumber, author, versi, dan status selalu terlihat.
3. **AI is subordinate** — semua hasil AI memakai label `AI Draft` dan tidak memiliki aksi final tanpa manusia.
4. **One tender context** — seluruh role melihat tender yang sama dengan hak tindakan berbeda.
5. **Density with hierarchy** — tabel padat tetap memiliki whitespace, tipografi, dan status yang mudah dipindai.

## Warna

| Token | Nilai | Fungsi |
|---|---|---|
| Navy | `#09294D` | Navigasi, heading, trust |
| Blue | `#1677D2` | D5, link, kolaborasi |
| Red | `#E52B33` | CTA keputusan dan risiko |
| Green | `#18A86B` | Validasi dan TKDN compliant |
| Purple | `#7456D8` | AI draft, diff, sumber AI |
| Surface | `#FFFFFF` | Panel dan dokumen |
| Canvas | `#F3F6F9` | Latar workspace |

## Struktur layar

- Header: identitas produk, tender aktif, notifikasi, dan peran.
- Sidebar: Command Center serta empat modul resmi D5–D8.
- Workspace: intro singkat, status utama, lalu data/keputusan.
- Portal: pemilih empat peran resmi dalam alur Proyek 2.

## Pola modul

- **D5:** master-detail Q&A dengan pasal, kategori, status, jawaban, dan adendum.
- **D6:** matriks evaluasi horizontal dengan deviasi harga dan status klarifikasi.
- **D7:** kartu realisasi TKDN per vendor dengan target marker, breakdown, dan bukti.
- **D8:** tiga panel—sumber, kanvas dokumen, dan status review.

## Responsif dan aksesibilitas

- Sidebar menjadi drawer pada layar kecil.
- Matriks dapat digulir horizontal tanpa memotong kolom.
- Grid kartu berubah dari empat/tiga kolom menjadi dua lalu satu.
- Semua kontrol memakai elemen HTML native dan label yang terlihat.
- Status tidak hanya dibedakan melalui warna, tetapi juga melalui teks.
- Animasi dinonaktifkan saat `prefers-reduced-motion` aktif.

## Batas desain

Tidak ada menu atau kartu utama D1–D4. Informasi dari tahap sebelumnya hanya tampil sebagai metadata tender apabila dibutuhkan untuk memahami D5–D8.
