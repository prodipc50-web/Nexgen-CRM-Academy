import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Move,
  Maximize,
  Sliders,
  Sparkles,
  Eye,
  RefreshCw,
  Crop,
  Layers,
  Square,
  RectangleHorizontal,
  Circle
} from 'lucide-react';
import { NexgenLogo } from './NexgenLogo';

interface LogoCropResizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string;
  onSaveLogo: (croppedDataUrl: string) => void;
  onResetLogo?: () => void;
}

export type AspectRatioMode = 'square' | 'wide' | 'circle' | 'free';

export const LogoCropResizeModal: React.FC<LogoCropResizeModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onSaveLogo,
  onResetLogo
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Customization Options
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>('square');
  const [bgStyle, setBgStyle] = useState<'transparent' | 'white' | 'dark' | 'soft'>('transparent');
  const [logoPadding, setLogoPadding] = useState<number>(12); // padding in px inside canvas
  const [cornerRadius, setCornerRadius] = useState<number>(0); // 0 = sharp, 16 = rounded, 999 = circle
  const [exportDpi, setExportDpi] = useState<'standard' | 'hd'>('hd');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeLogo = currentLogoUrl || localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
      if (activeLogo) {
        setImageSrc(activeLogo);
      } else {
        setImageSrc(null);
      }
      setZoom(1);
      setRotation(0);
      setPanOffset({ x: 0, y: 0 });
      setLogoPadding(12);
      setCornerRadius(0);
      setBgStyle('transparent');
    }
  }, [isOpen, currentLogoUrl]);

  // Load Image Object
  useEffect(() => {
    if (!imageSrc) {
      imageObjRef.current = null;
      setPreviewDataUrl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render canvas when parameters change
  useEffect(() => {
    renderCanvas();
  }, [zoom, rotation, panOffset, aspectMode, bgStyle, logoPadding, cornerRadius]);

  const getCanvasDimensions = () => {
    switch (aspectMode) {
      case 'wide':
        return { width: 360, height: 160 };
      case 'circle':
      case 'square':
      default:
        return { width: 300, height: 300 };
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Apply Background Fill
    if (bgStyle === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    } else if (bgStyle === 'dark') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);
    } else if (bgStyle === 'soft') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);
    }

    if (!img) return;

    // Optional Clipping for circular/rounded mode
    ctx.save();
    if (aspectMode === 'circle' || cornerRadius > 0) {
      const radius = aspectMode === 'circle' ? Math.min(width, height) / 2 : cornerRadius;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, radius);
      ctx.clip();
    }

    // Draw transformed image
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fit with user padding
    const availW = width - logoPadding * 2;
    const availH = height - logoPadding * 2;
    const imgAspect = img.width / img.height;
    const boxAspect = availW / availH;

    let drawW = availW;
    let drawH = availH;
    if (imgAspect > boxAspect) {
      drawW = availW;
      drawH = availW / imgAspect;
    } else {
      drawH = availH;
      drawW = availH * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    ctx.restore();

    try {
      setPreviewDataUrl(canvas.toDataURL('image/png'));
    } catch (e) {
      // ignore
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageSrc(reader.result as string);
        setZoom(1);
        setRotation(0);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const img = imageObjRef.current;
    if (!img) return;

    const { width: baseW, height: baseH } = getCanvasDimensions();
    const scaleFactor = exportDpi === 'hd' ? 2 : 1;
    const exportW = baseW * scaleFactor;
    const exportH = baseH * scaleFactor;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportW;
    exportCanvas.height = exportH;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Apply Background Fill
    if (bgStyle === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportW, exportH);
    } else if (bgStyle === 'dark') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, exportW, exportH);
    } else if (bgStyle === 'soft') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, exportW, exportH);
    }

    ctx.save();
    if (aspectMode === 'circle' || cornerRadius > 0) {
      const radius = aspectMode === 'circle' ? Math.min(exportW, exportH) / 2 : cornerRadius * scaleFactor;
      ctx.beginPath();
      ctx.roundRect(0, 0, exportW, exportH, radius);
      ctx.clip();
    }

    ctx.translate(exportW / 2 + panOffset.x * scaleFactor, exportH / 2 + panOffset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const availW = baseW - logoPadding * 2;
    const availH = baseH - logoPadding * 2;
    const imgAspect = img.width / img.height;
    const boxAspect = availW / availH;

    let drawW = availW;
    let drawH = availH;
    if (imgAspect > boxAspect) {
      drawW = availW;
      drawH = availW / imgAspect;
    } else {
      drawH = availH;
      drawW = availH * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const finalDataUrl = exportCanvas.toDataURL('image/png', 0.95);
    
    // Save to localStorage for instant sync across tabs and documents
    localStorage.setItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO', finalDataUrl);
    window.dispatchEvent(new Event('nexgen-logo-updated'));

    onSaveLogo(finalDataUrl);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to remove the custom uploaded logo and restore the official Nexgen Shield Emblem?')) {
      localStorage.removeItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
      window.dispatchEvent(new Event('nexgen-logo-updated'));
      setImageSrc(null);
      if (onResetLogo) onResetLogo();
      onClose();
    }
  };

  if (!isOpen) return null;

  const { width: cWidth, height: cHeight } = getCanvasDimensions();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-3xl w-full shadow-2xl border border-slate-100 space-y-5 text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center space-x-2">
                <span>Manual Logo Crop & Resize Studio</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  HQ Studio
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Crop, rotate, adjust padding, and resize your institute logo with live multi-theme preview
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Left Column: Canvas & Direct Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Action Bar: Upload from Device */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Logo (পিসি থেকে লোগো আপলোড)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  title="Square 1:1"
                  onClick={() => setAspectMode('square')}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    aspectMode === 'square' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Horizontal Wide"
                  onClick={() => setAspectMode('wide')}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    aspectMode === 'wide' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <RectangleHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Circle Crop"
                  onClick={() => setAspectMode('circle')}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    aspectMode === 'circle' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Circle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
            <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl overflow-hidden select-none min-h-[260px]">
              {/* Checkerboard Pattern for transparent bg */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #64748B 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Guide Tag */}
              <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
                <Move className="w-3 h-3 text-indigo-400" />
                <span>Drag to Position • Sliders to Adjust</span>
              </div>

              {/* The Actual Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  width: `${cWidth}px`,
                  height: `${cHeight}px`,
                  maxWidth: '100%'
                }}
                className={`cursor-grab active:cursor-grabbing border-2 border-indigo-400/60 shadow-2xl ${
                  aspectMode === 'circle' ? 'rounded-full' : 'rounded-xl'
                } bg-slate-950/40 object-contain transition-all`}
              />

              {/* If no image selected */}
              {!imageSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-6 text-center space-y-2 bg-slate-900/90 z-20">
                  <ImageIcon className="w-12 h-12 text-slate-500 opacity-60" />
                  <p className="text-xs font-bold text-white">No Custom Logo Uploaded Yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Upload your institute's PNG/JPEG logo file to manually crop, resize, and position it.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs mt-2"
                  >
                    Select Logo File
                  </button>
                </div>
              )}
            </div>

            {/* Sliders Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              {/* Zoom Slider */}
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-700 w-16 shrink-0 flex items-center space-x-1">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Zoom</span>
                </span>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-slate-600 w-10 text-right font-bold text-[11px]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Rotation Slider & Quick 90 deg */}
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-700 w-16 shrink-0 flex items-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rotate</span>
                </span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={e => setRotation(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-slate-600 w-10 text-right font-bold text-[11px]">
                  {rotation}°
                </span>
                <button
                  type="button"
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-200 rounded-md"
                  title="Rotate +90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inner Margin / Padding */}
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-700 w-16 shrink-0 flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Padding</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="2"
                  value={logoPadding}
                  onChange={e => setLogoPadding(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-slate-600 w-10 text-right font-bold text-[11px]">
                  {logoPadding}px
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Live Previews (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Background & Style Controls */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-black text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Background & Export Quality</span>
              </h4>

              {/* Background Selection */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Logo Background Fill:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'transparent', label: 'Transparent' },
                    { id: 'white', label: 'Pure White' },
                    { id: 'dark', label: 'Navy Dark' },
                    { id: 'soft', label: 'Soft Slate' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBgStyle(b.id as any)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] border transition-all text-left flex items-center justify-between ${
                        bgStyle === b.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{b.label}</span>
                      {bgStyle === b.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export DPI */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Output Resolution:</span>
                <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setExportDpi('standard')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      exportDpi === 'standard' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    1x Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportDpi('hd')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      exportDpi === 'hd' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    2x Ultra HD
                  </button>
                </div>
              </div>
            </div>

            {/* Live Tri-Preview Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-black text-slate-900 text-xs flex items-center space-x-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Live Multi-Theme Previews</span>
              </h4>

              {/* 1. Header / Navbar White Theme Preview */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  1. App Header & Navbar
                </span>
                <div className="flex items-center space-x-2.5">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="Logo preview"
                      className="w-10 h-10 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                      LOGO
                    </div>
                  )}
                  <div>
                    <h5 className="font-black text-slate-900 text-xs leading-none">
                      Nexgen Computer Academy
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Farmgate Campus • Live</p>
                  </div>
                </div>
              </div>

              {/* 2. Official Document / Printed Money Receipt Preview */}
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  2. Printed Money Receipt & Certificate
                </span>
                <div className="flex items-center justify-between border-b border-amber-200/40 pb-1.5">
                  <div className="flex items-center space-x-2">
                    {previewDataUrl ? (
                      <img
                        src={previewDataUrl}
                        alt="Logo receipt"
                        className="w-8 h-8 object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center text-[8px] font-bold text-amber-700">
                        NCA
                      </div>
                    )}
                    <span className="text-[11px] font-black text-slate-900">OFFICIAL RECEIPT</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-amber-900">#REC-2026-089</span>
                </div>
              </div>

              {/* 3. Dark Theme / Website Hero Preview */}
              <div className="bg-slate-900 p-3 rounded-xl shadow-2xs space-y-1 text-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  3. Dark Hero & Mobile Splash
                </span>
                <div className="flex items-center space-x-2.5">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="Logo dark"
                      className="w-9 h-9 object-contain shrink-0 drop-shadow-md"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                      LOGO
                    </div>
                  )}
                  <div>
                    <h5 className="font-black text-white text-xs leading-none">NEXGEN ACADEMY</h5>
                    <p className="text-[10px] text-amber-400 mt-0.5">Empowering IT Skills</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO') && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors inline-flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Crest</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPanOffset({ x: 0, y: 0 });
                setLogoPadding(12);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Reset Controls
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!imageSrc}
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Logo (লোগো সংরক্ষণ করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
