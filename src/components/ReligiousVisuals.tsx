import React from 'react';
import { resolveTraditionVisualType } from '../data/religiousVisualsData';

export interface ReligiousVisualProps {
  size?: number;
  className?: string;
  color?: string;
  glow?: boolean;
}

/**
 * 1. CHRISTIANITY: Latin Cross with Solar Halo & Radiance
 */
export const ChristianVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Christian Latin Cross with Celestial Radiance"
  >
    {glow && (
      <circle cx="50" cy="40" r="32" fill={color} fillOpacity="0.12" filter="blur(6px)" />
    )}
    {/* Celestial Halo */}
    <circle cx="50" cy="40" r="22" stroke={color} strokeWidth="1.5" strokeOpacity="0.45" strokeDasharray="3 2" />
    <circle cx="50" cy="40" r="16" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    
    {/* Radiating Light Beams */}
    <line x1="50" y1="12" x2="50" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="72" y1="40" x2="80" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="28" y1="40" x2="20" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="34" y1="24" x2="28" y2="18" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
    <line x1="66" y1="24" x2="72" y2="18" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />

    {/* The Latin Cross */}
    {/* Vertical Beam */}
    <rect x="46" y="16" width="8" height="68" rx="2" fill={color} fillOpacity="0.9" />
    {/* Horizontal Transom Beam */}
    <rect x="22" y="36" width="56" height="8" rx="2" fill={color} fillOpacity="0.9" />
    {/* Center Core Intersection Accent */}
    <circle cx="50" cy="40" r="3" fill="#FFFFFF" fillOpacity="0.9" />
    {/* Base Pedestal / Stepped Calvary Mount */}
    <path d="M38 88 L62 88 L58 84 L42 84 Z" fill={color} fillOpacity="0.75" />
  </svg>
);

/**
 * 2. CATHOLICISM: Sacred Cross with Chi-Rho (☧), Eucharistic Chalice & Marian Aura
 */
export const CatholicVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Catholic Cross with Chi-Rho and Eucharistic Halo"
  >
    {glow && (
      <circle cx="50" cy="50" r="36" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Ornate Octagonal Halo */}
    <circle cx="50" cy="38" r="24" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
    <circle cx="50" cy="38" r="28" stroke={color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3" />

    {/* Flared Gothic/Romanesque Cross Beams */}
    <path
      d="M48 10 L52 10 L54 34 L78 36 L78 40 L54 42 L52 86 L48 86 L46 42 L22 40 L22 36 L46 34 Z"
      fill={color}
      fillOpacity="0.85"
      stroke={color}
      strokeWidth="1.5"
    />

    {/* Chi-Rho Monogram (☧) in center */}
    {/* Chi (X) */}
    <line x1="43" y1="31" x2="57" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="57" y1="31" x2="43" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Rho (P) */}
    <line x1="50" y1="26" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M50 26 C55 26 58 29 58 33 C58 37 55 40 50 40"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Papal Keys / Liturgical Rosary Arch Bottom Accent */}
    <path
      d="M32 78 C38 84 62 84 68 78"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 3"
      opacity="0.6"
    />
    <circle cx="50" cy="82" r="3" fill={color} />
  </svg>
);

/**
 * 3. LATTER-DAY SAINT TRADITION (MORMONISM): Angel Moroni Herald Trumpet & Temple Spire
 */
export const LatterDaySaintsVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Latter-day Saint Angel Moroni with Trumpet & Celestial Temple Spire"
  >
    {glow && (
      <circle cx="52" cy="46" r="34" fill={color} fillOpacity="0.12" filter="blur(6px)" />
    )}
    {/* Celestial Starlight Ring */}
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 4" />
    
    {/* Salt Lake Temple Tower Silhouette Spire in background */}
    <path
      d="M50 12 L52 24 L56 28 L56 86 L44 86 L44 28 L48 24 Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1"
      strokeOpacity="0.4"
    />
    {/* Spire Finial Ball */}
    <circle cx="50" cy="22" r="3" fill={color} fillOpacity="0.7" />

    {/* Angel Moroni Figure with Golden Trumpet pointing to dawn */}
    {/* Trumpet raised upward right */}
    <path
      d="M49 32 L82 18 L84 21 L51 34 Z"
      fill={color}
      stroke={color}
      strokeWidth="0.8"
    />
    {/* Trumpet Bell flare */}
    <path d="M82 16 L88 17 L86 23 L80 20 Z" fill={color} />
    {/* Sound Radiance Waves from Trumpet */}
    <path d="M89 15 C92 18 92 23 89 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
    <path d="M92 12 C96 17 96 26 92 30" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />

    {/* Moroni's Head & Flowing Robe */}
    <circle cx="46" cy="34" r="4" fill={color} />
    <path
      d="M44 38 C42 45 40 56 41 68 L50 68 C52 56 50 45 47 38 Z"
      fill={color}
      fillOpacity="0.9"
    />
    {/* Flowing Back Robe Tail */}
    <path
      d="M41 44 C34 50 32 60 35 66 C38 60 40 52 42 46 Z"
      fill={color}
      fillOpacity="0.7"
    />
    {/* Golden Plates / Scroll in left arm */}
    <rect x="39" y="46" width="6" height="9" rx="1" transform="rotate(-15 39 46)" fill="#FFFFFF" fillOpacity="0.85" />
  </svg>
);

