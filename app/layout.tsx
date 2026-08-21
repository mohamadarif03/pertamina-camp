import type { Metadata } from "next";
import { ProjectProvider } from "./context/ProjectContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "TenderFlow AI — Proyek 2 Pertamina Camp 2026",
  description: "Digital Tender Collaboration and Intelligent Document Automation untuk Pertamina Patra Niaga Regional Kalimantan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
