"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Unlock } from "lucide-react";

interface DesignCustomizerProps {
  design: {
    size: number;
    fgColor: string;
    bgColor: string;
    logoUrl?: string;
  };
  onChange: (design: any) => void;
  isPro: boolean;
}

export function DesignCustomizer({ design, onChange, isPro }: DesignCustomizerProps) {
  const update = (key: string, value: any) => {
    onChange({ ...design, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">QR Size</Label>
          <span className="text-sm text-muted-foreground font-mono">{design.size}px</span>
        </div>
        <Slider
          min={100}
          max={500}
          step={10}
          value={[design.size]}
          onValueChange={([val]) => update("size", val)}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100px</span>
          <span>500px</span>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Foreground Color</Label>
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <input
              type="color"
              value={design.fgColor}
              onChange={(e) => update("fgColor", e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-sm font-mono text-muted-foreground">{design.fgColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <input
              type="color"
              value={design.bgColor}
              onChange={(e) => update("bgColor", e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-sm font-mono text-muted-foreground">{design.bgColor}</span>
          </div>
        </div>
      </div>

      {/* Logo URL (Currently Free for all) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Logo URL</Label>
          {!isPro && (
            <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white border-0 gap-1 text-xs font-semibold">
              <Unlock className="w-3 h-3" />
              Now Free
            </Badge>
          )}
        </div>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://example.com/logo.png"
            value={design.logoUrl ?? ""}
            onChange={(e) => update("logoUrl", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