/**
 * 4. ISLAM: Rub el Hizb (۞ Octagram) with Hilal (Crescent Moon) & Star
 */
export const IslamicVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Islamic Rub el Hizb Geometric Octagram and Crescent Hilal"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Rub el Hizb Outer Tessellation: Two Overlapping Squares */}
    {/* Square 1 */}
    <rect
      x="22"
      y="22"
      width="56"
      height="56"
      rx="3"
      stroke={color}
      strokeWidth="1.8"
      strokeOpacity="0.65"
      fill={color}
      fillOpacity="0.06"
    />
    {/* Square 2 (Rotated 45 degrees) */}
    <rect
      x="22"
      y="22"
      width="56"
      height="56"
      rx="3"
      transform="rotate(45 50 50)"
      stroke={color}
      strokeWidth="1.8"
      strokeOpacity="0.65"
      fill={color}
      fillOpacity="0.06"
    />

    {/* Inner Concentric Circle of Harmony */}
    <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="1" strokeOpacity="0.35" />

    {/* Sacred Crescent Moon (Hilal) */}
    <path
      d="M52 32 A 18 18 0 1 0 64 64 A 15 15 0 1 1 52 32 Z"
      fill={color}
      fillOpacity="0.9"
    />

    {/* 5-pointed Star inside Crescent */}
    <polygon
      points="59,38 61,43 66,43 62,46 64,51 59,48 55,51 57,46 53,43 58,43"
      fill="#FFFFFF"
      fillOpacity="0.95"
    />
  </svg>
);

/**
 * 5. JUDAISM: Star of David (Magen David ✡) & Seven-Branched Menorah
 */
export const JudaicVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Star of David Magen David and Seven-Branched Menorah"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Star of David (Magen David): Interlocking Triangles */}
    {/* Upward Triangle */}
    <polygon
      points="50,14 78,62 22,62"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.75"
      fill={color}
      fillOpacity="0.07"
    />
    {/* Downward Triangle */}
    <polygon
      points="50,74 78,26 22,26"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.75"
      fill={color}
      fillOpacity="0.07"
    />

    {/* Seven-Branched Menorah centered inside Magen David */}
    {/* Central Stem */}
    <line x1="50" y1="32" x2="50" y2="58" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    {/* Inner Branch Pair */}
    <path d="M44 35 C44 46 50 48 50 48 C50 48 56 46 56 35" stroke={color} strokeWidth="1.8" fill="none" />
    {/* Middle Branch Pair */}
    <path d="M38 34 C38 52 50 54 50 54 C50 54 62 52 62 34" stroke={color} strokeWidth="1.8" fill="none" />
    {/* Outer Branch Pair */}
    <path d="M32 33 C32 58 50 58 50 58 C50 58 68 58 68 33" stroke={color} strokeWidth="1.8" fill="none" />
    {/* Menorah Base */}
    <path d="M42 62 L58 62 L54 58 L46 58 Z" fill={color} />

    {/* 7 Glowing Flames */}
    {[32, 38, 44, 50, 56, 62, 68].map((x) => (
      <circle key={x} cx={x} cy="30" r="1.6" fill="#FDE68A" />
    ))}
  </svg>
);

/**
 * 6. HINDUISM: Sacred Aum / Om (ॐ) with Lotus of Spiritual Awakening
 */
