"use client";

import React, { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function WorkspacePage() {
  const {
    formData,
    checklist,
    setChecklist,
    qaList,
    setQaList,
    guarantees,
    vendorScores,
    setVendorScores,
    activeRole,
    setActiveRole
  } = useProject();

  const [completenessScore, setCompletenessScore] = useState(50);

  // Sync role in context just in case user lands directly
  useEffect(() => {
    if (activeRole !== "panitia") {
      setActiveRole("panitia");
    }
  }, [activeRole, setActiveRole]);

  // Calculate completeness based on shared checklist state
  useEffect(() => {
    const items = Object.values(checklist);
    const checkedCount = items.filter(Boolean).length;
    setCompletenessScore(Math.round((checkedCount / items.length) * 100));
  }, [checklist]);

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // --- STATE D2 & D4: SLA & Expiry Alerts ---
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 20, seconds: 55 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- STATE D5: Pre-Bid Meeting & BA Generator ---
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [baPreviewText, setBaPreviewText] = useState<string | null>(null);

  const submitAnswer = (id: number) => {
    if (!answerInput.trim()) return;
    setQaList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Answered", answer: answerInput } : item
      )
    );
    setAnswerInput("");
    setActiveQuestionId(null);
  };

  const generateBeritaAcara = () => {
    const timeString = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const content = `BERITA ACARA PENJELASAN TENDER (AANWIJZING)
Nomor: BA-042/PPN-KAL/2026
Tanggal: ${timeString}

Pekerjaan: ${formData.jobName}

Pada hari ini telah diselenggarakan rapat Pre-Bid untuk menjelaskan detail pengadaan.
Berikut adalah transkrip Q&A resmi yang telah disepakati:

${qaList
  .map(
    (q, idx) =>
      `${idx + 1}. Tanya [${q.vendor}]: ${q.question}\n   Jawab: ${
        q.answer || "(Akan dijawab tertulis via adendum)"
      }`
  )
  .join("\n\n")}

Dokumen ini sah dan akan dilampirkan dalam Adendum RKS.
Status TKDN Terkalkulasi: Target Min. ${formData.tkdnTarget}% | Tercapai (Estimasi): 34.5%`;

    setBaPreviewText(content);
    setRightPanelTab("ba");
  };

  // --- STATE D6: Evaluation Hub & Pricing Check ---
  const priceItems = [
    { id: 1, item: "Jasa TAD Operator Mobil Tangki (Unit/Bulan)", oe: 12000000, vendorA: 11800000, vendorB: 9200000, vendorC: 12100000 },
    { id: 2, item: "Penyediaan APD Standar HSSE Pertamina (Set)", oe: 2500000, vendorA: 2450000, vendorB: 1800000, vendorC: 2550000 },
    { id: 3, item: "Maintenance berkala kendaraan operasional (Unit/Tahun)", oe: 2000000, vendorA: 1950000, vendorB: 900000, vendorC: 2100000 },
    { id: 4, item: "Jasa Admin Support & Pelaporan (Orang/Bulan)", oe: 6500000, vendorA: 6400000, vendorB: 6300000, vendorC: 6600000 },
  ];

  const updateScore = (vendor: "vendorA" | "vendorB" | "vendorC", val: number) => {
    setVendorScores((prev) => ({
      ...prev,
      [vendor]: {
        ...prev[vendor],
        technical: val
      }
    }));
  };

  // --- STATE D8: Smart Doc & AI Assistant & Diff Viewer ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiDiffResult, setAiDiffResult] = useState<{ original: string; suggested: string; diffs: { type: "add" | "del" | "same"; text: string }[] } | null>(null);

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    
    const originalText = "Pasal 15: Keterlambatan penyerahan pekerjaan dikenakan denda sesuai dengan peraturan yang berlaku di PT Pertamina Patra Niaga.";
    const suggestedText = "Pasal 15: Apabila PENYEDIA BARANG/JASA terlambat menyelesaikan pekerjaan sesuai jangka waktu, maka akan dikenakan denda keterlambatan sebesar 1/1000 (satu per mil) dari nilai Kontrak untuk setiap hari keterlambatan, dengan maksimum denda sebesar 5% (lima persen) dari nilai Kontrak.";
    
    const diffs = [
      { type: "same" as const, text: "Pasal 15: " },
      { type: "del" as const, text: "Keterlambatan penyerahan pekerjaan dikenakan denda sesuai dengan peraturan yang berlaku di PT Pertamina Patra Niaga." },
      { type: "add" as const, text: "Apabila PENYEDIA BARANG/JASA terlambat menyelesaikan pekerjaan sesuai jangka waktu, maka akan dikenakan denda keterlambatan sebesar 1/1000 (satu per mil) dari nilai Kontrak untuk setiap hari keterlambatan, dengan maksimum denda sebesar 5% (lima persen) dari nilai Kontrak." }
    ];

    setAiDiffResult({
      original: originalText,
      suggested: suggestedText,
      diffs
    });
    setRightPanelTab("ai");
  };

  const [rightPanelTab, setRightPanelTab] = useState<"evaluation" | "ba" | "ai">("evaluation");

  return (
    <div className="app-container">
      {/* Dynamic Navbar */}
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        
        {/* Dynamic Sidebar */}
        <Sidebar />

        {/* 3. CONTENT PANE */}
        <main className="content-pane">
          {/* Action / Breadcrumb Header */}
          <div className="page-header">
            <div className="page-title-area">
              <div className="breadcrumb">Proyek 2 / Panitia Pengadaan Workspace</div>
              <h1 className="page-title">Workspace Kolaborasi & Evaluasi Tender</h1>
            </div>
            
            <div className="header-status-bar">
              {/* D4: SLA Countdown Pill */}
              <div className="progress-container" style={{ width: "220px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                <span className="breadcrumb" style={{ fontSize: "11px" }}>Batas Waktu Evaluasi Dokumen</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`badge ${timeLeft.hours < 15 ? "pulse-badge" : "badge-warning"}`}>
                    {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:{timeLeft.seconds.toString().padStart(2, "0")} tersisa
                  </span>
                </div>
              </div>

              {/* completeness score card badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                <span className="breadcrumb" style={{ fontSize: "11px" }}>Validasi Kelengkapan DP3 (D1)</span>
                <span className={`badge ${completenessScore === 100 ? "badge-success" : "badge-warning"}`}>
                  {completenessScore}% Lengkap
                </span>
              </div>
            </div>
          </div>

          {/* 3-Panel Split Workspace Area */}
          <div className="workspace-canvas">
            
            {/* LEFT PANEL - FORMS & PRE-BID */}
            <div className="left-panel">
              
              {/* CARD 1: DP3 validation Form (D1 & D7) */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Checklist Validasi Dokumen DP3 & TKDN (D1/D7)</span>
                  <span className="badge badge-ai">Automated Check</span>
                </div>
                <div className="card-body">
                  <div className="progress-container" style={{ marginBottom: "20px" }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${completenessScore}%` }}></div>
                    </div>
                    <span className="progress-text">{completenessScore}%</span>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-checkbox-group">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.pr}
                          onChange={() => handleChecklistChange("pr")}
                        />
                        <div className="checkbox-label">
                          <strong>Purchase Requisition (PR)</strong>
                          <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)" }}>Validasi Nomor PR-90422 terhadap SAP</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.oe}
                          onChange={() => handleChecklistChange("oe")}
                        />
                        <div className="checkbox-label">
                          <strong>Dokumen Owner Estimate (OE/HPS)</strong>
                          <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)" }}>Total HPS: Rp {formData.oe.toLocaleString("id-ID")} (Tervalidasi)</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.justification}
                          onChange={() => handleChecklistChange("justification")}
                        />
                        <div className="checkbox-label">
                          <strong>Justifikasi Pengadaan & Kualifikasi Vendor</strong>
                          <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)" }}>Ditandatangani oleh Manager Fungsi Peminta</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.pakta}
                          onChange={() => handleChecklistChange("pakta")}
                        />
                        <div className="checkbox-label">
                          <strong>Pakta Integritas Panitia & Peserta</strong>
                          {!checklist.pakta && (
                            <span className="text-danger" style={{ display: "block", fontSize: "11px" }}>
                              Wajib diunggah sebelum dokumen diserahkan ke Pejabat DP3
                            </span>
                          )}
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.tkdn}
                          onChange={() => handleChecklistChange("tkdn")}
                        />
                        <div className="checkbox-label">
                          <strong>Formulir TKDN (A1, A2, B1)</strong>
                          <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)" }}>Menjamin kontribusi komponen lokal min {formData.tkdnTarget}%</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={checklist.hctad}
                          onChange={() => handleChecklistChange("hctad")}
                        />
                        <div className="checkbox-label">
                          <strong>Checklist HC TAD (Human Capital TAD)</strong>
                          <span style={{ display: "block", fontSize: "12px", color: "var(--color-text-muted)" }}>Pekerjaan Jasa Operasional wajib mematuhi standar HC TAD</span>
                        </div>
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              {/* CARD 2: Bid Bond Expiry alert (D2) */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Jaminan Penawaran / Bid Bond Expiry Radar (D2)</span>
                  <span className="badge badge-danger">High Priority</span>
                </div>
                <div className="card-body">
                  <div className="quick-access-grid">
                    {guarantees.map((g) => (
                      <div 
                        key={g.id} 
                        className={`quick-access-card ${g.status !== "Valid" ? "active" : ""}`}
                        style={{ minHeight: "130px" }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", opacity: g.status !== "Valid" ? 0.9 : 0.6, color: g.status !== "Valid" ? "white" : "var(--color-text-muted)" }}>
                              {g.bank}
                            </span>
                            <span className={`badge ${g.status === "Valid" ? "badge-success" : "badge-danger"}`} style={{ padding: "2px 8px", fontSize: "10px" }}>
                              {g.status}
                            </span>
                          </div>
                          <h4 style={{ fontSize: "13px", fontWeight: "700", marginTop: "4px", color: g.status !== "Valid" ? "white" : "var(--color-text-main)" }}>
                            {g.type}
                          </h4>
                          <p style={{ fontSize: "12px", marginTop: "4px", opacity: g.status !== "Valid" ? 0.9 : 0.8, color: g.status !== "Valid" ? "white" : "var(--color-text-muted)" }}>
                            Rp {g.amount.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "11px", color: g.status !== "Valid" ? "white" : "var(--color-text-muted)" }}>
                          <span>Exp: {g.expiry}</span>
                          <div className="avatar-stack">
                            <div className="avatar-stack-item" style={{ borderColor: g.status !== "Valid" ? "var(--color-primary-navy)" : "white" }}>PT</div>
                            <div className="avatar-stack-item" style={{ borderColor: g.status !== "Valid" ? "var(--color-primary-navy)" : "white" }}>V</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {guarantees.length === 0 && (
                      <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Tidak ada jaminan di vault.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 3: Digital Pre-Bid Forum & BA Generator (D5) */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Pre-Bid Aanwijzing Forum (D5)</span>
                  <button className="btn btn-primary" onClick={generateBeritaAcara} style={{ padding: "6px 12px", fontSize: "12px" }}>
                    Generate BA Pre-Bid
                  </button>
                </div>
                <div className="card-body">
                  <div className="qa-list">
                    {qaList.map((item) => (
                      <div
                        key={item.id}
                        className="qa-card"
                        style={{
                          borderLeft: activeQuestionId === item.id ? "3px solid var(--color-accent-red)" : "1px solid var(--color-border-light)",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveQuestionId(item.id)}
                      >
                        <div className="qa-header">
                          <span className="qa-vendor">{item.vendor}</span>
                          <span className={`badge ${item.status === "Answered" ? "badge-success" : "badge-warning"}`}>
                            {item.status === "Answered" ? "Clarified" : "Pending Answer"}
                          </span>
                        </div>
                        <div className="qa-question">{item.question}</div>
                        {item.answer ? (
                          <div className="qa-answer-box">
                            <strong>Jawaban Panitia:</strong> {item.answer}
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--color-accent-red)", fontWeight: "600" }}>
                            Klik untuk menjawab secara resmi
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {activeQuestionId !== null && (
                    <div style={{ marginTop: "16px", padding: "16px", border: "1px solid var(--color-border-medium)", borderRadius: "6px", backgroundColor: "#F8FAFC" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                        Menjawab Pertanyaan dari: {qaList.find((q) => q.id === activeQuestionId)?.vendor}
                      </span>
                      <textarea
                        className="form-input"
                        placeholder="Ketik jawaban resmi panitia di sini..."
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        style={{ minHeight: "80px", marginBottom: "12px", resize: "none" }}
                      />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button className="btn btn-secondary" onClick={() => setActiveQuestionId(null)} style={{ padding: "6px 12px" }}>
                          Batal
                        </button>
                        <button className="btn btn-primary" onClick={() => submitAnswer(activeQuestionId!)} style={{ padding: "6px 12px" }}>
                          Kirim Jawaban
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT PANEL - DYNAMIC DETAILED EVALUATION, BA PREVIEW, & AI DRAFT */}
            <div className="right-panel">
              
              {/* TAB SELECTOR HEADER */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-light)", marginBottom: "20px" }}>
                <button
                  onClick={() => setRightPanelTab("evaluation")}
                  style={{
                    padding: "12px 16px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: rightPanelTab === "evaluation" ? "3px solid var(--color-primary-navy)" : "3px solid transparent",
                    color: rightPanelTab === "evaluation" ? "var(--color-primary-navy)" : "var(--color-text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Komparasi Harga & Evaluasi (D6)
                </button>
                
                <button
                  onClick={() => setRightPanelTab("ba")}
                  style={{
                    padding: "12px 16px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: rightPanelTab === "ba" ? "3px solid var(--color-primary-navy)" : "3px solid transparent",
                    color: rightPanelTab === "ba" ? "var(--color-primary-navy)" : "var(--color-text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Draf BA Pre-Bid
                </button>

                <button
                  onClick={() => setRightPanelTab("ai")}
                  style={{
                    padding: "12px 16px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: rightPanelTab === "ai" ? "3px solid var(--color-ai-accent)" : "3px solid transparent",
                    color: rightPanelTab === "ai" ? "var(--color-ai-accent)" : "var(--color-text-muted)",
                    cursor: "pointer",
                  }}
                >
                  AI Document Assistant (D8)
                </button>
              </div>

              {/* TAB CONTENT 1: EVALUATION MATRIX & ABNORMAL PRICING (D6) */}
              {rightPanelTab === "evaluation" && (
                <div>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Matriks Evaluasi Komersial (OE vs Bidder)</span>
                      <span className="badge badge-warning">Deteksi Harga Timpang</span>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      <div className="table-container">
                        <table className="matrix-table">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Item Pekerjaan</th>
                              <th>Owner Estimate (OE)</th>
                              <th>Vendor A</th>
                              <th>Vendor B (Timpang)</th>
                              <th>Vendor C</th>
                            </tr>
                          </thead>
                          <tbody>
                            {priceItems.map((item, idx) => {
                              const isB_Timpang = item.vendorB < item.oe * 0.8;
                              return (
                                <tr key={item.id} className={isB_Timpang ? "row-abnormal" : ""}>
                                  <td>{idx + 1}</td>
                                  <td>{item.item}</td>
                                  <td>Rp {item.oe.toLocaleString("id-ID")}</td>
                                  <td>Rp {item.vendorA.toLocaleString("id-ID")}</td>
                                  <td className={isB_Timpang ? "text-danger" : ""}>
                                    Rp {item.vendorB.toLocaleString("id-ID")}
                                    {isB_Timpang && <span style={{ display: "block", fontSize: "10px", fontWeight: "bold" }}>⚠️ Timpang ({( (item.vendorB / item.oe) * 100 ).toFixed(0)}%)</span>}
                                  </td>
                                  <td>Rp {item.vendorC.toLocaleString("id-ID")}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Evaluator Scoring Widget */}
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Collaborative Scoring Hub (Teknis & Kualifikasi)</span>
                    </div>
                    <div className="card-body">
                      <span style={{ fontSize: "12px", color: "var(--color-text-muted)", display: "block", marginBottom: "16px" }}>
                        Sesama Panitia/Evaluator dapat memasukkan skor teknis secara berkolaborasi sebelum menerbitkan LHP.
                      </span>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                            <span><strong>PT Borneo Jaya Utama (Vendor A)</strong></span>
                            <span>Skor Teknis: <strong>{vendorScores.vendorA.technical} / 100</strong></span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={vendorScores.vendorA.technical}
                            onChange={(e) => updateScore("vendorA", parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--color-primary-navy)" }}
                          />
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                            <span><strong>CV Mahakam Perkasa (Vendor B)</strong></span>
                            <span>Skor Teknis: <strong>{vendorScores.vendorB.technical} / 100</strong></span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={vendorScores.vendorB.technical}
                            onChange={(e) => updateScore("vendorB", parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--color-primary-navy)" }}
                          />
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                            <span><strong>PT Mahakam Logistik (Vendor C)</strong></span>
                            <span>Skor Teknis: <strong>{vendorScores.vendorC.technical} / 100</strong></span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={vendorScores.vendorC.technical}
                            onChange={(e) => updateScore("vendorC", parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--color-primary-navy)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: BERITA ACARA PREVIEW */}
              {rightPanelTab === "ba" && (
                <div className="card" style={{ minHeight: "350px" }}>
                  <div className="card-header">
                    <span className="card-title">Live Preview: Berita Acara Pre-Bid (D5)</span>
                    <button className="btn btn-secondary" onClick={() => {
                      if (baPreviewText) {
                        alert("BA Pre-Bid berhasil diekspor ke PDF dengan Digital Signature!");
                      }
                    }} style={{ padding: "6px 12px", fontSize: "12px" }}>
                      Ekspor PDF/e-Sign
                    </button>
                  </div>
                  <div className="card-body">
                    {baPreviewText ? (
                      <pre style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        whiteSpace: "pre-wrap",
                        backgroundColor: "var(--color-bg-workspace)",
                        padding: "16px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border-light)",
                        lineHeight: 1.5,
                        color: "var(--color-text-main)"
                      }}>
                        {baPreviewText}
                      </pre>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)", minHeight: "260px" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>Belum ada dokumen BA yang digenerasi.</span>
                        <span style={{ fontSize: "12px" }}>Klik tombol <strong>"Generate BA Pre-Bid"</strong> di panel kiri.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: AI ASSISTANT & DIFF VIEWER (D8) */}
              {rightPanelTab === "ai" && (
                <div className="ai-panel">
                  <div className="ai-header-bar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="#8B5CF6" />
                    </svg>
                    <span>Asisten AI Kontrak & RKS (Intelligent Draft Engine)</span>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" style={{ color: "var(--color-ai-accent)" }}>Tulis Prompt/Instruksi Penyusunan Pasal:</label>
                    <div className="ai-input-group">
                      <input
                        type="text"
                        className="ai-input"
                        placeholder="Contoh: Buatkan pasal denda keterlambatan vendor sebesar 1/1000 per hari maks 5%..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                      <button className="btn btn-ai" onClick={handleAiGenerate}>
                        Generasi Draf
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", display: "block", marginBottom: "6px" }}>Rekomendasi Cepat AI:</span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setAiPrompt("Buatkan klausul denda keterlambatan 1/1000 max 5%")}
                        style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px" }}
                      >
                        Klausul Denda Keterlambatan
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setAiPrompt("Tambahkan pasal standar Kesehatan & Keselamatan Kerja (K3) TAD")}
                        style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px" }}
                      >
                        Klausul K3 Standar TAD
                      </button>
                    </div>
                  </div>

                  {aiDiffResult && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-text-main)" }}>Diff Viewer - Hasil Komparasi Draft AI:</span>
                        <button className="btn btn-primary" onClick={() => {
                          alert("Perubahan dari AI telah disetujui dan diterapkan pada draf RKS!");
                          setAiDiffResult(null);
                        }} style={{ padding: "4px 8px", fontSize: "11px" }}>
                          ✓ Terima Perubahan
                        </button>
                      </div>

                      <div className="diff-container">
                        {aiDiffResult.diffs.map((d, index) => {
                          if (d.type === "add") {
                            return <ins key={index} className="diff-ins">{d.text}</ins>;
                          } else if (d.type === "del") {
                            return <del key={index} className="diff-del">{d.text}</del>;
                          } else {
                            return <span key={index} className="diff-normal">{d.text}</span>;
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
