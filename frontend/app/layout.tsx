import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PandemicSafe - Stay Safe During Pandemics",
  description: "AI-powered pandemic risk assessment and safe navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Center the content by constraining max width and auto margins */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