export const HinduVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Sacred Hindu Om with Lotus Blossom"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Blooming Lotus Petals at Base */}
    <path
      d="M50 78 C42 68 32 72 26 78 C36 84 46 82 50 78 Z"
      fill={color}
      fillOpacity="0.4"
    />
    <path
      d="M50 78 C58 68 68 72 74 78 C64 84 54 82 50 78 Z"
      fill={color}
      fillOpacity="0.4"
    />
    <path
      d="M50 72 C45 62 38 65 34 74 C42 76 48 74 50 72 Z"
      fill={color}
      fillOpacity="0.6"
    />
    <path
      d="M50 72 C55 62 62 65 66 74 C58 76 52 74 50 72 Z"
      fill={color}
      fillOpacity="0.6"
    />
    <circle cx="50" cy="74" r="2.5" fill={color} />

    {/* Sacred OM (ॐ) Character */}
    {/* Left Upper Curve */}
    <path
      d="M34 32 C38 24 50 24 52 32 C53 38 48 42 44 44"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Left Lower Curve */}
    <path
      d="M44 44 C52 46 54 58 46 64 C38 68 30 62 31 52"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Right Sweeping Tail */}
    <path
      d="M47 44 C56 42 66 48 68 56 C70 64 66 72 63 74"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* Chandrabindu (Crescent Moon and Dot above) */}
    <path
      d="M60 28 C66 32 74 32 78 28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="69" cy="22" r="2.8" fill={color} />
  </svg>
);

/**
 * 7. BUDDHISM: Dharmachakra (8-Spoked Wheel of Dharma ☸)
 */
export const BuddhistVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Buddhist Eight-Spoked Dharmachakra Wheel of Dhamma"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Outer Wheel Rim */}
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="3" strokeOpacity="0.85" />
    <circle cx="50" cy="50" r="33" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />

    {/* Center Hub */}
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    <circle cx="50" cy="50" r="4" fill="#FFFFFF" fillOpacity="0.9" />

    {/* 8 Spokes (The Noble Eightfold Path) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 + 10 * Math.cos(rad);
      const y1 = 50 + 10 * Math.sin(rad);
      const x2 = 50 + 33 * Math.cos(rad);
      const y2 = 50 + 33 * Math.sin(rad);
      return (
        <line
          key={angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    })}

    {/* 8 Outer Rim Studs / Knobs */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 50 + 38 * Math.cos(rad);
      const cy = 50 + 38 * Math.sin(rad);
      return <circle key={`stud-${angle}`} cx={cx} cy={cy} r="2.2" fill={color} />;
    })}
  </svg>
);

/**
 * 8. SIKHISM: The Sacred Khanda (Central Double-edged Sword, Chakar, and Twin Kirpans ☬)
 */
export const SikhVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Sikh Khanda Emblem"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Inner Chakar (Quoit / Circular Steel Ring representing infinity and divine unity) */}
    <circle cx="50" cy="50" r="19" stroke={color} strokeWidth="3" fill="none" />

    {/* Central Khanda (Double-edged vertical sword) */}
    {/* Blade */}
    <path
      d="M50 10 L53 38 L54 62 L50 68 L46 62 L47 38 Z"
      fill={color}
      stroke={color}
      strokeWidth="1"
    />
    {/* Khanda Hilt & Handle */}
    <rect x="44" y="68" width="12" height="3" rx="1" fill={color} />
    <rect x="48" y="71" width="4" height="15" rx="1" fill={color} />
    <circle cx="50" cy="88" r="2.5" fill={color} />

    {/* Left Kirpan (Curved Sword of Piri - Spiritual Sovereignty) */}
    <path
      d="M26 32 C18 48 24 72 44 82 C34 76 28 58 34 40 Z"
      fill={color}
      fillOpacity="0.9"
    />
    <rect x="42" y="81" width="3" height="7" rx="1" transform="rotate(-30 42 81)" fill={color} />

    {/* Right Kirpan (Curved Sword of Miri - Temporal Responsibility) */}
    <path
      d="M74 32 C82 48 76 72 56 82 C66 76 72 58 66 40 Z"
      fill={color}
      fillOpacity="0.9"
    />
    <rect x="55" y="81" width="3" height="7" rx="1" transform="rotate(30 55 81)" fill={color} />
  </svg>
);

/**
 * 9. BAHÁ'Í FAITH: The Nine-Pointed Star (Haykal) of Unity
 */
