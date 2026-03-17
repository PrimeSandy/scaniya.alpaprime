"use client";
import Link from "next/link";
import { QrCode } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Scaniya</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              One Scan, Infinite Possibilities. Create dynamic QR codes that update anytime — no reprinting needed.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Create QR", href: "/create" },
                { label: "Pricing", href: "/#pricing" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Support", href: "mailto:alphaprime.co.in@gmail.com" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Scaniya. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            scaniya.alphaprime.co.in
          </p>
        </div>
      </div>
    </footer>
  );
}
