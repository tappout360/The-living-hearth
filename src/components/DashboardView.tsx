import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings, GoldenRatioSpiral } from './SacredGeometry';
import { TraditionVisual } from './ReligiousVisuals';
import { SacredVisualsGalleryModal } from './SacredVisualsGalleryModal';
import { SacredOrientationCompass } from './SacredOrientationCompass';
import {
  getTraditionPersonalizationProfile,
  getUpcomingObservancesForCalendars,
} from '../data/traditionPersonalizationData';
import type { TraditionFilterScope } from '../types';
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
  Filter,
  Check,
  Edit3,
  Compass,
  Bell,
  BookMarked,
  Radio,
  Sliders,
  Clock,
  Home,
  Info,
} from 'lucide-react';
import { PRELOADED_SCRIPTURE_BOOKS } from '../data/scriptureData';
import { CHURCH_BROADCAST_EVENTS } from '../data/churchEventsData';

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
    userProfile,
    updateDisplayName,
    updatePrimaryTradition,
    toggleSameTraditionOnly,
    setSameTraditionScope,
    dismissReflection,
    setActivePrayerDetail,
    joinedRoomIds,
    completedLessonIds,
    orientationHelperEnabled,
    setOrientationHelperEnabled,
    activeCalendarSystems,
    dailyRhythmEnabled,
    spatialHeritageEnabled,
    setIsPersonalizationModalOpen,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const personalizationProfile = getTraditionPersonalizationProfile(userProfile.primaryTradition);
  const upcomingObservances = getUpcomingObservancesForCalendars(activeCalendarSystems);

  // Local state for modals & filtering
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.displayName);
  const [prayerFilter, setPrayerFilter] = useState<'all' | 'journal' | 'sent' | 'received'>('all');
  const [showTraditionFirstTimeReminder, setShowTraditionFirstTimeReminder] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'dawn':
        return `Peace at Dawn, ${userProfile.displayName}`;
      case 'day':
        return `Light in the Midst of Day, ${userProfile.displayName}`;
      case 'dusk':
        return `Grace as Evening Falls, ${userProfile.displayName}`;
      case 'night':
        return `Quiet Sanctuary of the Night, ${userProfile.displayName}`;
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

  // Curate filtered content based on "Same Tradition Only" setting
  const isFilterActive = userProfile.sameTraditionOnly;
  const filterScope = userProfile.sameTraditionScope;

  const filteredRooms = rooms.filter((r) => {
    if (!isFilterActive || (filterScope !== 'rooms' && filterScope !== 'both')) return true;
    return r.tradition.toLowerCase().includes(userProfile.primaryTradition.toLowerCase());
  });

  const filteredLearning = learningModules.filter((m) => {
    if (!isFilterActive || (filterScope !== 'learning' && filterScope !== 'both')) return true;
    return (
      m.tradition.toLowerCase().includes(userProfile.primaryTradition.toLowerCase()) ||
      m.tradition.toLowerCase().includes('comparative')
    );
  });

  // Filter prayers
  const filteredPrayers = prayers.filter((p) => {
    if (prayerFilter === 'journal') return p.destinationType === 'journal';
    if (prayerFilter === 'sent') return p.destinationType === 'person' || p.destinationType === 'room';
    if (prayerFilter === 'received') return (p.responses && p.responses.length > 0) || p.recipientName === userProfile.displayName;
    return true;
  });

  // Map userProfile.primaryTradition to 1 of 5 major traditions for canonical scriptures & streams
  const matchedTraditionKey = (() => {
    const t = userProfile.primaryTradition.toLowerCase();
    if (t.includes('islam') || t.includes('muslim')) return 'islam';
    if (t.includes('juda')) return 'judaism';
    if (t.includes('hindu')) return 'hinduism';
    if (t.includes('buddh')) return 'buddhism';
    return 'christianity';
  })();

  const matchedBook = PRELOADED_SCRIPTURE_BOOKS.find((b) => b.religionId === matchedTraditionKey) || PRELOADED_SCRIPTURE_BOOKS[0];
  const dailyScripture = matchedBook.chapters[0];

  const traditionEvents = CHURCH_BROADCAST_EVENTS.filter((e) =>
    e.religionId === matchedTraditionKey
  );
  const featuredEvent = traditionEvents[0] || CHURCH_BROADCAST_EVENTS[0];

  const handleToggleSameTradition = () => {
    if (!userProfile.sameTraditionOnly && !userProfile.hasSeenTraditionFilterNotice) {
      setShowTraditionFirstTimeReminder(true);
    }
    toggleSameTraditionOnly();
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName(tempName);
    setIsEditingName(false);
  };

  const traditionOptions = [
    'Christianity',
    'Catholicism',
    'Latter-day Saint Tradition (Mormonism)',
    'Islam',
    'Judaism',
    'Hinduism',
    'Buddhism',
    'Sikhism',
    'Bahá\'í Faith',
    'Jainism',
    'Taoism & East Asian Traditions',
    'Shinto',
    'Celtic & Indigenous Traditions',
    'Spiritualism & Spiritism',
    'Spiritual but not religious',
    'Exploring & Interfaith',
    'Prefer not to say',
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* 1. Personal Hearth Header with Display Name & Sacred Focus Controls */}
      <section
        aria-label="Personal Faith Dashboard and Greeting"
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
          <div className="space-y-2 z-10 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif tracking-wider uppercase"
                style={{ backgroundColor: `${currentTone.primary}20`, color: currentTone.primary }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTone.primary }} />
                Sacred Rhythm • {timeOfDay.toUpperCase()}
              </div>

              {/* Focus Badge with Clickable Popover */}
              <button
                onClick={() => setIsFocusModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif border border-stone-300/40 hover:border-amber-400 transition-colors"
                title="Customize Primary Tradition and Focus"
              >
                <Compass className="w-3 h-3 text-amber-500" />
                <span>Focus: {userProfile.primaryTradition}</span>
                <ChevronRight className="w-3 h-3 text-stone-400" />
              </button>

              {/* Personalization Layer Button */}
              <button
                onClick={() => setIsPersonalizationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif border border-stone-300/40 hover:border-amber-400 transition-colors"
                style={{ backgroundColor: `${currentTone.primary}12` }}
                title="Tradition-Aware Personalization & Dignity Matrix"
              >
                <Sliders className="w-3 h-3 text-amber-600" />
                <span>Personalization</span>
              </button>
            </div>

            {/* Display Name with Quick Edit */}
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-3 py-1 rounded-xl border border-amber-400 bg-transparent text-xl font-serif"
                  placeholder="Your preferred name"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl text-xs font-serif"
                  style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1 text-xs text-stone-400"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight m-0">
                  {getGreeting()}
                </h2>
                <button
                  onClick={() => {
                    setTempName(userProfile.displayName);
                    setIsEditingName(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-stone-600"
                  aria-label="Edit display name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-sm text-stone-500 leading-relaxed font-sans">
              {getSubGreeting()}
            </p>
          </div>

          <div className="shrink-0 relative flex flex-col items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => setIsGalleryOpen(true)}
              title={`Inspect Sacred Iconography for ${userProfile.primaryTradition}`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border shadow-md hover:scale-105 transition-transform cursor-pointer relative group"
              style={{
                backgroundColor: `${currentTone.primary}20`,
                borderColor: `${currentTone.primary}60`,
                color: currentTone.primary,
              }}
            >
              <TraditionVisual tradition={userProfile.primaryTradition} size={54} color={currentTone.primary} glow={true} />
              <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-stone-900/85 text-[10px] text-amber-200 border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xs">
                Sacred Visual
              </span>
            </button>
            <span className="text-[11px] font-serif text-stone-400 text-center max-w-[110px] truncate">
              {userProfile.primaryTradition}
            </span>
          </div>
        </div>

        {/* Focus Banner: "Same Tradition Only" Filter Toggle */}
        <div className="mt-6 pt-4 border-t border-stone-200/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="font-medium text-stone-700 dark:text-stone-200">
                “Show Only My Tradition” Filter:
              </span>
              <span className="ml-1 text-stone-500">
                {userProfile.sameTraditionOnly
                  ? `Active (${userProfile.sameTraditionScope} prioritized for ${userProfile.primaryTradition})`
                  : 'Off (Full access to all 25+ global traditions)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSameTradition}
              className={`px-3.5 py-1.5 rounded-full font-serif text-xs font-medium border transition-all ${
                userProfile.sameTraditionOnly
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'border-stone-300/40 hover:bg-stone-500/10'
              }`}
            >
              {userProfile.sameTraditionOnly ? 'Filter Active (Tap to Disable)' : 'Activate My Tradition Only'}
            </button>

            <button
              onClick={() => setIsFocusModalOpen(true)}
              className="p-1.5 rounded-full border border-stone-300/30 hover:bg-stone-500/10"
              title="Configure Focus Settings"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Soft First-time Tradition Filter Reminder */}
        {showTraditionFirstTimeReminder && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-600 dark:text-stone-300 flex items-start justify-between gap-2 animate-in fade-in">
            <p className="m-0 leading-relaxed">
              <strong>Gentle Notice: </strong> You will mainly see learning and community circles related to your chosen tradition ({userProfile.primaryTradition}). You can reverse or refine this filter at any time to explore all world paths.
            </p>
            <button
              onClick={() => setShowTraditionFirstTimeReminder(false)}
              className="p-1 text-stone-400 hover:text-stone-600 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Optional Dismissible Daily Reflection Card */}
        {!userProfile.isReflectionDismissed && (
          <div className="mt-4 pt-3 border-t border-stone-200/10 flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <Feather className="w-4 h-4 mt-0.5 shrink-0" style={{ color: currentTone.primary }} />
              <div>
                <span className="font-serif italic text-stone-600 dark:text-stone-300">
                  “Silence is not an absence, but the presence of an intimacy where words are no longer needed.”
                </span>
                <span className="block text-[11px] text-stone-400 mt-0.5">
                  — Contemplative Heritage Series • Reflecting with {userProfile.primaryTradition}
                </span>
              </div>
            </div>
            <button
              onClick={dismissReflection}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              aria-label="Dismiss daily reflection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 1.5. Sacred Times & Holy Days Multi-Calendar Ribbon */}
      <section
        aria-label="Upcoming Sacred Times and Multi-Calendar Observances"
        className="rounded-3xl p-5 sm:p-6 border shadow-xs transition-all space-y-3"
        style={{
          borderColor: `${currentTone.primary}30`,
          backgroundColor:
            timeOfDay === 'night' ? 'rgba(42, 35, 29, 0.85)' : 'rgba(255, 253, 249, 0.95)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-base sm:text-lg font-normal m-0">
              Sacred Times & Observances
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-mono">
              {activeCalendarSystems.length} calendar systems active
            </span>
          </div>
          <button
            onClick={() => setIsPersonalizationModalOpen(true)}
            className="text-xs font-serif text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Calendars & Systems</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          {upcomingObservances.map((obs) => (
            <div
              key={obs.id}
              className="p-3.5 rounded-2xl border transition-all hover:scale-101 space-y-1.5"
              style={{
                borderColor: obs.beginsAtSunset ? `${currentTone.primary}45` : 'rgba(232, 168, 124, 0.2)',
                backgroundColor: obs.beginsAtSunset ? `${currentTone.primary}0D` : 'transparent',
              }}
            >
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="font-mono px-1.5 py-0.5 rounded-md bg-stone-500/10 text-stone-500 uppercase">
                  {obs.calendarSystem.replace('_', ' ')}
                </span>
                <span className="font-serif font-medium text-amber-700 dark:text-amber-300">
                  {obs.dateDisplay}
                </span>
              </div>
              <h4 className="font-serif text-sm font-medium leading-tight m-0 text-stone-800 dark:text-stone-100">
                {obs.name}
              </h4>
              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {obs.description}
              </p>
              <div className="text-[10px] text-stone-400 font-serif pt-0.5">
                Tradition: {obs.traditionId}
              </div>
            </div>
          ))}
        </div>
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
            backgroundColor: timeOfDay === 'night' ? '#2F2721' : '#FFFDF9',
          }}
        >
          <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
            <GoldenRatioSpiral size={120} color={currentTone.primary} />
          </div>

          <div className="space-y-3 z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-medium tracking-wide uppercase text-stone-400">
                Today’s Light & Focus • {userProfile.primaryTradition}
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
            backgroundColor: timeOfDay === 'night' ? '#2B231D' : '#FBF7F2',
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
                <span className="font-serif font-semibold">{prayers.length} intentions</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Circles Joined / Available</span>
                <span className="font-serif font-semibold">
                  {joinedRoomIds.length} joined ({filteredRooms.length} available)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Scholarly Lessons Completed</span>
                <span className="font-serif font-semibold">
                  {completedLessonIds.length} completed ({filteredLearning.length} paths)
                </span>
              </div>
            </div>
          </div>

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

      {/* 2.5. Personal Faith Sanctuary: Daily Canonical Scripture & House of Worship Stream */}
      <section
        aria-label="Personalized Scripture & Stream"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Daily Scripture Card */}
        <div
          className="rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4"
          style={{
            borderColor: `${currentTone.primary}35`,
            backgroundColor: timeOfDay === 'night' ? '#2F2721' : '#FFFDF9',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-serif uppercase tracking-wider text-amber-600 font-semibold flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5" />
                Scripture of the Day • {matchedTraditionKey}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {dailyScripture.verses.length} verses
              </span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-normal leading-snug m-0">
                {dailyScripture.title}
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                {matchedBook.title} • {matchedBook.originalLanguage}
              </p>
            </div>

            <p className="text-xs sm:text-sm font-serif italic text-stone-700 dark:text-stone-300 line-clamp-3 leading-relaxed border-l-2 pl-3" style={{ borderColor: currentTone.primary }}>
              “{dailyScripture.verses[0]?.text}”
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-200/20">
            <span className="text-[11px] text-stone-400">
              Highlighter & Margins Ready
            </span>
            <button
              onClick={() => setActiveTab('scripture')}
              className="px-4 py-1.5 rounded-full text-xs font-serif font-medium border flex items-center gap-1.5 hover:scale-102 transition-transform"
              style={{
                backgroundColor: `${currentTone.primary}20`,
                borderColor: currentTone.primary,
                color: currentTone.primary,
              }}
            >
              <span>Study & Highlight</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Verified House of Worship Stream Card */}
        <div
          className="rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4"
          style={{
            borderColor: `${currentTone.primary}35`,
            backgroundColor: timeOfDay === 'night' ? '#2F2721' : '#FFFDF9',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-serif uppercase tracking-wider text-emerald-600 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Worship & Events • {matchedTraditionKey}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-mono">
                {featuredEvent.broadcastType === 'live' ? 'LIVE NOW' : 'Pre-recorded'}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-normal leading-snug m-0">
                {featuredEvent.title}
              </h3>
              <p className="text-xs text-stone-500 font-serif mt-0.5">
                {featuredEvent.houseOfWorshipName} • {featuredEvent.sacredRhythmTag}
              </p>
            </div>

            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {featuredEvent.description}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-200/20">
            <span className="text-[11px] text-stone-400">
              Speaker: {featuredEvent.speaker}
            </span>
            <button
              onClick={() => setActiveTab('churches')}
              className="px-4 py-1.5 rounded-full text-xs font-serif font-medium border flex items-center gap-1.5 hover:scale-102 transition-transform"
              style={{
                backgroundColor: `${currentTone.primary}20`,
                borderColor: currentTone.primary,
                color: currentTone.primary,
              }}
            >
              <span>Join Sanctuary Stream</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 2.6. Sacred Orientation & Daily Practice Rhythm (Tradition Personalization Dimensions) */}
      <section
        aria-label="Sacred Orientation and Daily Practice Rhythm"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left Column: Daily Practice Rhythm (if enabled) */}
        <div
          className={`${orientationHelperEnabled ? 'lg:col-span-6' : 'lg:col-span-12'} rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4`}
          style={{
            borderColor: `${currentTone.primary}35`,
            backgroundColor: timeOfDay === 'night' ? '#2B231D' : '#FBF7F2',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-base sm:text-lg font-normal m-0">
                  Suggested Practice Rhythm • {userProfile.primaryTradition}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-serif">
                Non-Mandatory Windows
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Gentle windows derived from the historic daily cadence of {userProfile.primaryTradition}. Offered for contemplation without alarms, guilt, or compliance scoring.
            </p>

            {dailyRhythmEnabled ? (
              <div className="space-y-2 pt-1">
                {personalizationProfile.dailyRhythm.map((rhythm) => (
                  <div
                    key={rhythm.id}
                    className="p-3 rounded-2xl border flex items-start justify-between gap-3 text-xs"
                    style={{
                      borderColor: 'rgba(232, 168, 124, 0.25)',
                      backgroundColor:
                        timeOfDay === 'night' ? 'rgba(40, 34, 29, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-semibold text-stone-800 dark:text-stone-100">
                          {rhythm.name}
                        </span>
                        {rhythm.traditionalName && (
                          <span className="text-[11px] text-stone-400 italic">
                            ({rhythm.traditionalName})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {rhythm.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
                        {rhythm.timeWindow}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-2">
                <p className="text-xs text-stone-400">Daily practice rhythm is currently paused.</p>
                <button
                  onClick={() => setIsPersonalizationModalOpen(true)}
                  className="text-xs font-serif text-amber-600 underline"
                >
                  Enable in Personalization Settings
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-200/20 text-[11px] text-stone-400">
            <span>Harmonized with solar/lunar movement</span>
            <button
              onClick={() => setIsPersonalizationModalOpen(true)}
              className="text-amber-600 hover:underline"
            >
              Customize Rhythm
            </button>
          </div>
        </div>

        {/* Right Column: Sacred Orientation Compass (if enabled) or Opt-in Card */}
        {orientationHelperEnabled ? (
          <div className="lg:col-span-6">
            <SacredOrientationCompass profile={personalizationProfile} />
          </div>
        ) : (
          <div
            className="lg:col-span-6 rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4"
            style={{
              borderColor: `${currentTone.primary}35`,
              backgroundColor: timeOfDay === 'night' ? '#2F2721' : '#FFFDF9',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <h3 className="font-serif text-base sm:text-lg font-normal m-0">
                    Sacred Orientation Helper (Opt-In)
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/15 text-stone-400 font-mono">
                  Off by Default
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Many traditions honor facing a specific sacred center or cardinal direction during prayer or meditation.
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs">
                <div className="font-serif font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Focus for {userProfile.primaryTradition}:{' '}
                    {personalizationProfile.orientation.target?.name ||
                      (personalizationProfile.orientation.cardinalDirection
                        ? `${personalizationProfile.orientation.cardinalDirection}-facing`
                        : 'Inward / Center of Prayer')}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                  {personalizationProfile.orientation.target?.theologicalSignificance ||
                    personalizationProfile.orientation.advisoryNote}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-stone-200/20">
              <span className="text-[11px] text-stone-400">Geodesic Azimuth Calculation</span>
              <button
                onClick={() => setOrientationHelperEnabled(true)}
                className="px-4 py-2 rounded-full font-serif text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102"
                style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Enable Compass Dial</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2.7. Spatial Heritage & Contemplative Environment Card */}
      {spatialHeritageEnabled && (
        <section
          aria-label="Spatial and Environmental Heritage"
          className="rounded-3xl p-6 border shadow-xs space-y-3"
          style={{
            borderColor: `${currentTone.primary}25`,
            backgroundColor:
              timeOfDay === 'night' ? 'rgba(38, 31, 26, 0.9)' : 'rgba(254, 252, 248, 0.95)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base sm:text-lg font-normal m-0">
                Spatial & Environmental Heritage • {personalizationProfile.spatialHeritage.systemName}
              </h3>
            </div>
            <span className="text-[10px] text-stone-400 font-serif">
              Tradition: {personalizationProfile.traditionName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif italic">
            “{personalizationProfile.spatialHeritage.corePrinciple}”
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            {personalizationProfile.spatialHeritage.gentleGuidance.slice(0, 2).map((guidance, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1"
              >
                <span className="font-serif font-semibold text-amber-700 dark:text-amber-300 block">
                  Guidance Principle {idx + 1}:
                </span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {guidance}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-stone-400 font-sans pt-1">
            <strong>Advisory Note:</strong> {personalizationProfile.spatialHeritage.educationalDisclaimer}
          </p>
        </section>
      )}

      {/* 3. Horizontal Scroll: Moderated Circles / Rooms */}
      <section aria-label="Moderated Circles and Rooms" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: currentTone.primary }} />
            <h3 className="font-serif text-lg font-normal m-0">Your Rooms & Circles</h3>
            {isFilterActive && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-serif">
                Filtered: {userProfile.primaryTradition}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isFilterActive && (
              <button
                onClick={() => toggleSameTraditionOnly(false)}
                className="text-xs font-serif text-amber-600 hover:underline"
              >
                Clear filter
              </button>
            )}
            <button
              onClick={() => setActiveTab('rooms')}
              className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
            >
              Explore all {rooms.length} rooms
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {filteredRooms.map((room) => {
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
                  backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                }}
                aria-label={`Open room: ${room.title}, tradition: ${room.tradition}`}
              >
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
            {isFilterActive && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-serif">
                Prioritizing: {userProfile.primaryTradition}
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
          >
            Explore all traditions
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLearning.slice(0, 2).map((module) => (
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
                backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
              }}
            >
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

      {/* 5. Personal Prayer Log & Sanctuary with Interactive Detail View */}
      <section aria-label="Personal Prayer Log" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-lg font-normal m-0">Private Prayer Sanctuary</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-stone-500/10 text-xs">
              {(['all', 'journal', 'sent', 'received'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPrayerFilter(mode)}
                  className={`px-2.5 py-1 rounded-full font-serif capitalize transition-colors ${
                    prayerFilter === mode ? 'bg-white dark:bg-stone-800 shadow-xs font-medium' : 'text-stone-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPrayComposerOpen(true)}
              className="text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 flex items-center gap-1"
            >
              Write new
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredPrayers.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-serif text-xs rounded-2xl border border-stone-200/20">
              No intentions found in this view.
            </div>
          ) : (
            filteredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                onClick={() => setActivePrayerDetail(prayer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActivePrayerDetail(prayer);
                }}
                className="p-4 rounded-2xl border cursor-pointer transition-all hover:scale-101 space-y-1.5 shadow-xs"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.2)',
                  backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FAF6F2',
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium" style={{ color: currentTone.primary }}>
                      {prayer.destinationType === 'journal'
                        ? '🔒 Private Journal'
                        : prayer.destinationType === 'person'
                        ? `🕊 To ${prayer.recipientName}`
                        : `🕯 Room: ${prayer.roomName}`}
                    </span>
                    {prayer.privateReminder && prayer.privateReminder !== 'none' && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Bell className="w-2.5 h-2.5" />
                        {prayer.privateReminder}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400">{prayer.timestamp}</span>
                </div>

                <h4 className="font-serif text-sm font-normal m-0">{prayer.title}</h4>
                <p className="font-serif text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed line-clamp-2">
                  “{prayer.content}”
                </p>

                {prayer.responses && prayer.responses.length > 0 && (
                  <div className="pt-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{prayer.responses.length} response(s) held in quiet prayer</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Focus & Tradition Customization Modal */}
      {isFocusModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-normal m-0">Primary Tradition & Focus Controls</h3>
              </div>
              <button onClick={() => setIsFocusModalOpen(false)} className="p-1 rounded-full hover:bg-stone-500/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Primary Tradition Selector */}
            <div className="space-y-2">
              <label className="font-serif text-xs font-semibold block">Designate Primary Tradition / Path:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {traditionOptions.map((trad) => (
                  <button
                    key={trad}
                    onClick={() => updatePrimaryTradition(trad)}
                    className={`p-2.5 rounded-xl border text-left font-serif transition-colors flex items-center justify-between ${
                      userProfile.primaryTradition === trad
                        ? 'ring-2 font-semibold shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: userProfile.primaryTradition === trad ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                      backgroundColor: userProfile.primaryTradition === trad ? `${currentTone.primary}20` : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <TraditionVisual tradition={trad} size={18} color={currentTone.primary} />
                      <span className="truncate">{trad}</span>
                    </div>
                    {userProfile.primaryTradition === trad && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Same Tradition Only Toggle & Scope */}
            <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif font-semibold block">“Show Only My Tradition” Toggle</span>
                  <span className="text-[11px] text-stone-400">Limit Dashboard and Discovery to {userProfile.primaryTradition}</span>
                </div>
                <input
                  type="checkbox"
                  checked={userProfile.sameTraditionOnly}
                  onChange={(e) => toggleSameTraditionOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </div>

              {userProfile.sameTraditionOnly && (
                <div className="pt-2 border-t border-stone-200/20 space-y-2">
                  <span className="font-serif font-medium text-[11px] block">Granular Filter Scope:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['learning', 'rooms', 'both'] as TraditionFilterScope[]).map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => setSameTraditionScope(scope)}
                        className={`p-2 rounded-xl text-center capitalize border text-xs font-serif ${
                          userProfile.sameTraditionScope === scope ? 'ring-1 border-amber-400 font-semibold' : 'opacity-70'
                        }`}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFocusModalOpen(false)}
                className="px-5 py-2 rounded-full font-serif text-xs font-semibold"
                style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sacred Visuals Gallery Modal */}
      <SacredVisualsGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialTradition={userProfile.primaryTradition}
      />
    </div>
  );
};
