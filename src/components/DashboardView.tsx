import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings, GoldenRatioSpiral } from './SacredGeometry';
import {
  Sparkles,
  BookOpen,
  Users,
  Lock,
  ChevronRight,
  Calendar,
  X,
  ShieldCheck,
  Feather,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    timeOfDay,
    hearthTone,
    rooms,
    setSelectedRoomId,
    setActiveTab,
    prayers,
    learningModules,
    setSelectedLearningId,
    setIsPrayComposerOpen,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const [isReflectionDismissed, setIsReflectionDismissed] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'Peace at Dawn';
      case 'day':
        return 'Light in the Midst of Day';
      case 'dusk':
        return 'Grace as Evening Falls';
      case 'night':
        return 'Quiet Sanctuary of the Night';
    }
  };

  const getSubGreeting = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'May your morning be untangled, purposeful, and gently held.';
      case 'day':
        return 'A pause between your duties to remember the still center within.';
      case 'dusk':
        return 'Setting aside the day’s labors; welcoming rest and gratitude.';
      case 'night':
        return 'No striving is required of you here. Rest in quiet wonder.';
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* 1. Time of Day Luminous Greeting Header */}
      <section
        aria-label="Daily Sanctuary Greeting"
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xs transition-all duration-500"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor:
            timeOfDay === 'night'
              ? 'rgba(40, 34, 29, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-wider uppercase"
                 style={{ backgroundColor: `${currentTone.primary}20`, color: currentTone.primary }}>
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTone.primary }} />
              Sacred Rhythm • {timeOfDay.toUpperCase()}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight m-0">
              {getGreeting()}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed font-sans">
              {getSubGreeting()}
            </p>
          </div>

          <div className="hidden sm:block shrink-0 relative">
            <ConcentricRings size={96} ringsCount={3} glowColor={currentTone.primary} className="animate-breath" />
          </div>
        </div>

        {/* Optional Dismissible Daily Reflection Card */}
        {!isReflectionDismissed && (
          <div
            className="mt-6 pt-4 border-t border-stone-200/20 flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in"
          >
            <div className="flex items-start gap-2.5">
              <Feather className="w-4 h-4 mt-0.5 shrink-0" style={{ color: currentTone.primary }} />
              <div>
                <span className="font-serif italic text-stone-600 dark:text-stone-300">
                  “Silence is not an absence, but the presence of an intimacy where words are no longer needed.”
                </span>
                <span className="block text-[11px] text-stone-400 mt-0.5">
                  — Contemplative Heritage Series
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsReflectionDismissed(true)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              aria-label="Dismiss daily reflection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 2. Golden Ratio Split: Today's Light (Primary 61.8%) & Practice Rhythm (Secondary 38.2%) */}
      <section
        aria-label="Today's Light and Sacred Practice"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left Column: Today's Light Card (Golden Ratio ~61.8%) */}
        <div
          className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border relative overflow-hidden flex flex-col justify-between shadow-xs transition-all"
          style={{
            borderColor: `${currentTone.primary}40`,
            backgroundColor:
              timeOfDay === 'night' ? '#2F2721' : '#FFFDF9',
          }}
        >
          {/* Subtle Golden Ratio spiral watermark */}
          <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
            <GoldenRatioSpiral size={120} color={currentTone.primary} />
          </div>

          <div className="space-y-3 z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-medium tracking-wide uppercase text-stone-400">
                Today’s Light & Focus
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Season of Contemplation</span>
              </div>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug">
              Cultivating Stillness in an Urgent World
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-lg">
              Take three quiet minutes before continuing. No metrics, no streak pressure, no notifications demanding your gaze. Just breathing in compassion, exhaling agitation.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => setIsPrayComposerOpen(true)}
              className="px-5 py-2.5 rounded-full font-serif text-xs font-medium flex items-center gap-2 transition-transform hover:scale-102 shadow-xs"
              style={{
                backgroundColor: currentTone.primary,
                color: '#2C2520',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Offer an Intention
            </button>

            <button
              onClick={() => {
                setSelectedLearningId('learn-divine-compassion');
                setActiveTab('learn');
              }}
              className="px-4 py-2.5 rounded-full font-serif text-xs font-medium border transition-colors hover:bg-stone-500/10"
              style={{
                borderColor: currentTone.primary,
                color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
              }}
            >
              Explore Today’s Wisdom
            </button>
          </div>
        </div>

        {/* Right Column: Practice Rhythm & Federal Safety (Secondary ~38.2%) */}
        <div
          className="lg:col-span-5 rounded-3xl p-6 border flex flex-col justify-between space-y-4 shadow-xs"
          style={{
            borderColor: 'rgba(232, 168, 124, 0.25)',
            backgroundColor:
              timeOfDay === 'night' ? '#2B231D' : '#FBF7F2',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-medium uppercase text-stone-400">
                Your Sanctuary Status
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-mono">
                Encrypted Vault
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Private Prayers Recorded</span>
                <span className="font-serif font-semibold">{prayers.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Moderated Circles Active</span>
                <span className="font-serif font-semibold">{rooms.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Scholarly Modules Visited</span>
                <span className="font-serif font-semibold">
                  {learningModules.filter((m) => m.progressPercent > 0).length} of {learningModules.length}
                </span>
              </div>
            </div>
          </div>

          {/* HIPAA & Non-solicitation assurance card */}
          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-500 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-medium text-stone-600 dark:text-stone-300">Protected Haven</span>
              <p className="text-[11px] leading-tight">
                Zero solicitations, zero commercial tracking, and active PHI health shielding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Scroll: Your Rooms as Soft Circular / Annular Tiles */}
      <section aria-label="Your Moderated Rooms" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: currentTone.primary }} />
            <h3 className="font-serif text-lg font-normal m-0">Your Rooms & Circles</h3>
          </div>
          <button
            onClick={() => setActiveTab('rooms')}
            className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
          >
            Explore all {rooms.length} rooms
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {rooms.map((room) => {
            const hasActivity = room.activityStatus === 'active' || room.activityStatus === 'glowing';
            return (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setActiveTab('rooms');
                }}
                className="group shrink-0 flex flex-col items-center text-center p-3 rounded-3xl border transition-all duration-300 hover:scale-104 focus:outline-none focus-visible:ring-2"
                style={{
                  width: '160px',
                  backgroundColor:
                    timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                }}
                aria-label={`Open room: ${room.title}, tradition: ${room.tradition}`}
              >
                {/* Circular Motif with Concentric Ring */}
                <div className="relative mb-2.5 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      hasActivity ? 'animate-breath' : ''
                    }`}
                    style={{
                      backgroundColor: `${currentTone.primary}18`,
                      border: `1.5px solid ${currentTone.primary}`,
                    }}
                  >
                    <ConcentricRings size={44} ringsCount={2} glowColor={currentTone.primary} />
                  </div>
                  {hasActivity && (
                    <span
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-stone-900 bg-amber-500"
                      title="Gentle activity glowing"
                    />
                  )}
                </div>

                <span className="font-serif text-xs font-medium line-clamp-1 group-hover:underline">
                  {room.title}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                  {room.tradition}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Continue Learning with Progress Rings */}
      <section aria-label="Continue Learning Paths" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: currentTone.primary }} />
            <h3 className="font-serif text-lg font-normal m-0">Continue Learning Paths</h3>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
          >
            All modules
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningModules.slice(0, 2).map((module) => (
            <div
              key={module.id}
              onClick={() => {
                setSelectedLearningId(module.id);
                setActiveTab('learn');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedLearningId(module.id);
                  setActiveTab('learn');
                }
              }}
              className="p-5 rounded-3xl border cursor-pointer transition-all hover:scale-101 flex items-start gap-4 shadow-xs"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor:
                  timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
              }}
            >
              {/* Circular Progress Indicator */}
              <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-200 dark:text-stone-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    strokeDasharray={`${module.progressPercent}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke={currentTone.primary}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-medium">
                  {module.progressPercent}%
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                    {module.tradition}
                  </span>
                  <span className="text-[10px] text-stone-500">{module.timeEstimate}</span>
                </div>
                <h4 className="font-serif text-sm font-medium leading-snug m-0">
                  {module.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {module.shortDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Private Prayer Log Preview */}
      <section aria-label="Private Prayer Log" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-lg font-normal m-0">Private Prayer Sanctuary</h3>
          </div>
          <button
            onClick={() => setIsPrayComposerOpen(true)}
            className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
          >
            Write new intention
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {prayers.slice(0, 3).map((prayer) => (
            <div
              key={prayer.id}
              className="p-4 rounded-2xl border transition-all"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.2)',
                backgroundColor:
                  timeOfDay === 'night' ? '#2A221C' : '#FAF6F2',
              }}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-serif font-medium" style={{ color: currentTone.primary }}>
                  {prayer.type === 'private'
                    ? '🔒 Private Journal'
                    : prayer.type === 'direct'
                    ? `🕊 Sent to ${prayer.recipientName} (Consent Verified)`
                    : `🕯 Offered in ${prayer.roomName}`}
                </span>
                <span className="text-[11px] text-stone-400">{prayer.timestamp}</span>
              </div>
              <h4 className="font-serif text-sm font-normal mb-1">{prayer.title}</h4>
              <p className="font-serif text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed line-clamp-2">
                “{prayer.content}”
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
