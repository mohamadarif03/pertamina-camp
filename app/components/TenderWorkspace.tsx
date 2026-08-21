"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ModuleId, Role, useProject } from "../context/ProjectContext";

const moduleMeta: Record<ModuleId, { code: string; label: string; hint: string }> = {
  overview: { code: "P2", label: "Command Center", hint: "Ringkasan tender aktif" },
  prebid: { code: "D5", label: "Digital Pre-Bid", hint: "Q&A, keputusan, dan BA" },
  evaluation: { code: "D6", label: "Evaluation Hub", hint: "Komparasi dan kolaborasi" },
  tkdn: { code: "D7", label: "TKDN Monitor", hint: "Realisasi dan verifikasi" },
  documents: { code: "D8", label: "Smart Documents", hint: "BA, LHP, dan diff" },
};

const roleNames: Record<Role, string> = {
  panitia: "Panitia / Buyer",
  evaluator: "Tim Evaluator",
  vendor: "Vendor",
  approver: "Approver",
};

export default function TenderWorkspace({ initialRole }: { initialRole: Role }) {
  const project = useProject();
  const [mobileNav, setMobileNav] = useState(false);

  const navigate = (id: ModuleId) => {
    project.setModule(id);
    setMobileNav(false);
  };

  return (
    <div className="workspace-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <button className="mobile-menu" onClick={() => setMobileNav((value) => !value)} aria-label="Buka navigasi">☰</button>
          <Link href="/" className="brand-mark" aria-label="Kembali ke portal">P</Link>
          <div>
            <strong>TenderFlow AI</strong>
            <span>Pertamina Camp 2026 · Proyek 2</span>
          </div>
        </div>
        <div className="tender-selector">
          <span className="live-dot" />
          <div><small>Tender aktif</small><strong>TAD Operasional Distribusi BBM</strong></div>
          <span className="chevron">⌄</span>
        </div>
        <div className="header-actions">
          <button className="icon-button" aria-label="Cari">⌕</button>
          <button className="icon-button notification" aria-label="Notifikasi">◌</button>
          <div className="avatar">{initialRole.slice(0, 2).toUpperCase()}</div>
        </div>
      </header>

      <div className="app-body">
        <aside className={`side-nav ${mobileNav ? "open" : ""}`}>
          <div className="role-block">
            <div className="role-avatar">{initialRole.slice(0, 1).toUpperCase()}</div>
            <div><small>Masuk sebagai</small><strong>{roleNames[initialRole]}</strong></div>
          </div>
          <nav aria-label="Modul Proyek 2">
            {(Object.keys(moduleMeta) as ModuleId[]).map((id) => (
              <button key={id} className={project.module === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)}>
                <span className="module-code">{moduleMeta[id].code}</span>
                <span><strong>{moduleMeta[id].label}</strong><small>{moduleMeta[id].hint}</small></span>
                {id === "prebid" && project.questions.filter((q) => q.status === "Masuk" || q.status === "Dibahas").length > 0 && <b className="nav-count">{project.questions.filter((q) => q.status === "Masuk" || q.status === "Dibahas").length}</b>}
              </button>
            ))}
          </nav>
          <div className="scope-card">
            <span>Ruang lingkup terkunci</span>
            <strong>D5 · D6 · D7 · D8</strong>
            <p>Seluruh modul berada dalam batas resmi Proyek 2.</p>
          </div>
          <Link href="/" className="switch-role">⇄ Ganti peran demo</Link>
        </aside>

        <main className="workspace-main">
          {project.module === "overview" && <Overview onOpen={navigate} />}
          {project.module === "prebid" && <PreBid role={initialRole} />}
          {project.module === "evaluation" && <Evaluation role={initialRole} />}
          {project.module === "tkdn" && <TKDN role={initialRole} />}
          {project.module === "documents" && <Documents role={initialRole} />}
        </main>
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Overview({ onOpen }: { onOpen: (id: ModuleId) => void }) {
  const { questions, evaluations, tkdnRecords, audit, documentStatus } = useProject();
  const answered = questions.filter((q) => q.status === "Terjawab" || q.status === "Menjadi Adendum").length;
  const avgTkdn = tkdnRecords.reduce((sum, item) => sum + item.domestic / (item.domestic + item.foreign) * 100, 0) / tkdnRecords.length;
  return <>
    <PageIntro eyebrow="Project 2 · Live workspace" title="Satu keputusan, satu jejak, satu dokumen." description="Kolaborasi tender dari pre-bid hingga LHP—terhubung, terukur, dan siap diaudit." action={<button className="primary-button" onClick={() => onOpen("documents")}>Buka draf terbaru →</button>} />
    <section className="hero-status">
      <div><span className="status-kicker">TENDER ID · PPN-KAL/2026/042</span><h2>Jasa TAD Operasional Distribusi BBM Regional Kalimantan</h2><p>Metode tender terbuka · 3 vendor · Tahap evaluasi penawaran</p></div>
      <div className="readiness"><div className="readiness-ring"><strong>74</strong><span>%</span></div><div><small>Kesiapan keputusan</small><strong>2 item perlu tindakan</strong></div></div>
    </section>
    <div className="metric-grid">
      <Metric code="D5" value={`${answered}/${questions.length}`} label="Q&A terselesaikan" tone="blue" />
      <Metric code="D6" value={`${evaluations.length}`} label="Vendor dievaluasi" tone="red" />
      <Metric code="D7" value={`${avgTkdn.toFixed(1)}%`} label="Rata-rata TKDN" tone="green" />
      <Metric code="D8" value="v0.3" label={`BA · ${documentStatus}`} tone="purple" />
    </div>
    <div className="content-grid two-one">
      <section className="panel flow-panel"><div className="panel-heading"><div><span className="eyebrow">ALUR TERPADU</span><h3>Progress Proyek 2</h3></div><span className="soft-badge">Live</span></div>
        <div className="flow-list">
          {[
            ["D5", "Pre-Bid & BA", "3 pertanyaan · 1 adendum", "prebid", "done"],
            ["D6", "Evaluation Hub", "1 klarifikasi masih terbuka", "evaluation", "active"],
            ["D7", "Verifikasi TKDN", "2 dari 3 vendor terverifikasi", "tkdn", "active"],
            ["D8", "LHP & approval", "Draf v0.2 belum diajukan", "documents", "pending"],
          ].map(([code, label, detail, id, state], index) => <button key={code} className="flow-item" onClick={() => onOpen(id as ModuleId)}><span className={`flow-node ${state}`}>{index + 1}</span><span><strong>{code} · {label}</strong><small>{detail}</small></span><b>→</b></button>)}
        </div>
      </section>
      <section className="panel audit-panel"><div className="panel-heading"><div><span className="eyebrow">AUDIT TRAIL</span><h3>Aktivitas terbaru</h3></div></div>
        <div className="audit-list">{audit.slice(0, 4).map((item) => <div className="audit-item" key={item.id}><span className="audit-dot"/><p><strong>{item.actor}</strong> {item.action} <b>{item.object}</b><small>{item.time}</small></p></div>)}</div>
      </section>
    </div>
  </>;
}

function Metric({ code, value, label, tone }: { code: string; value: string; label: string; tone: string }) {
  return <div className={`metric-card ${tone}`}><span className="metric-code">{code}</span><strong>{value}</strong><p>{label}</p></div>;
}

function PreBid({ role }: { role: Role }) {
  const { questions, addQuestion, answerQuestion } = useProject();
  const [selected, setSelected] = useState(questions[1]?.id ?? questions[0].id);
  const [clause, setClause] = useState("RKS § 6.2 — Jadwal Mobilisasi");
  const [category, setCategory] = useState<"Teknis" | "Komersial" | "Administrasi">("Teknis");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const current = questions.find((item) => item.id === selected) ?? questions[0];
  const submit = (event: FormEvent) => { event.preventDefault(); if (!question.trim()) return; addQuestion({ clause, category, question }); setQuestion(""); };
  const canAnswer = role === "panitia";
  return <>
    <PageIntro eyebrow="D5 · Digital Pre-Bid" title="Semua pertanyaan terhubung ke keputusan." description="Forum Aanwijzing terstruktur dengan jejak pasal, status, adendum, dan draf BA otomatis." action={<div className="session-live"><span className="live-dot"/> Sesi dibuka · 42 menit</div>} />
    <div className="content-grid prebid-layout">
      <section className="panel question-panel"><div className="panel-heading"><div><span className="eyebrow">FORUM RESMI</span><h3>Pertanyaan vendor</h3></div><span className="soft-badge">{questions.length} total</span></div>
        <div className="filter-row"><button className="filter active">Semua</button><button className="filter">Belum selesai</button><button className="filter">Adendum</button></div>
        <div className="question-list">{questions.map((item) => <button key={item.id} className={selected === item.id ? "question-row selected" : "question-row"} onClick={() => setSelected(item.id)}><div className="vendor-chip">{item.vendor.split(" ").slice(-2).map((x) => x[0]).join("")}</div><div><span><b>{item.vendor}</b><small>{item.time}</small></span><strong>{item.question}</strong><p>{item.clause} · {item.category}</p></div><em className={`status ${item.status.replaceAll(" ", "-").toLowerCase()}`}>{item.status}</em></button>)}</div>
      </section>
      <section className="panel detail-panel"><div className="detail-top"><span className={`status ${current.status.replaceAll(" ", "-").toLowerCase()}`}>{current.status}</span><small>{current.time}</small></div><span className="clause-chip">{current.clause}</span><h2>{current.question}</h2><p className="vendor-name">Diajukan oleh <strong>{current.vendor}</strong> · {current.category}</p>
        {current.answer && <div className="official-answer"><span>JAWABAN RESMI PANITIA</span><p>{current.answer}</p>{current.status === "Menjadi Adendum" && <b>↳ Tercatat dalam Adendum 01</b>}</div>}
        {canAnswer && !current.answer && <div className="answer-box"><label>Jawaban resmi</label><textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Tulis jawaban yang akan masuk ke Berita Acara..."/><div><button className="secondary-button" onClick={() => answer && answerQuestion(current.id, answer, true)}>Jadikan adendum</button><button className="primary-button" onClick={() => answer && answerQuestion(current.id, answer, false)}>Kirim jawaban</button></div></div>}
        {role === "vendor" && <form className="ask-box" onSubmit={submit}><div><label>Rujukan pasal</label><input value={clause} onChange={(e) => setClause(e.target.value)} /></div><div><label>Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}><option>Teknis</option><option>Komersial</option><option>Administrasi</option></select></div><label>Pertanyaan baru</label><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ajukan pertanyaan yang spesifik dan dapat ditelusuri..."/><button className="primary-button">Ajukan pertanyaan</button></form>}
        {!canAnswer && role !== "vendor" && <div className="read-only-note">Mode review · Pertanyaan dan keputusan hanya dapat diubah oleh Panitia.</div>}
      </section>
    </div>
  </>;
}

function Evaluation({ role }: { role: Role }) {
  const { evaluations, updateScore } = useProject();
  const canScore = role === "evaluator";
  return <>
    <PageIntro eyebrow="D6 · Evaluation Collaboration Hub" title="Bandingkan bukti, bukan sekadar angka." description="Matriks bersama untuk melihat deviasi harga, skor, klarifikasi, dan alasan keputusan." action={<button className="secondary-button">Lihat rubrik · 60/40</button>} />
    <section className="panel evaluation-table-panel"><div className="panel-heading"><div><span className="eyebrow">MATRIX VIEW</span><h3>Perbandingan vendor</h3></div><div className="evaluator-stack"><span>NP</span><span>RA</span><span>+2</span><small>4 evaluator aktif</small></div></div>
      <div className="responsive-table"><table className="evaluation-table"><thead><tr><th>Vendor</th><th>Teknis</th><th>Komersial</th><th>TKDN</th><th>Penawaran</th><th>Deviasi OE</th><th>Klarifikasi</th><th>Nilai akhir</th></tr></thead><tbody>{evaluations.map((item) => { const total = item.technical * .6 + item.commercial * .4; return <tr key={item.id}><td><div className="vendor-cell"><span>{item.initials}</span><div><strong>{item.vendor}</strong><small>{item.note}</small></div></div></td><td>{canScore ? <input className="score-input" type="number" min="0" max="100" value={item.technical} onChange={(e) => updateScore(item.id, Number(e.target.value))}/> : <b>{item.technical}</b>}</td><td><b>{item.commercial}</b></td><td><b>{item.tkdn}%</b></td><td>Rp {item.price.toFixed(2)} M</td><td><span className={item.priceDeviation < -15 ? "deviation danger" : "deviation safe"}>{item.priceDeviation > 0 ? "+" : ""}{item.priceDeviation}%</span></td><td><span className={`clarification ${item.clarification === "Menunggu respons" ? "waiting" : ""}`}>{item.clarification}</span></td><td><strong className="final-score">{total.toFixed(1)}</strong></td></tr>})}</tbody></table></div>
    </section>
    <div className="content-grid two-one"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">HARGA TIMPANG</span><h3>Klarifikasi aktif</h3></div><span className="danger-badge">1 perlu tindakan</span></div><div className="anomaly-card"><div className="anomaly-value">−55%</div><div><strong>Maintenance kendaraan · CV Mahakam Perkasa</strong><p>Rp 900 ribu dibanding OE Rp 2 juta. Respons vendor belum diterima.</p></div><button className="secondary-button">Buka klarifikasi</button></div></section><section className="panel decision-card"><span className="eyebrow">KONSOLIDASI</span><h3>Belum siap dikunci</h3><p>Selesaikan klarifikasi harga dan verifikasi TKDN vendor sebelum membuat LHP.</p><div className="mini-progress"><span style={{ width: "72%" }}/></div><small>72% lengkap</small></section></div>
  </>;
}

function TKDN({ role }: { role: Role }) {
  const { tkdnRecords, updateTKDN, verifyTKDN } = useProject();
  const [editing, setEditing] = useState<string | null>(null);
  const target = 30;
  return <>
    <PageIntro eyebrow="D7 · Real-Time TKDN Monitoring" title="TKDN terlihat sampai ke komponennya." description="Realisasi berbobot, bukti pendukung, gap target, dan status verifikasi dalam satu layar." action={<span className="target-pill">Target tender · {target}%</span>} />
    <div className="tkdn-grid">{tkdnRecords.map((item) => { const percentage = item.domestic / (item.domestic + item.foreign) * 100; const gap = percentage - target; return <section className="panel tkdn-card" key={item.id}><div className="tkdn-card-top"><div className="vendor-cell"><span>{item.vendor.split(" ").slice(-2).map((x) => x[0]).join("")}</span><div><strong>{item.vendor}</strong><small>{item.evidence} bukti terlampir</small></div></div><span className={item.verified ? "verified" : "unverified"}>{item.verified ? "Terverifikasi" : "Perlu verifikasi"}</span></div><div className="tkdn-score"><strong>{percentage.toFixed(1)}%</strong><span className={gap >= 0 ? "positive" : "negative"}>{gap >= 0 ? "+" : ""}{gap.toFixed(1)}% dari target</span></div><div className="stacked-bar"><span style={{ width: `${percentage}%` }}/><i style={{ left: `${target}%` }}/></div><div className="component-split"><div><small>Komponen DN</small><strong>Rp {item.domestic.toFixed(2)} M</strong></div><div><small>Komponen LN</small><strong>Rp {item.foreign.toFixed(2)} M</strong></div></div>{editing === item.id ? <TKDNEditor item={item} onSave={(dn, ln) => { updateTKDN(item.id, dn, ln); setEditing(null); }}/>:<div className="tkdn-actions">{role === "vendor" && <button className="secondary-button" onClick={() => setEditing(item.id)}>Perbarui komponen</button>}{role === "evaluator" && !item.verified && <button className="primary-button" onClick={() => verifyTKDN(item.id)}>Verifikasi bukti</button>}<button className="text-button">Lihat breakdown →</button></div>}</section>})}</div>
    <section className="panel evidence-panel"><div className="panel-heading"><div><span className="eyebrow">EVIDENCE CENTER</span><h3>Kelengkapan bukti TKDN</h3></div><span className="soft-badge">11 dokumen</span></div><div className="evidence-row"><span className="file-icon">A1</span><div><strong>Rekapitulasi capaian TKDN</strong><small>Form A1 · diperbarui 18 menit lalu</small></div><span className="verified">Valid</span></div><div className="evidence-row"><span className="file-icon">B1</span><div><strong>Rincian biaya jasa</strong><small>Form B1 · 1 koreksi menunggu vendor</small></div><span className="unverified">Review</span></div></section>
  </>;
}

function TKDNEditor({ item, onSave }: { item: { domestic: number; foreign: number }; onSave: (dn: number, ln: number) => void }) {
  const [dn, setDn] = useState(item.domestic); const [ln, setLn] = useState(item.foreign);
  return <div className="inline-editor"><label>Nilai DN (M)<input type="number" step="0.01" value={dn} onChange={(e) => setDn(Number(e.target.value))}/></label><label>Nilai LN (M)<input type="number" step="0.01" value={ln} onChange={(e) => setLn(Number(e.target.value))}/></label><button className="primary-button" onClick={() => onSave(dn, ln)}>Simpan</button></div>;
}

function Documents({ role }: { role: Role }) {
  const { questions, evaluations, tkdnRecords, documentStatus, setDocumentStatus } = useProject();
  const [document, setDocument] = useState<"BA" | "LHP">("BA");
  const answered = questions.filter((q) => q.answer);
  const average = evaluations.reduce((sum, item) => sum + item.technical * .6 + item.commercial * .4, 0) / evaluations.length;
  const sources = useMemo(() => document === "BA" ? [`${questions.length} Q&A Pre-Bid`, "Daftar hadir digital", "Adendum 01"] : [`${evaluations.length} matriks evaluasi`, `${tkdnRecords.length} kalkulasi TKDN`, "1 klarifikasi harga"], [document, questions.length, evaluations.length, tkdnRecords.length]);
  return <>
    <PageIntro eyebrow="D8 · Intelligent Document Automation" title="AI menyusun. Manusia memutuskan." description="Draf dokumen berbasis data tender dengan sumber, perubahan, versi, dan approval yang terlihat." action={<div className="document-tabs"><button className={document === "BA" ? "active" : ""} onClick={() => setDocument("BA")}>Berita Acara</button><button className={document === "LHP" ? "active" : ""} onClick={() => setDocument("LHP")}>LHP</button></div>} />
    <div className="content-grid document-layout"><aside className="panel source-panel"><div className="panel-heading"><div><span className="eyebrow">SOURCES</span><h3>Data yang digunakan</h3></div></div>{sources.map((source, index) => <div className="source-row" key={source}><span>{index + 1}</span><div><strong>{source}</strong><small>Disinkronkan · hari ini</small></div><b>✓</b></div>)}<div className="ai-guardrail"><strong>Human-in-the-loop</strong><p>AI tidak dapat menerbitkan dokumen atau menentukan pemenang.</p></div></aside>
      <section className="document-canvas"><div className="document-toolbar"><div><span className="ai-badge">AI DRAFT</span><strong>{document === "BA" ? "BA Pre-Bid · v0.3" : "LHP Tender · v0.2"}</strong></div><div><button className="secondary-button">Bandingkan versi</button>{role === "approver" ? <button className="primary-button" onClick={() => setDocumentStatus("Approved")}>Setujui dokumen</button> : <button className="primary-button" onClick={() => setDocumentStatus("In review")}>Kirim untuk review</button>}</div></div><article className="paper"><header><div className="paper-logo">PERTAMINA</div><small>PT PERTAMINA PATRA NIAGA<br/>REGIONAL KALIMANTAN</small></header>{document === "BA" ? <><h2>BERITA ACARA PENJELASAN TENDER</h2><h3>Nomor: BA-042/PPN-KAL/2026</h3><p>Pada hari ini telah dilaksanakan rapat penjelasan tender untuk pekerjaan <strong>Jasa TAD Operasional Distribusi BBM Regional Kalimantan</strong>.</p><h4>I. HASIL PEMBAHASAN</h4>{answered.map((q, index) => <div className="paper-section" key={q.id}><b>{index + 1}. {q.clause}</b><p><strong>Pertanyaan:</strong> {q.question}</p><p><strong>Keputusan:</strong> {q.answer}</p>{q.status === "Menjadi Adendum" && <span>Masuk Adendum 01</span>}</div>)}<h4>II. ACTION ITEMS</h4><p>{questions.length - answered.length} pertanyaan masih memerlukan jawaban tertulis sebelum BA difinalisasi.</p></> : <><h2>LAPORAN HASIL PEMILIHAN</h2><h3>Draft konsolidasi evaluasi</h3><p>Evaluasi dilakukan terhadap {evaluations.length} vendor menggunakan bobot teknis 60% dan komersial 40%, dengan verifikasi TKDN sebagai kontrol kepatuhan.</p><h4>I. RINGKASAN EVALUASI</h4><div className="paper-highlight"><span>Rata-rata skor gabungan</span><strong>{average.toFixed(1)}</strong></div><h4>II. TEMUAN MATERIAL</h4><p>CV Mahakam Perkasa memiliki satu item dengan deviasi −55% terhadap OE. Rekomendasi pemenang belum dapat dikunci sampai klarifikasi diterima.</p><h4>III. TKDN</h4><p>Dua dari tiga vendor telah memiliki bukti TKDN terverifikasi. Satu vendor masih memerlukan koreksi Form B1.</p></>}</article></section>
      <aside className="panel review-panel"><div className="panel-heading"><div><span className="eyebrow">REVIEW</span><h3>Status dokumen</h3></div></div><div className="review-status"><span className="version-icon">v</span><div><strong>{documentStatus}</strong><small>Versi 0.{document === "BA" ? "3" : "2"}</small></div></div><div className="review-check"><span>✓</span><p><strong>Sumber terhubung</strong><small>{sources.length} sumber tervalidasi</small></p></div><div className="review-check warning"><span>!</span><p><strong>Perlu perhatian</strong><small>{document === "BA" ? "1 Q&A belum selesai" : "1 klarifikasi harga terbuka"}</small></p></div><label className="review-label">Catatan reviewer<textarea placeholder="Tambahkan arahan revisi..."/></label></aside>
    </div>
  </>;
}
