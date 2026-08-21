"use client";

import { createContext, useContext, useState } from "react";

export type Role = "panitia" | "evaluator" | "vendor" | "approver";
export type ModuleId = "overview" | "prebid" | "evaluation" | "tkdn" | "documents";
export type QuestionStatus = "Masuk" | "Dibahas" | "Terjawab" | "Menjadi Adendum";

export interface Question {
  id: number;
  vendor: string;
  clause: string;
  category: "Teknis" | "Komersial" | "Administrasi";
  question: string;
  answer?: string;
  status: QuestionStatus;
  time: string;
}

export interface VendorEvaluation {
  id: string;
  vendor: string;
  initials: string;
  technical: number;
  commercial: number;
  tkdn: number;
  price: number;
  priceDeviation: number;
  clarification: "Tidak diperlukan" | "Menunggu respons" | "Diterima";
  note: string;
}

export interface TKDNRecord {
  id: string;
  vendor: string;
  domestic: number;
  foreign: number;
  evidence: number;
  verified: boolean;
}

export interface AuditEvent {
  id: number;
  actor: string;
  action: string;
  object: string;
  time: string;
}

interface ProjectContextValue {
  module: ModuleId;
  setModule: (module: ModuleId) => void;
  questions: Question[];
  addQuestion: (question: Pick<Question, "clause" | "category" | "question">) => void;
  answerQuestion: (id: number, answer: string, asAddendum: boolean) => void;
  evaluations: VendorEvaluation[];
  updateScore: (id: string, score: number) => void;
  tkdnRecords: TKDNRecord[];
  updateTKDN: (id: string, domestic: number, foreign: number) => void;
  verifyTKDN: (id: string) => void;
  audit: AuditEvent[];
  documentStatus: "AI Draft" | "In review" | "Approved";
  setDocumentStatus: (status: "AI Draft" | "In review" | "Approved") => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

const defaultQuestions: Question[] = [
  {
    id: 1,
    vendor: "PT Borneo Jaya Utama",
    clause: "RKS § 4.2 — Personel",
    category: "Teknis",
    question: "Apakah sertifikasi pengemudi defensif dapat dipenuhi maksimal 30 hari setelah kontrak dimulai?",
    answer: "Sertifikasi wajib tersedia sebelum mobilisasi. Bukti dilampirkan pada penawaran teknis.",
    status: "Terjawab",
    time: "09:42 WITA",
  },
  {
    id: 2,
    vendor: "CV Mahakam Perkasa",
    clause: "RKS § 7.1 — TKDN",
    category: "Administrasi",
    question: "Apakah Form B1 dapat diperbarui setelah klarifikasi apabila terdapat koreksi komponen biaya?",
    status: "Dibahas",
    time: "10:08 WITA",
  },
  {
    id: 3,
    vendor: "PT Kutai Energi Logistik",
    clause: "RKS § 9.3 — Pemeliharaan",
    category: "Komersial",
    question: "Mohon konfirmasi apakah biaya preventive maintenance sudah termasuk dalam harga bulanan.",
    answer: "Biaya wajib termasuk dalam harga satuan bulanan dan akan ditegaskan melalui Adendum 01.",
    status: "Menjadi Adendum",
    time: "10:21 WITA",
  },
];

const defaultEvaluations: VendorEvaluation[] = [
  { id: "v1", vendor: "PT Borneo Jaya Utama", initials: "BJ", technical: 88, commercial: 86, tkdn: 34.5, price: 22.45, priceDeviation: -2.4, clarification: "Tidak diperlukan", note: "Dokumen teknis lengkap dan metode kerja terukur." },
  { id: "v2", vendor: "CV Mahakam Perkasa", initials: "MP", technical: 76, commercial: 92, tkdn: 27.8, price: 18.72, priceDeviation: -18.6, clarification: "Menunggu respons", note: "Item maintenance terindikasi di bawah ambang kewajaran." },
  { id: "v3", vendor: "PT Kutai Energi Logistik", initials: "KE", technical: 91, commercial: 81, tkdn: 38.2, price: 23.18, priceDeviation: 0.8, clarification: "Diterima", note: "Skor teknis tertinggi dan bukti TKDN paling lengkap." },
];

const defaultTKDN: TKDNRecord[] = [
  { id: "v1", vendor: "PT Borneo Jaya Utama", domestic: 7.74, foreign: 14.71, evidence: 4, verified: true },
  { id: "v2", vendor: "CV Mahakam Perkasa", domestic: 5.20, foreign: 13.52, evidence: 2, verified: false },
  { id: "v3", vendor: "PT Kutai Energi Logistik", domestic: 8.85, foreign: 14.33, evidence: 5, verified: true },
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [module, setModule] = useState<ModuleId>("overview");
  const [questions, setQuestions] = useState(defaultQuestions);
  const [evaluations, setEvaluations] = useState(defaultEvaluations);
  const [tkdnRecords, setTkdnRecords] = useState(defaultTKDN);
  const [documentStatus, setDocumentStatus] = useState<"AI Draft" | "In review" | "Approved">("AI Draft");
  const [audit, setAudit] = useState<AuditEvent[]>([
    { id: 1, actor: "Nadia Prameswari", action: "memverifikasi bukti", object: "TKDN PT Borneo Jaya Utama", time: "Hari ini, 10:31" },
    { id: 2, actor: "Budi Hartono", action: "menandai keputusan", object: "Q&A RKS § 9.3 sebagai Adendum 01", time: "Hari ini, 10:24" },
    { id: 3, actor: "AI Document Assistant", action: "membuat versi 0.3", object: "Draf BA Pre-Bid", time: "Hari ini, 10:22" },
  ]);

  const log = (actor: string, action: string, object: string) => {
    setAudit((items) => [{ id: Date.now(), actor, action, object, time: "Baru saja" }, ...items].slice(0, 12));
  };

  const addQuestion = (input: Pick<Question, "clause" | "category" | "question">) => {
    setQuestions((items) => [...items, { ...input, id: Date.now(), vendor: "PT Borneo Jaya Utama", status: "Masuk", time: "Baru saja" }]);
    log("PT Borneo Jaya Utama", "mengajukan pertanyaan", input.clause);
  };

  const answerQuestion = (id: number, answer: string, asAddendum: boolean) => {
    const item = questions.find((question) => question.id === id);
    setQuestions((items) => items.map((question) => question.id === id ? { ...question, answer, status: asAddendum ? "Menjadi Adendum" : "Terjawab" } : question));
    log("Budi Hartono", asAddendum ? "menandai sebagai adendum" : "menjawab pertanyaan", item?.clause ?? "Pre-Bid");
  };

  const updateScore = (id: string, score: number) => {
    setEvaluations((items) => items.map((item) => item.id === id ? { ...item, technical: score } : item));
    const vendor = evaluations.find((item) => item.id === id)?.vendor ?? "vendor";
    log("Nadia Prameswari", "memperbarui skor teknis", vendor);
  };

  const updateTKDN = (id: string, domestic: number, foreign: number) => {
    setTkdnRecords((items) => items.map((item) => item.id === id ? { ...item, domestic, foreign, verified: false } : item));
    log("Vendor", "memperbarui komponen TKDN", tkdnRecords.find((item) => item.id === id)?.vendor ?? "vendor");
  };

  const verifyTKDN = (id: string) => {
    setTkdnRecords((items) => items.map((item) => item.id === id ? { ...item, verified: true } : item));
    log("Nadia Prameswari", "memverifikasi bukti TKDN", tkdnRecords.find((item) => item.id === id)?.vendor ?? "vendor");
  };

  const value = { module, setModule, questions, addQuestion, answerQuestion, evaluations, updateScore, tkdnRecords, updateTKDN, verifyTKDN, audit, documentStatus, setDocumentStatus };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used inside ProjectProvider");
  return context;
}
