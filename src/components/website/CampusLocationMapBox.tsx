import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Compass, Layers, Building2 } from 'lucide-react';
import { resolveMapUrls, DEFAULT_GOOGLE_SHARE_URL } from '../../utils/mapHelper';

interface CampusLocationMapBoxProps {
  embedUrl?: string;
  shareUrl?: string;
  address?: string;
  directions?: string;
  instituteName?: string;
}

export const CampusLocationMapBox: React.FC<CampusLocationMapBoxProps> = ({
  embedUrl,
  shareUrl = DEFAULT_GOOGLE_SHARE_URL,
  address = '14/B, Garden Road, Kazipara, Farmgate, Dhaka–1215, Bangladesh',
  directions = 'Behind Bashundhara City Market, 2 minutes walking distance from Farmgate Metro Station.',
  instituteName = 'Nexgen Computer Academy'
}) => {
  const [mapType, setMapType] = useState<'google' | 'osm'>('google');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resolved = resolveMapUrls(embedUrl, shareUrl, address);
  const directNavigationUrl = resolved.directUrl || DEFAULT_GOOGLE_SHARE_URL;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  // Safety timer: ensure loading indicator never stays stuck if iframe takes long or blocks onLoad
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [mapType, embedUrl]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl flex flex-col relative h-full min-h-[460px] group">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <MapPin className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xs sm:text-sm text-white tracking-tight">
                {instituteName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Farmgate Campus
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[250px] sm:max-w-[360px]">
              {address}
            </p>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {/* Map Layer Switcher */}
          <div className="bg-slate-800 p-0.5 rounded-xl border border-slate-700 flex items-center text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setMapType('google')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                mapType === 'google'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Google Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType('osm')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                mapType === 'osm'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Street View</span>
            </button>
          </div>

          {/* Primary Action: Open Google Location */}
          <a
            href={directNavigationUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-transform hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Maps-এ দেখুন</span>
            <span className="sm:hidden">Open Maps</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* Interactive Map Iframe Display */}
      <div className="relative flex-1 w-full min-h-[360px] bg-slate-200 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center space-y-3 z-5">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500">গুগল ম্যাপ লোড হচ্ছে...</p>
          </div>
        )}

        {mapType === 'google' ? (
          <iframe
            title="Nexgen Computer Academy Google Map"
            src={resolved.embedUrl}
            className="w-full h-full min-h-[360px] border-0"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setMapType('osm');
            }}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <iframe
            title="Nexgen Computer Academy Street Map"
            src={resolved.osmEmbedUrl}
            className="w-full h-full min-h-[360px] border-0"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        )}

        {/* Floating Quick Navigation Chip */}
        <div className="absolute bottom-16 right-4 z-10 hidden sm:flex items-center space-x-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-lg border border-slate-700/80 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>দিকনির্দেশনা পান (Directions)</span>
          </a>
        </div>
      </div>

      {/* Bottom Bar: Address & Copy Action */}
      <div className="bg-white p-3.5 sm:px-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold truncate max-w-[280px] sm:max-w-md">
            {directions || address}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>ঠিকানা কপি করুন</span>
              </>
            )}
          </button>

          <a
            href={directNavigationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 underline"
          >
            <span>{directNavigationUrl}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
