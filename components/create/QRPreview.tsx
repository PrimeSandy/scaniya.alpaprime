import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRPreviewProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  logoUrl?: string;
  overlayType: "none" | "text" | "image";
  centerText: string;
  centerTextColor: string;
  centerShape: "square" | "circle" | "rounded";
  centerSize: number;
}

export interface QRPreviewRef {
  download: (filename?: string) => void;
}

export const QRPreview = forwardRef<QRPreviewRef, QRPreviewProps>(
  ({ value, size, fgColor, bgColor, logoUrl, overlayType, centerText, centerTextColor, centerShape, centerSize }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<QRCodeStyling | null>(null);

    useImperativeHandle(ref, () => ({
      download: (filename = "qrcode") => {
        if (qrRef.current) {
          qrRef.current.download({ name: filename, extension: "png" });
        }
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: value || "https://scaniya.alphaprime.co.in",
        dotsOptions: { color: fgColor, type: "rounded" },
        backgroundOptions: { color: bgColor },
        imageOptions: { crossOrigin: "anonymous", margin: 4 },
        cornersSquareOptions: { type: "extra-rounded", color: fgColor },
        cornersDotOptions: { type: "dot", color: fgColor },
      });

      containerRef.current.innerHTML = "";
      qrRef.current.append(containerRef.current);
    }, []);

    useEffect(() => {
      if (!qrRef.current) return;

      const options: any = {
        data: value || "https://scaniya.alphaprime.co.in",
        width: size,
        height: size,
        dotsOptions: { color: fgColor, type: "rounded" },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { type: "extra-rounded", color: fgColor },
        cornersDotOptions: { type: "dot", color: fgColor },
      };

      // Handle Overlay
      if (overlayType === "none") {
        options.image = "";
      } else if (overlayType === "image" && logoUrl) {
        options.image = logoUrl;
        options.imageOptions = {
          crossOrigin: "anonymous",
          margin: 4,
          imageSize: centerSize / 100,
        };
      } else if (overlayType === "text" && centerText) {
        // Render text to a data URL
        const canvas = document.createElement("canvas");
        const s = 200;
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw Shape Background
          ctx.fillStyle = bgColor;
          if (centerShape === "circle") {
            ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = fgColor; ctx.lineWidth = 4; ctx.stroke();
          } else if (centerShape === "rounded") {
            ctx.beginPath(); ctx.roundRect(0, 0, s, s, s * 0.28); ctx.fill();
            ctx.strokeStyle = fgColor; ctx.lineWidth = 4; ctx.stroke();
          } else {
            ctx.fillRect(0, 0, s, s);
            ctx.strokeStyle = fgColor; ctx.lineWidth = 4; ctx.strokeRect(0, 0, s, s);
          }

          // Draw Text
          const txt = centerText.toUpperCase();
          const fs = txt.length === 1 ? s * 0.52 : txt.length <= 3 ? s * 0.3 : txt.length <= 6 ? s * 0.2 : s * 0.15;
          ctx.fillStyle = centerTextColor;
          ctx.font = `bold ${fs}px Inter, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(txt, s / 2, s / 2 + 2);
          
          options.image = canvas.toDataURL();
          options.imageOptions = {
            crossOrigin: "anonymous",
            margin: 2,
            imageSize: centerSize / 100,
          };
        }
      }

      qrRef.current.update(options);
    }, [value, size, fgColor, bgColor, logoUrl, overlayType, centerText, centerTextColor, centerShape, centerSize]);

    return (
      <div className="flex flex-col items-center gap-6 p-2">
        <div
          className="rounded-3xl p-6 shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl -z-10 group-hover:from-primary/10 transition-colors" />
          <div ref={containerRef} className="rounded-xl overflow-hidden shadow-inner" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider animate-pulse">
            Live Preview · High Quality
          </p>
          <p className="text-[9px] text-muted-foreground/60">
            Design automatically saved to scan engine
          </p>
        </div>
      </div>
    );
  }
);
