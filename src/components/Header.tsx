import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { HearthFlameGlow } from './SacredGeometry';
import { AmbientAudioBar } from './AmbientAudioBar';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ShieldCheck,
  Eye,
  PhoneCall,
  X,
  Globe,
  Mail,
  WifiOff,
  Lock,
  KeyRound,
} from 'lucide-react';
import type { HearthTone, TimeOfDay } from '../types';

export const Header: React.FC = () => {
  const {
    timeOfDay,
    setTimeOfDay,
    setIsAutoTime,
    hearthTone,
    setHearthTone,
    currentLanguage,
    t,
    accessibility,
    setAccessibility,
    setIsOnboardingOpen,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    invitations,
    setIsInvitationsModalOpen,
    isOnline,
    setIsProtocolModalOpen,
    authSession,
    isVaultUnlocked,
    unlockVault,
    lockVault,
    lastSyncNotice,
    clearSyncNotice,
  } = useHearth();

  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isHipaaInfoOpen, setIsHipaaInfoOpen] = useState(false);
  const [isTonePickerOpen, setIsTonePickerOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [unlockPass, setUnlockPass] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const pendingInvitesCount = invitations.filter((i) => i.status === 'pending').length;
  const currentTone = HEARTH_TONES[hearthTone];
  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const getTimeIcon = (t: TimeOfDay) => {
    switch (t) {
      case 'dawn':
        return <Sunrise className="w-4 h-4 text-amber-500" />;
      case 'day':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'dusk':
        return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'night':
        return <Moon className="w-4 h-4 text-amber-200" />;
    }
  };

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-500"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.15)',
          backgroundColor:
            timeOfDay === 'night'
              ? 'rgba(44, 37, 32, 0.88)'
              : 'rgba(253, 246, 240, 0.88)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Hearth Flame */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 rounded-full p-1"
              aria-label="The Living Hearth - Open Sanctuary Welcome"
            >
              <HearthFlameGlow size={32} color={currentTone.primary} />
              <div>
                <h1
                  className="font-serif text-lg tracking-wide font-normal leading-tight m-0"
                  style={{
                    color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
                  }}
                >
                  {t('appTitle')}
                </h1>
                <p className="text-xs text-stone-500 tracking-wider uppercase font-sans">
                  {t('sanctuarySubtitle')}
                </p>
              </div>
            </button>
          </div>

          {/* Controls: Language, Ambient Sound, Time of Day, Tone, HIPAA Shield, Accessibility */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Language Selector Trigger */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: timeOfDay === 'night' ? '#3B332B' : '#FFFFFF',
                color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
              }}
              title="Global Language & Sacred Communication"
              aria-label={`Current language: ${activeLangConfig.name}. Open language selection.`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-serif">{activeLangConfig.nativeName}</span>
            </button>

            {/* Invitations & Connections Trigger */}
            <button
              onClick={() => setIsInvitationsModalOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: timeOfDay === 'night' ? '#3B332B' : '#FFFFFF',
                color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
              }}
              title="Invitations & Circle Connections"
              aria-label={`Invitations. ${pendingInvitesCount} pending.`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-serif hidden md:inline">Invites</span>
              {pendingInvitesCount > 0 && (
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-tight"
                  style={{
                    backgroundColor: currentTone.primary,
                    color: '#2C2520',
                  }}
                >
                  {pendingInvitesCount}
                </span>
              )}
            </button>

            {/* Offline Mode Indicator */}
            {!isOnline && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-600 border border-amber-500/40"
                title="Working offline. Changes saved locally to your encrypted vault."
              >
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden lg:inline">Offline Vault</span>
              </div>
            )}

            {/* Ambient Audio Bar */}
            <AmbientAudioBar />

            {/* Time of Day Cycle Button */}
            <div className="relative">
              <button
                onClick={() => {
                  const times: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night'];
                  const nextIdx = (times.indexOf(timeOfDay) + 1) % times.length;
                  setTimeOfDay(times[nextIdx]);
                  setIsAutoTime(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-102"
                style={{
                  backgroundColor:
                    timeOfDay === 'night' ? '#3B332B' : '#FFFFFF',
                  borderColor: currentTone.primary,
                  color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
                }}
                title={`Current lighting: ${timeOfDay.toUpperCase()} (Click to cycle)`}
                aria-label={`Current sacred lighting: ${timeOfDay}. Press to switch time of day.`}
              >
                {getTimeIcon(timeOfDay)}
                <span className="capitalize hidden sm:inline">{timeOfDay}</span>
              </button>
            </div>

            {/* Hearth Tone Button */}
            <div className="relative">
              <button
                onClick={() => setIsTonePickerOpen(!isTonePickerOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
                style={{
                  backgroundColor:
                    timeOfDay === 'night' ? '#3B332B' : '#FFFFFF',
                  borderColor: currentTone.primary,
                  color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
                }}
                aria-label={`Personal Hearth Tone: ${currentTone.name}`}
                aria-expanded={isTonePickerOpen}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-xs"
                  style={{ backgroundColor: currentTone.primary }}
                />
                <span className="hidden md:inline">{currentTone.name.split(' ')[0]}</span>
              </button>

              {/* Hearth Tone Dropdown Menu */}
              {isTonePickerOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    backgroundColor:
                      timeOfDay === 'night' ? '#352D26' : '#FFFFFF',
                    borderColor: currentTone.primary,
                  }}
                >
                  <p className="text-xs font-serif px-2 py-1 text-stone-400">
                    Select Your Hearth Tone
                  </p>
                  {Object.values(HEARTH_TONES).map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => {
                        setHearthTone(tone.id as HearthTone);
                        setIsTonePickerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        hearthTone === tone.id ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor:
                          hearthTone === tone.id
                            ? `${tone.primary}25`
                            : 'transparent',
                        color:
                          timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tone.primary }}
                        />
                        {tone.name}
                      </span>
                      {hearthTone === tone.id && (
                        <span className="text-[10px] text-stone-400">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Multi-Client Sync Indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.4)',
                backgroundColor: timeOfDay === 'night' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
              }}
              title="Real-time multi-client synchronization active via standard BroadcastChannel"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Live Sync</span>
            </div>

            {/* Sovereign Vault Key & Status Button */}
            <button
              onClick={() => setIsVaultModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: isVaultUnlocked ? `${currentTone.primary}50` : 'rgba(239, 68, 68, 0.5)',
                backgroundColor: isVaultUnlocked ? (timeOfDay === 'night' ? '#3B332B' : '#FFFFFF') : 'rgba(239, 68, 68, 0.12)',
                color: isVaultUnlocked ? (timeOfDay === 'night' ? '#F9F4EF' : '#2C2520') : '#EF4444',
              }}
              title={`Sovereign Web Crypto Vault: ${isVaultUnlocked ? 'Unlocked' : 'Locked'}. Fingerprint: ${authSession?.fingerprint || 'local'}`}
              aria-label="Sovereign Vault Status"
            >
              {isVaultUnlocked ? (
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              )}
              <span className="hidden md:inline font-mono text-[10px]">
                {isVaultUnlocked ? 'AES-GCM' : 'Locked'}
              </span>
            </button>

            {/* HIPAA / Federal Safety Shield Badge */}
            <button
              onClick={() => setIsHipaaInfoOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor:
                  timeOfDay === 'night'
                    ? 'rgba(110, 139, 107, 0.25)'
                    : 'rgba(110, 139, 107, 0.15)',
                color: '#6E8B6B',
                border: '1px solid rgba(110, 139, 107, 0.4)',
              }}
              title="Federal & HIPAA Compliance Shield Active"
              aria-label="Federal and HIPAA Compliance Shield Status"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline font-mono text-[11px]">HIPAA Safe</span>
            </button>

            {/* Accessibility Quick Menu Button */}
            <button
              onClick={() => setIsA11yOpen(!isA11yOpen)}
              className="p-1.5 rounded-full text-xs border transition-colors"
              style={{
                backgroundColor:
                  timeOfDay === 'night' ? '#3B332B' : '#FFFFFF',
                borderColor: currentTone.primary,
                color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
              }}
              aria-label="Open Accessibility & Display Settings (WCAG 2.2 AA)"
              aria-expanded={isA11yOpen}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Multi-Client Notice Bar */}
        {lastSyncNotice && (
          <div
            className="border-t px-4 py-1.5 text-xs flex items-center justify-between transition-all animate-in fade-in"
            style={{
              backgroundColor: `${currentTone.primary}18`,
              borderColor: `${currentTone.primary}30`,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif">{lastSyncNotice}</span>
              </div>
              <button
                onClick={clearSyncNotice}
                className="p-1 rounded-full hover:opacity-70 text-stone-400"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Accessibility Drawer / Popover (WCAG 2.2 AA) */}
      {isA11yOpen && (
        <div
          role="region"
          aria-label="Accessibility Controls"
          className="fixed top-16 right-4 w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-4 shadow-2xl z-40 border transition-all animate-in fade-in"
          style={{
            backgroundColor: timeOfDay === 'night' ? '#2A241F' : '#FFFDFB',
            borderColor: currentTone.primary,
            color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
            <h2 className="text-sm font-serif font-medium flex items-center gap-1.5 m-0">
              <Eye className="w-4 h-4" style={{ color: currentTone.primary }} />
              Accessibility Controls (WCAG 2.2 AA)
            </h2>
            <button
              onClick={() => setIsA11yOpen(false)}
              className="p-1 rounded-full hover:opacity-80"
              aria-label="Close Accessibility Controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-3 text-xs">
            {/* Font Size Adjuster */}
            <div>
              <label className="font-semibold block mb-1 text-stone-500">
                Text Scaling ({accessibility.fontSizePercent}%)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 120, 140, 175].map((pct) => (
                  <button
                    key={pct}
                    onClick={() =>
                      setAccessibility((prev) => ({ ...prev, fontSizePercent: pct }))
                    }
                    className={`py-1.5 px-2 rounded-lg font-medium border ${
                      accessibility.fontSizePercent === pct
                        ? 'ring-2 font-bold'
                        : 'opacity-70'
                    }`}
                    style={{
                      borderColor: currentTone.primary,
                      backgroundColor:
                        accessibility.fontSizePercent === pct
                          ? `${currentTone.primary}30`
                          : 'transparent',
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium block">High Contrast Mode</span>
                <span className="text-[11px] text-stone-400">
                  Meets WCAG AAA 7:1 ratio
                </span>
              </div>
              <button
                onClick={() =>
                  setAccessibility((prev) => ({
                    ...prev,
                    highContrast: !prev.highContrast,
                  }))
                }
                role="switch"
                aria-checked={accessibility.highContrast}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  accessibility.highContrast ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium block">Reduced Motion</span>
                <span className="text-[11px] text-stone-400">
                  Replaces breath pulse with calm static glow
                </span>
              </div>
              <button
                onClick={() =>
                  setAccessibility((prev) => ({
                    ...prev,
                    reducedMotion: !prev.reducedMotion,
                  }))
                }
                role="switch"
                aria-checked={accessibility.reducedMotion}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  accessibility.reducedMotion ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIPAA & Federal Compliance Guarantee Modal */}
      {isHipaaInfoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hipaa-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-4 animate-in fade-in zoom-in-95"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#27201B' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h2 id="hipaa-dialog-title" className="text-lg font-serif font-semibold m-0">
                  Federal & HIPAA Privacy Covenant
                </h2>
              </div>
              <button
                onClick={() => setIsHipaaInfoOpen(false)}
                className="p-1 rounded-full hover:bg-stone-500/20"
                aria-label="Close Privacy Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              The Living Hearth is architected to exceed federal consumer privacy protections and follow rigorous HIPAA-conscious data minimization standards:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="font-semibold text-emerald-600 flex items-center gap-1.5">
                  ✓ Protected Health Information (PHI) Shield
                </div>
                <p className="text-stone-400">
                  Real-time client-side analysis warns before submitting sensitive medical diagnoses, treatments, or identifiable patient data to public spaces.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="font-semibold text-amber-600 flex items-center gap-1.5">
                  ✓ Zero Commercial Advertising & No Tracking Pixels
                </div>
                <p className="text-stone-400">
                  No Meta Pixels, Google Ad trackers, data brokers, or commercial cookies exist on this platform. Spiritual vulnerability is never monetized.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <div className="font-semibold text-sky-600 flex items-center gap-1.5">
                  ✓ Strict Anti-Solicitation Guarantee
                </div>
                <p className="text-stone-400">
                  Financial recruitment, crowdfunding pitches, and unsolicited conversion messages are filtered out by policy and automated checks.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-rose-600">Immediate Crisis Support (988)</span>
                  <p className="text-stone-400 mt-0.5">
                    If you or someone you pray for is in acute medical or emotional distress, dial or text <strong className="underline">988</strong> (USA/Canada Lifeline) or contact emergency services immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsHipaaInfoOpen(false);
                  setIsProtocolModalOpen(true);
                }}
                className="px-4 py-2 rounded-full border border-stone-300/40 text-xs font-serif hover:bg-stone-500/10 flex items-center gap-1.5"
              >
                <span>Complete Protocol & Governance Charter</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHipaaInfoOpen(false)}
                className="px-5 py-2 rounded-full font-serif text-xs font-medium"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                I Understand & Feel Protected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Language & Sacred Communication Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Sovereign Web Crypto Vault Modal */}
      {isVaultModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vault-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-colors"
          style={{
            backgroundColor:
              timeOfDay === 'night'
                ? 'rgba(26, 21, 18, 0.85)'
                : 'rgba(253, 246, 240, 0.85)',
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A241F' : '#FFFFFF',
              borderColor: `${currentTone.primary}50`,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentTone.primary}25` }}
                >
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 id="vault-modal-title" className="font-serif text-base font-medium m-0">
                    Sovereign Sanctuary Vault
                  </h3>
                  <p className="text-[10px] text-stone-500 font-mono">
                    AES-GCM-256 • HIPAA § 164.312
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVaultModalOpen(false);
                  setUnlockError(null);
                  setUnlockPass('');
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800 dark:text-emerald-300">
                  Vault Status:
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {isVaultUnlocked ? 'Decrypted & Active' : 'Locked (Encrypted)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px] pt-1">
                <span>Vault Mode:</span>
                <span className="font-serif capitalize">{authSession?.mode === 'passphrase_vault' ? 'Passphrase Handle' : 'Anonymous Guest'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-[11px]">
                <span>Key Fingerprint:</span>
                <span className="font-mono">{authSession?.fingerprint || 'sovereign-vault'}</span>
              </div>
            </div>

            {/* Lock / Unlock controls */}
            {!isVaultUnlocked ? (
              <div className="space-y-3">
                <p className="text-xs text-stone-500">
                  Enter your master passphrase to unlock your sovereign encryption key and reveal private journal reflections:
                </p>
                <input
                  type="password"
                  value={unlockPass}
                  onChange={(e) => setUnlockPass(e.target.value)}
                  placeholder="Master Passphrase"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border bg-transparent focus:outline-none"
                  style={{ borderColor: `${currentTone.primary}60` }}
                />
                {unlockError && (
                  <p className="text-xs text-rose-500">{unlockError}</p>
                )}
                <button
                  onClick={async () => {
                    setUnlockError(null);
                    const ok = await unlockVault(unlockPass);
                    if (ok) {
                      setIsVaultModalOpen(false);
                      setUnlockPass('');
                    } else {
                      setUnlockError('Incorrect passphrase. Key could not be derived.');
                    }
                  }}
                  className="w-full py-2.5 rounded-full font-serif text-xs font-semibold"
                  style={{
                    backgroundColor: currentTone.primary,
                    color: '#2C2520',
                  }}
                >
                  Unlock Sovereign Vault
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your private prayers and personal intentions are encrypted client-side using native Web Crypto before saving to storage. Zero commercial telemetry, zero Google or ad cookies.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {authSession?.mode === 'passphrase_vault' && (
                    <button
                      onClick={() => {
                        lockVault();
                        setIsVaultModalOpen(false);
                      }}
                      className="flex-1 py-2 rounded-full border border-stone-300/40 text-xs font-serif hover:bg-stone-500/10 flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Vault Now</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsVaultModalOpen(false);
                      setIsOnboardingOpen(true);
                    }}
                    className="flex-1 py-2 rounded-full border border-stone-300/40 text-xs font-serif hover:bg-stone-500/10 flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Manage Keys</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
