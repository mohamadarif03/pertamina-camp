"use client";

import React, { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function SubmitterPage() {
  const { 
    formData, 
    setFormData, 
    checklist, 
    setChecklist, 
    submitterTab, 
    setSubmitterTab,
    activeRole, 
    setActiveRole 
  } = useProject();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeDaftarFilter, setActiveDaftarFilter] = useState("semua");

  // Submissions List & Filter states
  const [submissionsList, setSubmissionsList] = useState([
    {
      id: "DP3-2026-001",
      title: "Pengadaan Jasa TAD TBBM Balikpapan 2026",
      type: "Tenaga Kerja Alih Daya (TAD)",
      oe: 1500000000,
      date: "18 Agu 2026, 09:30 WIB",
      completeness: 100,
      missingDoc: "",
      currentStage: "Tahap 1: Pemeriksaan DP3",
      stageNum: 1,
      slaStatus: "on-track", // on-track, warning, overdue, none
      slaText: "2 Hari 14 Jam",
      prNum: "PR-90422",
      statusGroup: "proses" // draf, proses, revisi, selesai
    },
    {
      id: "DP3-2026-002",
      title: "Pekerjaan Pipe Coating Terminal BBM Samarinda",
      type: "Jasa Konstruksi",
      oe: 4500000000,
      date: "15 Agu 2026, 14:15 WIB",
      completeness: 100,
      missingDoc: "",
      currentStage: "Tahap 7: Pre-Bid Meeting",
      stageNum: 7,
      slaStatus: "warning",
      slaText: "18 Jam Tersisa",
      prNum: "PR-90390",
      statusGroup: "proses"
    },
    {
      id: "DP3-2026-003",
      title: "Pengadaan APD & Atribut HSSE Regional",
      type: "Pengadaan Barang",
      oe: 850000000,
      date: "Draf",
      completeness: 60,
      missingDoc: "Form TKDN belum diunggah",
      currentStage: "Belum diajukan (Draf)",
      stageNum: 0,
      slaStatus: "none",
      slaText: "-",
      prNum: "-",
      statusGroup: "draf"
    },
    {
      id: "DP3-2026-004",
      title: "Penyusunan KAK Amdal Depot LPG Pontianak",
      type: "Jasa Konsultansi",
      oe: 1200000000,
      date: "12 Agu 2026, 10:00 WIB",
      completeness: 80,
      missingDoc: "Checklist HC TAD belum diunggah",
      currentStage: "Ditolak Pejabat DP3",
      stageNum: 2,
      slaStatus: "overdue",
      slaText: "Overdue +1 Hari",
      prNum: "PR-90410",
      statusGroup: "revisi"
    },
    {
      id: "DP3-2026-005",
      title: "Pengadaan IT Server & Colocation Balikpapan",
      type: "Pengadaan Barang",
      oe: 5600000000,
      date: "01 Jul 2026, 11:30 WIB",
      completeness: 100,
      missingDoc: "",
      currentStage: "Tahap 15: Penerbitan PO / Kontrak",
      stageNum: 15,
      slaStatus: "completed",
      slaText: "Released",
      prNum: "PR-90210",
      statusGroup: "selesai"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterHps, setFilterHps] = useState("Semua");
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<any | null>(null);

  const [activeTemplateFilter, setActiveTemplateFilter] = useState("semua");
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [previewedDoc, setPreviewedDoc] = useState<any | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  const [selectedProjectContext, setSelectedProjectContext] = useState("DP3-2026-001");
  const [aiTabRight, setAiTabRight] = useState("editor");
  const [editorText, setEditorText] = useState(`KERANGKA ACUAN KERJA (KAK) / SPESIFIKASI TEKNIS
Pekerjaan: Pengadaan Jasa Tenaga Kerja Alih Daya Terminal BBM Balikpapan
Fungsi Peminta: Supply & Distribution
Nilai Owner Estimate (OE): Rp 1.500.000.000
Nomor PR SAPP: PR-90422
Mata Anggaran: CC-KALTARA-2026

I. RUANG LINGKUP PEKERJAAN
Penyedia jasa wajib menyediakan tenaga kerja terampil untuk mengelola operasional depot dan distribusi bahan bakar minyak di Terminal BBM Balikpapan selama durasi kontrak.

II. PERSYARATAN UMUM VENDOR
1. Memiliki izin usaha yang sah di bidang penyediaan tenaga kerja.
2. Memiliki pengalaman minimal 3 tahun dalam mengelola pekerjaan sejenis.`);
  const [originalText, setOriginalText] = useState(`KERANGKA ACUAN KERJA (KAK) / SPESIFIKASI TEKNIS
Pekerjaan: Pengadaan Jasa Tenaga Kerja Alih Daya Terminal BBM Balikpapan
Fungsi Peminta: Supply & Distribution
Nilai Owner Estimate (OE): Rp 1.500.000.000
Nomor PR SAPP: PR-90422
Mata Anggaran: CC-KALTARA-2026

I. RUANG LINGKUP PEKERJAAN
Penyedia jasa wajib menyediakan tenaga kerja terampil untuk mengelola operasional depot dan distribusi bahan bakar minyak di Terminal BBM Balikpapan selama durasi kontrak.

II. PERSYARATAN UMUM VENDOR
1. Memiliki izin usaha yang sah di bidang penyediaan tenaga kerja.
2. Memiliki pengalaman minimal 3 tahun dalam mengelola pekerjaan sejenis.`);
  const [showDiffHighlights, setShowDiffHighlights] = useState(true);

  // Status Tracking states
  const [trackingProjectId, setTrackingProjectId] = useState("DP3-2026-001");
  const [clickedStageNum, setClickedStageNum] = useState<number | null>(null);
  const [slaReminderSent, setSlaReminderSent] = useState(false);

  // Form Wizard & Inputs states
  const [formStep, setFormStep] = useState(1);
  const [jenisPekerjaan, setJenisPekerjaan] = useState("Tenaga Kerja Alih Daya (TAD)");
  const [metodePengadaan, setMetodePengadaan] = useState("Tender Terbuka");
  const [targetDurasi, setTargetDurasi] = useState(12);
  const [durasiUnit, setDurasiUnit] = useState("Bulan");
  const [nomorPR, setNomorPR] = useState("PR-90422");
  const [costCenter, setCostCenter] = useState("CC-KALTARA-2026");

  // File states (mocked upload success)
  const [uploadedFiles, setUploadedFiles] = useState({
    pakta: false,
    tkdn: false,
    hctad: false,
    lainnya: false
  });

  // Popup banner validation error
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Sync role in context
  useEffect(() => {
    if (activeRole !== "submitter") {
      setActiveRole("submitter");
    }
  }, [activeRole, setActiveRole]);

  // Validation Checks
  const checks = {
    dataDasar: formData.jobName.trim().length > 0,
    anggaran: formData.oe > 0 && nomorPR.trim().length > 0,
    pakta: uploadedFiles.pakta,
    tkdn: uploadedFiles.tkdn,
    hctad: jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" ? uploadedFiles.hctad : true
  };

  // Calculate kelengkapan
  const calculateCompleteness = () => {
    const passed = Object.values(checks).filter(Boolean).length;
    return Math.round((passed / 5) * 100);
  };
  const score = calculateCompleteness();

  const handleUpload = (key: keyof typeof uploadedFiles) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleRemoveFile = (key: keyof typeof uploadedFiles) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const handleSubmitClick = () => {
    if (score < 100) {
      setShowErrorBanner(true);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getTrackingStages = (projId: string) => {
    const list = [
      { step: 1, label: "Pemeriksaan DP3 & PPL", desc: "Inisiasi FPP selesai diajukan oleh Ahmad Faisal." },
      { step: 2, label: "Approval Pejabat DP3", desc: "Verifikasi kelayakan berkas & persetujuan Pejabat." },
      { step: 3, label: "Penyiapan Dokumen Pemilihan (RKS)", desc: "Penyusunan kerangka acuan kerja & syarat administratif." },
      { step: 4, label: "Pengumuman Tender / Undangan", desc: "Publikasi undangan pengadaan ke calon penyedia." },
      { step: 5, label: "Pendaftaran & Pemasukan Penawaran", desc: "Pendaftaran minat & pengumpulan dokumen penawaran vendor." },
      { step: 6, label: "Penilaian Kualifikasi", desc: "Evaluasi keabsahan administrasi vendor." },
      { step: 7, label: "Pre-Bid Meeting (Aanwijzing)", desc: "Rapat koordinasi tanya jawab teknis pre-bid." },
      { step: 8, label: "Site Visit", desc: "Peninjauan lapangan lokasi proyek bersama calon vendor." },
      { step: 9, label: "Pembukaan & Evaluasi Penawaran", desc: "Evaluasi administrasi, teknis, dan harga penawaran vendor." },
      { step: 10, label: "Negosiasi & Klarifikasi Harga Timpang", desc: "Negosiasi harga penawaran calon pemenang." },
      { step: 11, label: "Penegasan Harga", desc: "Konfirmasi harga akhir tertulis dari vendor." },
      { step: 12, label: "LHP & Usulan Pemenang", desc: "Panitia menyusun Laporan Hasil Pemilihan." },
      { step: 13, label: "Pengumuman Pemenang", desc: "Publikasi pengumuman pemenang resmi." },
      { step: 14, label: "Penunjukan Pemenang", desc: "Penerbitan surat penunjukan pemenang (SPPBJ)." },
      { step: 15, label: "Finalisasi Kontrak / Release PO", desc: "Tanda tangan kontrak & release Purchase Order SAP." }
    ];

    let activeStage = 1;
    let isRevising = false;
    if (projId === "DP3-2026-001") {
      activeStage = 1;
    } else if (projId === "DP3-2026-002") {
      activeStage = 7;
    } else if (projId === "DP3-2026-004") {
      activeStage = 2;
      isRevising = true;
    }

    return list.map((item) => {
      let status = "pending";
      let timestamp = "";
      let pic = "Panitia Pengadaan";
      let docName = "";

      if (item.step < activeStage) {
        status = "done";
        timestamp = "18 Agu 2026, 09:30 WIB";
      } else if (item.step === activeStage) {
        if (isRevising) {
          status = "breached";
          pic = "Pejabat DP3 - Regional Kalimantan";
          timestamp = "Masuk sejak 12 Agu 2026";
        } else {
          status = "current";
          pic = "Panitia Pengadaan - Buyer A";
          timestamp = "Masuk sejak 15 Agu 2026";
        }
      }

      if (item.step === 7) docName = "Berita_Acara_Pre_Bid_D5.pdf";
      if (item.step === 9) docName = "Laporan_Evaluasi_Penawaran_D6.pdf";
      if (item.step === 1) docName = "Form_DP3_Inisiasi.pdf";

      return {
        ...item,
        status,
        timestamp,
        pic,
        docName
      };
    });
  };

  // Mock Submissions List data
  const getFilteredSubmissions = () => {
    return submissionsList.filter((item) => {
      // 1. Kategori Status Tabs
      if (activeDaftarFilter !== "semua" && item.statusGroup !== activeDaftarFilter) {
        return false;
      }
      // 2. Pencarian Cepat
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchId = item.id.toLowerCase().includes(query);
        const matchPr = item.prNum.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchPr) {
          return false;
        }
      }
      // 3. Filter Jenis Pekerjaan
      if (filterJenis !== "Semua" && item.type !== filterJenis) {
        return false;
      }
      // 4. Filter Nilai HPS/OE
      if (filterHps !== "Semua") {
        if (filterHps === "< 1 Miliar" && item.oe >= 1000000000) return false;
        if (filterHps === "1 - 5 Miliar" && (item.oe < 1000000000 || item.oe > 5000000000)) return false;
        if (filterHps === "> 5 Miliar" && item.oe <= 5000000000) return false;
      }
      return true;
    });
  };

  const templatesList = [
    {
      id: "temp-1",
      title: "Pakta Integritas Submitter.docx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "DOCX",
      version: "v2026.1",
      size: "45 KB",
      desc: "Form surat pernyataan integritas bebas KKN yang wajib ditandatangani oleh peminta pengadaan.",
      tag: "MANDATORY D1",
      subtopik: "D1 Engine (Mandatory)"
    },
    {
      id: "temp-2",
      title: "Formulir TKDN (Form A1, A2, B1).xlsx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "XLSX",
      version: "v2026.2",
      size: "1.2 MB",
      desc: "Template perhitungan TKDN resmi untuk pengadaan barang & jasa di Patra Niaga.",
      tag: "MANDATORY D7",
      subtopik: "D7 TKDN (Mandatory)"
    },
    {
      id: "temp-3",
      title: "Checklist HC TAD (Tenaga Kerja Alih Daya).docx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "DOCX",
      version: "v2026.1",
      size: "310 KB",
      desc: "Checklist validasi kelayakan dan pemenuhan hak Tenaga Kerja Alih Daya.",
      tag: "MANDATORY IF TAD",
      subtopik: "D1 Engine (Wajib jika Pekerjaan = TAD)"
    },
    {
      id: "temp-4",
      title: "Template Kerangka Acuan Kerja (KAK) / Spec Teknis.docx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "DOCX",
      version: "v2026.1",
      size: "85 KB",
      desc: "Kerangka acuan draf Uraian Pekerjaan & Spesifikasi Teknis RKS.",
      tag: "SUPPORTING D8",
      subtopik: "D8 Smart Doc / AI"
    },
    {
      id: "temp-5",
      title: "Form Risk Assessment & Denda.xlsx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "XLSX",
      version: "v2026.1",
      size: "95 KB",
      desc: "Form identifikasi tingkat risiko pekerjaan dan formula penentuan denda keterlambatan.",
      tag: "STANDARD D1",
      subtopik: "D1 Engine"
    },
    {
      id: "temp-6",
      title: "Template Justifikasi Pengadaan (PL/Pil Direct).docx",
      category: "baku",
      categoryLabel: "Formulir Baku DP3",
      format: "DOCX",
      version: "v2026.1",
      size: "60 KB",
      desc: "Template surat alasan teknis/operasional untuk metode Penunjukan / Pemilihan Langsung.",
      tag: "STANDARD D1",
      subtopik: "D1 Engine"
    },
    {
      id: "temp-7",
      title: "Pedoman Pengadaan Barang/Jasa PT Pertamina Patra Niaga.pdf",
      category: "regulasi",
      categoryLabel: "Regulasi & Pedoman",
      format: "PDF",
      version: "v2025.4",
      size: "2.4 MB",
      desc: "Buku acuan utama tata cara pengadaan, batasan wewenang (DOA), dan tahapan tender B2B.",
      tag: "READ-ONLY REGULASI",
      subtopik: "Pedoman Pengadaan"
    },
    {
      id: "temp-8",
      title: "Pedoman Tata Kerja (PTK) TKDN Pertamina Group.pdf",
      category: "regulasi",
      categoryLabel: "Regulasi & Pedoman",
      format: "PDF",
      version: "v2025.2",
      size: "1.8 MB",
      desc: "Acuan perhitungan target persentase TKDN berdasarkan Roadmap TKDN Pertamina.",
      tag: "READ-ONLY D7",
      subtopik: "D7 TKDN"
    },
    {
      id: "temp-9",
      title: "Kebijakan & Regulasi Human Capital mengenai Pekerjaan TAD.pdf",
      category: "regulasi",
      categoryLabel: "Regulasi & Pedoman",
      format: "PDF",
      version: "v2026.1",
      size: "1.1 MB",
      desc: "Acuan aturan ketenagakerjaan, struktur pengupahan, dan standar keselamatan kerja untuk pekerjaan borongan/TAD.",
      tag: "READ-ONLY HC",
      subtopik: "Pedoman TAD"
    },
    {
      id: "temp-10",
      title: "Matriks Ketentuan Jaminan (Bid Bond & Performance Bond).pdf",
      category: "regulasi",
      categoryLabel: "Regulasi & Pedoman",
      format: "PDF",
      version: "v2025.1",
      size: "820 KB",
      desc: "Tabel panduan besaran % nilai jaminan dan daftar bank penerbit jaminan yang diakui Pertamina.",
      tag: "READ-ONLY D2",
      subtopik: "D2 Jaminan"
    },
    {
      id: "temp-11",
      title: "Panduan Penggunaan Portal e-Procurement Pertamina.pdf",
      category: "sop",
      categoryLabel: "Panduan Sistem",
      format: "PDF",
      version: "v2026.1",
      size: "1.5 MB",
      desc: "Langkah-langkah SOP penggunaan sistem e-Procurement untuk Submitter.",
      tag: "SOP SYSTEM",
      subtopik: "SOP"
    }
  ];

  const filteredSubmissions = getFilteredSubmissions();

  // AI Chat Bot Mock for Specs drafting
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Halo! Saya Asisten AI Pengadaan. Saya siap membantu Anda menyusun Spesifikasi Teknis, Uraian Pekerjaan, atau menetapkan target TKDN untuk paket pengadaan Anda." }
  ]);

  const handlePresetTrigger = (presetName: string, type: string) => {
    const newMsgUser = { role: "user", content: presetName };
    let reply = "";
    
    if (type === "kak") {
      reply = "AI mendeteksi proyek terpilih: Pekerjaan Pipe Coating Samarinda. Mengenerate draf spesifikasi KAK dan HSSE di editor sebelah kanan. Silakan lihat pembanding visual pada tab Diff-Viewer.";
      setEditorText(`KERANGKA ACUAN KERJA (KAK) / SPESIFIKASI TEKNIS
Pekerjaan: Pekerjaan Pipe Coating Terminal BBM Samarinda
Fungsi Peminta: Supply & Distribution
Nilai Owner Estimate (OE): Rp 4.500.000.000
Nomor PR SAPP: PR-90390
Mata Anggaran: CC-KALTARA-2026

I. RUANG LINGKUP PEKERJAAN
Penyedia jasa wajib melakukan jasa pelapisan pipa anti-korosif pada tangki pendam dan pipa distribusi BBM di Samarinda.

II. PERSYARATAN UMUM VENDOR
1. Memiliki sertifikasi pelapisan pipa migas.
2. Memiliki tim inspektur korosi bersertifikat.
3. Durasi pekerjaan diusulkan selama 6 bulan penuh.`);
      setAiTabRight("diff");
      setShowDiffHighlights(true);
    } else if (type === "risiko") {
      reply = "AI menyarankan penambahan klausul denda keterlambatan (1/1000 per hari) dan kewajiban asuransi CAR (Contractor All Risks) karena proyek bernilai >1 Miliar. Silakan cek Diff-Viewer sebelah kanan.";
      setAiTabRight("diff");
      setShowDiffHighlights(true);
    } else if (type === "tad") {
      reply = "Melakukan audit kepatuhan. Dokumen KAK tervalidasi memenuhi Pedoman Tata Kerja (PTK) Pertamina Patra Niaga nomor PTK-007 mengenai standar ketenagakerjaan TAD.";
      setAiTabRight("diff");
      setShowDiffHighlights(true);
    } else if (type === "tkdn") {
      reply = "Berdasarkan Roadmap TKDN Pertamina 2026, untuk Klasifikasi Jasa Konstruksi, target minimum TKDN yang direkomendasikan adalah 35.50%.";
      setAiTabRight("diff");
      setShowDiffHighlights(true);
    } else if (type === "justifikasi") {
      reply = "Membuat kalimat justifikasi teknis/operasional: 'Metode Pemilihan Langsung diusulkan berdasarkan pertimbangan aspek spesialisasi teknologi perlindungan korosi pipa bawah tanah serta rekam jejak sertifikasi HSE vendor.'";
      setAiTabRight("diff");
      setShowDiffHighlights(true);
    }

    const newMsgAssistant = { role: "assistant", content: reply };
    setChatMessages((prev) => [...prev, newMsgUser, newMsgAssistant]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    const inputMsg = chatInput;
    setChatInput("");

    setTimeout(() => {
      let aiContent = "Tentu, berdasarkan Pedoman Pengadaan Pertamina, spesifikasi teknis tersebut perlu menyertakan standar HSSE berikut:\n\n1. Seluruh operator TAD wajib memiliki sertifikasi berkendara aman (Defensive Driving).\n2. APD yang disediakan wajib bersertifikat SNI dan standar HSSE Regional VI.";
      if (inputMsg.toLowerCase().includes("tkdn")) {
        aiContent = "Untuk paket pengadaan ini, target TKDN minimum yang disarankan adalah 35.5% karena melibatkan jasa kapal tanker domestik dan TAD lokal.";
        setAiTabRight("diff");
        setShowDiffHighlights(true);
      } else if (inputMsg.toLowerCase().includes("denda") || inputMsg.toLowerCase().includes("risiko")) {
        aiContent = "Menganalisis draf spesifikasi Anda... AI merekomendasikan penambahan klausul denda keterlambatan 1/1000 per hari keterlambatan (maksimal 5% dari nilai kontrak). Silakan lihat tab Diff-Viewer.";
        setAiTabRight("diff");
        setShowDiffHighlights(true);
      }
      setChatMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Dynamic Navbar */}
      <Navbar />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Dynamic Sidebar */}
        <Sidebar />

        <main className="content-pane" style={{ padding: "24px" }}>
          
          {/* Dashboard Tab Content */}
          {submitterTab === "dashboard" && (
            <div>
              {/* 1. Header & Quick Action Area */}
              <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                <div className="page-title-area">
                  <div className="breadcrumb" style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "500", marginBottom: "4px" }}>
                    Selamat Datang, Ahmad Faisal — Fungsi Supply & Distribution (Regional Kalimantan)
                  </div>
                  <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: "700" }}>
                    Dashboard Peminta Pengadaan
                    <span className="badge" style={{ backgroundColor: "var(--color-primary-navy)", color: "white", fontSize: "11px", fontWeight: "700", borderRadius: "4px" }}>
                      Role: Submitter / Peminta
                    </span>
                  </h1>
                </div>
                <div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setSubmitterTab("form")} 
                    style={{ backgroundColor: "var(--color-accent-red)", color: "white", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    + Buat Pengajuan DP3 Baru
                  </button>
                </div>
              </div>

              {/* 2. Summary Metric Cards (KPI Baris Atas) */}
              <div className="quick-access-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "24px" }}>
                
                <div className="quick-access-card" style={{ minHeight: "110px", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Total Pengajuan DP3</span>
                    <h3 style={{ fontSize: "26px", color: "var(--color-primary-navy)", margin: "6px 0 2px 0", fontWeight: "700" }}>12 Pekerjaan</h3>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "600" }}>
                    2 Draf | 3 In-Review | 7 Disetujui/Berjalan
                  </span>
                </div>

                <div className="quick-access-card" style={{ minHeight: "110px", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Skor Kelengkapan Rata-Rata</span>
                    <h3 style={{ fontSize: "26px", color: "var(--color-success)", margin: "6px 0 2px 0", fontWeight: "700" }}>95%</h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "10px", padding: "2px 8px", fontWeight: "700", alignSelf: "flex-start" }}>
                    Sebagian besar DP3 tanpa kesalahan
                  </span>
                </div>

                <div className="quick-access-card" style={{ minHeight: "110px", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Status SLA Pengajuan (D4)</span>
                    <h3 style={{ fontSize: "26px", color: "var(--color-primary-navy)", margin: "6px 0 2px 0", fontWeight: "700" }}>3 Aktif | 0 Delay</h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "10px", padding: "2px 8px", fontWeight: "700", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
                    3 Pekerjaan On-Track
                  </span>
                </div>

                <div className="quick-access-card" style={{ minHeight: "110px", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Capaian TKDN Unit Kerja (D7)</span>
                    <h3 style={{ fontSize: "26px", color: "var(--color-secondary-blue)", margin: "6px 0 2px 0", fontWeight: "700" }}>78.5%</h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "10px", padding: "2px 8px", fontWeight: "700", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
                    Di atas Target Roadmap
                  </span>
                </div>

              </div>

              {/* Grid 2 Column for Main Widgets */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", marginBottom: "24px" }}>
                
                {/* Left Side: Active Tracker & Revision alerts */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {/* 3. Main Widget 1: Active Procurement Status Tracker */}
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Active Procurement Status Tracker (D3 & D4)</span>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border-light)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <div>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text-main)" }}>
                              Pengadaan Jasa TAD TBBM Balikpapan
                            </h4>
                            <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>DP3-2026-001</span>
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span className="badge badge-ai" style={{ fontSize: "10px" }}>Tenaga Kerja Alih Daya (TAD)</span>
                            <span className="badge badge-success" style={{ fontSize: "10px", backgroundColor: "#E6F4EA", color: "#137333", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              1 Hari 14 Jam Tersisa
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px", fontSize: "13px" }}>
                          <div>
                            <span style={{ color: "var(--color-text-muted)", display: "block" }}>Estimasi HPS/OE:</span>
                            <strong>Rp 1.500.000.000</strong>
                          </div>
                          <div>
                            <span style={{ color: "var(--color-text-muted)", display: "block" }}>Tahap FPP Saat Ini (15 Tahapan):</span>
                            <strong>Tahap 1: Pemeriksaan DP3 & PPL</strong>
                          </div>
                        </div>

                        {/* FPP progress bar line */}
                        <div className="progress-container" style={{ marginBottom: "16px" }}>
                          <div className="progress-track" style={{ height: "6px" }}>
                            <div className="progress-fill" style={{ width: "6.7%", backgroundColor: "var(--color-success)" }}></div>
                          </div>
                          <span className="progress-text" style={{ fontSize: "11px" }}>1/15</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => setSubmitterTab("tracking")} 
                            style={{ padding: "6px 14px", fontSize: "12px", fontWeight: "700" }}
                          >
                            Detail Status FPP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Main Widget 2: Action Needed & Revision Alert Center */}
                  <div className="card" style={{ borderLeft: "4px solid var(--color-danger)", backgroundColor: "var(--color-danger-bg)" }}>
                    <div className="card-header" style={{ background: "none", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
                      <span className="card-title" style={{ color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Action Needed & Revision Alert Center (D1)
                      </span>
                    </div>
                    <div className="card-body" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <strong>DP3-2026-004 (Pengadaan Konsultansi Amdal) — Status: Butuh Perbaikan</strong>
                        <span className="badge badge-danger" style={{ fontSize: "10px", padding: "2px 8px" }}>Revisi Segera</span>
                      </div>
                      <div style={{ color: "var(--color-text-main)", marginBottom: "14px", padding: "10px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "6px" }}>
                        <strong>Catatan Pejabat DP3 / Validation Engine:</strong>
                        <p style={{ fontSize: "12px", marginTop: "2px", color: "var(--color-text-main)" }}>
                          "Jenis Pekerjaan TAD terpilih tetapi Checklist HC TAD belum diunggah."
                        </p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setSubmitterTab("form")} 
                          style={{ padding: "6px 14px", fontSize: "12px" }}
                        >
                          Perbaiki Form DP3
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: AI Helper & Templates download */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {/* 5. A. Smart Doc & AI Assistant Quick Input */}
                  <div className="card" style={{ borderLeft: "4px solid var(--color-ai-accent)", backgroundColor: "var(--color-ai-bg)" }}>
                    <div className="card-header" style={{ background: "none", borderBottom: "1px solid var(--color-ai-border)" }}>
                      <span className="card-title" style={{ color: "var(--color-ai-accent)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Smart Doc & AI Assistant (D8)
                      </span>
                    </div>
                    <div className="card-body" style={{ fontSize: "13px" }}>
                      <p style={{ color: "var(--color-text-muted)", marginBottom: "12px", lineHeight: "1.4" }}>
                        Butuh bantuan menyusun Kerangka Acuan Kerja (KAK) atau Spesifikasi Teknis RKS?
                      </p>
                      <div className="form-group" style={{ marginBottom: "12px" }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Contoh: Buat draf spesifikasi armada..."
                          style={{ fontSize: "12px", padding: "8px 12px" }}
                        />
                      </div>
                      <button 
                        className="btn btn-ai" 
                        onClick={() => setSubmitterTab("ai")} 
                        style={{ width: "100%", padding: "8px", fontSize: "12px" }}
                      >
                        Generate Draf dengan AI
                      </button>
                    </div>
                  </div>

                  {/* 5. B. Quick Download & Template Acuan */}
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Quick Download & Template Acuan</span>
                    </div>
                    <div className="card-body" style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        
                        <div 
                          onClick={() => alert("Downloading Template Pakta Integritas...")}
                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "1px solid var(--color-border-light)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
                          className="drive-file-row-hover"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-navy)" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          <div style={{ fontSize: "12px" }}>
                            <strong>Template Pakta Integritas (.docx)</strong>
                          </div>
                        </div>

                        <div 
                          onClick={() => alert("Downloading Form TKDN A1/A2/B1...")}
                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "1px solid var(--color-border-light)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
                          className="drive-file-row-hover"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                          <div style={{ fontSize: "12px" }}>
                            <strong>Form TKDN A1/A2/B1 (.xlsx)</strong>
                          </div>
                        </div>

                        <div 
                          onClick={() => alert("Downloading Form Checklist HC TAD...")}
                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "1px solid var(--color-border-light)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
                          className="drive-file-row-hover"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          <div style={{ fontSize: "12px" }}>
                            <strong>Form Checklist HC TAD (.pdf)</strong>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* 6. Bottom Section: Timeline Aktivitas Terakhir (Audit Log) */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Timeline Aktivitas Terakhir (Audit Log)</span>
                </div>
                <div className="card-body" style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                    
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span style={{ color: "var(--color-text-muted)", minWidth: "120px", fontWeight: "600" }}>10:30 WIB</span>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
                      <span>DP3-2026-001 berhasil disetujui oleh Pejabat DP3.</span>
                    </div>

                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span style={{ color: "var(--color-text-muted)", minWidth: "120px", fontWeight: "600" }}>Yesterday</span>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-secondary-blue)" }}></span>
                      <span>Mengunggah revisi Form TKDN A1 untuk proyek Pengadaan Pipe Coating.</span>
                    </div>

                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span style={{ color: "var(--color-text-muted)", minWidth: "120px", fontWeight: "600" }}>15 Aug 2026</span>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-border-medium)" }}></span>
                      <span>Membuat draf baru DP3-2026-003.</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Form Tab Content */}
          {submitterTab === "form" && (
            <div>
              {/* Stepper Header area */}
              <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                <div className="page-title-area">
                  <div className="breadcrumb" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    Pengajuan Pengadaan &gt; Buat DP3 Baru
                  </div>
                  <h1 className="page-title" style={{ fontSize: "22px", fontWeight: "700" }}>Penyusunan Formulir DP3 & Lampiran</h1>
                </div>
                <div>
                  <span className={`badge ${score === 100 ? "badge-success" : "badge-warning"}`} style={{ padding: "6px 12px", fontSize: "12px" }}>
                    Kelengkapan Dokumen: {score}%
                  </span>
                </div>
              </div>

              {/* Error Banner Alert */}
              {showErrorBanner && (
                <div style={{
                  padding: "16px",
                  backgroundColor: "var(--color-danger-bg)",
                  border: "1px solid var(--color-danger)",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-danger)", fontSize: "13px", fontWeight: "600" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span>Tidak dapat mengajukan. Silakan lengkapi Checklist HC TAD terlebih dahulu.</span>
                  </div>
                  <button 
                    onClick={() => setShowErrorBanner(false)}
                    style={{ background: "none", border: "none", color: "var(--color-danger)", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* Progress Stepper (3 Langkah Visual) */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                backgroundColor: "white",
                border: "1px solid var(--color-border-light)",
                borderRadius: "10px",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: formStep === 1 ? "var(--color-primary-navy)" : formStep > 1 ? "var(--color-success)" : "#CBD5E1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}>
                    {formStep > 1 ? "✓" : "1"}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: formStep === 1 ? "700" : "500", color: formStep === 1 ? "var(--color-primary-navy)" : "var(--color-text-muted)" }}>
                    Informasi Dasar & Anggaran
                  </span>
                </div>

                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border-light)", margin: "0 20px" }}></div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: formStep === 2 ? "var(--color-primary-navy)" : formStep > 2 ? "var(--color-success)" : "#CBD5E1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}>
                    {formStep > 2 ? "✓" : "2"}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: formStep === 2 ? "700" : "500", color: formStep === 2 ? "var(--color-primary-navy)" : "var(--color-text-muted)" }}>
                    Upload Dokumen Pendukung & TKDN
                  </span>
                </div>

                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border-light)", margin: "0 20px" }}></div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: formStep === 3 ? "var(--color-primary-navy)" : "#CBD5E1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}>
                    3
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: formStep === 3 ? "700" : "500", color: formStep === 3 ? "var(--color-primary-navy)" : "var(--color-text-muted)" }}>
                    Reviu & Finalisasi Submission
                  </span>
                </div>
              </div>

              {isSubmitted ? (
                <div className="card" style={{ padding: "40px", textAlign: "center" }}>
                  <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h2>DP3 Berhasil Disubmit!</h2>
                  <p style={{ color: "var(--color-text-muted)", marginTop: "8px", marginBottom: "24px" }}>
                    Dokumen Anda telah diteruskan ke Pejabat DP3 (Approver) untuk direview dan disetujui.
                  </p>
                  <button className="btn btn-secondary" onClick={() => {
                    setIsSubmitted(false);
                    setFormStep(1);
                    setUploadedFiles({ pakta: false, tkdn: false, hctad: false, lainnya: false });
                  }}>
                    Modifikasi / Buat Pengajuan Baru
                  </button>
                </div>
              ) : (
                <div className="workspace-canvas" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", padding: 0, gap: "24px" }}>
                  
                  {/* Left Column: Active Form Step */}
                  <div>
                    
                    {/* STEP 1: Informasi Dasar & Anggaran */}
                    {formStep === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div className="card">
                          <div className="card-header">
                            <span className="card-title">SECTION A: Informasi Dasar Pengadaan & Klasifikasi Pekerjaan</span>
                          </div>
                          <div className="card-body">
                            <div className="form-group">
                              <label className="form-label">Nama Pekerjaan / Pengadaan:</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={formData.jobName}
                                onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                                placeholder="Contoh: Pengadaan Jasa Tenaga Kerja Alih Daya Terminal BBM Balikpapan 2026"
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Fungsi Peminta Pengadaan:</label>
                              <select 
                                className="project-selector" 
                                style={{ width: "100%", backgroundColor: "white", padding: "10px" }}
                                value={formData.requestingFunction}
                                onChange={(e) => setFormData({ ...formData, requestingFunction: e.target.value })}
                              >
                                <option value="Supply & Distribution">Supply & Distribution</option>
                                <option value="Sales & Marketing">Sales & Marketing</option>
                                <option value="HSSE">HSSE</option>
                                <option value="IT">IT</option>
                              </select>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                              <div className="form-group">
                                <label className="form-label">Jenis / Klasifikasi Pekerjaan:</label>
                                <select 
                                  className="project-selector" 
                                  style={{ width: "100%", backgroundColor: "white", padding: "10px" }}
                                  value={jenisPekerjaan}
                                  onChange={(e) => setJenisPekerjaan(e.target.value)}
                                >
                                  <option value="Jasa Konstruksi">Jasa Konstruksi</option>
                                  <option value="Jasa Non-Konstruksi">Jasa Non-Konstruksi</option>
                                  <option value="Pengadaan Barang">Pengadaan Barang</option>
                                  <option value="Tenaga Kerja Alih Daya (TAD)">Tenaga Kerja Alih Daya (TAD)</option>
                                  <option value="Jasa Konsultansi">Jasa Konsultansi</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label">Metode Pengadaan (Usulan):</label>
                                <select 
                                  className="project-selector" 
                                  style={{ width: "100%", backgroundColor: "white", padding: "10px" }}
                                  value={metodePengadaan}
                                  onChange={(e) => setMetodePengadaan(e.target.value)}
                                >
                                  <option value="Tender Terbuka">Tender Terbuka</option>
                                  <option value="Tender Terbatas">Tender Terbatas</option>
                                  <option value="Penunjukan Langsung">Penunjukan Langsung</option>
                                  <option value="Pemilihan Langsung">Pemilihan Langsung</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Target Durasi Pekerjaan:</label>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <input 
                                  type="number"
                                  className="form-input"
                                  value={targetDurasi}
                                  onChange={(e) => setTargetDurasi(parseInt(e.target.value) || 0)}
                                  style={{ flex: 1 }}
                                />
                                <select 
                                  className="project-selector"
                                  value={durasiUnit}
                                  onChange={(e) => setDurasiUnit(e.target.value)}
                                  style={{ width: "120px", backgroundColor: "white" }}
                                >
                                  <option value="Bulan">Bulan</option>
                                  <option value="Hari">Hari</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header">
                            <span className="card-title">SECTION B: Nilai Anggaran & Sumber Dana</span>
                          </div>
                          <div className="card-body">
                            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
                              <div className="form-group">
                                <label className="form-label">Estimasi HPS / Owner Estimate (OE):</label>
                                <input 
                                  type="number"
                                  className="form-input"
                                  value={formData.oe}
                                  onChange={(e) => setFormData({ ...formData, oe: parseInt(e.target.value) || 0 })}
                                  placeholder="Masukkan Nominal Rupiah"
                                />
                                <span style={{ display: "block", fontSize: "12px", color: "var(--color-primary-navy)", fontWeight: "600", marginTop: "4px" }}>
                                  Terformat: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(formData.oe)}
                                </span>
                              </div>

                              <div className="form-group">
                                <label className="form-label">Nomor Purchase Requisition (PR):</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={nomorPR}
                                  onChange={(e) => setNomorPR(e.target.value)}
                                  placeholder="PR-9XXXXXX"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Mata Anggaran / Cost Center:</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={costCenter}
                                onChange={(e) => setCostCenter(e.target.value)}
                                placeholder="Contoh: CC-KALTARA-2026"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Upload Dokumen Pendukung & TKDN */}
                    {formStep === 2 && (
                      <div className="card">
                        <div className="card-header">
                          <span className="card-title">SECTION C: Repository Upload Dokumen Pendukung Pemilihan (DP3)</span>
                        </div>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          
                          {/* File 1: Pakta */}
                          <div style={{ 
                            padding: "16px", 
                            border: "1px solid var(--color-border-light)", 
                            borderRadius: "8px", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                          }}>
                            <div>
                              <strong style={{ fontSize: "14px", display: "block" }}>Pakta Integritas (Wajib)</strong>
                              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Format PDF, Maksimal 5MB</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span className={`badge ${uploadedFiles.pakta ? "badge-success" : "badge-warning"}`}>
                                {uploadedFiles.pakta ? "Uploaded" : "Missing"}
                              </span>
                              {!uploadedFiles.pakta ? (
                                <button className="btn btn-secondary" onClick={() => handleUpload("pakta")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Unggah Berkas
                                </button>
                              ) : (
                                <button className="btn btn-danger" onClick={() => handleRemoveFile("pakta")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>

                          {/* File 2: TKDN */}
                          <div style={{ 
                            padding: "16px", 
                            border: "1px solid var(--color-border-light)", 
                            borderRadius: "8px", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                          }}>
                            <div>
                              <strong style={{ fontSize: "14px", display: "block" }}>Formulir TKDN (Form A1, A2, B1) (Wajib)</strong>
                              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Format Excel/PDF (D7)</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span className={`badge ${uploadedFiles.tkdn ? "badge-success" : "badge-warning"}`}>
                                {uploadedFiles.tkdn ? "Uploaded" : "Missing"}
                              </span>
                              {!uploadedFiles.tkdn ? (
                                <button className="btn btn-secondary" onClick={() => handleUpload("tkdn")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Unggah Berkas
                                </button>
                              ) : (
                                <button className="btn btn-danger" onClick={() => handleRemoveFile("tkdn")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>

                          {/* File 3: HC TAD */}
                          <div style={{ 
                            padding: "16px", 
                            border: jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" && !uploadedFiles.hctad ? "1.5px solid var(--color-danger)" : "1px solid var(--color-border-light)", 
                            borderRadius: "8px", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                          }}>
                            <div>
                              <strong style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                Checklist HC TAD (Tenaga Kerja Alih Daya)
                                <span className={`badge ${jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" ? "badge-danger" : "badge-secondary"}`} style={{ fontSize: "9px" }}>
                                  {jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" ? "Wajib" : "Opsional"}
                                </span>
                              </strong>
                              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Mandatori untuk jenis pekerjaan TAD</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span className={`badge ${uploadedFiles.hctad ? "badge-success" : "badge-warning"}`}>
                                {uploadedFiles.hctad ? "Uploaded" : "Missing"}
                              </span>
                              {!uploadedFiles.hctad ? (
                                <button className="btn btn-secondary" onClick={() => handleUpload("hctad")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Unggah Berkas
                                </button>
                              ) : (
                                <button className="btn btn-danger" onClick={() => handleRemoveFile("hctad")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>

                          {/* File 4: Lainnya */}
                          <div style={{ 
                            padding: "16px", 
                            border: "1px solid var(--color-border-light)", 
                            borderRadius: "8px", 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                          }}>
                            <div>
                              <strong style={{ fontSize: "14px", display: "block" }}>Dokumen Pendukung Lainnya (Opsional)</strong>
                              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>KAK, Justifikasi Pengadaan, Izin Prinsip</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span className={`badge ${uploadedFiles.lainnya ? "badge-success" : "badge-secondary"}`} style={{ backgroundColor: uploadedFiles.lainnya ? "var(--color-success)" : "#E2E8F0", color: uploadedFiles.lainnya ? "white" : "var(--color-text-muted)" }}>
                                {uploadedFiles.lainnya ? "Uploaded" : "Optional"}
                              </span>
                              {!uploadedFiles.lainnya ? (
                                <button className="btn btn-secondary" onClick={() => handleUpload("lainnya")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Unggah Berkas
                                </button>
                              ) : (
                                <button className="btn btn-danger" onClick={() => handleRemoveFile("lainnya")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* STEP 3: Reviu & Finalisasi Submission */}
                    {formStep === 3 && (
                      <div className="card">
                        <div className="card-header">
                          <span className="card-title">Ringkasan Konfirmasi & Reviu Pengisian</span>
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                          
                          <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border-light)" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Data Perencanaan Pengadaan:</h4>
                            
                            <table className="matrix-table" style={{ fontSize: "13px" }}>
                              <tbody>
                                <tr>
                                  <td style={{ fontWeight: "700", width: "200px" }}>Nama Pekerjaan</td>
                                  <td>{formData.jobName}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Fungsi Peminta</td>
                                  <td>{formData.requestingFunction}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Jenis Pekerjaan</td>
                                  <td>{jenisPekerjaan}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Metode Pengadaan</td>
                                  <td>{metodePengadaan}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Durasi Pekerjaan</td>
                                  <td>{targetDurasi} {durasiUnit}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Estimasi HPS / OE</td>
                                  <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(formData.oe)}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Nomor SAP PR</td>
                                  <td>{nomorPR}</td>
                                </tr>
                                <tr>
                                  <td style={{ fontWeight: "700" }}>Cost Center</td>
                                  <td>{costCenter}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div style={{ padding: "20px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Status Lampiran Dokumen:</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Pakta Integritas:</span>
                                <strong style={{ color: uploadedFiles.pakta ? "var(--color-success)" : "var(--color-danger)" }}>
                                  {uploadedFiles.pakta ? "Sudah Diunggah" : "Belum Diunggah"}
                                </strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Formulir TKDN (Komponen Dalam Negeri):</span>
                                <strong style={{ color: uploadedFiles.tkdn ? "var(--color-success)" : "var(--color-danger)" }}>
                                  {uploadedFiles.tkdn ? "Sudah Diunggah" : "Belum Diunggah"}
                                </strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Checklist HC TAD:</span>
                                <strong style={{ color: uploadedFiles.hctad ? "var(--color-success)" : jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" ? "var(--color-danger)" : "var(--color-text-muted)" }}>
                                  {uploadedFiles.hctad ? "Sudah Diunggah" : jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" ? "Wajib Diunggah" : "Tidak Diperlukan (Opsional)"}
                                </strong>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Real-Time Validation Sticky Widget */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Completeness Score Card */}
                    <div className="card" style={{ borderLeft: "4px solid var(--color-primary-navy)" }}>
                      <div className="card-header">
                        <span className="card-title">Real-Time Validation Engine (D1)</span>
                      </div>
                      <div className="card-body">
                        <div style={{ marginBottom: "16px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-muted)" }}>Skor Kelengkapan Berkas:</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                            <div className="progress-track" style={{ flex: 1, height: "8px", backgroundColor: "#E2E8F0", borderRadius: "4px" }}>
                              <div className="progress-fill" style={{ width: `${score}%`, height: "100%", backgroundColor: score === 100 ? "var(--color-success)" : score >= 50 ? "var(--color-warning)" : "var(--color-danger)", borderRadius: "4px", transition: "width 0.3s ease" }}></div>
                            </div>
                            <strong style={{ fontSize: "14px" }}>{score}%</strong>
                          </div>
                        </div>

                        {/* Color Status Badge */}
                        <div style={{ marginBottom: "20px" }}>
                          {score < 50 ? (
                            <div className="badge badge-warning" style={{ backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-danger)" }}></span>
                              Dokumen Tidak Lengkap
                            </div>
                          ) : score < 100 ? (
                            <div className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-warning)" }}></span>
                              Menunggu Kelengkapan Wajib
                            </div>
                          ) : (
                            <div className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
                              Valid &amp; Siap Diajukan
                            </div>
                          )}
                        </div>

                        {/* Dynamic Checklist Summary */}
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Checklist Validasi Dokumen:</span>
                          <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                            
                            <li style={{ display: "flex", alignItems: "center", gap: "8px", color: checks.dataDasar ? "var(--color-text-main)" : "var(--color-text-muted)" }}>
                              <span style={{ color: checks.dataDasar ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: "bold" }}>
                                {checks.dataDasar ? "[ ✓ ]" : "[   ]"}
                              </span>
                              <span>Data Dasar Pekerjaan</span>
                            </li>

                            <li style={{ display: "flex", alignItems: "center", gap: "8px", color: checks.anggaran ? "var(--color-text-main)" : "var(--color-text-muted)" }}>
                              <span style={{ color: checks.anggaran ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: "bold" }}>
                                {checks.anggaran ? "[ ✓ ]" : "[   ]"}
                              </span>
                              <span>Nilai HPS &amp; PR SAPP</span>
                            </li>

                            <li style={{ display: "flex", alignItems: "center", gap: "8px", color: checks.pakta ? "var(--color-text-main)" : "var(--color-text-muted)" }}>
                              <span style={{ color: checks.pakta ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: "bold" }}>
                                {checks.pakta ? "[ ✓ ]" : "[   ]"}
                              </span>
                              <span>Pakta Integritas</span>
                            </li>

                            <li style={{ display: "flex", alignItems: "center", gap: "8px", color: checks.tkdn ? "var(--color-text-main)" : "var(--color-text-muted)" }}>
                              <span style={{ color: checks.tkdn ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: "bold" }}>
                                {checks.tkdn ? "[ ✓ ]" : "[   ]"}
                              </span>
                              <span>Form TKDN</span>
                            </li>

                            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: checks.hctad ? "var(--color-text-main)" : "var(--color-danger)" }}>
                              <span style={{ color: checks.hctad ? "var(--color-success)" : "var(--color-danger)", fontWeight: "bold" }}>
                                {checks.hctad ? "[ ✓ ]" : "[ ⚠ ]"}
                              </span>
                              <div>
                                <span>Checklist HC TAD</span>
                                {jenisPekerjaan === "Tenaga Kerja Alih Daya (TAD)" && !uploadedFiles.hctad && (
                                  <span style={{ display: "block", fontSize: "10px", color: "var(--color-danger)", fontWeight: "600", marginTop: "2px" }}>
                                    Wajib diisi karena Jenis Pekerjaan = TAD
                                  </span>
                                )}
                              </div>
                            </li>

                          </ul>
                        </div>

                      </div>
                    </div>

                    {/* Smart Doc AI Assistant Box */}
                    <div className="card" style={{ borderLeft: "4px solid var(--color-ai-accent)", backgroundColor: "var(--color-ai-bg)" }}>
                      <div className="card-header" style={{ background: "none", borderBottom: "1px solid var(--color-ai-border)" }}>
                        <span className="card-title" style={{ color: "var(--color-ai-accent)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          AI Specification Writer
                        </span>
                      </div>
                      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => {
                            setChatInput("Bantu saya menyusun draf KAK untuk pekerjaan ini");
                            setSubmitterTab("ai");
                          }}
                          style={{ padding: "8px", fontSize: "12px", justifyContent: "flex-start", width: "100%" }}
                        >
                          Bantu Buat Draf KAK dengan AI
                        </button>
                        
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => {
                            setChatInput("Cek keselarasan spesifikasi teknis dan HSSE");
                            setSubmitterTab("ai");
                          }}
                          style={{ padding: "8px", fontSize: "12px", justifyContent: "flex-start", width: "100%" }}
                        >
                          Cek Keselarasan Spesifikasi Teknis
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Footer Action Bar */}
              {!isSubmitted && (
                <div style={{
                  marginTop: "24px",
                  padding: "16px 24px",
                  backgroundColor: "white",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    {formStep > 1 && (
                      <button className="btn btn-secondary" onClick={() => setFormStep(formStep - 1)}>
                        Kembali
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => alert("Draf pengisian berhasil disimpan!")}
                    >
                      Simpan sebagai Draf
                    </button>

                    {formStep < 3 ? (
                      <button className="btn btn-primary" onClick={() => setFormStep(formStep + 1)}>
                        Lanjut
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={handleSubmitClick}
                        style={{ 
                          backgroundColor: score === 100 ? "var(--color-accent-red)" : "#CBD5E1", 
                          borderColor: score === 100 ? "var(--color-accent-red)" : "#CBD5E1", 
                          color: score === 100 ? "white" : "var(--color-text-muted)",
                          cursor: "pointer" 
                        }}
                      >
                        Submit DP3 ke Pejabat / Panitia
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Daftar Pengajuan Saya Tab Content */}
          {submitterTab === "daftar" && (
            <div>
              {/* Header & Quick Filter Tabs */}
              <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                <div className="page-title-area">
                  <div className="breadcrumb" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    Pengadaan Saya &gt; Riwayat &amp; Daftar Pengajuan FPP
                  </div>
                  <h1 className="page-title" style={{ fontSize: "22px", fontWeight: "700" }}>Riwayat &amp; Daftar Pengajuan FPP</h1>
                </div>
                <div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setFormStep(1);
                      setSubmitterTab("form");
                    }}
                    style={{ backgroundColor: "var(--color-accent-red)", color: "white" }}
                  >
                    + Buat FPP / DP3 Baru
                  </button>
                </div>
              </div>

              {/* Quick Filter Tabs (Kategori Status) */}
              <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "12px", marginBottom: "20px" }}>
                {[
                  { key: "semua", label: "Semua Pengajuan", count: submissionsList.length, color: "var(--color-primary-navy)" },
                  { key: "draf", label: "Draf", count: submissionsList.filter(s => s.statusGroup === "draf").length, color: "var(--color-text-muted)" },
                  { key: "proses", label: "Sedang Diproses", count: submissionsList.filter(s => s.statusGroup === "proses").length, color: "var(--color-success)" },
                  { key: "revisi", label: "Butuh Perbaikan / Revisi", count: submissionsList.filter(s => s.statusGroup === "revisi").length, color: "var(--color-danger)", highlight: true },
                  { key: "selesai", label: "Selesai / PO Released", count: submissionsList.filter(s => s.statusGroup === "selesai").length, color: "var(--color-secondary-blue)" }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveDaftarFilter(f.key)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "9999px",
                      border: f.highlight && f.count > 0 ? "1px solid var(--color-danger)" : "none",
                      backgroundColor: activeDaftarFilter === f.key ? f.color : "#E2E8F0",
                      color: activeDaftarFilter === f.key ? "white" : f.highlight && f.count > 0 ? "var(--color-danger)" : "var(--color-text-muted)",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    {f.label}
                    <span style={{
                      padding: "2px 6px",
                      borderRadius: "10px",
                      backgroundColor: activeDaftarFilter === f.key ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)",
                      fontSize: "10px"
                    }}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* 2. Panel Search, Filter & Export */}
              <div className="card" style={{ marginBottom: "20px" }}>
                <div className="card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                  
                  {/* Search and Filters */}
                  <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "300px" }}>
                    <div className="navbar-search-container" style={{ flex: 1, maxWidth: "400px", border: "1px solid var(--color-border-medium)", margin: 0 }}>
                      <svg className="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <input 
                        type="text" 
                        className="navbar-search-input" 
                        placeholder="Cari Nama Pekerjaan, ID DP3, atau Nomor PR..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select 
                      className="project-selector"
                      value={filterJenis}
                      onChange={(e) => setFilterJenis(e.target.value)}
                      style={{ width: "160px", backgroundColor: "white", border: "1px solid var(--color-border-medium)" }}
                    >
                      <option value="Semua">Semua Jenis</option>
                      <option value="Tenaga Kerja Alih Daya (TAD)">TAD</option>
                      <option value="Jasa Konstruksi">Jasa Konstruksi</option>
                      <option value="Pengadaan Barang">Pengadaan Barang</option>
                      <option value="Jasa Konsultansi">Jasa Konsultansi</option>
                    </select>

                    <select 
                      className="project-selector"
                      value={filterHps}
                      onChange={(e) => setFilterHps(e.target.value)}
                      style={{ width: "160px", backgroundColor: "white", border: "1px solid var(--color-border-medium)" }}
                    >
                      <option value="Semua">Semua OE/HPS</option>
                      <option value="&lt; 1 Miliar">&lt; 1 Miliar</option>
                      <option value="1 - 5 Miliar">1 - 5 Miliar</option>
                      <option value="&gt; 5 Miliar">&gt; 5 Miliar</option>
                    </select>
                  </div>

                  {/* Export Button */}
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => alert("Rekapitulasi data pengajuan berhasil diekspor!")}
                    style={{ padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Ekspor Data
                  </button>

                </div>
              </div>

              {/* 3. Tabel Utama Daftar Pengajuan FPP */}
              <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                  <div className="table-container">
                    <table className="matrix-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ width: "120px" }}>No. FPP / DP3</th>
                          <th>Nama Pekerjaan &amp; Tag</th>
                          <th style={{ width: "150px" }}>Estimasi HPS/OE</th>
                          <th style={{ width: "160px" }}>Tanggal Ajukan</th>
                          <th style={{ width: "140px" }}>Skor Validasi DP3</th>
                          <th>Tahap FPP Saat Ini</th>
                          <th style={{ width: "160px" }}>SLA Timer</th>
                          <th style={{ width: "160px", textAlign: "right" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="drive-file-row-hover">
                            <td style={{ fontWeight: "700" }}>{sub.id}</td>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ fontWeight: "600", color: "var(--color-text-main)" }}>{sub.title}</span>
                                <span className="badge badge-secondary" style={{ alignSelf: "flex-start", fontSize: "9px", padding: "1px 6px" }}>{sub.type}</span>
                              </div>
                            </td>
                            <td style={{ fontWeight: "600" }}>
                              Rp {sub.oe.toLocaleString("id-ID")}
                            </td>
                            <td style={{ color: "var(--color-text-muted)", fontSize: "12px" }}>
                              {sub.date}
                            </td>
                            <td>
                              {sub.completeness === 100 ? (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-success)", fontWeight: "600", fontSize: "12px" }}>
                                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
                                  100% Valid
                                </div>
                              ) : (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-danger)", fontWeight: "600", fontSize: "12px" }}>
                                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-danger)" }}></span>
                                  {sub.completeness}% ({sub.type === "Tenaga Kerja Alih Daya (TAD)" ? "HC TAD Missing" : "Doc Missing"})
                                </div>
                              )}
                            </td>
                            <td>
                              <strong style={{ fontSize: "12px", color: "var(--color-primary-navy)" }}>{sub.currentStage}</strong>
                            </td>
                            <td>
                              {sub.slaStatus === "on-track" && (
                                <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "white" }}></span>
                                  On-Track ({sub.slaText})
                                </span>
                              )}
                              {sub.slaStatus === "warning" && (
                                <span className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "white" }}></span>
                                  Warning ({sub.slaText})
                                </span>
                              )}
                              {sub.slaStatus === "overdue" && (
                                <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "white" }}></span>
                                  {sub.slaText}
                                </span>
                              )}
                              {sub.slaStatus === "completed" && (
                                <span className="badge badge-success" style={{ backgroundColor: "#E6F4EA", color: "#137333", fontSize: "10px" }}>
                                  {sub.slaText}
                                </span>
                              )}
                              {sub.slaStatus === "none" && (
                                <span style={{ color: "var(--color-text-muted)" }}>-</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button 
                                  className="btn btn-secondary" 
                                  onClick={() => setSelectedSubForDetail(sub)}
                                  style={{ padding: "4px 8px", fontSize: "11px" }}
                                >
                                  Detail
                                </button>
                                
                                {(sub.statusGroup === "draf" || sub.statusGroup === "revisi") && (
                                  <button 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      setFormData({
                                        jobName: sub.title,
                                        requestingFunction: "Supply & Distribution",
                                        oe: sub.oe,
                                        tkdnTarget: 25
                                      });
                                      setJenisPekerjaan(sub.type);
                                      setNomorPR(sub.prNum);
                                      setFormStep(sub.statusGroup === "revisi" ? 2 : 1);
                                      setSubmitterTab("form");
                                    }}
                                    style={{ padding: "4px 8px", fontSize: "11px" }}
                                  >
                                    Revisi
                                  </button>
                                )}

                                <button 
                                  className="btn btn-secondary"
                                  onClick={() => alert(`Mengunduh berkas paket lampiran ZIP untuk ${sub.id}`)}
                                  style={{ padding: "4px", display: "inline-flex", alignItems: "center" }}
                                  title="Unduh Paket DP3 (.zip)"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                </button>

                                {sub.statusGroup === "draf" && (
                                  <button 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      if (confirm(`Apakah Anda yakin ingin menghapus draf ${sub.id}?`)) {
                                        setSubmissionsList(submissionsList.filter(item => item.id !== sub.id));
                                      }
                                    }}
                                    style={{ padding: "4px", color: "var(--color-danger)" }}
                                    title="Hapus Draf"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredSubmissions.length === 0 && (
                      <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
                        Tidak ada pengajuan untuk kategori filter ini.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Side Drawer: Detailed FPP Lifecycle Tracker */}
              {selectedSubForDetail && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  zIndex: 9999,
                  display: "flex",
                  justifyContent: "flex-end"
                }}>
                  {/* Backdrop Click Dismiss */}
                  <div style={{ flex: 1 }} onClick={() => setSelectedSubForDetail(null)}></div>
                  
                  {/* Side Drawer Canvas */}
                  <div style={{
                    width: "480px",
                    backgroundColor: "white",
                    height: "100%",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px",
                    animation: "slideIn 0.3s ease-out"
                  }}>
                    <div>
                      {/* Drawer Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "16px", marginBottom: "20px" }}>
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)" }}>DETAIL STATUS FPP TRACKER</span>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-primary-navy)", margin: "4px 0 0 0" }}>{selectedSubForDetail.id}</h3>
                        </div>
                        <button 
                          onClick={() => setSelectedSubForDetail(null)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "var(--color-text-muted)",
                            cursor: "pointer"
                          }}
                        >
                          &times;
                        </button>
                      </div>

                      {/* Info Panel Summary */}
                      <div style={{ padding: "12px", backgroundColor: "var(--color-bg-app)", borderRadius: "8px", marginBottom: "20px", fontSize: "12px", lineHeight: "1.5" }}>
                        <strong style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>{selectedSubForDetail.title}</strong>
                        <span>Nilai OE: <strong>Rp {selectedSubForDetail.oe.toLocaleString("id-ID")}</strong></span>
                        <br />
                        <span>Nomor PR SAP: <strong>{selectedSubForDetail.prNum}</strong></span>
                      </div>

                      {/* 15 Tahapan List */}
                      <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 280px)", paddingRight: "8px" }}>
                        {[
                          { step: 1, label: "Inisiasi Fungsi Peminta (PR & DP3)", desc: "Formulir DP3 disubmit oleh Ahmad Faisal." },
                          { step: 2, label: "Approval Pejabat DP3", desc: "Verifikasi kelayakan berkas & anggaran." },
                          { step: 3, label: "Registrasi & Pembentukan Panitia", desc: "Penunjukan tim buyer dan nomor SK." },
                          { step: 4, label: "Penyusunan RKS & HPS oleh Panitia", desc: "Penyusunan syarat umum & khusus pemilihan." },
                          { step: 5, label: "Pengumuman / Undangan Tender", desc: "Publikasi paket pengadaan di portal e-Procurement." },
                          { step: 6, label: "Pengambilan Dokumen Pemilihan", desc: "Pendaftaran vendor calon penyedia." },
                          { step: 7, label: "Penjelasan Rapat Aanwijzing", desc: "Forum tanya jawab pre-bid di vault." },
                          { step: 8, label: "Pemasukan Dokumen Penawaran Vendor", desc: "Unggah dokumen penawaran harga & administrasi." },
                          { step: 9, label: "Pembukaan Dokumen Penawaran", desc: "Verifikasi kelengkapan berkas penawaran vendor." },
                          { step: 10, label: "Evaluasi Kualifikasi, Teknis & Komersial", desc: "Klarifikasi penawaran tidak wajar / timpang." },
                          { step: 11, label: "Negosiasi Harga & Klarifikasi Timpang", desc: "Negosiasi dengan calon pemenang teratas." },
                          { step: 12, label: "Penerbitan Laporan Hasil Pemilihan (LHP)", desc: "Penyusunan usulan pemenang oleh Panitia." },
                          { step: 13, label: "Persetujuan & Penunjukan Pemenang", desc: "Persetujuan LHP oleh Pejabat Berwenang." },
                          { step: 14, label: "Masa Sanggah Vendor", desc: "Masa sanggah hasil pengumuman." },
                          { step: 15, label: "Penerbitan PO / Kontrak", desc: "Finalisasi tanda tangan kontrak & penerbitan PO SAP." }
                        ].map((stage) => {
                          const isCompleted = selectedSubForDetail.stageNum > stage.step || selectedSubForDetail.statusGroup === "selesai";
                          const isActive = selectedSubForDetail.stageNum === stage.step && selectedSubForDetail.statusGroup !== "selesai" && selectedSubForDetail.statusGroup !== "draf";
                          return (
                            <div key={stage.step} style={{ display: "flex", gap: "14px", marginBottom: "14px", position: "relative" }}>
                              
                              {/* Connector line between steps */}
                              {stage.step < 15 && (
                                <div style={{
                                  position: "absolute",
                                  top: "24px",
                                  left: "11px",
                                  width: "2px",
                                  height: "100%",
                                  backgroundColor: isCompleted ? "var(--color-success)" : "#E2E8F0"
                                }}></div>
                              )}

                              <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: isCompleted ? "var(--color-success)" : isActive ? "var(--color-primary-navy)" : "#CBD5E1",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                fontWeight: "700",
                                zIndex: 2
                              }}>
                                {isCompleted ? "✓" : stage.step}
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                                <strong style={{ 
                                  fontSize: "12px", 
                                  color: isActive ? "var(--color-primary-navy)" : isCompleted ? "var(--color-text-main)" : "var(--color-text-muted)"
                                }}>
                                  {stage.label}
                                </strong>
                                {isActive && (
                                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "block" }}>
                                    {selectedSubForDetail.missingDoc ? selectedSubForDetail.missingDoc : stage.desc}
                                  </span>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>

                    <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "16px" }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setSelectedSubForDetail(null)}
                        style={{ width: "100%", padding: "10px" }}
                      >
                        Tutup Status Tracker
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Template Tab Content */}
          {submitterTab === "templates" && (() => {
            const filteredTemplates = templatesList.filter((item) => {
              if (activeTemplateFilter !== "semua" && item.category !== activeTemplateFilter) {
                return false;
              }
              if (templateSearchQuery.trim().length > 0) {
                const query = templateSearchQuery.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(query);
                const matchDesc = item.desc.toLowerCase().includes(query);
                const matchVersion = item.version.toLowerCase().includes(query);
                if (!matchTitle && !matchDesc && !matchVersion) {
                  return false;
                }
              }
              return true;
            });

            return (
              <div>
                
                {/* 5. Notification Indicator: Version Control Alert */}
                {showUpdateBanner && (
                  <div style={{
                    padding: "12px 18px",
                    backgroundColor: "#E6F4EA",
                    border: "1px solid #A8DAB5",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#137333", fontSize: "13px", fontWeight: "600" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      <span>
                        <strong>Pemberitahuan Update Template:</strong> Template Form TKDN (v2026.2) telah diperbarui per 10 Januari 2026 sesuai SK Manajemen Terbaru. Pastikan Anda mengunduh versi terbaru untuk pengajuan DP3 baru.
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowUpdateBanner(false)}
                      style={{ background: "none", border: "none", color: "#137333", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
                    >
                      Tutup
                    </button>
                  </div>
                )}

                {/* Header & Title Area */}
                <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                  <div className="page-title-area">
                    <div className="breadcrumb" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                      Resource Library &gt; Template &amp; Dokumen Acuan Resmi
                    </div>
                    <h1 className="page-title" style={{ fontSize: "22px", fontWeight: "700" }}>Template &amp; Dokumen Acuan Resmi</h1>
                  </div>
                  <div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => alert("Mengunduh seluruh formulir baku DP3 dalam format ZIP...")}
                      style={{ backgroundColor: "var(--color-accent-red)", color: "white", display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Unduh Semua Template Paket DP3 (.zip)
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="card" style={{ marginBottom: "24px" }}>
                  <div className="card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    
                    {/* Category tabs */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { key: "semua", label: "Semua Dokumen" },
                        { key: "baku", label: "Formulir Baku DP3" },
                        { key: "regulasi", label: "Regulasi & Pedoman" },
                        { key: "sop", label: "Panduan Sistem (SOP)" }
                      ].map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => setActiveTemplateFilter(cat.key)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid var(--color-border-medium)",
                            backgroundColor: activeTemplateFilter === cat.key ? "var(--color-primary-navy)" : "white",
                            color: activeTemplateFilter === cat.key ? "white" : "var(--color-text-main)",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Quick search input */}
                    <div className="navbar-search-container" style={{ margin: 0, border: "1px solid var(--color-border-medium)", width: "300px" }}>
                      <svg className="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <input 
                        type="text" 
                        className="navbar-search-input" 
                        placeholder="Cari nama atau deskripsi acuan..." 
                        value={templateSearchQuery}
                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      />
                    </div>

                  </div>
                </div>

                {/* Grid list of Document Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  {filteredTemplates.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="card drive-file-row-hover" 
                      style={{ 
                        borderLeft: doc.tag.includes("MANDATORY") ? "4px solid var(--color-danger)" : "4px solid var(--color-primary-navy)",
                        padding: "20px" 
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          {/* File extension indicator */}
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            backgroundColor: doc.format === "PDF" ? "var(--color-danger-bg)" : doc.format === "XLSX" ? "#E6F4EA" : "#E8F0FE",
                            color: doc.format === "PDF" ? "var(--color-danger)" : doc.format === "XLSX" ? "#137333" : "var(--color-primary-navy)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "800"
                          }}>
                            {doc.format}
                          </div>
                          <div>
                            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-main)", margin: 0 }}>
                              {doc.title}
                            </h3>
                            <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                              <span>Kategori: <strong>{doc.categoryLabel}</strong></span>
                              <span>|</span>
                              <span>Ukuran: {doc.size}</span>
                              <span>|</span>
                              <span>Versi: <strong style={{ color: "var(--color-primary-navy)" }}>{doc.version}</strong> (Terbaru)</span>
                            </div>
                          </div>
                        </div>

                        <span className={`badge ${doc.tag.includes("MANDATORY") ? "badge-danger" : "badge-secondary"}`} style={{ fontSize: "10px" }}>
                          {doc.tag}
                        </span>
                      </div>

                      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: "1.5", margin: "8px 0 16px 0" }}>
                        {doc.desc}
                      </p>

                      {/* Interactive Buttons Group */}
                      <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--color-border-light)", paddingTop: "14px" }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setPreviewedDoc(doc)}
                          style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          Preview Document
                        </button>

                        <button 
                          className="btn btn-secondary" 
                          onClick={() => alert(`Mengunduh file ${doc.title}...`)}
                          style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download Template
                        </button>

                        <button 
                          className="btn btn-secondary" 
                          onClick={() => {
                            setChatInput(`Bagaimana panduan pengisian dan regulasi terkait dokumen "${doc.title}"?`);
                            setSubmitterTab("ai");
                          }}
                          style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-ai-accent)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          Ask AI Assistant (D8)
                        </button>
                      </div>

                    </div>
                  ))}
                  
                  {filteredTemplates.length === 0 && (
                    <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
                      Tidak ada dokumen acuan yang cocok dengan kriteria pencarian Anda.
                    </div>
                  )}
                </div>

                {/* PDF/Doc Preview Modal */}
                {previewedDoc && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    zIndex: 99999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: "800px",
                      maxWidth: "90%",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      height: "85vh",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                      overflow: "hidden"
                    }}>
                      {/* Toolbar Preview */}
                      <div style={{
                        padding: "14px 20px",
                        backgroundColor: "var(--color-primary-navy)",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "11px", backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "4px" }}>
                            PREVIEW {previewedDoc.format}
                          </span>
                          <strong style={{ fontSize: "14px" }}>{previewedDoc.title}</strong>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ fontSize: "12px" }}>Zoom: <strong>100%</strong></span>
                          <button 
                            onClick={() => setPreviewedDoc(null)}
                            style={{ background: "none", border: "none", color: "white", fontSize: "22px", cursor: "pointer", fontWeight: "bold" }}
                          >
                            &times;
                          </button>
                        </div>
                      </div>

                      {/* Mock Document Canvas */}
                      <div style={{
                        flex: 1,
                        backgroundColor: "#F1F5F9",
                        overflowY: "auto",
                        padding: "40px 20px",
                        display: "flex",
                        justifyContent: "center"
                      }}>
                        {/* Page Layout Representation */}
                        <div style={{
                          width: "100%",
                          maxWidth: "680px",
                          backgroundColor: "white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          borderRadius: "4px",
                          minHeight: "800px",
                          padding: "48px",
                          fontFamily: "serif",
                          color: "#1E293B",
                          lineHeight: "1.6",
                          fontSize: "14px"
                        }}>
                          <div style={{ textAlign: "center", marginBottom: "32px", borderBottom: "2px solid #E2E8F0", paddingBottom: "16px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "800", textTransform: "uppercase", margin: 0, fontFamily: "sans-serif" }}>
                              PT Pertamina Patra Niaga
                            </h2>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "sans-serif", color: "var(--color-text-muted)" }}>
                              Supply &amp; Distribution - Resource Library
                            </span>
                          </div>

                          <h3 style={{ textAlign: "center", fontSize: "16px", textDecoration: "underline", marginBottom: "24px" }}>
                            {previewedDoc.title.replace(/\.[a-z0-9]+$/i, "")}
                          </h3>

                          {/* Specific Mock Content matching Document title */}
                          {previewedDoc.id === "temp-1" && (
                            <div>
                              <p>Yang bertanda tangan di bawah ini selaku Pejabat/Peminta Pengadaan di lingkungan PT Pertamina Patra Niaga, dengan ini menyatakan bahwa:</p>
                              <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                                <li>Tidak akan melakukan praktik Korupsi, Kolusi, dan Nepotisme (KKN) dalam seluruh proses tahapan pengadaan barang dan jasa.</li>
                                <li>Melaporkan segala bentuk indikasi penyimpangan atau pelanggaran integritas kepada pihak Whistleblowing System (WBS) Pertamina.</li>
                                <li>Menghindari conflict of interest (pertentangan kepentingan) baik langsung maupun tidak langsung dengan penyedia barang/jasa.</li>
                              </ol>
                              <div style={{ marginTop: "60px", textAlign: "right" }}>
                                <p style={{ fontSize: "12px" }}>Ditetapkan di Jakarta, 18 Agustus 2026</p>
                                <br /><br />
                                <strong style={{ textDecoration: "underline" }}>Ahmad Faisal</strong>
                                <p style={{ fontSize: "11px", color: "var(--color-text-muted)", margin: 0 }}>Fungsi Supply &amp; Distribution</p>
                              </div>
                            </div>
                          )}

                          {previewedDoc.id === "temp-2" && (
                            <div>
                              <p><strong>FORMULIR TKDN A1: REKAPITULASI CAPAIAN TINGKAT KOMPONEN DALAM NEGERI</strong></p>
                              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "12px", fontFamily: "sans-serif" }}>
                                <thead>
                                  <tr style={{ backgroundColor: "#F8FAFC" }}>
                                    <th style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "left" }}>Komponen Biaya</th>
                                    <th style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>Porsi DN (%)</th>
                                    <th style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>Porsi LN (%)</th>
                                    <th style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "right" }}>Total Nilai (IDR)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px" }}>1. Bahan Baku (Material)</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>40%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>60%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "right" }}>500.000.000</td>
                                  </tr>
                                  <tr>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px" }}>2. Tenaga Kerja (Labor)</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>100%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>0%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "right" }}>300.000.000</td>
                                  </tr>
                                  <tr>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px" }}>3. Alat Kerja (Equipment)</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>70%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>30%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "right" }}>200.000.000</td>
                                  </tr>
                                  <tr style={{ fontWeight: "bold", backgroundColor: "#F1F5F9" }}>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px" }}>TOTAL GAP TKDN GABUNGAN</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>64%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "center" }}>36%</td>
                                    <td style={{ border: "1px solid #CBD5E1", padding: "8px", textAlign: "right" }}>1.000.000.000</td>
                                  </tr>
                                </tbody>
                              </table>
                              <p style={{ marginTop: "16px", fontSize: "11px", color: "#64748B", fontStyle: "italic" }}>
                                *Catatan: Nilai capaian minimum TKDN untuk kategori Pengadaan Jasa Gabungan sekurang-kurangnya adalah 30% sesuai PTK TKDN 2026.
                              </p>
                            </div>
                          )}

                          {previewedDoc.id !== "temp-1" && previewedDoc.id !== "temp-2" && (
                            <div>
                              <p><strong>PASAL 1: KETENTUAN UMUM</strong></p>
                              <p>Dokumen ini mengatur standar baku penyusunan dan pedoman tata kelola pengadaan barang dan jasa pada PT Pertamina Patra Niaga sesuai dengan kebijakan internal dan peraturan perundangan yang berlaku.</p>
                              <p>Setiap fungsi peminta (Submitter) berkewajiban untuk memastikan keselarasan dokumen perencanaan dengan standar ini guna meminimalisir deviasi administrasi di tingkat Panitia Pengadaan.</p>
                              <p style={{ marginTop: "24px" }}><strong>PASAL 2: TAHAPAN DAN RUANG LINGKUP</strong></p>
                              <p>Ruang lingkup pedoman ini mencakup tahapan Inisiasi FPP/DP3, penyusunan OE/HPS, review kepatuhan teknis, evaluasi kualifikasi vendor, hingga negosiasi dan penerbitan Purchase Order (PO) SAP secara terpusat.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Preview Modal */}
                      <div style={{
                        padding: "14px 20px",
                        backgroundColor: "#F1F5F9",
                        borderTop: "1px solid var(--color-border-light)",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px"
                      }}>
                        <button className="btn btn-secondary" onClick={() => setPreviewedDoc(null)}>
                          Tutup Preview
                        </button>
                        <button className="btn btn-primary" onClick={() => alert(`Mengunduh berkas ${previewedDoc.title}...`)}>
                          Unduh Berkas
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* AI Assistant Tab Content */}
          {submitterTab === "ai" && (
            <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
              <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                <div className="page-title-area">
                  <div className="breadcrumb">Proyek 2 / Smart AI Assistant (D8)</div>
                  <h1 className="page-title">Asisten Konsultasi Dokumen & Spesifikasi</h1>
                </div>
              </div>

              <div className="ai-panel" style={{ minHeight: "450px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="ai-header-bar">
                    <span>AI Specification Helper</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        style={{
                          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                          backgroundColor: msg.role === "user" ? "var(--color-primary-navy)" : "white",
                          color: msg.role === "user" ? "white" : "var(--color-text-main)",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          maxWidth: "80%",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          border: msg.role === "user" ? "none" : "1px solid var(--color-border-light)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                        }}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="ai-input-group">
                  <input
                    type="text"
                    className="ai-input"
                    placeholder="Tanyakan penyusunan RKS, TKDN, atau spesifikasi HSSE..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-ai">
                    Kirim
                  </button>
                </form>
              </div>

              {/* Recommendation Quick Prompts */}
              <div style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", display: "block", marginBottom: "8px" }}>Rekomendasi Pertanyaan:</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-secondary" onClick={() => setChatInput("Bagaimana menyusun persyaratan TKDN untuk jasa TAD?")} style={{ padding: "6px 12px", fontSize: "11px", display: "inline-flex", alignItems: "center" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    TKDN Jasa TAD
                  </button>
                  <button className="btn btn-secondary" onClick={() => setChatInput("Tulis draf kriteria HSSE untuk vendor angkutan BBM Balikpapan")} style={{ padding: "6px 12px", fontSize: "11px", display: "inline-flex", alignItems: "center" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Persyaratan HSSE Vendor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Tab Content */}
          {submitterTab === "tracking" && (() => {
            // Determine active project based on selection
            const currentProj = submissionsList.find(s => s.id === trackingProjectId) || submissionsList[0];
            const stages = getTrackingStages(currentProj.id);
            
            // Selected stage details (fallback to current project stage if none selected)
            const activeDetailStage = clickedStageNum 
              ? stages.find(s => s.step === clickedStageNum) || stages[0]
              : stages.find(s => s.step === currentProj.stageNum) || stages[0];

            return (
              <div>
                
                {/* Header & Quick Filter Bar */}
                <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="page-title-area">
                    <div className="breadcrumb" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                      Proyek 2 &gt; Status Tracking FPP
                    </div>
                    <h1 className="page-title" style={{ fontSize: "22px", fontWeight: "700" }}>Monitoring 15 Tahapan Lifecycle Tender</h1>
                  </div>

                  {/* Context Selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-muted)" }}>Pilih Pengajuan:</span>
                    <select 
                      className="project-selector" 
                      value={trackingProjectId}
                      onChange={(e) => {
                        setTrackingProjectId(e.target.value);
                        setClickedStageNum(null);
                        setSlaReminderSent(false);
                      }}
                      style={{ backgroundColor: "white", border: "1px solid var(--color-border-medium)" }}
                    >
                      <option value="DP3-2026-001">DP3-2026-001 (Jasa TAD Balikpapan)</option>
                      <option value="DP3-2026-002">DP3-2026-002 (Samarinda Pipe Coating)</option>
                      <option value="DP3-2026-004">DP3-2026-004 (KAK Amdal Pontianak)</option>
                    </select>
                  </div>
                </div>

                {/* Metric Summary Bar */}
                <div className="card" style={{ marginBottom: "24px" }}>
                  <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
                    
                    {/* Progress score */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px", fontWeight: "600" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Akumulasi Alur Pengadaan:</span>
                        <strong style={{ color: "var(--color-primary-navy)" }}>{Math.round((currentProj.stageNum / 15) * 100)}% Selesai</strong>
                      </div>
                      <div className="progress-track" style={{ height: "8px", backgroundColor: "#E2E8F0", borderRadius: "4px" }}>
                        <div className="progress-fill" style={{ width: `${(currentProj.stageNum / 15) * 100}%`, height: "100%", backgroundColor: "var(--color-primary-navy)", borderRadius: "4px" }}></div>
                      </div>
                    </div>

                    {/* Status Badge Proyek */}
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>SLA STATUS:</span>
                        {currentProj.slaStatus === "on-track" && (
                          <span className="badge badge-success" style={{ fontSize: "12px", marginTop: "4px" }}>
                            On-Track
                          </span>
                        )}
                        {currentProj.slaStatus === "warning" && (
                          <span className="badge badge-warning" style={{ fontSize: "12px", marginTop: "4px" }}>
                            SLA Warning
                          </span>
                        )}
                        {currentProj.slaStatus === "overdue" && (
                          <span className="badge badge-danger" style={{ fontSize: "12px", marginTop: "4px" }}>
                            Delayed
                          </span>
                        )}
                        {currentProj.slaStatus === "none" && (
                          <span className="badge badge-secondary" style={{ fontSize: "12px", marginTop: "4px" }}>
                            Draf
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>SISA WAKTU FASE:</span>
                        <strong style={{ fontSize: "13px", color: "var(--color-text-main)", marginTop: "4px" }}>{currentProj.slaText}</strong>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Split columns layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "stretch" }}>
                  
                  {/* Left Column: Visual Stepper 15 Tahapan */}
                  <div className="card">
                    <div className="card-header" style={{ borderBottom: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="card-title">Visual Timeline 15 Tahapan Pengadaan</span>
                      <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Klik tahapan untuk melihat rincian drawer</span>
                    </div>
                    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {stages.map((stage) => {
                        const isSelected = activeDetailStage.step === stage.step;
                        
                        return (
                          <div 
                            key={stage.step}
                            onClick={() => setClickedStageNum(stage.step)}
                            style={{
                              display: "flex",
                              gap: "16px",
                              alignItems: "flex-start",
                              padding: "14px",
                              borderRadius: "8px",
                              backgroundColor: isSelected ? "var(--color-bg-app)" : "white",
                              border: isSelected ? "1.5px solid var(--color-primary-navy)" : "1px solid var(--color-border-light)",
                              cursor: "pointer",
                              position: "relative",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {/* Connector line between steps */}
                            {stage.step < 15 && (
                              <div style={{
                                position: "absolute",
                                top: "36px",
                                left: "25px",
                                width: "2px",
                                height: "24px",
                                backgroundColor: stage.status === "done" ? "var(--color-success)" : "#CBD5E1",
                                zIndex: 1
                              }}></div>
                            )}

                            {/* Circle Indicator */}
                            <div style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              backgroundColor: stage.status === "done" ? "var(--color-success)" : stage.status === "current" ? "var(--color-primary-navy)" : stage.status === "breached" ? "var(--color-danger)" : "#CBD5E1",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "700",
                              zIndex: 2,
                              boxShadow: stage.status === "current" ? "0 0 0 4px rgba(0,75,135,0.15)" : "none"
                            }}>
                              {stage.status === "done" ? "✓" : stage.step}
                            </div>

                            {/* Text label */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <strong style={{ 
                                  fontSize: "13px", 
                                  color: stage.status === "done" ? "var(--color-success)" : stage.status === "current" ? "var(--color-primary-navy)" : stage.status === "breached" ? "var(--color-danger)" : "var(--color-text-main)" 
                                }}>
                                  {stage.label}
                                </strong>
                                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{stage.timestamp}</span>
                              </div>
                              <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                                {stage.desc}
                              </span>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Panel Detail Tahap Aktif & SLA Timer */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    <div className="card" style={{ borderLeft: "4px solid var(--color-primary-navy)" }}>
                      <div className="card-header">
                        <span className="card-title">Rincian Operasional Tahap {activeDetailStage.step}</span>
                      </div>
                      <div className="card-body">
                        
                        {/* Countdown SLA Widget */}
                        <div style={{
                          padding: "16px",
                          backgroundColor: activeDetailStage.status === "breached" ? "var(--color-danger-bg)" : "var(--color-bg-app)",
                          border: activeDetailStage.status === "breached" ? "1px solid var(--color-danger)" : "1px solid var(--color-border-light)",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <div style={{ color: activeDetailStage.status === "breached" ? "var(--color-danger)" : "var(--color-primary-navy)" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          </div>
                          <div>
                            <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "block" }}>Batas Waktu Penyelesaian (SLA):</span>
                            <strong style={{ fontSize: "14px", color: activeDetailStage.status === "breached" ? "var(--color-danger)" : "var(--color-text-main)" }}>
                              {currentProj.slaText}
                            </strong>
                          </div>
                        </div>

                        {/* Current PIC */}
                        <div style={{ marginBottom: "16px" }}>
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "block" }}>Unit Kerja / PIC Penanggung Jawab:</span>
                          <strong style={{ fontSize: "13px", color: "var(--color-text-main)", display: "block", marginTop: "2px" }}>
                            {activeDetailStage.pic}
                          </strong>
                        </div>

                        {/* Output Document Link */}
                        {activeDetailStage.docName && (
                          <div style={{ marginBottom: "20px", padding: "12px", border: "1px solid var(--color-border-light)", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: "10px", color: "var(--color-text-muted)", display: "block" }}>DOKUMEN KELUARAN (DELIVERABLE):</span>
                              <strong style={{ fontSize: "12px" }}>{activeDetailStage.docName}</strong>
                            </div>
                            <button 
                              className="btn btn-secondary"
                              onClick={() => alert(`Mengunduh dokumen keluaran ${activeDetailStage.docName}...`)}
                              style={{ padding: "4px 8px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                              Unduh
                            </button>
                          </div>
                        )}

                        {/* Audit Log Timeline */}
                        <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "16px", marginBottom: "20px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", display: "block", marginBottom: "10px", textTransform: "uppercase" }}>Audit Log &amp; Timestamp:</span>
                          <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                            <li style={{ display: "flex", gap: "8px" }}>
                              <span style={{ color: "var(--color-success)" }}>[ ✓ ]</span>
                              <div>
                                <span>Berkas diterima oleh {activeDetailStage.pic}</span>
                                <span style={{ display: "block", fontSize: "10px", color: "var(--color-text-muted)" }}>18 Agu 2026, 09:30 WIB</span>
                              </div>
                            </li>
                            <li style={{ display: "flex", gap: "8px" }}>
                              <span style={{ color: "var(--color-success)" }}>[ ✓ ]</span>
                              <div>
                                <span>Pengecekan Kepatuhan Dokumen DP3 tuntas</span>
                                <span style={{ display: "block", fontSize: "10px", color: "var(--color-text-muted)" }}>18 Agu 2026, 10:15 WIB</span>
                              </div>
                            </li>
                          </ul>
                        </div>

                        {/* Catatan Revisi Center */}
                        {currentProj.id === "DP3-2026-004" && activeDetailStage.step === 2 && (
                          <div style={{
                            padding: "12px",
                            backgroundColor: "var(--color-danger-bg)",
                            border: "1px solid var(--color-danger)",
                            borderRadius: "6px",
                            marginBottom: "20px",
                            fontSize: "12px"
                          }}>
                            <span style={{ fontWeight: "700", color: "var(--color-danger)", display: "block", marginBottom: "4px" }}>CATATAN REVISI PEJABAT:</span>
                            <span style={{ color: "var(--color-text-main)" }}>Harap melampirkan berkas Justifikasi Penunjukan Langsung secara terperinci.</span>
                          </div>
                        )}

                        {/* Area Aksi & Escalation Trigger */}
                        <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "16px" }}>
                          {slaReminderSent ? (
                            <div style={{
                              padding: "10px",
                              backgroundColor: "var(--color-success-bg)",
                              color: "var(--color-success)",
                              border: "1px solid var(--color-success)",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              textAlign: "center"
                            }}>
                              Notifikasi Reminder Berhasil Dikirim!
                            </div>
                          ) : (
                            <button 
                              className="btn btn-primary"
                              onClick={() => {
                                setSlaReminderSent(true);
                                alert(`Notifikasi pengingat SLA otomatis berhasil dikirim ke email & dashboard ${activeDetailStage.pic}`);
                              }}
                              style={{ width: "100%", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                              Send SLA Reminder
                            </button>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* Catatan Revisi & Feedback Tab Content */}
          {submitterTab === "revisi" && (
            <div>
              <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
                <div className="page-title-area">
                  <div className="breadcrumb">Proyek 2 / Revisi Desk</div>
                  <h1 className="page-title">Pusat Pesan Masuk Revisi & Feedback</h1>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="qa-list">
                    
                    <div className="qa-card" style={{ borderLeft: "4px solid var(--color-danger)" }}>
                      <div className="qa-header">
                        <span className="qa-vendor" style={{ color: "var(--color-accent-red)" }}>Pejabat DP3 (Approver) - Revisi Pengajuan PR-90410</span>
                        <span className="badge badge-danger">Perlu Tindakan</span>
                      </div>
                      <div className="qa-question">
                        Harap lampirkan sertifikasi kepatuhan TKDN terbaru untuk item jasa Tenaga Kerja Alih Daya (TAD) Operator Depot LPG. Draf yang dikirimkan sebelumnya belum melampirkan Lampiran A2.
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button className="btn btn-primary" onClick={() => setSubmitterTab("form")} style={{ padding: "6px 12px", fontSize: "11px" }}>
                          Revisi Sekarang →
                        </button>
                      </div>
                    </div>

                    <div className="qa-card" style={{ borderLeft: "4px solid var(--color-success)" }}>
                      <div className="qa-header">
                        <span className="qa-vendor">Panitia Pengadaan (Buyer) - Klarifikasi PR-90422</span>
                        <span className="badge badge-success">Selesai Direvisi</span>
                      </div>
                      <div className="qa-question">
                        Justifikasi kriteria teknis vendor armada mobil tangki telah divalidasi dan dicentang oleh tim buyer. RKS siap disusun.
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
