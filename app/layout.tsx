import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Scaniya — Dynamic QR Code Platform",
  description:
    "Create, customize, and track dynamic QR codes. One Scan, Infinite Possibilities.",
  keywords: ["QR code", "dynamic QR", "QR generator", "scaniya", "QR analytics"],
  openGraph: {
    title: "Scaniya — Dynamic QR Code Platform",
    description: "One Scan, Infinite Possibilities",
    url: "https://scaniya.alphaprime.co.in",
    siteName: "Scaniya",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
