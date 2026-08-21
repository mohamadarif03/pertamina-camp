import Link from "next/link";

const roles = [
  { href: "/panitia", code: "01", title: "Panitia / Buyer", description: "Kelola pre-bid, keputusan, draf BA, konsolidasi evaluasi, dan LHP.", accent: "blue", initials: "PB" },
  { href: "/evaluator", code: "02", title: "Tim Evaluator", description: "Bandingkan penawaran, beri skor, klarifikasi harga, dan verifikasi TKDN.", accent: "red", initials: "EV" },
  { href: "/vendor", code: "03", title: "Vendor", description: "Ajukan pertanyaan berbasis pasal dan perbarui komponen serta bukti TKDN.", accent: "green", initials: "VD" },
  { href: "/approver", code: "04", title: "Approver", description: "Review sumber, diff, audit trail, lalu setujui atau kembalikan dokumen.", accent: "purple", initials: "AP" },
];

export default function Portal() {
  return <main className="portal">
    <header className="portal-header"><div className="brand-lockup"><div className="brand-mark">P</div><div><strong>TenderFlow AI</strong><span>Pertamina Camp 2026</span></div></div><div className="scope-lock"><span>PROYEK 2</span><strong>D5 · D6 · D7 · D8</strong></div></header>
    <section className="portal-hero"><div className="portal-copy"><span className="eyebrow light">DIGITAL TENDER COLLABORATION</span><h1>Dari percakapan<br/>menjadi keputusan.</h1><p>Workspace kolaborasi tender dan otomasi dokumen yang menjaga setiap pertanyaan, evaluasi, TKDN, serta dokumen tetap terhubung dan dapat diaudit.</p><div className="hero-modules"><span>D5 <b>Pre-Bid</b></span><span>D6 <b>Evaluation</b></span><span>D7 <b>TKDN</b></span><span>D8 <b>Smart Docs</b></span></div><Link href="/workspace" className="hero-workspace-link">Lihat Tender Decision Workspace <span>→</span></Link></div><div className="portal-visual"><div className="signal-card one"><span>Q&A TERHUBUNG</span><strong>RKS § 9.3</strong><p>Keputusan tercatat dalam Adendum 01</p></div><div className="signal-card two"><span>TKDN REAL-TIME</span><strong>34.5%</strong><p>+4.5% di atas target tender</p></div><div className="signal-card three"><span>AI DRAFT</span><strong>BA · v0.3</strong><p>3 sumber terverifikasi</p></div><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core-mark">P2</div></div></section>
    <section className="role-section"><div className="section-title"><div><span className="eyebrow">PILIH SUDUT PANDANG</span><h2>Masuk ke workspace demo</h2></div><p>Semua peran bekerja pada tender dan sumber data yang sama.</p></div><div className="role-grid">{roles.map((role) => <Link href={role.href} className={`role-card ${role.accent}`} key={role.href}><div className="role-card-top"><span>{role.code}</span><div>{role.initials}</div></div><h3>{role.title}</h3><p>{role.description}</p><b>Buka workspace <span>→</span></b></Link>)}</div></section>
    <footer className="portal-footer"><span>PT Pertamina Patra Niaga Regional Kalimantan × FILKOM UB</span><span>Prototype kompetisi · Data demonstrasi</span></footer>
  </main>;
}
