"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface QAItem {
  id: number;
  vendor: string;
  question: string;
  status: "Pending Answer" | "Answered";
  answer?: string;
  timestamp: string;
}

export interface Guarantee {
  id: number;
  type: string;
  bank: string;
  amount: number;
  expiry: string;
  status: "Valid" | "Expiring" | "Expired";
  vendor: string;
}

export interface ScoreData {
  technical: number;
  commercial: number;
  notes: string;
}

export interface ProjectFormData {
  jobName: string;
  requestingFunction: string;
  oe: number;
  tkdnTarget: number;
}

export interface ProjectChecklist {
  pr: boolean;
  oe: boolean;
  justification: boolean;
  pakta: boolean;
  tkdn: boolean;
  hctad: boolean;
}

interface ProjectContextType {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  checklist: ProjectChecklist;
  setChecklist: React.Dispatch<React.SetStateAction<ProjectChecklist>>;
  qaList: QAItem[];
  setQaList: React.Dispatch<React.SetStateAction<QAItem[]>>;
  guarantees: Guarantee[];
  setGuarantees: React.Dispatch<React.SetStateAction<Guarantee[]>>;
  vendorScores: Record<string, ScoreData>;
  setVendorScores: React.Dispatch<React.SetStateAction<Record<string, ScoreData>>>;
  activeRole: string;
  setActiveRole: (role: string) => void;
  submitterTab: string;
  setSubmitterTab: React.Dispatch<React.SetStateAction<string>>;
  dp3Approved: boolean | null;
  setDp3Approved: (val: boolean | null) => void;
  lhpApproved: boolean | null;
  setLhpApproved: (val: boolean | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const DEFAULT_FORM_DATA: ProjectFormData = {
  jobName: "Jasa Penyelenggaraan Transportasi & Distribusi BBM - Balikpapan",
  requestingFunction: "Fungsi Retail Sales Kalimantan",
  oe: 23000000000,
  tkdnTarget: 25,
};

const DEFAULT_CHECKLIST: ProjectChecklist = {
  pr: true,
  oe: true,
  justification: true,
  pakta: false,
  tkdn: false,
  hctad: false,
};

const DEFAULT_QA_LIST: QAItem[] = [
  {
    id: 1,
    vendor: "PT Borneo Jaya Utama",
    question: "Apakah sertifikat TKDN untuk komponen TAD dapat digabung dalam satu form B1?",
    status: "Pending Answer",
    timestamp: "10:15 WITA",
  },
  {
    id: 2,
    vendor: "CV Mahakam Perkasa",
    question: "Berapa lama masa jaminan penawaran (Bid Bond) yang disyaratkan sejak pembukaan tender?",
    status: "Answered",
    answer: "Masa berlaku Bid Bond minimal adalah 120 hari kalender terhitung sejak batas akhir pemasukan dokumen penawaran.",
    timestamp: "09:45 WITA",
  },
];

const DEFAULT_GUARANTEES: Guarantee[] = [
  {
    id: 1,
    type: "Jaminan Penawaran (Bid Bond)",
    bank: "Bank Mandiri",
    amount: 1150000000,
    expiry: "2026-11-15",
    status: "Valid",
    vendor: "PT Borneo Jaya Utama",
  },
];

const DEFAULT_SCORES: Record<string, ScoreData> = {
  vendorA: { technical: 85, commercial: 90, notes: "Kualifikasi dan armada memenuhi seluruh standar HSSE Pertamina." },
  vendorB: { technical: 72, commercial: 98, notes: "Skor komersial tinggi karena harga murah, namun terdapat harga timpang di item pemeliharaan." },
  vendorC: { technical: 90, commercial: 85, notes: "Skor teknis tertinggi, memiliki sertifikasi TKDN melebihi standar minimum." },
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM_DATA);
  const [checklist, setChecklist] = useState<ProjectChecklist>(DEFAULT_CHECKLIST);
  const [qaList, setQaList] = useState<QAItem[]>(DEFAULT_QA_LIST);
  const [guarantees, setGuarantees] = useState<Guarantee[]>(DEFAULT_GUARANTEES);
  const [vendorScores, setVendorScores] = useState<Record<string, ScoreData>>(DEFAULT_SCORES);
  const [activeRole, setActiveRoleState] = useState<string>("portal");
  const [submitterTab, setSubmitterTab] = useState<string>("dashboard");
  const [dp3Approved, setDp3Approved] = useState<boolean | null>(null);
  const [lhpApproved, setLhpApproved] = useState<boolean | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const storedForm = localStorage.getItem("pp_form");
      if (storedForm) setFormData(JSON.parse(storedForm));

      const storedChecklist = localStorage.getItem("pp_checklist");
      if (storedChecklist) setChecklist(JSON.parse(storedChecklist));

      const storedQa = localStorage.getItem("pp_qa");
      if (storedQa) setQaList(JSON.parse(storedQa));

      const storedGuarantees = localStorage.getItem("pp_guarantees");
      if (storedGuarantees) setGuarantees(JSON.parse(storedGuarantees));

      const storedScores = localStorage.getItem("pp_scores");
      if (storedScores) setVendorScores(JSON.parse(storedScores));

      const storedRole = localStorage.getItem("pp_role");
      if (storedRole) setActiveRoleState(storedRole);

      const storedDp3 = localStorage.getItem("pp_dp3_approved");
      if (storedDp3) setDp3Approved(JSON.parse(storedDp3));

      const storedLhp = localStorage.getItem("pp_lhp_approved");
      if (storedLhp) setLhpApproved(JSON.parse(storedLhp));
    } catch (e) {
      console.error("Error loading localStorage", e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("pp_form", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("pp_checklist", JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem("pp_qa", JSON.stringify(qaList));
  }, [qaList]);

  useEffect(() => {
    localStorage.setItem("pp_guarantees", JSON.stringify(guarantees));
  }, [guarantees]);

  useEffect(() => {
    localStorage.setItem("pp_scores", JSON.stringify(vendorScores));
  }, [vendorScores]);

  useEffect(() => {
    localStorage.setItem("pp_role", activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem("pp_dp3_approved", JSON.stringify(dp3Approved));
  }, [dp3Approved]);

  useEffect(() => {
    localStorage.setItem("pp_lhp_approved", JSON.stringify(lhpApproved));
  }, [lhpApproved]);

  const setActiveRole = (role: string) => {
    setActiveRoleState(role);
  };

  return (
    <ProjectContext.Provider
      value={{
        formData,
        setFormData,
        checklist,
        setChecklist,
        qaList,
        setQaList,
        guarantees,
        setGuarantees,
        vendorScores,
        setVendorScores,
        activeRole,
        setActiveRole,
        submitterTab,
        setSubmitterTab,
        dp3Approved,
        setDp3Approved,
        lhpApproved,
        setLhpApproved,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
