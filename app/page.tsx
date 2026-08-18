"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useProject } from "./context/ProjectContext";
import Navbar from "./components/Navbar";

interface RoleCardProps {
  title: string;
  roleId: string;
  roleKey: string;
  description: string;
  features: string[];
  color: string;
  path: string;
}

function RoleCard({ title, roleId, roleKey, description, features, color, path }: RoleCardProps) {
  const { setActiveRole } = useProject();
  
  return (
    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", borderTop: `4px solid ${color}` }}>
      <div className="card-body" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.5px" }}>
            {roleKey}
          </span>
          <span className="badge" style={{ backgroundColor: `${color}15`, color: color }}>
            Portal Aktif
          </span>
        </div>
        
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "var(--color-text-main)" }}>
          {title}
        </h3>
        
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: "1.4", marginBottom: "16px" }}>
          {description}
        </p>

        <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-main)", display: "block", marginBottom: "6px" }}>
            Fitur Utama:
          </span>
          <ul style={{ paddingLeft: "16px", fontSize: "12px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
            {features.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--color-border-light)", backgroundColor: "var(--color-bg-app)" }}>
        <Link 
          href={path} 
          onClick={() => setActiveRole(roleId)} 
          className="btn" 
          style={{ width: "100%", backgroundColor: color, color: "white", textDecoration: "none", display: "inline-flex", justifyContent: "center" }}
        >
          Masuk Workspace →
        </Link>
      </div>
    </div>
  );
}

export default function RoleSelectorPortal() {
  const { setActiveRole } = useProject();

  // Reset active role to portal on selector page mount
  useEffect(() => {
    setActiveRole("portal");
  }, [setActiveRole]);

  const roles = [
    {
      title: "Submitter (Fungsi Peminta)",
      roleId: "submitter",
      roleKey: "Internal Pertamina",
      description: "Unit kerja internal yang menginisiasi pengadaan barang/jasa, menyusun draf PPL, formulir DP3, dan lampiran teknis.",
      features: ["Penyusunan Form DP3 (D1)", "TKDN Calculator (D7)", "Checklist HC TAD Mandatori"],
      color: "var(--color-secondary-blue)",
      path: "/submitter",
    },
    {
      title: "Panitia Pengadaan (Buyer)",
      roleId: "panitia",
      roleKey: "Procurement Officer",
      description: "Pengelola utama eksekusi tender dari pembuatan RKS, fasilitasi Pre-Bid Aanwijzing, monitoring SLA, hingga penerbitan Berita Acara.",
      features: ["Pre-Bid Q&A Forum (D5)", "SLA Countdown & Alerts (D4)", "Auto-Gen Berita Acara PDF (D5)", "Smart Doc AI Draft (D8)"],
      color: "var(--color-primary-navy)",
      path: "/panitia",
    },
    {
      title: "Tim Evaluator",
      roleId: "evaluator",
      roleKey: "Technical & Commercial",
      description: "Tim teknis internal yang bertugas menilai proposal penawaran vendor secara kualifikasi, teknis, dan mengidentifikasi harga timpang.",
      features: ["Vendor Evaluation Matrix (D6)", "Abnormal Price Detection (D6)", "Scoring & Notes Dashboard"],
      color: "var(--color-ai-accent)",
      path: "/evaluator",
    },
    {
      title: "Reviewer & Approver",
      roleId: "approver",
      roleKey: "Management Signatory",
      description: "Pejabat berwenang atau Pejabat DP3 yang mereview kepatuhan pengadaan, memberikan koreksi adendum RKS, dan menyetujui LHP.",
      features: ["Diff-Viewer Review RKS (D8)", "Tanda Tangan Digital LHP", "Approval Workflow DP3 (D1)"],
      color: "var(--color-accent-red)",
      path: "/approver",
    },
    {
      title: "Vendor / Penyedia Mitra",
      roleId: "vendor",
      roleKey: "Eksternal Partner",
      description: "Pihak ketiga calon penyedia barang/jasa yang mengunggah jaminan bid bond, bertanya di forum pre-bid, dan mengunggah dokumen penawaran.",
      features: ["Bid Bond Expiry Vault (D2)", "Partisipasi Pre-Bid Q&A (D5)", "Submit Proposal Komersial"],
      color: "#10B981", // Emerald Green
      path: "/vendor",
    },
  ];

  return (
    <div className="app-container" style={{ overflowY: "auto", paddingBottom: "40px" }}>
      {/* Header Portal */}
      <Navbar />

      {/* Hero Welcome Section */}
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "40px 24px 20px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--color-primary-navy)", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          Digital Tender Collaboration & Intelligent Document Automation
        </h1>
        <p style={{ fontSize: "15px", color: "var(--color-text-muted)", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
          Selamat datang di Portal Pengadaan Digital Terintegrasi PT Pertamina Patra Niaga Regional Kalimantan. 
          Pilih peran kerja Anda di bawah ini untuk mengakses dashboard dan memulai kolaborasi pengadaan.
        </p>
      </div>

      {/* Grid Portal Roles */}
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              roleId={role.roleId}
              title={role.title}
              roleKey={role.roleKey}
              description={role.description}
              features={role.features}
              color={role.color}
              path={role.path}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <footer style={{ marginTop: "auto", padding: "24px 0", borderTop: "1px solid var(--color-border-light)", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          Sistem Pengadaan Digital &copy; 2026 PT Pertamina Patra Niaga Regional Kalimantan x FILKOM UB (Pertamina Camp)
        </div>
      </footer>
    </div>
  );
}
