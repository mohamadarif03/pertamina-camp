import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ProjectProvider } from "./context/ProjectContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pertamina Patra Niaga - Digital Tender & Document Automation",
  description: "Portal Kolaborasi Tender Digital & Otomatisasi Dokumen - Regional Kalimantan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}


