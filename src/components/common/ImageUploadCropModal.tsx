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
  Circle,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  FileImage,
  FolderOpen
} from 'lucide-react';

export type AspectRatioOption = '16:9' | '4:3' | '1:1' | '3:2' | 'circle' | 'free';

export interface ImagePresetItem {
  label: string;
  category?: string;
  url: string;
}

interface ImageUploadCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  onSaveImage: (croppedDataUrl: string) => void;
  title?: string;
  subtitle?: string;
  aspectRatio?: AspectRatioOption;
  recommendedSize?: string;
  presetImages?: ImagePresetItem[];
}

export const ImageUploadCropModal: React.FC<ImageUploadCropModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  onSaveImage,
  title = 'Upload, Crop & Resize Image',
  subtitle = 'Upload your own image, crop to the perfect framing, or select from curated presets.',
  aspectRatio = '16:9',
  recommendedSize = 'Recommended: 1200 × 675px (16:9 HD)',
  presetImages = []
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Customization Options
  const [selectedAspect, setSelectedAspect] = useState<AspectRatioOption>(aspectRatio);
  const [bgStyle, setBgStyle] = useState<'transparent' | 'white' | 'dark' | 'soft'>('transparent');
  const [imagePadding, setImagePadding] = useState<number>(0);
  const [cornerRadius, setCornerRadius] = useState<number>(0);
  const [urlInput, setUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (currentImageUrl) {
        setImageSrc(currentImageUrl);
        setUrlInput(currentImageUrl.startsWith('data:') ? '' : currentImageUrl);
      } else {
        setImageSrc(null);
        setUrlInput('');
      }
      setZoom(1);
      setRotation(0);
      setPanOffset({ x: 0, y: 0 });
      setImagePadding(0);
      setCornerRadius(0);
      setBgStyle('transparent');
      setSelectedAspect(aspectRatio);
    }
  }, [isOpen, currentImageUrl, aspectRatio]);

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
    img.onerror = () => {
      // If cross-origin fails, try without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imageObjRef.current = fallbackImg;
        renderCanvas();
      };
      fallbackImg.src = imageSrc;
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render canvas when parameters change
  useEffect(() => {
    renderCanvas();
  }, [zoom, rotation, panOffset, selectedAspect, bgStyle, imagePadding, cornerRadius]);

  const getCanvasDimensions = () => {
    switch (selectedAspect) {
      case '16:9':
        return { width: 480, height: 270 };
      case '4:3':
        return { width: 400, height: 300 };
      case '3:2':
        return { width: 450, height: 300 };
      case 'circle':
      case '1:1':
        return { width: 360, height: 360 };
      case 'free':
      default:
        return { width: 480, height: 320 };
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
    if (selectedAspect === 'circle' || cornerRadius > 0) {
      const radius = selectedAspect === 'circle' ? Math.min(width, height) / 2 : cornerRadius;
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
    const availW = width - imagePadding * 2;
    const availH = height - imagePadding * 2;
    const imgAspect = img.width / img.height;
    const boxAspect = availW / availH;

    let drawW = availW;
    let drawH = availH;
    // Cover the canvas box
    if (imgAspect > boxAspect) {
      drawH = availH;
      drawW = availH * imgAspect;
    } else {
      drawW = availW;
      drawH = availW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    ctx.restore();

    try {
      setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.92));
    } catch (e) {
      // ignore
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageSrc(result);
      setZoom(1);
      setRotation(0);
      setPanOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setImageSrc(urlInput.trim());
    setZoom(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag to Pan Canvas
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

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleFinalSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    try {
      const finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onSaveImage(finalDataUrl);
      onClose();
    } catch (err) {
      if (imageSrc) {
        onSaveImage(imageSrc);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold shrink-0">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                {title}
              </h3>
              <p className="text-[11px] sm:text-xs text-indigo-200 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Source Selection Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                  activeTab === 'url'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>

              {presetImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    activeTab === 'presets'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Preset Library ({presetImages.length})</span>
                </button>
              )}
            </div>

            <span className="text-[11px] font-bold text-slate-400">
              {recommendedSize}
            </span>
          </div>

          {/* Tab 1: Upload / Drag-and-Drop */}
          {activeTab === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                isDraggingFile
                  ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]'
                  : 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">
                Drag & Drop Image Here, or Click to Browse
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Supports high-resolution PNG, JPG, JPEG, WEBP and SVG files from your device.
              </p>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <label className="font-bold text-slate-700 text-xs block">
                Direct Image Link / CDN URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
                >
                  Load Image
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && presetImages.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <span className="font-bold text-slate-700 text-xs block">
                Click any curated preset to apply and crop:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {presetImages.map((preset, idx) => (
                  <button
                    key={`${preset.label}-${idx}`}
                    type="button"
                    onClick={() => {
                      setImageSrc(preset.url);
                      setZoom(1);
                      setRotation(0);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    className={`relative rounded-2xl overflow-hidden border p-1 text-left transition-all group ${
                      imageSrc === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="h-16 rounded-xl overflow-hidden bg-slate-100 mb-1.5 relative">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {imageSrc === preset.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 block px-1">
                      {preset.label}
                    </span>
                    {preset.category && (
                      <span className="text-[9px] text-slate-400 line-clamp-1 block px-1">
                        {preset.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Cropper & Canvas Workspace */}
          {imageSrc ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Canvas Preview & Pan Area */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                    <Move className="w-4 h-4 text-indigo-600" />
                    <span>Interactive Framing Stage (Drag to Reposition)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Frame</span>
                  </button>
                </div>

                <div className="relative bg-slate-900/90 rounded-3xl p-4 flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner min-h-[300px]">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="cursor-grab active:cursor-grabbing max-w-full max-h-[320px] rounded-2xl shadow-2xl object-contain"
                  />

                  {/* Overlay Guide Grid */}
                  <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-3xl grid grid-cols-3 grid-rows-3 opacity-30" />
                </div>
              </div>

              {/* Right Column: Aspect Ratio & Transform Controls */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                {/* 1. Aspect Ratio Presets */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>Aspect Ratio Preset</span>
                    <span className="text-[10px] text-indigo-600 font-bold">{selectedAspect}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedAspect('16:9')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === '16:9'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <RectangleHorizontal className="w-4 h-4 mb-0.5" />
                      <span>16:9 (Hero/Card)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAspect('4:3')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === '4:3'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Square className="w-4 h-4 mb-0.5" />
                      <span>4:3 (Gallery)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAspect('1:1')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === '1:1'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Square className="w-4 h-4 mb-0.5" />
                      <span>1:1 (Square)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAspect('3:2')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === '3:2'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <RectangleHorizontal className="w-4 h-4 mb-0.5" />
                      <span>3:2 (Photo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAspect('circle')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === 'circle'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Circle className="w-4 h-4 mb-0.5" />
                      <span>Circle Avatar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedAspect('free')}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        selectedAspect === 'free'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-4 h-4 mb-0.5" />
                      <span>Free Size</span>
                    </button>
                  </div>
                </div>

                {/* 2. Zoom Slider */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center space-x-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Zoom Scale</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* 3. Rotation Controls */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center space-x-1.5">
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotation</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{rotation}°</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                      className="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>+90°</span>
                    </button>
                  </div>
                </div>

                {/* 4. Canvas Background */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <label className="font-bold text-slate-700 text-xs block">
                    Letterbox Background Fill
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      type="button"
                      onClick={() => setBgStyle('transparent')}
                      className={`p-1.5 rounded-lg text-[11px] font-bold text-center border ${
                        bgStyle === 'transparent' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgStyle('white')}
                      className={`p-1.5 rounded-lg text-[11px] font-bold text-center border ${
                        bgStyle === 'white' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgStyle('dark')}
                      className={`p-1.5 rounded-lg text-[11px] font-bold text-center border ${
                        bgStyle === 'dark' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgStyle('soft')}
                      className={`p-1.5 rounded-lg text-[11px] font-bold text-center border ${
                        bgStyle === 'soft' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Soft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Upload an image or pick a preset above to activate the interactive cropping workbench.
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={!imageSrc}
              onClick={handleFinalSave}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Apply & Save Cropped Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
