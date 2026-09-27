import React from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings, VesicaPiscisSymbol } from './SacredGeometry';

interface LivingLightFieldProps {
  atmosphereMode?: 'dashboard' | 'learning' | 'practice' | 'discussion' | 'prayer';
}

export const LivingLightField: React.FC<LivingLightFieldProps> = ({
  atmosphereMode = 'dashboard',
}) => {
  const { hearthTone, accessibility } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  if (accessibility.reducedMotion) {
    return null; // Honors reduced sensory load
  }

  // Adjust ambient opacity and tint according to room atmospheric layer
  let auraOpacity = 0.12;
  let lightColor = currentTone.primary;
  let ringSize = 420;

  if (atmosphereMode === 'learning') {
    // Cooler, clearer light for clarity and focus
    auraOpacity = 0.08;
    lightColor = '#A8B5A2';
  } else if (atmosphereMode === 'practice') {
    // Warmer, softer diffusion for stillness
    auraOpacity = 0.18;
    lightColor = currentTone.primary;
    ringSize = 520;
  } else if (atmosphereMode === 'discussion') {
    // Balanced, minimal motion
    auraOpacity = 0.06;
  } else if (atmosphereMode === 'prayer') {
    // Warm lantern glow
    auraOpacity = 0.22;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-1000"
      aria-hidden="true"
    >
      {/* 1. Subtle Radial Living Light Field (Lantern Glow) */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-breath"
        style={{
          width: '650px',
          height: '650px',
          background: `radial-gradient(circle, ${lightColor} 0%, transparent 70%)`,
          opacity: auraOpacity,
        }}
      />

      {/* 2. Floating Abstract Geometry (Extremely low opacity, drifts in background) */}
      <div className="absolute -top-16 -left-16 opacity-5 animate-pulse duration-1000">
        <ConcentricRings size={ringSize} ringsCount={4} glowColor={lightColor} />
      </div>

      <div className="absolute -bottom-24 -right-24 opacity-5">
        <VesicaPiscisSymbol size={380} color={lightColor} />
      </div>

      {/* 3. Subtle floating light particles for Practice rooms */}
      {atmosphereMode === 'practice' && (
        <div className="absolute inset-0">
          <div
            className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: currentTone.primary, animationDuration: '7s' }}
          />
          <div
            className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: currentTone.primary, animationDuration: '9s' }}
          />
        </div>
      )}
    </div>
  );
};
