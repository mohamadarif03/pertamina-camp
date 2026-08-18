"use client";

import React, { useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EvaluatorPage() {
  const {
    formData,
    vendorScores,
    setVendorScores,
    activeRole,
    setActiveRole
  } = useProject();

  // Sync role in context just in case user lands directly
  useEffect(() => {
    if (activeRole !== "evaluator") {
      setActiveRole("evaluator");
    }
  }, [activeRole, setActiveRole]);

  const priceItems = [
    { id: 1, item: "Jasa TAD Operator Mobil Tangki (Unit/Bulan)", oe: 12000000, vendorA: 11800000, vendorB: 9200000, vendorC: 12100000 },
    { id: 2, item: "Penyediaan APD Standar HSSE Pertamina (Set)", oe: 2500000, vendorA: 2450000, vendorB: 1800000, vendorC: 2550000 },
    { id: 3, item: "Maintenance berkala kendaraan operasional (Unit/Tahun)", oe: 2000000, vendorA: 1950000, vendorB: 900000, vendorC: 2100000 },
  ];

  const handleScoreChange = (vendor: string, field: "technical" | "commercial", val: number) => {
    setVendorScores((prev) => ({
      ...prev,
      [vendor]: {
        ...prev[vendor],
        [field]: val,
      },
    }));
  };

  const handleNotesChange = (vendor: string, notes: string) => {
    setVendorScores((prev) => ({
      ...prev,
      [vendor]: {
        ...prev[vendor],
        notes,
      },
    }));
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
              <div className="breadcrumb">Proyek 2 / Hub Penilaian Kolaboratif</div>
              <h1 className="page-title">Evaluasi Penawaran & Deteksi Harga Timpang</h1>
            </div>
            <div>
              <span className="badge badge-ai">Automated Pricing Check</span>
            </div>
          </div>

          <div className="workspace-canvas" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", padding: 0, gap: "24px" }}>
            
            {/* Left Column: Commercial Matrix with Abnormal price highlighting (D6) */}
            <div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Matriks Perbandingan Penawaran Harga (OE vs Bidder)</span>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <div className="table-container">
                    <table className="matrix-table">
                      <thead>
                        <tr>
                          <th>Item Pekerjaan</th>
                          <th>HPS (OE)</th>
                          <th>Vendor A</th>
                          <th>Vendor B (Timpang)</th>
                          <th>Vendor C</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceItems.map((item) => {
                          const isB_Timpang = item.vendorB < item.oe * 0.8;
                          return (
                            <tr key={item.id} className={isB_Timpang ? "row-abnormal" : ""}>
                              <td style={{ fontWeight: 500 }}>{item.item}</td>
                              <td>Rp {item.oe.toLocaleString("id-ID")}</td>
                              <td>Rp {item.vendorA.toLocaleString("id-ID")}</td>
                              <td className={isB_Timpang ? "text-danger" : ""}>
                                Rp {item.vendorB.toLocaleString("id-ID")}
                                {isB_Timpang && <span style={{ display: "block", fontSize: "10px", fontWeight: "bold" }}>Timpang ({( (item.vendorB / item.oe) * 100 ).toFixed(0)}%)</span>}
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

              <div className="card" style={{ borderLeft: "4px solid var(--color-warning)", backgroundColor: "var(--color-warning-bg)" }}>
                <div className="card-header" style={{ background: "none", borderBottom: "1px solid var(--color-border-light)" }}>
                  <span className="card-title" style={{ color: "var(--color-warning)" }}>Peringatan Harga Timpang Otomatis</span>
                </div>
                <div className="card-body" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  <p>
                    Item pekerjaan <strong>"Maintenance berkala kendaraan operasional"</strong> dari <strong>CV Mahakam Perkasa (Vendor B)</strong> terdeteksi sebesar <strong>Rp 900.000</strong>. Nilai ini di bawah batas wajar 80% Owner Estimate (OE/HPS) yang bernilai Rp 2.000.000.
                  </p>
                  <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                    <button className="btn btn-primary" onClick={() => alert("Formulir Klarifikasi Harga Timpang telah digenerasi untuk dikirimkan ke Vendor B!")} style={{ padding: "6px 12px", fontSize: "12px" }}>
                      Terbitkan Form Klarifikasi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Scoring Inputs */}
            <div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Skoring Evaluasi Teknis & Kualifikasi</span>
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Vendor A */}
                    <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "16px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                        PT Borneo Jaya Utama (Vendor A)
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
                        <div>
                          <label className="form-label">Skor Teknis (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorA.technical}
                            onChange={(e) => handleScoreChange("vendorA", "technical", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Skor Komersial (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorA.commercial}
                            onChange={(e) => handleScoreChange("vendorA", "commercial", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <label className="form-label">Catatan Evaluator:</label>
                      <textarea
                        className="form-input"
                        style={{ minHeight: "60px", resize: "none" }}
                        value={vendorScores.vendorA.notes}
                        onChange={(e) => handleNotesChange("vendorA", e.target.value)}
                      />
                    </div>

                    {/* Vendor B */}
                    <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "16px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                        CV Mahakam Perkasa (Vendor B)
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
                        <div>
                          <label className="form-label">Skor Teknis (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorB.technical}
                            onChange={(e) => handleScoreChange("vendorB", "technical", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Skor Komersial (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorB.commercial}
                            onChange={(e) => handleScoreChange("vendorB", "commercial", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <label className="form-label">Catatan Evaluator:</label>
                      <textarea
                        className="form-input"
                        style={{ minHeight: "60px", resize: "none" }}
                        value={vendorScores.vendorB.notes}
                        onChange={(e) => handleNotesChange("vendorB", e.target.value)}
                      />
                    </div>

                    {/* Vendor C */}
                    <div style={{ paddingBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                        PT Mahakam Logistik (Vendor C)
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
                        <div>
                          <label className="form-label">Skor Teknis (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorC.technical}
                            onChange={(e) => handleScoreChange("vendorC", "technical", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Skor Komersial (50-100):</label>
                          <input
                            type="number"
                            className="form-input"
                            value={vendorScores.vendorC.commercial}
                            onChange={(e) => handleScoreChange("vendorC", "commercial", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <label className="form-label">Catatan Evaluator:</label>
                      <textarea
                        className="form-input"
                        style={{ minHeight: "60px", resize: "none" }}
                        value={vendorScores.vendorC.notes}
                        onChange={(e) => handleNotesChange("vendorC", e.target.value)}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn btn-blue" onClick={() => alert("Nilai evaluasi berhasil disimpan dan dikompilasi ke Matriks Penilaian LHP!")}>
                        Simpan & Sinkronisasi Skor
                      </button>
                    </div>

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
