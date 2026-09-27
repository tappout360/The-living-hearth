import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { VesicaPiscisSymbol } from './SacredGeometry';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ChevronRight,
  Feather,
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const {
    learningModules,
    selectedLearningId,
    setSelectedLearningId,
    hearthTone,
    timeOfDay,
    setIsPrayComposerOpen,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const selectedModule = learningModules.find((m) => m.id === selectedLearningId);

  const [activeTab, setActiveTab] = useState<'content' | 'comparative'>('content');
  const [isSaved, setIsSaved] = useState(false);

  // If a learning module is selected, render reading and comparative views
  if (selectedModule) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-300">
        {/* Navigation & Header */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
          style={{
            borderColor: 'rgba(232, 168, 124, 0.25)',
            backgroundColor: timeOfDay === 'night' ? '#2E2620' : '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedLearningId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              aria-label="Return to all learning paths"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Pathways
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
                Scholarly Verified
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider font-serif text-stone-400">
              {selectedModule.tradition} • {selectedModule.timeEstimate}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug mt-1 m-0">
              {selectedModule.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-2xl leading-relaxed">
              {selectedModule.shortDescription}
            </p>
          </div>

          {/* Academic citation notice */}
          <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs flex items-center gap-2 text-stone-500">
            <Feather className="w-3.5 h-3.5 shrink-0" style={{ color: currentTone.primary }} />
            <span>
              <strong>Academic Source: </strong>
              {selectedModule.scholarlyCitation}
            </span>
          </div>

          {/* View Mode Toggle (Content vs Vesica Piscis Comparative) */}
          {selectedModule.comparativePair && (
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/20">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all ${
                  activeTab === 'content' ? 'font-semibold shadow-xs' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: activeTab === 'content' ? currentTone.primary : 'transparent',
                  color: activeTab === 'content' ? '#2C2520' : 'inherit',
                  border: `1px solid ${currentTone.primary}50`,
                }}
              >
                📖 Detailed Discourse
              </button>
              <button
                onClick={() => setActiveTab('comparative')}
                className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all flex items-center gap-1.5 ${
                  activeTab === 'comparative' ? 'font-semibold shadow-xs' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: activeTab === 'comparative' ? currentTone.primary : 'transparent',
                  color: activeTab === 'comparative' ? '#2C2520' : 'inherit',
                  border: `1px solid ${currentTone.primary}50`,
                }}
              >
                <VesicaPiscisSymbol size={16} color="currentColor" />
                Vesica Piscis Comparative Study
              </button>
            </div>
          )}
        </div>

        {/* View Tab 1: Detailed Discourse */}
        {activeTab === 'content' && (
          <article className="space-y-6">
            {selectedModule.contentSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl border shadow-xs space-y-2.5 transition-all"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.2)',
                  backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
                }}
              >
                <h3 className="font-serif text-lg font-normal leading-snug m-0" style={{ color: currentTone.primary }}>
                  {sec.heading}
                </h3>
                <p className="font-serif text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
                  {sec.body}
                </p>
              </div>
            ))}

            {/* Reading Actions Bar */}
            <div className="p-4 rounded-3xl border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 flex items-center gap-1.5 font-serif"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
                  <span>{isSaved ? 'Saved to Sanctuary' : 'Save for Contemplation'}</span>
                </button>
                <button
                  onClick={() => setIsPrayComposerOpen(true)}
                  className="px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 flex items-center gap-1.5 font-serif"
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: currentTone.primary }} />
                  <span>Add to Prayer List</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Marked Complete</span>
              </div>
            </div>
          </article>
        )}

        {/* View Tab 2: Vesica Piscis Comparative Dual-Column Study */}
        {activeTab === 'comparative' && selectedModule.comparativePair && (
          <div className="space-y-6">
            {/* Vesica Piscis Central Geometric Header */}
            <div
              className="p-6 sm:p-8 rounded-3xl border text-center space-y-3 relative overflow-hidden"
              style={{
                borderColor: `${currentTone.primary}50`,
                backgroundColor: timeOfDay === 'night' ? '#2E251E' : '#FAF6F0',
              }}
            >
              <div className="flex justify-center">
                <VesicaPiscisSymbol size={96} color={currentTone.primary} className="animate-breath" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal m-0">
                Intersection of Truth: {selectedModule.comparativePair.sharedPrinciple}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
                In sacred geometry, the Vesica Piscis symbolizes the shared lens where two unique traditions illuminate a singular universal truth without erasing their distinct heritage.
              </p>
            </div>

            {/* Dual Column Comparative Layout guided by Golden Ratio / Vesica Piscis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Tradition A Column */}
              <div
                className="p-6 rounded-3xl border space-y-3 shadow-xs"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                  backgroundColor: timeOfDay === 'night' ? '#272019' : '#FFFFFF',
                }}
              >
                <div className="text-[11px] uppercase tracking-wider font-serif text-stone-400">
                  Tradition Stream I
                </div>
                <h4 className="font-serif text-base font-normal">
                  {selectedModule.comparativePair.partnerTradition.split('&')[0].trim()}
                </h4>
                <p className="font-serif text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {selectedModule.comparativePair.traditionAPerspective}
                </p>
              </div>

              {/* Tradition B Column */}
              <div
                className="p-6 rounded-3xl border space-y-3 shadow-xs"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                  backgroundColor: timeOfDay === 'night' ? '#272019' : '#FFFFFF',
                }}
              >
                <div className="text-[11px] uppercase tracking-wider font-serif text-stone-400">
                  Tradition Stream II
                </div>
                <h4 className="font-serif text-base font-normal">
                  {selectedModule.comparativePair.partnerTradition.split('&')[1]?.trim() || 'Contemplative Interfaith'}
                </h4>
                <p className="font-serif text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {selectedModule.comparativePair.traditionBPerspective}
                </p>
              </div>
            </div>

            {/* The Lens of Harmony Card */}
            <div
              className="p-6 rounded-3xl border space-y-2 text-center"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: `${currentTone.primary}12`,
              }}
            >
              <span className="text-xs uppercase font-serif tracking-widest text-stone-500">
                The Sacred Synthesis
              </span>
              <p className="font-serif text-sm sm:text-base italic max-w-xl mx-auto leading-relaxed">
                “{selectedModule.comparativePair.intersectionInsight}”
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render Path of Connected Nodes (Beginner -> Deeper)
  return (
    <div className="space-y-6 pb-24">
      {/* Learning Overview Banner */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-2"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: currentTone.primary }} />
          <h2 className="font-serif text-2xl font-normal leading-snug m-0">
            Scholarly Wisdom Pathways
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
          Curated learning progressions crafted with university religion scholars and authentic practitioners. Rigorous, respectful, and pressure-free.
        </p>
      </div>

      {/* Path of Connected Nodes (Beginner -> Deeper) */}
      <div className="space-y-4">
        {learningModules.map((module, index) => {
          const isComplete = module.progressPercent === 100;
          return (
            <div
              key={module.id}
              onClick={() => setSelectedLearningId(module.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedLearningId(module.id);
                }
              }}
              className="group p-6 rounded-3xl border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-101 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
              }}
              aria-label={`Open learning pathway: ${module.title}`}
            >
              <div className="flex items-start gap-4">
                {/* Node Ring Indicator */}
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                    style={{
                      border: `2px solid ${isComplete ? '#6E8B6B' : currentTone.primary}`,
                      backgroundColor: `${currentTone.primary}15`,
                    }}
                  >
                    <span className="font-serif text-xs font-semibold">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                      {module.tradition}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[10px] text-stone-500">{module.timeEstimate}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-normal leading-snug group-hover:underline">
                    {module.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 max-w-xl leading-relaxed">
                    {module.shortDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[11px] font-mono text-stone-400 block">
                    {module.progressPercent}% Complete
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                  style={{
                    backgroundColor: `${currentTone.primary}20`,
                    color: currentTone.primary,
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
