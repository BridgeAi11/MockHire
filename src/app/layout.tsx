import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MockHire — Company-Pattern Placement Assessment & Readiness Platform",
  description: "Practice smarter. Assess fairly. Get placement-ready with curated company-pattern placement assessments built for engineering students and colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