export const BahaiVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => {
  // Generate 9 outer points and 9 inner points for a regular 9-pointed star
  const points: string[] = [];
  const outerR = 38;
  const innerR = 19;
  for (let i = 0; i < 18; i++) {
    const angle = (i * 20 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? outerR : innerR;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const polygonPoints = points.join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bahá'í Nine-Pointed Star of Unity"
    >
      {glow && (
        <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
      )}
      {/* Outer Halo */}
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
      {/* 9-Pointed Star Polygon */}
      <polygon
        points={polygonPoints}
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.16"
      />
      {/* Inner 9-Point Star Geometry Core */}
      <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" fillOpacity="0.9" />
    </svg>
  );
};

/**
 * 10. JAINISM: Ahimsa Hand (Abhayamudra with Wheel of Dharma in Palm)
 */
export const JainVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Jain Ahimsa Hand of Non-Violence"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Upraised Palm of Non-Violence (Abhayamudra) */}
    <path
      d="M36 82 L36 56 C36 48 38 32 38 24 C38 20 42 20 42 24 L42 46 C42 36 45 16 48 16 C51 16 52 36 52 44 C52 34 55 18 58 18 C61 18 62 36 62 46 C62 40 65 26 68 26 C71 26 72 38 72 52 C72 68 68 82 64 86 L36 86 Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Thumb */}
    <path
      d="M36 62 C28 58 24 50 26 44 C28 42 32 44 36 52"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Wheel of Dharma (24 spokes of the Tirthankaras) in the Palm */}
    <circle cx="52" cy="58" r="14" stroke={color} strokeWidth="1.8" />
    <circle cx="52" cy="58" r="4" fill={color} />
    {/* Wheel Spokes */}
    {[0, 30, 60, 90, 120, 150].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 52 + 14 * Math.cos(rad);
      const y1 = 58 + 14 * Math.sin(rad);
      const x2 = 52 - 14 * Math.cos(rad);
      const y2 = 58 - 14 * Math.sin(rad);
      return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeOpacity="0.6" />;
    })}

    {/* Sacred Ahimsa Text/Inscription Badge */}
    <circle cx="52" cy="58" r="2" fill="#FFFFFF" />
  </svg>
);

/**
 * 11. TAOISM: Taijitu (Yin and Yang ☯) with Flowing Bagua Rhythms
 */
export const TaoistVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Taoist Taijitu Yin-Yang Balance"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Outer Bagua Trigram Harmony Ring */}
    <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 4" />
    <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="2" strokeOpacity="0.8" />

    {/* Taijitu Circle */}
    {/* Dark / Yin half */}
    <path
      d="M50 14 A 36 36 0 0 0 50 86 A 18 18 0 0 1 50 50 A 18 18 0 0 0 50 14 Z"
      fill={color}
      fillOpacity="0.85"
    />
    {/* Light / Yang half */}
    <path
      d="M50 14 A 36 36 0 0 1 50 86 A 18 18 0 0 1 50 50 A 18 18 0 0 0 50 14 Z"
      fill={color}
      fillOpacity="0.15"
    />

    {/* Seed in Yin (Yang Eye) */}
    <circle cx="50" cy="32" r="5" fill="#FFFFFF" fillOpacity="0.95" />
    {/* Seed in Yang (Yin Eye) */}
    <circle cx="50" cy="68" r="5" fill={color} fillOpacity="0.95" />
  </svg>
);

/**
 * 12. SHINTO: Sacred Torii Gateway (⛩️)
 */
export const ShintoVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Shinto Sacred Torii Gate"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Rising Sun Disk behind Torii */}
    <circle cx="50" cy="46" r="20" fill={color} fillOpacity="0.2" />

    {/* Upper Curved Lintel (Kasagi) with upturned roof tips */}
    <path
      d="M12 24 C28 20 72 20 88 24 L86 28 C70 25 30 25 14 28 Z"
      fill={color}
      fillOpacity="0.95"
    />
    {/* Lower Crossbeam (Nuki) */}
    <rect x="18" y="36" width="64" height="5" rx="1" fill={color} fillOpacity="0.9" />

    {/* Two Main Pillars (Hashira) angled slightly outward at base */}
    <path d="M30 26 L27 84 L33 84 L34 26 Z" fill={color} fillOpacity="0.9" />
    <path d="M70 26 L66 84 L72 84 L73 26 Z" fill={color} fillOpacity="0.9" />

    {/* Central Tablet Tie (Gakuzuka) */}
    <rect x="48" y="24" width="4" height="12" fill={color} fillOpacity="0.95" />

    {/* Pillar Base Stones (Kamebara) */}
    <rect x="24" y="84" width="12" height="4" rx="1" fill={color} fillOpacity="0.75" />
    <rect x="64" y="84" width="12" height="4" rx="1" fill={color} fillOpacity="0.75" />
  </svg>
);

