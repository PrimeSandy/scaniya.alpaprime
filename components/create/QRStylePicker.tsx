"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { GradientConfig, QRStyled, QRStyledRef, ClassicQR, RoundedQR, ColoredQR, BrandedQR } from "./QRStyled";
import { QRGradientPicker } from "./QRGradientPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export type QRFinalConfig = {
  dotStyle: string;
  fgColor: string;
  bgColor: string;
  cornerStyle: string;
  cornerColor: string;
  logo?: string;
  logoSize: number;
  frameStyle: "none" | "scanme" | "brackets";
  gradientConfig?: GradientConfig;
};

interface QRStylePickerProps {
  value: string;
  onStyleChange?: (config: QRFinalConfig) => void;
}

const DOT_STYLE_OPTIONS = ["square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"];
const CORNER_STYLE_OPTIONS = ["square", "dot", "extra-rounded"];

export default function QRStylePicker({ value, onStyleChange }: QRStylePickerProps) {
  const qrRef = useRef<QRStyledRef>(null);

  const [activeTab, setActiveTab] = useState<"style" | "gradient" | "frame">("style");
  const [selectedPreset, setSelectedPreset] = useState<"classic" | "rounded" | "colored" | "branded">("classic");
  
  const [fgColor, setFgColor] = useState("#0C0F14");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [cornerColor, setCornerColor] = useState("#0C0F14");
  
  const [dotStyle, setDotStyle] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  
  const [logo, setLogo] = useState<string | undefined>();
  const [logoSize, setLogoSize] = useState(0.25);
  
  const [frameStyle, setFrameStyle] = useState<"none" | "scanme" | "brackets">("none");
  
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientConfig, setGradientConfig] = useState<GradientConfig | undefined>();

  const currentConfig: QRFinalConfig = {
    dotStyle,
    fgColor,
    bgColor,
    cornerStyle,
    cornerColor,
    logo,
    logoSize,
    frameStyle,
    gradientConfig: gradientEnabled ? gradientConfig : undefined,
  };

  const applyPreset = (preset: "classic" | "rounded" | "colored" | "branded") => {
    setSelectedPreset(preset);
    setGradientEnabled(false);
    if (preset === "classic") {
      setDotStyle("square");
      setFgColor("#000000");
      setBgColor("#ffffff");
      setCornerStyle("square");
      setCornerColor("#000000");
      setLogo(undefined);
    } else if (preset === "rounded") {
      setDotStyle("extra-rounded");
      setFgColor("#0C0F14");
      setBgColor("#ffffff");
      setCornerStyle("extra-rounded");
      setCornerColor("#0C0F14");
      setLogo(undefined);
    } else if (preset === "colored") {
      setDotStyle("dots");
      setFgColor("#00DDB4");
      setBgColor("#0C0F14");
      setCornerStyle("dot");
      setCornerColor("#00DDB4");
      setLogo(undefined);
    } else if (preset === "branded") {
      setDotStyle("classy-rounded");
      setFgColor("#0C0F14");
      setBgColor("#ffffff");
      setCornerStyle("extra-rounded");
      setCornerColor("#00DDB4");
      setLogo("/logo.png"); // From public folder
      setLogoSize(0.25);
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPresetCard = (name: string, type: "classic" | "rounded" | "colored" | "branded") => (
    <div
      key={type}
      onClick={() => applyPreset(type)}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all bg-card hover:bg-muted/50",
        selectedPreset === type ? "border-[#00DDB4]" : "border-border"
      )}
    >
      <div className="w-[100px] h-[100px] flex items-center justify-center pointer-events-none transform scale-90 origin-center">
        {type === "classic" && <ClassicQR value={value || "https://scaniya.alphaprime.co.in"} size={100} />}
        {type === "rounded" && <RoundedQR value={value || "https://scaniya.alphaprime.co.in"} size={100} />}
        {type === "colored" && <ColoredQR value={value || "https://scaniya.alphaprime.co.in"} size={100} />}
        {type === "branded" && <BrandedQR value={value || "https://scaniya.alphaprime.co.in"} size={100} />}
      </div>
      <span className="text-xs font-medium">{name}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left side: Controls */}
      <div className="lg:col-span-7 space-y-6">
        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
            <TabsTrigger value="frame">Frame</TabsTrigger>
          </TabsList>

          {/* STYLE TAB */}
          <TabsContent value="style" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {renderPresetCard("Classic", "classic")}
              {renderPresetCard("Rounded", "rounded")}
              {renderPresetCard("Colored", "colored")}
              {renderPresetCard("Branded", "branded")}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Foreground</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                  />
                  <span className="text-xs font-mono">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Background</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                  />
                  <span className="text-xs font-mono">{bgColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Corner Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={cornerColor}
                    onChange={(e) => setCornerColor(e.target.value)}
                    className="w-9 h-9 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                  />
                  <span className="text-xs font-mono">{cornerColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Custom Logo</Label>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <span className="bg-muted px-3 py-1.5 rounded-md text-xs font-medium hover:bg-muted/80 transition-colors">
                    Upload Logo
                  </span>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </Label>
              </div>
              {logo && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Logo Size</Label>
                    <span className="text-xs">{Math.round(logoSize * 100)}%</span>
                  </div>
                  <Slider
                    value={[logoSize]}
                    onValueChange={([val]) => setLogoSize(val)}
                    min={0.1}
                    max={0.4}
                    step={0.05}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-destructive px-0" 
                    onClick={() => setLogo(undefined)}
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dot Style</Label>
                <select
                  value={dotStyle}
                  onChange={(e) => setDotStyle(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors flex-1"
                >
                  {DOT_STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Corner Style</Label>
                <select
                  value={cornerStyle}
                  onChange={(e) => setCornerStyle(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors flex-1"
                >
                  {CORNER_STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </TabsContent>

          {/* GRADIENT TAB */}
          <TabsContent value="gradient" className="space-y-6 mt-6">
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Enable gradient</Label>
                <p className="text-xs text-muted-foreground">Overrides foreground color</p>
              </div>
              <Switch checked={gradientEnabled} onCheckedChange={setGradientEnabled} />
            </div>

            {gradientEnabled && (
              <QRGradientPicker
                value={value || "https://scaniya.alphaprime.co.in"}
                onChange={(config) => setGradientConfig(config)}
              />
            )}
          </TabsContent>

          {/* FRAME TAB */}
          <TabsContent value="frame" className="space-y-6 mt-6">
            <div className="grid grid-cols-3 gap-4">
              {([
                { id: "none", label: "None" },
                { id: "scanme", label: "Scan Me" },
                { id: "brackets", label: "Brackets" },
              ] as const).map((frame) => (
                <div
                  key={frame.id}
                  onClick={() => setFrameStyle(frame.id)}
                  className={cn(
                    "flex flex-col flex-1 items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-card min-h-[120px] gap-3",
                    frameStyle === frame.id ? "border-[#00DDB4]" : "border-border hover:border-[#00DDB4]/50"
                  )}
                >
                  {frame.id === "none" && <div className="w-10 h-10 border-2 border-dashed border-muted-foreground/30 rounded" />}
                  {frame.id === "scanme" && (
                    <div className="px-2 py-1 rounded-md border-2 border-[#00DDB4] text-[8px] font-bold text-[#00DDB4] uppercase tracking-wider font-['Rajdhani'] flex items-center justify-center">
                      <div className="w-5 h-5 bg-muted mr-1"></div> Scan Me
                    </div>
                  )}
                  {frame.id === "brackets" && (
                    <div className="w-10 h-10 border-2 border-[#00DDB4] border-dashed rounded relative flex items-center justify-center">
                       <span className="text-[10px]">QR</span>
                       <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#00DDB4]" />
                       <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#00DDB4]" />
                       <div className="absolute top-0 right-0 w-2 h-0.5 bg-[#00DDB4]" />
                       <div className="absolute top-0 right-0 w-0.5 h-2 bg-[#00DDB4]" />
                       <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-[#00DDB4]" />
                       <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-[#00DDB4]" />
                       <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-[#00DDB4]" />
                       <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-[#00DDB4]" />
                    </div>
                  )}
                  <span className="text-xs font-medium">{frame.label}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side: Preview & Actions */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] sticky top-24">
          <QRStyled
            ref={qrRef}
            value={value || "https://scaniya.alphaprime.co.in"}
            size={300}
            dotStyle={dotStyle as any}
            fgColor={gradientEnabled ? undefined : fgColor}
            bgColor={bgColor}
            cornerStyle={cornerStyle as any}
            cornerColor={gradientEnabled ? undefined : cornerColor}
            logo={logo}
            logoSize={logoSize}
            frameStyle={frameStyle}
            gradientConfig={gradientEnabled ? gradientConfig : undefined}
          />

          <div className="w-full space-y-4 mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-center text-muted-foreground mb-3">Export Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => qrRef.current?.downloadQR("png", 300)} className="w-full text-xs">
                PNG (300px)
              </Button>
              <Button variant="outline" onClick={() => qrRef.current?.downloadQR("png", 1000)} className="w-full text-xs">
                PNG (1000px)
              </Button>
            </div>
            <Button variant="outline" onClick={() => qrRef.current?.downloadQR("svg")} className="w-full text-xs">
              VECTOR SVG
            </Button>
            
            <Button 
              className="w-full mt-4 bg-[#00DDB4] hover:bg-[#00DDB4]/90 text-black font-bold"
              onClick={() => onStyleChange?.(currentConfig)}
            >
              Apply Style
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
