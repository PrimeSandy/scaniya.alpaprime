"use client";

import React, { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { GradientConfig } from "./QRStyled";

interface QRGradientPickerProps {
  value: string;
  onChange: (config: GradientConfig) => void;
}

const PRESETS = [
  { name: "Ocean", colors: ["#00DDB4", "#0066FF"], direction: "horizontal" as const },
  { name: "Sunset", colors: ["#FF6B35", "#FF0080", "#7B00FF"], direction: "diagonal" as const },
  { name: "Gold", colors: ["#FFB300", "#FF6B00"], direction: "vertical" as const },
  { name: "Scaniya", colors: ["#00DDB4", "#0C0F14", "#00DDB4"], direction: "horizontal" as const },
];

export const QRGradientPicker: React.FC<QRGradientPickerProps> = ({ value, onChange }) => {
  const [direction, setDirection] = useState<"horizontal" | "vertical" | "diagonal">("horizontal");
  const [colors, setColors] = useState<string[]>(["#00DDB4", "#0066FF"]);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const renderPreview = useCallback(async () => {
    if (!value) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
      const { modules } = qr;
      const count = modules.size;
      const cell = 500 / count;

      const gradMap = {
        horizontal: ctx.createLinearGradient(0, 0, 500, 0),
        vertical: ctx.createLinearGradient(0, 0, 0, 500),
        diagonal: ctx.createLinearGradient(0, 0, 500, 500),
      };

      const grad = gradMap[direction];
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 500, 500);

      ctx.fillStyle = grad;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (modules.get(r, c)) {
            ctx.fillRect(c * cell, r * cell, cell, cell);
          }
        }
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("QR Render Error:", err);
    }
  }, [value, colors, direction]);

  useEffect(() => {
    const timer = setTimeout(renderPreview, 300);
    return () => clearTimeout(timer);
  }, [value, colors, direction, renderPreview]);

  // Removed the useEffect that blindly called onChange to prevent infinite React update loops.
  // Instead, onChange will only be manually dispatched inside user-interaction handlers.
  
  // Note: If you want to initialize the parent with the default gradient, do it once on mount:
  useEffect(() => {
    onChange({ direction, colors });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDirection = (dir: "horizontal" | "vertical" | "diagonal") => {
    setDirection(dir);
    onChange({ direction: dir, colors });
  };

  const addColor = () => {
    if (colors.length < 5) {
      const newColors = [...colors, "#000000"];
      setColors(newColors);
      onChange({ direction, colors: newColors });
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      onChange({ direction, colors: newColors });
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
    onChange({ direction, colors: newColors });
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = "qr-gradient.png";
    link.href = previewUrl;
    link.click();
  };

  return (
    <div className="bg-[#0C0F14] p-6 rounded-2xl text-white space-y-6 max-w-lg w-full">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">Direction:</label>
          <div className="flex gap-2">
            {(["horizontal", "vertical", "diagonal"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => updateDirection(dir)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                  direction === dir
                    ? "bg-[#00DDB4] text-black font-bold"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">Color stops:</label>
          <div className="flex flex-wrap gap-3 items-center">
            {colors.map((color, i) => (
              <div key={i} className="relative group">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                {colors.length > 2 && (
                  <button
                    onClick={() => removeColor(i)}
                    className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {colors.length < 5 && (
              <button
                onClick={addColor}
                className="w-10 h-10 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-xl hover:border-[#00DDB4] hover:text-[#00DDB4] transition-colors"
              >
                +
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">Presets:</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setColors(preset.colors);
                  setDirection(preset.direction);
                  onChange({ direction: preset.direction, colors: preset.colors });
                }}
                className="px-3 py-1 rounded-full border border-white/10 text-xs hover:border-[#00DDB4] text-white hover:text-[#00DDB4] transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/10">
        <label className="text-sm font-medium text-gray-400 self-start">LIVE QR PREVIEW</label>
        <div className="bg-white p-4 rounded-xl shadow-2xl flex items-center justify-center w-[272px] h-[272px]">
          {previewUrl ? (
            <img src={previewUrl} alt="QR Preview" className="w-[240px] h-[240px]" />
          ) : (
            <div className="w-[240px] h-[240px] bg-gray-100 animate-pulse" />
          )}
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={() => onChange({ direction, colors })}
            className="flex-1 px-4 py-2 bg-[#00DDB4] text-black rounded-xl text-sm font-bold hover:brightness-110 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