/**
 * 13. INDIGENOUS & CELTIC: Sacred Triquetra Knot & Tree of Life
 */
export const IndigenousCelticVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Celtic Triquetra Trinity Knot and Sacred Earth Circle"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Sacred Earth Interlocking Ring */}
    <circle cx="50" cy="52" r="22" stroke={color} strokeWidth="2" strokeOpacity="0.6" fill="none" />

    {/* Triquetra Knot Petals */}
    {/* Top Petal */}
    <path
      d="M50 16 C66 38 66 64 50 64 C34 64 34 38 50 16 Z"
      stroke={color}
      strokeWidth="2.5"
      fill={color}
      fillOpacity="0.15"
    />
    {/* Bottom Left Petal */}
    <path
      d="M24 68 C36 46 62 46 62 62 C62 78 36 78 24 68 Z"
      stroke={color}
      strokeWidth="2.5"
      fill={color}
      fillOpacity="0.15"
    />
    {/* Bottom Right Petal */}
    <path
      d="M76 68 C64 46 38 46 38 62 C38 78 64 78 76 68 Z"
      stroke={color}
      strokeWidth="2.5"
      fill={color}
      fillOpacity="0.15"
    />

    {/* Center Core of Vitality */}
    <circle cx="50" cy="52" r="3" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
 * 14. CONTEMPLATIVE / INTERFAITH: Living Hearth Labyrinth Mandala
 */
export const ContemplativeInterfaithVisual: React.FC<ReligiousVisualProps> = ({
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Universal Contemplative Living Hearth Mandala"
  >
    {glow && (
      <circle cx="50" cy="50" r="35" fill={color} fillOpacity="0.14" filter="blur(6px)" />
    )}
    {/* Concentric Circles of Pilgrimage */}
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="1.8" strokeOpacity="0.65" />
    <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.8" />

    {/* Central Hearth Flame of Illumination */}
    <path
      d="M50 36 C55 42 56 46 56 50 C56 54 53 58 50 58 C47 58 44 54 44 50 C44 46 45 42 50 36 Z"
      fill={color}
      fillOpacity="0.9"
    />
    <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
  </svg>
);

export type { TraditionVisualType } from '../data/religiousVisualsData';

export interface TraditionVisualProps {
  tradition?: string;
  size?: number;
  className?: string;
  color?: string;
  glow?: boolean;
}

/**
 * Universal TraditionVisual Component
 * Renders the authentic visual emblem for any religion or faith tradition.
 */
export const TraditionVisual: React.FC<TraditionVisualProps> = ({
  tradition = '',
  size = 48,
  className = '',
  color = 'currentColor',
  glow = true,
}) => {
  const visualType = resolveTraditionVisualType(tradition);

  switch (visualType) {
    case 'christianity':
      return <ChristianVisual size={size} className={className} color={color} glow={glow} />;
    case 'catholicism':
      return <CatholicVisual size={size} className={className} color={color} glow={glow} />;
    case 'latter-day-saints':
      return <LatterDaySaintsVisual size={size} className={className} color={color} glow={glow} />;
    case 'islam':
      return <IslamicVisual size={size} className={className} color={color} glow={glow} />;
    case 'judaism':
      return <JudaicVisual size={size} className={className} color={color} glow={glow} />;
    case 'hinduism':
      return <HinduVisual size={size} className={className} color={color} glow={glow} />;
    case 'buddhism':
      return <BuddhistVisual size={size} className={className} color={color} glow={glow} />;
    case 'sikhism':
      return <SikhVisual size={size} className={className} color={color} glow={glow} />;
    case 'bahai':
      return <BahaiVisual size={size} className={className} color={color} glow={glow} />;
    case 'jainism':
      return <JainVisual size={size} className={className} color={color} glow={glow} />;
    case 'taoism':
      return <TaoistVisual size={size} className={className} color={color} glow={glow} />;
    case 'shinto':
      return <ShintoVisual size={size} className={className} color={color} glow={glow} />;
    case 'celtic-indigenous':
      return <IndigenousCelticVisual size={size} className={className} color={color} glow={glow} />;
    case 'contemplative-interfaith':
    default:
      return <ContemplativeInterfaithVisual size={size} className={className} color={color} glow={glow} />;
  }
};

export type { TraditionVisualMeta } from '../data/religiousVisualsData';
export { SACRED_VISUAL_REGISTRY } from '../data/religiousVisualsData';
