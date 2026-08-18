"use client";

import React, { useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function ApproverPage() {
  const {
    formData,
    checklist,
    dp3Approved,
    setDp3Approved,
    lhpApproved,
    setLhpApproved,
    activeRole,
    setActiveRole
  } = useProject();

  // Sync role in context just in case user lands directly
  useEffect(() => {
    if (activeRole !== "approver") {
      setActiveRole("approver");
    }
  }, [activeRole, setActiveRole]);

  const diffs = [
    { type: "same" as const, text: "Pasal 15: " },
    { type: "del" as const, text: "Keterlambatan penyerahan pekerjaan dikenakan denda sesuai dengan peraturan yang berlaku di PT Pertamina Patra Niaga." },
    { type: "add" as const, text: "Apabila PENYEDIA BARANG/JASA terlambat menyelesaikan pekerjaan sesuai jangka waktu, maka akan dikenakan denda keterlambatan sebesar 1/1000 (satu per mil) dari nilai Kontrak untuk setiap hari keterlambatan, dengan maksimum denda sebesar 5% (lima persen) dari nilai Kontrak." }
  ];

  // Calculate current DP3 completeness
  const items = Object.values(checklist);
  const checkedCount = items.filter(Boolean).length;
  const completeness = Math.round((checkedCount / items.length) * 100);

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
              <div className="breadcrumb">Proyek 2 / Pejabat DP3 & Reviewer Pengadaan</div>
              <h1 className="page-title">Persetujuan Dokumen & Hasil Evaluasi</h1>
            </div>
            <div>
              <span className="badge badge-warning">Review Diperlukan</span>
            </div>
          </div>

          <div className="workspace-canvas" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", padding: 0, gap: "24px" }}>
            
            {/* Left Column: List of Items to Approve */}
            <div>
              {/* Approval Item 1: DP3 validation */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Review Dokumen DP3: {formData.jobName}</span>
                  {dp3Approved === true ? (
                    <span className="badge badge-success">Approved</span>
                  ) : dp3Approved === false ? (
                    <span className="badge badge-danger">Rejected</span>
                  ) : (
                    <span className="badge badge-warning">Pending Review</span>
                  )}
                </div>
                <div className="card-body">
                  <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                    Dokumen ini telah disubmit oleh Fungsi Peminta ({formData.requestingFunction}) dengan tingkat kelengkapan <strong>{completeness}% (PR, OE, Pakta Integritas, Form TKDN, TAD Checklist terlampir)</strong>.
                  </p>
                  
                  <div style={{ border: "1px solid var(--color-border-light)", padding: "12px", borderRadius: "6px", backgroundColor: "#F8FAFC", fontSize: "13px", marginBottom: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "8px" }}>
                      <span><strong>Fungsi Pengusul:</strong></span> <span>{formData.requestingFunction}</span>
                      <span><strong>Owner Estimate (OE):</strong></span> <span>Rp {formData.oe.toLocaleString("id-ID")}</span>
                      <span><strong>Target TKDN:</strong></span> <span>{formData.tkdnTarget}%</span>
                    </div>
                  </div>

                  {dp3Approved === null ? (
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button className="btn btn-secondary" onClick={() => setDp3Approved(false)}>
                        Tolak & Revisi
                      </button>
                      <button className="btn btn-primary" onClick={() => setDp3Approved(true)}>
                        ✓ Setujui DP3 & Mulai RKS
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn btn-secondary" onClick={() => setDp3Approved(null)} style={{ padding: "6px 12px", fontSize: "12px" }}>
                        Ubah Status
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Item 2: LHP pricing anomalies */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Review Laporan Hasil Pemilihan (LHP) & Rekomendasi Pemenang</span>
                  {lhpApproved === true ? (
                    <span className="badge badge-success">Approved</span>
                  ) : lhpApproved === false ? (
                    <span className="badge badge-danger">Rejected</span>
                  ) : (
                    <span className="badge badge-warning">Pending Review</span>
                  )}
                </div>
                <div className="card-body">
                  <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                    Laporan Hasil Pemilihan (LHP) telah diterbitkan oleh Panitia Pengadaan. Terdapat catatan evaluasi harga timpang:
                  </p>

                  <div style={{ border: "1px solid var(--color-warning)", padding: "12px", borderRadius: "6px", backgroundColor: "var(--color-warning-bg)", fontSize: "13px", marginBottom: "16px" }}>
                    <strong>Catatan Harga Timpang (Vendor B):</strong>
                    <p style={{ fontSize: "12px", color: "var(--color-text-main)", marginTop: "4px" }}>
                      CV Mahakam Perkasa mengajukan penawaran jasa pemeliharaan berkala kendaraan di bawah batas wajar 80% OE. Hasil klarifikasi menunjukkan penawaran tidak logis.
                    </p>
                    <p style={{ fontWeight: 600, fontSize: "12px", marginTop: "8px" }}>
                      Rekomendasi Pemenang Utama: PT Borneo Jaya Utama (Vendor A) - Nilai Kontrak Rp 22.450.000.000
                    </p>
                  </div>

                  {lhpApproved === null ? (
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button className="btn btn-secondary" onClick={() => setLhpApproved(false)}>
                        Kembalikan LHP
                      </button>
                      <button className="btn btn-primary" onClick={() => setLhpApproved(true)}>
                        e-Sign & Setujui Pemenang
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn btn-secondary" onClick={() => setLhpApproved(null)} style={{ padding: "6px 12px", fontSize: "12px" }}>
                        Ubah Status
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Diff-Viewer for RKS Revision Approval */}
            <div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Diff Viewer: Persetujuan Revisi RKS (D8)</span>
                  <span className="badge badge-ai">AI Proposed Draft</span>
                </div>
                <div className="card-body">
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)", display: "block", marginBottom: "16px" }}>
                    Bandingkan draf pasal asli vs usulan panitia yang dibantu oleh AI sebelum penandatanganan dokumen adendum.
                  </span>

                  <div className="diff-container" style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                    {diffs.map((d, index) => {
                      if (d.type === "add") {
                        return <ins key={index} className="diff-ins">{d.text}</ins>;
                      } else if (d.type === "del") {
                        return <del key={index} className="diff-del">{d.text}</del>;
                      } else {
                        return <span key={index} className="diff-normal">{d.text}</span>;
                      }
                    })}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="btn btn-ai" onClick={() => alert("Klausul revisi adendum RKS disetujui untuk ditambahkan!")}>
                      ✓ Terima Klausul Adendum RKS
                    </button>
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
