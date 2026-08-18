# DESIGN SYSTEM & UI/UX SPECIFICATION (design.md)
## Proyek 2: Digital Tender Collaboration and Intelligent Document Automation
**Mitra:** PT Pertamina Patra Niaga Regional Kalimantan x FILKOM UB (Pertamina Camp 2026)

---

## 1. Design Vision & Core Principles

Dokumen ini merupakan pedoman desain visual (Design System) untuk pengembangan antarmuka web **Proyek 2**. Sistem dirancang untuk menggabungkan fungsionalitas *enterprise-grade procurement* dengan antarmuka yang modern, bersih, dan intuitif.

### Prinsip Utama Desain:
1. **Trust & Corporate Compliance**: Menggunakan identitas warna resmi PT Pertamina Patra Niaga untuk memancarkan integritas, profesionalisme, dan kepatuhan hukum.
2. **Document-Centric Clarity**: Area penyusunan dokumen (RKS & Kontrak) dirancang dengan visual yang sangat bersih (*high contrast*, *low visual noise*) agar pengguna nyaman membaca dan mengedit dokumen panjang.
3. **Real-Time Visual Feedback**: Menggunakan indikator status yang tegas (warna aksen, *badge*, dan *timer*) untuk memberikan visibilitas seketika terhadap SLA, validasi data, dan hasil evaluasi.
4. **Seamless Collaboration**: Tata letak dua panel (*split-screen*) untuk memfasilitasi perbandingan *side-by-side* penawaran vendor dan interaksi Pre-Bid secara langsung.

---

## 2. Color Palette & Theme Tokens

Palet warna berbasis identitas **PT Pertamina Patra Niaga** dipadukan dengan standar desain aplikasi enterprise modern.

### 2.1 Brand & Core Colors
| Token Name | Color Code (HEX) | Visual Preview | Usage / Role |
| :--- | :--- | :--- | :--- |
| `--color-primary-navy` | `#004B87` | Deep Corporate Navy | Sidebar background, Top Navigation, Table Headers, Primary Headings |
| `--color-primary-navy-dark` | `#00335E` | Dark Navy | Hover states on primary elements, Active navigation items |
| `--color-accent-red` | `#ED1C24` | Pertamina Red | Main CTA Buttons (*Submit*, *Approve*), High-priority Alerts, Primary Accents |
| `--color-accent-red-hover` | `#C81018` | Darker Red | Hover states for primary CTA buttons |
| `--color-secondary-blue` | `#00A3E0` | Vibrant Cyan/Blue | Link text, Interactive highlights, Secondary active indicators |

### 2.2 Neutral & Background Tokens
| Token Name | Color Code (HEX) | Usage / Role |
| :--- | :--- | :--- |
| `--color-bg-app` | `#F8FAFC` | Main application background canvas |
| `--color-bg-surface` | `#FFFFFF` | Card backgrounds, Modal dialogs, Form containers |
| `--color-bg-workspace` | `#F1F5F9` | Canvas background for Document Editor & PDF preview |
| `--color-border-light` | `#E2E8F0` | Subtle borders for cards, inputs, and table rows |
| `--color-border-medium` | `#CBD5E1` | Input focus borders, divider lines |
| `--color-text-main` | `#0F172A` | Primary text content, headings, body text |
| `--color-text-muted` | `#64748B` | Subtitles, captions, disabled states, placeholder text |

### 2.3 Status & Semantic Colors
| Status | Color Code (HEX) | Usage / Role |
| :--- | :--- | :--- |
| **Success / Valid** | `#10B981` (Emerald) | Validasi D1 Lolos, Status Approved, SLA On-Track, Dokumen Complete |
| **Warning / Pending** | `#F59E0B` (Amber) | Pending Review, Peringatan SLA Mendekati Batas (D4), Harga Timpang |
| **Danger / Expiry Alert** | `#EF4444` (Red) | Validasi Error (D1), Jaminan Kedaluwarsa (D2), SLA Breached |
| **Info / AI Accent** | `#8B5CF6` (Purple/Indigo) | AI Assistant Features (D8), Auto-gen Indicators |

---

## 3. Typography Hierarchy

Sistem menggunakan font **Plus Jakarta Sans** atau **Inter** (Fallback: `sans-serif`) untuk memastikan keterbacaan tinggi pada tingkat kerapatan data yang berbeda.

