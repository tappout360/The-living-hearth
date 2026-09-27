import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  SACRED_VISUAL_REGISTRY,
  TraditionVisual,
  type TraditionVisualMeta,
} from './ReligiousVisuals';
import { X, Sparkles, BookOpen, Compass, Shield } from 'lucide-react';

interface SacredVisualsGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTradition?: string;
}

export const SacredVisualsGalleryModal: React.FC<SacredVisualsGalleryModalProps> = ({
  isOpen,
  onClose,
  initialTradition,
}) => {
  const { hearthTone, timeOfDay } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [selectedMeta, setSelectedMeta] = useState<TraditionVisualMeta>(() => {
    if (initialTradition) {
      const match = SACRED_VISUAL_REGISTRY.find((m) =>
        initialTradition.toLowerCase().includes(m.type) || m.displayName.toLowerCase().includes(initialTradition.toLowerCase())
      );
      if (match) return match;
    }
    return SACRED_VISUAL_REGISTRY[0];
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sacred-visuals-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
    >
      <div
        className="w-full max-w-4xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
          borderColor: `${currentTone.primary}60`,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-200/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${currentTone.primary}25`,
                color: currentTone.primary,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sacred-visuals-title" className="font-serif text-xl sm:text-2xl font-normal leading-snug m-0">
                Sacred Visuals & Religious Iconography
              </h2>
              <p className="text-xs text-stone-500 m-0">
                Authentic, reverent vector emblems celebrating the world’s sacred traditions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-500/20 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            aria-label="Close sacred visuals gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Grid List on Left/Top + Detailed Showcase on Right */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tradition Badges Grid */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-serif text-stone-400 block mb-2">
              Select Tradition to Inspect Emblem ({SACRED_VISUAL_REGISTRY.length} Traditions)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SACRED_VISUAL_REGISTRY.map((meta) => {
                const isSelected = selectedMeta.type === meta.type;
                return (
                  <button
                    key={meta.type}
                    onClick={() => setSelectedMeta(meta)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center gap-2 group ${
                      isSelected
                        ? 'shadow-md scale-102 font-medium'
                        : 'hover:bg-stone-500/10 opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isSelected ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                      backgroundColor: isSelected
                        ? `${currentTone.primary}18`
                        : timeOfDay === 'night'
                        ? '#221C18'
                        : '#FFFFFF',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${currentTone.primary}15`,
                        color: currentTone.primary,
                      }}
                    >
                      <TraditionVisual tradition={meta.displayName} size={32} color={currentTone.primary} />
                    </div>
                    <span className="text-xs text-center font-serif leading-tight">
                      {meta.displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Spotlight of Selected Visual */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 border flex flex-col justify-between space-y-6"
            style={{
              borderColor: 'rgba(232, 168, 124, 0.3)',
              backgroundColor: timeOfDay === 'night' ? '#241D18' : '#FFFDFB',
            }}
          >
            <div className="space-y-4">
              {/* Large Spotlight Visual Medallion */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center border shadow-inner animate-breath"
                  style={{
                    backgroundColor: `${currentTone.primary}20`,
                    borderColor: `${currentTone.primary}60`,
                    color: currentTone.primary,
                  }}
                >
                  <TraditionVisual
                    tradition={selectedMeta.displayName}
                    size={80}
                    color={currentTone.primary}
                    glow={true}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-normal leading-snug m-0">
                    {selectedMeta.displayName}
                  </h3>
                  <span className="text-xs font-serif text-stone-500 mt-1 block">
                    {selectedMeta.primaryEmblem}
                  </span>
                </div>
              </div>

              {/* Spiritual Meaning */}
              <div className="p-3.5 rounded-2xl bg-stone-500/10 space-y-1.5 border border-stone-200/20">
                <span className="text-[11px] font-serif uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Sacred Meaning & Symbolism
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed m-0">
                  {selectedMeta.spiritualMeaning}
                </p>
              </div>

              {/* Historic Origins */}
              <div className="p-3.5 rounded-2xl bg-stone-500/10 space-y-1.5 border border-stone-200/20">
                <span className="text-[11px] font-serif uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Historical Lineage
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed m-0">
                  {selectedMeta.historicOrigins}
                </p>
              </div>
            </div>

            {/* Compliance & Scholarly Guarantee Badge */}
            <div className="pt-3 border-t border-stone-200/20 flex items-center gap-2 text-[11px] text-stone-400">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Scholarly curated vector geometry. 100% private, client-side, zero trackers.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200/20 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Rendered natively across all devices with sacred proportion mathematics.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full font-serif text-xs font-medium transition-transform hover:scale-102"
            style={{
              backgroundColor: currentTone.primary,
              color: '#2C2520',
            }}
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
};
