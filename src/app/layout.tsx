import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QuizProvider } from "@/contexts/QuizContext";
import { Toaster } from "@/components/ui/sonner"
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
  title: "Quiz A.J Rorato",
  description:
    "Quiz educacional de matemática contextualizado com a empresa A.J Rorato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark `}
        suppressHydrationWarning
      >
        <QuizProvider>
          {children}
          <Toaster position="top-right"/>
        </QuizProvider>
      </body>
    </html>
  );
}
