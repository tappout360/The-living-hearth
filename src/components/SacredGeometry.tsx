import React from 'react';

interface SacredRingsProps {
  size?: number;
  className?: string;
  glowColor?: string;
  ringsCount?: number;
}

export const ConcentricRings: React.FC<SacredRingsProps> = ({
  size = 120,
  className = '',
  glowColor = 'currentColor',
  ringsCount = 3,
}) => {
  const center = size / 2;
  const step = center / (ringsCount + 1);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: ringsCount }).map((_, i) => {
        const radius = step * (i + 1);
        const opacity = 0.2 + (i * 0.15);
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            stroke={glowColor}
            strokeWidth={1.5}
            strokeDasharray={i === 1 ? '4 3' : undefined}
            opacity={opacity}
          />
        );
      })}
      <circle cx={center} cy={center} r={step * 0.4} fill={glowColor} opacity={0.7} />
    </svg>
  );
};

export const VesicaPiscisSymbol: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 80,
  className = '',
  color = 'currentColor',
}) => {
  const r = size * 0.38;
  const cx1 = size * 0.4;
  const cx2 = size * 0.6;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx={cx1} cy={cy} r={r} stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx={cx2} cy={cy} r={r} stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Intersection mask highlight */}
      <path
        d={`M ${size * 0.5} ${cy - r * 0.866} A ${r} ${r} 0 0 1 ${size * 0.5} ${cy + r * 0.866} A ${r} ${r} 0 0 1 ${size * 0.5} ${cy - r * 0.866}`}
        fill={color}
        fillOpacity="0.18"
      />
    </svg>
  );
};

export const GoldenRatioSpiral: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 64,
  className = '',
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="96" height="59.3" rx="8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <rect x="61.8" y="2" width="36.2" height="59.3" stroke={color} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
      <path
        d="M 2 61.3 C 2 20 61.8 2 98 2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
};

export const HearthFlameGlow: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 48,
  className = '',
  color = 'currentColor',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full animate-ripple opacity-30"
        style={{ backgroundColor: color }}
      />
      <div
        className="relative rounded-full animate-breath flex items-center justify-center shadow-lg"
        style={{
          width: size * 0.65,
          height: size * 0.65,
          background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${color} 75%, transparent 100%)`,
        }}
      />
    </div>
  );
};
