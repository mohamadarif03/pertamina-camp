"use client";

import React from "react";
import Link from "next/link";
import { useProject } from "../context/ProjectContext";

// SVG Icons
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconDocument = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconFolder = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"></path>
  </svg>
);

const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const IconEnvelope = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconCheckList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const IconScales = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path>
    <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path>
    <line x1="16" y1="12" x2="18" y2="12"></line>
  </svg>
);

const IconSignature = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconBank = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="22" width="20" height="2"></rect>
    <path d="M12 2L2 7v3h20V7L12 2z"></path>
    <rect x="4" y="10" width="2" height="12"></rect>
    <rect x="9" y="10" width="2" height="12"></rect>
    <rect x="13" y="10" width="2" height="12"></rect>
    <rect x="18" y="10" width="2" height="12"></rect>
  </svg>
);

const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
    <polyline points="16 16 12 12 8 16"></polyline>
  </svg>
);

export default function Sidebar() {
  const { activeRole, checklist, submitterTab, setSubmitterTab } = useProject();

  // Calculate current DP3 completeness dynamically
  const items = Object.values(checklist);
  const checkedCount = items.filter(Boolean).length;
  const completeness = Math.round((checkedCount / items.length) * 100);

  const getMenuItems = (role: string) => {
    switch (role) {
      case "panitia":
        return [
          { label: "Procurement Tracker", icon: <IconChart />, path: "/panitia" },
          { label: "DocGen (D1)", icon: <IconDocument />, path: "/panitia" },
          { label: "Pre-Bid Workspace (D5)", icon: <IconChat />, path: "/panitia" },
          { label: "Evaluation Hub (D6)", icon: <IconDashboard />, path: "/panitia" },
          { label: "Contracts Vault", icon: <IconLock />, path: "/panitia" },
        ];
      case "evaluator":
        return [
          { label: "Penilaian Penawaran (D6)", icon: <IconChart />, path: "/evaluator" },
          { label: "Klarifikasi Harga Timpang", icon: <IconSearch />, path: "/evaluator" },
          { label: "Draft LHP (Laporan)", icon: <IconDocument />, path: "/evaluator" },
        ];
      case "approver":
        return [
          { label: "Review & Approval", icon: <IconCheckList />, path: "/approver" },
          { label: "Verifikasi RKS & Kontrak", icon: <IconScales />, path: "/approver" },
          { label: "Riwayat e-Sign", icon: <IconSignature />, path: "/approver" },
        ];
      case "vendor":
        return [
          { label: "Dashboard Tender", icon: <IconHome />, path: "/vendor" },
          { label: "Jaminan Vault (D2)", icon: <IconBank />, path: "/vendor" },
          { label: "Tanya Jawab (D5)", icon: <IconChat />, path: "/vendor" },
          { label: "Submit Penawaran", icon: <IconUpload />, path: "/vendor" },
        ];
      default:
        return [];
    }
  };

  if (activeRole === "portal") return null;

  // Render CUSTOM Submitter Sidebar with inline SVGs (no emoji, no main button)
  if (activeRole === "submitter") {
    return (
      <aside className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Group 1: Main Navigation */}
          <div>
            <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.6, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "8px", paddingLeft: "12px" }}>
              Main Navigation
            </span>
            <ul className="sidebar-menu">
              <li className={`menu-item ${submitterTab === "dashboard" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("dashboard")} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <IconDashboard /> Dashboard
                </a>
              </li>
              <li className={`menu-item ${submitterTab === "form" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("form")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <IconDocument /> Buat Pengajuan (DP3)
                  </div>
                  <span className="badge" style={{ backgroundColor: "var(--color-accent-red)", color: "white", fontSize: "9px", padding: "2px 6px" }}>NEW</span>
                </a>
              </li>
              <li className={`menu-item ${submitterTab === "daftar" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("daftar")} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <IconFolder /> Daftar Pengajuan Saya
                </a>
              </li>
            </ul>
          </div>

          {/* Group 2: Workspace & Resource Library */}
          <div>
            <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.6, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "8px", paddingLeft: "12px" }}>
              Workspace & Resources
            </span>
            <ul className="sidebar-menu">
              <li className={`menu-item ${submitterTab === "templates" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("templates")} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <IconBook /> Template & Dokumen Acuan
                </a>
              </li>
              <li className={`menu-item ${submitterTab === "ai" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("ai")} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <IconSparkle /> Smart AI Assistant (D8)
                </a>
              </li>
            </ul>
          </div>

          {/* Group 3: Monitoring & Notifications */}
          <div>
            <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.6, letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "8px", paddingLeft: "12px" }}>
              Monitoring & Alerts
            </span>
            <ul className="sidebar-menu">
              <li className={`menu-item ${submitterTab === "tracking" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("tracking")} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <IconChart /> Status Tracking FPP
                </a>
              </li>
              <li className={`menu-item ${submitterTab === "revisi" ? "active" : ""}`}>
                <a onClick={() => setSubmitterTab("revisi")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <IconEnvelope /> Catatan Revisi
                  </div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-accent-red)" }}></div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sidebar: Compliance Widget & Profile */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "16px" }}>
          
          {/* Unit Compliance Widget */}
          <div className="sidebar-progress-container" style={{ padding: "0 8px" }}>
            <div className="sidebar-progress-label" style={{ fontSize: "11px", opacity: 0.9 }}>
              <span>Target TKDN Unit Kerja</span>
              <strong>Achieved 78%</strong>
            </div>
            <div className="sidebar-progress-track" style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.2)" }}>
              <div 
                className="sidebar-progress-fill" 
                style={{ width: "78%", backgroundColor: "var(--color-success)" }}
              ></div>
            </div>
          </div>

          {/* Submitter Profile Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: "8px" }}>
            <div style={{ 
              width: "36px", 
              height: "36px", 
              borderRadius: "50%", 
              backgroundColor: "var(--color-secondary-blue)", 
              color: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontWeight: "700", 
              fontSize: "14px" 
            }}>
              AF
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "white" }}>Ahmad Faisal</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>NIP. 109283 | Supply & Dist</span>
              <span className="badge" style={{ alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontSize: "8px", fontWeight: "700", padding: "2px 6px", marginTop: "2px" }}>
                SUBMITTER
              </span>
            </div>
          </div>

          <div className="sidebar-footer" style={{ fontSize: "10px", opacity: 0.4, padding: 0 }}>
            <span>Pertamina Camp &copy; 2026</span>
          </div>
        </div>
      </aside>
    );
  }

  // Fallback for other roles (original design, emojis replaced by SVGs, action button removed)
  const menuItems = getMenuItems(activeRole);

  return (
    <aside className="sidebar">
      <div>
        <ul className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <li key={idx} className={`menu-item ${idx === 0 ? "active" : ""}`}>
              <Link href={item.path} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "14px" }}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-compliance-section">
        <span className="sidebar-compliance-title">SLA & COMPLIANCE DETAILS</span>
        
        <div className="sidebar-progress-container">
          <div className="sidebar-progress-label">
            <span>Kelengkapan DP3</span>
            <span>{completeness}%</span>
          </div>
          <div className="sidebar-progress-track">
            <div 
              className="sidebar-progress-fill" 
              style={{ 
                width: `${completeness}%`, 
                backgroundColor: completeness === 100 ? "var(--color-success)" : "var(--color-secondary-blue)" 
              }}
            ></div>
          </div>
        </div>

        <div className="sidebar-progress-container">
          <div className="sidebar-progress-label">
            <span>SLA Waktu Evaluasi</span>
            <span>60% terpakai</span>
          </div>
          <div className="sidebar-progress-track">
            <div 
              className="sidebar-progress-fill" 
              style={{ width: "60%", backgroundColor: "var(--color-warning)" }}
            ></div>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>Pertamina Camp &copy; 2026</span>
        </div>
      </div>
    </aside>
  );
}
