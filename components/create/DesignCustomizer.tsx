import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Unlock, LayoutGrid, Circle, Square as SquareIcon, Type, Image as ImageIcon, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesignCustomizerProps {
  design: {
    size: number;
    fgColor: string;
    bgColor: string;
    logoUrl?: string;
    overlayType: "none" | "text" | "image";
    centerText: string;
    centerTextColor: string;
    centerShape: "square" | "circle" | "rounded";
    centerSize: number;
  };
  onChange: (design: any) => void;
  isPro: boolean;
}

const DOT_COLORS = [
  "#6c63ff", "#111827", "#16a34a", "#dc2626", "#ea580c", "#0284c7", "#9ca3af"
];

const TEXT_COLORS = [
  "#6c63ff", "#111827", "#16a34a", "#dc2626", "#ea580c", "#0284c7"
];

export function DesignCustomizer({ design, onChange, isPro }: DesignCustomizerProps) {
  const update = (key: string, value: any) => {
    onChange({ ...design, [key]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Center Overlay Tabs */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Center Overlay
        </Label>
        <div className="flex bg-muted/50 p-1 rounded-xl gap-1">
          {[
            { id: "none", label: "None", icon: Minus },
            { id: "text", label: "Text", icon: Type },
            { id: "image", label: "Logo", icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => update("overlayType", tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                design.overlayType === tab.id
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Sections */}
      {design.overlayType === "none" && (
        <div className="p-4 bg-muted/30 border border-dashed border-border rounded-xl text-center">
          <p className="text-xs text-muted-foreground">Minimal QR code without center overlay.</p>
        </div>
      )}

      {design.overlayType === "text" && (
        <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Overlay Text</Label>
            <Input
              placeholder="e.g. S or AP"
              maxLength={8}
              value={design.centerText}
              onChange={(e) => update("centerText", e.target.value)}
              className="bg-background border-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-medium">Text Color</Label>
            <div className="flex flex-wrap gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update("centerTextColor", c)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-transform active:scale-90",
                    design.centerTextColor === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative group">
                <input
                  type="color"
                  value={design.centerTextColor}
                  onChange={(e) => update("centerTextColor", e.target.value)}
                  className="w-7 h-7 rounded-full cursor-pointer appearance-none bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                />
                <div 
                  className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: design.centerTextColor }}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {design.overlayType === "image" && (
        <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Logo Image</Label>
              <Badge variant="outline" className="text-[10px] py-0 font-normal">Square Recommended</Badge>
            </div>
            <Input
              type="url"
              placeholder="https://example.com/logo.png"
              value={design.logoUrl}
              onChange={(e) => update("logoUrl", e.target.value)}
              className="bg-background border-primary/20 focus:border-primary"
            />
            <p className="text-[10px] text-muted-foreground">Or provide a direct image URL</p>
          </div>
        </div>
      )}

      {/* Center Shape */}
      {design.overlayType !== "none" && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Overlay Shape
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "square", label: "Square", icon: SquareIcon },
              { id: "circle", label: "Circle", icon: Circle },
              { id: "rounded", label: "Rounded", icon: LayoutGrid },
            ].map((sh) => (
              <button
                key={sh.id}
                onClick={() => update("centerShape", sh.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all",
                  design.centerShape === sh.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-muted-foreground/10 hover:border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <sh.icon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">{sh.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Center Size */}
      {design.overlayType !== "none" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Overlay Size
            </Label>
            <span className="text-xs font-bold text-primary">{design.centerSize}%</span>
          </div>
          <Slider
            min={14}
            max={34}
            step={1}
            value={[design.centerSize]}
            onValueChange={([val]) => update("centerSize", val)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>
      )}

      <hr className="border-border/50" />

      {/* QR Dot Color */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          QR Dot Color
        </Label>
        <div className="flex flex-wrap gap-2">
          {DOT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update("fgColor", c)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all active:scale-95 shadow-sm",
                design.fgColor === c ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={design.fgColor}
              onChange={(e) => update("fgColor", e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer appearance-none bg-transparent border-0 opacity-0 absolute inset-0 z-10"
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground"
              style={{ backgroundColor: design.fgColor }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Background
        </Label>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
          <div className="relative">
            <input
              type="color"
              value={design.bgColor}
              onChange={(e) => update("bgColor", e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer appearance-none bg-transparent border-0 opacity-0 absolute inset-0 z-10"
            />
            <div 
              className="w-8 h-8 rounded-lg border border-border shadow-sm"
              style={{ backgroundColor: design.bgColor }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase">{design.bgColor}</span>
        </div>
      </div>
    </div>
  );
}
