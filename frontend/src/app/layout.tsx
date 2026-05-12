import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iron Lung — Career & Collaboration Platform",
  description:
    "Platform digital untuk menghubungkan mahasiswa dengan peluang karir, proyek kolaborasi, dan mitra industri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
