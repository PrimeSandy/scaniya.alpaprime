"use client";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRPreviewProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  logoUrl?: string;
}

export function QRPreview({ value, size, fgColor, bgColor, logoUrl }: QRPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    qrRef.current = new QRCodeStyling({
      width: size,
      height: size,
      data: value || "https://scaniya.alphaprime.co.in",
      dotsOptions: { color: fgColor, type: "rounded" },
      backgroundOptions: { color: bgColor },
      imageOptions: { crossOrigin: "anonymous", margin: 4 },
      ...(logoUrl ? { image: logoUrl } : {}),
      cornersSquareOptions: { type: "extra-rounded", color: fgColor },
      cornersDotOptions: { type: "dot", color: fgColor },
    });

    ref.current.innerHTML = "";
    qrRef.current.append(ref.current);
  }, []);

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.update({
      data: value || "https://scaniya.alphaprime.co.in",
      width: size,
      height: size,
      dotsOptions: { color: fgColor, type: "rounded" },
      backgroundOptions: { color: bgColor },
      ...(logoUrl ? { image: logoUrl } : { image: "" }),
      cornersSquareOptions: { type: "extra-rounded", color: fgColor },
      cornersDotOptions: { type: "dot", color: fgColor },
    });
  }, [value, size, fgColor, bgColor, logoUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-2xl p-4 shadow-xl border border-border/50"
        style={{ backgroundColor: bgColor }}
      >
        <div ref={ref} />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Updates live as you edit
      </p>
    </div>
  );
}
