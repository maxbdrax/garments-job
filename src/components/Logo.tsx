import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'dark', 
  showTagline = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium Garments Niyog Emblem SVG */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-2 shadow-lg border border-emerald-500/40 group hover:border-emerald-400 transition-all`}>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 blur-xs pointer-events-none" />

        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm"
        >
          {/* Garment Shirt Collar / Fabric geometric fold */}
          <path 
            d="M10 38L24 45L38 38V14L24 5L10 14V38Z" 
            stroke="#10b981" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="#064e3b"
            fillOpacity="0.45"
          />
          {/* RMG Fabric Weave Grid Lines */}
          <path 
            d="M17 19L31 33M31 19L17 33" 
            stroke="#059669" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeDasharray="2 3"
          />
          {/* Dynamic Stitch Wave */}
          <path 
            d="M13 25C17 20 20 30 24 25C28 20 31 30 35 25" 
            stroke="#34d399" 
            strokeWidth="2.4" 
            strokeLinecap="round"
          />
          {/* Golden Precision Sewing Needle */}
          <path 
            d="M35 7L13 41" 
            stroke="#fbbf24" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
          />
          {/* Needle Eye Hole with Golden Metallic Sheen */}
          <ellipse 
            cx="33" 
            cy="10" 
            rx="1.6" 
            ry="2.8" 
            transform="rotate(33 33 10)" 
            fill="#0f172a" 
            stroke="#f59e0b" 
            strokeWidth="1.4"
          />
          {/* Emerald Silk Thread Loop going through needle */}
          <path 
            d="M33 10C37 13 36 21 28 22" 
            stroke="#10b981" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          {/* Central Stitch Point */}
          <circle cx="24" cy="24" r="2.2" fill="#34d399" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${titleSizes[size]} ${isLight ? 'text-white' : 'text-slate-900'}`}>
            Garments
          </span>
          <span className={`font-black tracking-tight ${titleSizes[size]} bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent`}>
            Niyog
          </span>
          <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            BD
          </span>
        </div>

        {showTagline && (
          <p className={`${taglineSizes[size]} font-semibold tracking-wide ${isLight ? 'text-slate-300' : 'text-slate-500'}`}>
            তৈরি পোশাক ও টেক্সটাইল নিয়োগ পোর্টাল
          </p>
        )}
      </div>
    </div>
  );
};
