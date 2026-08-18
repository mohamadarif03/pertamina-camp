"use client";

import React, { useState, useEffect } from "react";
import { useProject, Guarantee, QAItem } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function VendorPage() {
  const {
    guarantees,
    setGuarantees,
    qaList,
    setQaList,
    activeRole,
    setActiveRole
  } = useProject();

  const [newGuarantee, setNewGuarantee] = useState({
    type: "Jaminan Penawaran (Bid Bond)",
    bank: "",
    amount: "",
    expiry: "",
  });

  const [newQuestion, setNewQuestion] = useState("");

  // Sync role in context just in case user lands directly
  useEffect(() => {
    if (activeRole !== "vendor") {
      setActiveRole("vendor");
    }
  }, [activeRole, setActiveRole]);

  const handleAddGuarantee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuarantee.bank || !newGuarantee.amount || !newGuarantee.expiry) return;

    const expiryDate = new Date(newGuarantee.expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: Guarantee["status"] = "Valid";
    if (diffDays <= 0) status = "Expired";
    else if (diffDays <= 14) status = "Expiring";

    const newObj: Guarantee = {
      id: Date.now(),
      type: newGuarantee.type,
      bank: newGuarantee.bank,
      amount: parseInt(newGuarantee.amount) || 0,
      expiry: newGuarantee.expiry,
      status,
      vendor: "PT Borneo Jaya Utama",
    };

    setGuarantees([...guarantees, newObj]);
    setNewGuarantee({
      type: "Jaminan Penawaran (Bid Bond)",
      bank: "",
      amount: "",
      expiry: "",
    });
    alert("Jaminan berhasil diunggah dan disimpan ke Vault Jaminan!");
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQA: QAItem = {
      id: Date.now(),
      vendor: "PT Borneo Jaya Utama",
      question: newQuestion,
      status: "Pending Answer",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WITA",
    };

    setQaList([...qaList, newQA]);
    setNewQuestion("");
    alert("Pertanyaan berhasil diajukan ke Forum Pre-Bid!");
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
          <div className="page-header" style={{ padding: "0 0 20px 0", borderBottom: "1px solid var(--color-border-light)", marginBottom: "24px", background: "none" }}>
            <div className="page-title-area">
              <div className="breadcrumb">Proyek 2 / Portal Vendor Eksternal</div>
              <h1 className="page-title">Partisipasi Tender & Jaminan Vault</h1>
            </div>
            <div>
              <span className="badge badge-success">Undangan Aktif</span>
            </div>
          </div>

          <div className="workspace-canvas" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: 0, gap: "24px" }}>
            
            {/* Left Panel: Jaminan Vault (D2) */}
            <div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Unggah Jaminan Penawaran / Pelaksanaan (D2)</span>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAddGuarantee}>
                    <div className="form-group">
                      <label className="form-label">Jenis Jaminan:</label>
                      <select
                        className="project-selector"
                        style={{ width: "100%", backgroundColor: "white", padding: "10px" }}
                        value={newGuarantee.type}
                        onChange={(e) => setNewGuarantee({ ...newGuarantee, type: e.target.value })}
                      >
                        <option value="Jaminan Penawaran (Bid Bond)">Jaminan Penawaran (Bid Bond)</option>
                        <option value="Jaminan Pelaksanaan (Performance Bond)">Jaminan Pelaksanaan (Performance Bond)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bank Penerbit:</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: Bank Mandiri, Bank BNI"
                        value={newGuarantee.bank}
                        onChange={(e) => setNewGuarantee({ ...newGuarantee, bank: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label className="form-label">Nilai Jaminan (Rp):</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Nilai Rupiah"
                          value={newGuarantee.amount}
                          onChange={(e) => setNewGuarantee({ ...newGuarantee, amount: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Tanggal Kedaluwarsa:</label>
                        <input
                          type="date"
                          className="form-input"
                          value={newGuarantee.expiry}
                          onChange={(e) => setNewGuarantee({ ...newGuarantee, expiry: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                      <button type="submit" className="btn btn-primary">
                        Unggah Dokumen Jaminan
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Jaminan Vault (Data-Sync)</span>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <div className="table-container">
                    <table className="matrix-table">
                      <thead>
                        <tr>
                          <th>Jenis</th>
                          <th>Bank</th>
                          <th>Nilai</th>
                          <th>Masa Berlaku</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guarantees.map((g) => (
                          <tr key={g.id}>
                            <td>{g.type}</td>
                            <td>{g.bank}</td>
                            <td>Rp {g.amount.toLocaleString("id-ID")}</td>
                            <td>{g.expiry}</td>
                            <td>
                              <span className={`badge ${g.status === "Valid" ? "badge-success" : g.status === "Expiring" ? "badge-warning" : "badge-danger"}`}>
                                {g.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Pre-Bid Forum (D5) */}
            <div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Pre-Bid Forum - Ajukan Pertanyaan (D5)</span>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAskQuestion} style={{ marginBottom: "20px" }}>
                    <div className="form-group">
                      <label className="form-label">Tulis Pertanyaan Resmi (terkait klausul RKS):</label>
                      <textarea
                        className="form-input"
                        placeholder="Contoh: Apakah diperbolehkan menggunakan sertifikasi TKDN yang sedang dalam proses perpanjangan?..."
                        style={{ minHeight: "100px", marginBottom: "12px", resize: "none" }}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="btn btn-blue">
                          Ajukan ke Forum
                        </button>
                      </div>
                    </div>
                  </form>

                  <span style={{ fontSize: "14px", fontWeight: "700", display: "block", marginBottom: "12px" }}>
                    Riwayat Forum Tanya Jawab (Shared):
                  </span>
                  
                  <div className="qa-list">
                    {qaList.map((q) => (
                      <div key={q.id} className="qa-card">
                        <div className="qa-header">
                          <span className="qa-vendor" style={{ color: "var(--color-primary-navy)" }}>{q.vendor} (Tanya):</span>
                          <span className={`badge ${q.status === "Answered" ? "badge-success" : "badge-warning"}`}>
                            {q.status === "Answered" ? "Clarified" : "Pending"}
                          </span>
                        </div>
                        <div className="qa-question">{q.question}</div>
                        {q.answer && (
                          <div className="qa-answer-box">
                            <strong>Jawaban Panitia:</strong> {q.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
