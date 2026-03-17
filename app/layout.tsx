import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://scaniya.alphaprime.co.in"),
  title: {
    default: "Scaniya — Dynamic QR Code Platform",
    template: "%s | Scaniya",
  },
  description:
    "Create, customize, and track dynamic QR codes with Scaniya. The ultimate free QR code generator with logo support and real-time analytics.",
  keywords: [
    "free QR code generator",
    "dynamic QR code",
    "custom QR code",
    "QR code with logo",
    "trackable QR code",
    "QR code analytics",
    "scaniya",
  ],
  authors: [{ name: "Scaniya Team" }],
  creator: "Scaniya",
  publisher: "Scaniya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Scaniya — Dynamic QR Code Platform",
    description: "Create, customize, and track dynamic QR codes with logo support and analytics.",
    url: "https://scaniya.alphaprime.co.in",
    siteName: "Scaniya",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or I should create/ask for it
        width: 1200,
        height: 630,
        alt: "Scaniya - Dynamic QR Code Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scaniya — Dynamic QR Code Platform",
    description: "Create, customize, and track dynamic QR codes with logo support and real-time analytics.",
    images: ["/og-image.png"],
    creator: "@scaniya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_PLACEHOLDER",
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
