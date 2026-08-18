"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProject } from "../context/ProjectContext";

export default function Navbar() {
  const { activeRole, setActiveRole } = useProject();
  const router = useRouter();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setActiveRole(val);
    if (val === "portal") {
      router.push("/");
    } else {
      router.push(`/${val}`);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "submitter": return "Submitter (Fungsi Peminta)";
      case "panitia": return "Panitia Pengadaan (Buyer)";
      case "evaluator": return "Tim Evaluator";
      case "approver": return "Pejabat DP3 (Approver)";
      case "vendor": return "Vendor (Calon Penyedia)";
      default: return "Portal Peran Selector";
    }
  };

  return (
    <header className="top-navbar">
      <div className="nav-brand">
        <Link href="/" onClick={() => setActiveRole("portal")} style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/logo.webp"
            alt="Pertamina Logo"
            width={120}
            height={36}
            style={{ objectFit: "contain", marginRight: "8px", cursor: "pointer" }}
            priority
          />
        </Link>
        <div>
          <span className="brand-text">PERTAMINA PATRA NIAGA</span>
          <span className="brand-subtext" style={{ display: "block" }}>
            Regional Kalimantan - {getRoleDisplayName(activeRole)}
          </span>
        </div>
      </div>

      {/* Centered Search Bar matching Google Drive */}
      <div className="navbar-search-container">
        <svg className="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className="navbar-search-input" 
          placeholder="Cari berkas, tender, atau vendor..." 
        />
      </div>

      <div className="nav-actions">
        {/* Dynamic Role Switcher Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-text-muted)" }}>
            Ganti Peran:
          </span>
          <select 
            className="project-selector" 
            value={activeRole} 
            onChange={handleRoleChange}
            style={{ 
              border: "1px solid var(--color-primary-navy)", 
              padding: "6px 12px", 
              fontSize: "12px",
              height: "32px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <option value="portal">Selector Portal</option>
            <option value="submitter">Submitter</option>
            <option value="panitia">Panitia Pengadaan</option>
            <option value="evaluator">Evaluator</option>
            <option value="approver">Approver</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        {/* User profile avatar styled */}
        <div className="user-profile">
          <div className="user-avatar" style={{ 
            backgroundColor: activeRole === "submitter" ? "var(--color-secondary-blue)" : 
                             activeRole === "panitia" ? "var(--color-primary-navy)" :
                             activeRole === "evaluator" ? "var(--color-ai-accent)" :
                             activeRole === "approver" ? "var(--color-accent-red)" :
                             activeRole === "vendor" ? "#10B981" : "var(--color-text-muted)"
          }}>
            {activeRole === "portal" ? "PT" : activeRole.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
