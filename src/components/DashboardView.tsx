import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings, GoldenRatioSpiral } from './SacredGeometry';
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
    userProfile,
    updateDisplayName,
    updatePrimaryTradition,
    toggleSameTraditionOnly,
    setSameTraditionScope,
    dismissReflection,
    setActivePrayerDetail,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];

  // Local state for modals & filtering
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.displayName);
  const [prayerFilter, setPrayerFilter] = useState<'all' | 'journal' | 'sent' | 'received'>('all');
  const [showTraditionFirstTimeReminder, setShowTraditionFirstTimeReminder] = useState(false);

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
    'Islam',
    'Judaism',
    'Hinduism',
    'Buddhism',
    'Celtic & Indigenous Traditions',
    'Spiritualism & Spiritism',
    'Taoism & East Asian Traditions',
    'Sikhism',
    'Baha’i Faith',
    'Spiritual but not religious',
    'Exploring',
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

          <div className="hidden sm:block shrink-0 relative">
            <ConcentricRings size={96} ringsCount={3} glowColor={currentTone.primary} className="animate-breath" />
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
                <span className="font-serif font-semibold">{prayers.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Circles Available</span>
                <span className="font-serif font-semibold">
                  {filteredRooms.length} {isFilterActive && `(Filtered to ${userProfile.primaryTradition})`}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-200/20">
                <span className="text-stone-500">Scholarly Modules</span>
                <span className="font-serif font-semibold">
                  {filteredLearning.length} modules
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
                    <span>{trad}</span>
                    {userProfile.primaryTradition === trad && <Check className="w-3.5 h-3.5 text-amber-500" />}
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
    </div>
  );
};