```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Hierarchy Scale:
- **Heading 1 (`H1`)**: 28px / 36px line-height | Bold (700) | Main Dashboard Titles
- **Heading 2 (`H2`)**: 22px / 28px line-height | SemiBold (600) | Section Titles, Modal Headers
- **Heading 3 (`H3`)**: 18px / 24px line-height | SemiBold (600) | Card Headers, Document Subsections
- **Body Regular**: 14px / 20px line-height | Regular (400) | Standard Form Text, Table Data
- **Body Medium**: 14px / 20px line-height | Medium (500) | Labels, Table Headers
- **Caption / Small**: 12px / 16px line-height | Regular (400) | Meta info, SLA Timers, Badges
- **Code / Document Mono**: `'JetBrains Mono', 'Fira Code', monospace` | 13px | Document Templates & Auto-gen variables

---

## 4. Layout Architecture & Navigation Grid

Aplikasi menggunakan struktur 3-Panel Layout yang responsif dan fleksibel.

```
+-----------------------------------------------------------------------------------+
|  TOP NAVBAR (App Name, Project Selector, Global Search, User Profile & Roles)    |
+--------------+--------------------------------------------------------------------+
| SIDEBAR      | MAIN CONTENT AREA                                                  |
| (Navy Theme) | +----------------------------------------------------------------+ |
|              | | BREADCRUMB / ACTION HEADER                                     | |
| - Dashboard  | +----------------------------------------------------------------+ |
| - DocGen     | | WORKSPACE / SPLIT VIEW CANVAS                                  | |
| - Pre-Bid    | |                                                                | |
| - Evaluation | |  [Left Pane: Form/Inputs]    |  [Right Pane: Live Preview/AI]  | |
| - Contracts  | |                               |                                | |
|              | +----------------------------------------------------------------+ |
+--------------+--------------------------------------------------------------------+
```

### Key Grid Dimensions:
- **Sidebar Width**: `260px` (Collapsible to `72px`)
- **Top Bar Height**: `64px` (Sticky top)
- **Container Max-Width**: `1600px` (Fluid stretch for Split-screen views)
- **Gutter & Spacing Base**: `8px` scale (`8px`, `16px`, `24px`, `32px`)

---

## 5. Specifications per Subtopic Feature (D1 - D8)

### 5.1 Subtopik D1: Doc Digital Form & Validation Engine
- **Visual Design**: Form terstruktur dengan validasi inline *real-time*.
- **UI Components**:
  - **Status Indicator Banner**: Banner bagian atas form yang menampilkan skor kelengkapan dokumen (contoh: "Kelengkapan Dokumen DP3: 85%").
  - **Inline Validation Tooltip**: Jika field wajib belum terisi, input border berubah menjadi merah (`#EF4444`) dengan tooltip peringatan yang menjelaskan dokumen pendukung yang kurang.
  - **TKDN & Tax Checklist**: Widget checkbox bertingkat untuk checklist HC TAD dan Form TKDN (A1, A2, B1).

### 5.2 Subtopik D2 & D4: SLA Timer & Expiry Alert System
- **Visual Design**: Badge dan progress bar visual yang memberikan kesadaran waktu (*time-sensitivity*).
- **UI Components**:
  - **SLA Countdown Pill**: Badges dengan icon jam `⏱️`
    - Green Badge: SLA > 48 jam
    - Amber Badge: SLA < 24 jam (Warning)
    - Red Pulsing Badge: SLA Terlewat (Breached)
  - **Bid Bond Expiry Card**: Widget khusus di dashboard dengan alert penanda warna kuning/merah untuk jaminan vendor yang mendekati masa kedaluwarsa.

### 5.3 Subtopik D5: Digital Pre-Bid Workspace & Auto-Gen Berita Acara
- **Visual Design**: Workspace kolaboratif 2 kolom (Kiri: Forum Q&A Aanwijzing, Kanan: Preview Berita Acara).
- **UI Components**:
  - **Q&A Chat Thread**: Card pertanyaan vendor dengan tag status `[Pending Answer]`, `[Answered]`, `[Clarified]`.
  - **Generate BA Button**: Tombol CTA utama (Pertamina Red `#ED1C24`) dengan icon PDF.
  - **Auto-Gen BA Preview Pane**: Panel kanan yang menampilkan draf *Berita Acara Penjelasan Tender* secara *real-time* saat panitia menjawab pertanyaan.

### 5.4 Subtopik D6: Evaluation Collaboration Hub
- **Visual Design**: Data-dense Matrix Table & Side-by-Side Comparison Modal.
- **UI Components**:
  - **Vendor Comparison Matrix**: Tabel komparatif yang menyandingkan *Owner Estimate* (OE) dengan penawaran Vendor A, Vendor B, Vendor C.
  - **Abnormal Price Highlight**: Highlight cell latar kuning lembut (`#FEF3C7`) jika ditemukan **Harga Timpang** (harga penawaran jauh di bawah OE).
  - **Multi-Evaluator Scoring Widget**: Rating slider/input angka untuk skor teknis + area catatan evaluasi internal yang hanya bisa dilihat oleh sesama Evaluator.
  - **Consolidated LHP Preview**: Draf otomatis Laporan Hasil Pemilihan (LHP) dengan diagram spider chart/radar scoring.

### 5.5 Subtopik D8: Smart Doc & AI Assistant Bar
- **Visual Design**: Drawer/Sidebar melayang (Floating Side-Panel) khusus fitur AI.
- **UI Components**:
  - **AI Prompt Box**: Area input berbasis aksen ungu/indigo (`#8B5CF6`) untuk meminta AI menggenerasi draf pasal RKS atau meringkas Berita Acara.
  - **Diff-Viewer**: Visual pembanding antara teks RKS standar vs teks saran dari AI (*Green text for insertion, Red strikethrough for deletion*).

---

## 6. Implementation CSS Variables (Tailwind / Custom CSS Config)

Gunakan variabel CSS berikut pada file stylesheet utama (`globals.css` / `tailwind.config.js`):

```javascript
// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        pertamina: {
          navy: '#004B87',
          'navy-dark': '#00335E',
          red: '#ED1C24',
          'red-hover': '#C81018',
          blue: '#00A3E0',
        },
        workspace: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          canvas: '#F1F5F9',
          border: '#E2E8F0',
        },
        ai: {
          accent: '#8B5CF6',
          bg: '#F5F3FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

---

## 7. Responsive & Accessibility Guidelines
1. **WCAG 2.1 AA Compliance**: Seluruh teks pada tombol merah dan header navy harus memenuhi rasio kontras minimal `4.5:1` terhadap latar belakangnya.
2. **Keyboard Accessibility**: Seluruh formulir validasi D1, Q&A D5, dan tabel scoring D6 harus dapat dinavigasi penuh menggunakan `Tab`, `Enter`, dan `Space`.
3. **Desktop Optimized**: Mengingat aplikasi ini adalah *enterprise procurement tool* dengan data padat, antarmuka dioptimalkan untuk resolusi layar `1366x768` hingga `1920x1080` pixel.