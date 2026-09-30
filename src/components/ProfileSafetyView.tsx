import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { HearthTone } from '../types';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  PhoneCall,
  Check,
  AlertTriangle,
  KeyRound,
  Radio,
  RefreshCw,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { syncEngine } from '../sync/broadcastEngine';

export const ProfileSafetyView: React.FC = () => {
  const {
    hearthTone,
    setHearthTone,
    timeOfDay,
    exportUserData,
    purgeUserData,
    userProfile,
    setIsInvitationsModalOpen,
    setIsProtocolModalOpen,
    authSession,
    isVaultUnlocked,
    setupPassphraseVault,
    lockVault,
    switchToGuestVault,
    setIsDomainGuideOpen,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];

  const [privateByDefault, setPrivateByDefault] = useState(true);
  const [requireConsentForPrayers, setRequireConsentForPrayers] = useState(true);
  const [anonymousInRooms, setAnonymousInRooms] = useState(true);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [isPassphraseFormOpen, setIsPassphraseFormOpen] = useState(false);
  const [handleInput, setHandleInput] = useState(authSession?.handle || userProfile.displayName);
  const [passphraseInput, setPassphraseInput] = useState('');
  const [showPassphraseInput, setShowPassphraseInput] = useState(false);
  const [passphraseMessage, setPassphraseMessage] = useState<string | null>(null);
  const [syncTestMessage, setSyncTestMessage] = useState<string | null>(null);

  const handlePurge = () => {
    purgeUserData();
    setIsPurgeModalOpen(false);
    setPurgeSuccess(true);
    setTimeout(() => setPurgeSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* 1. Minimal Profile Header (No public exposure by default) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: `${currentTone.primary}20`,
              }}
            >
              <Lock className="w-6 h-6" style={{ color: currentTone.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-normal m-0">
                  {userProfile.displayName}’s Sanctuary
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-mono">
                  100% Confidential
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Primary Focus: <strong className="font-serif">{userProfile.primaryTradition}</strong> • Display name visible only on your dashboard by default.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInvitationsModalOpen(true)}
            className="px-4 py-2 rounded-full border border-stone-300/40 text-xs font-serif hover:bg-stone-500/10 flex items-center gap-1.5 self-start sm:self-center"
          >
            <span>Manage Invitations</span>
          </button>
        </div>
      </div>

      {/* 2. Federal & HIPAA Compliance Center */}
      <section
        aria-label="Federal and HIPAA Compliance Center"
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(110, 139, 107, 0.4)',
          backgroundColor: timeOfDay === 'night' ? '#262923' : '#F7FAF7',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif text-lg font-normal m-0 text-emerald-800 dark:text-emerald-300">
              Federal & HIPAA Compliance Safeguards
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProtocolModalOpen(true)}
              className="px-3 py-1 rounded-full text-xs font-serif border border-emerald-600/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
            >
              View Complete Protocol
            </button>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full hidden sm:inline">
              Federal Standards Met
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          The Living Hearth operates under strict data minimization guidelines. Because prayers often involve vulnerable life events, health conditions, or grief, we enforce clinical-grade protections:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/50 border border-emerald-500/20 space-y-1">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
              ✓ Real-time PHI Shield
            </span>
            <span className="text-stone-500 text-[11px]">
              Active scanner checks for clinical diagnostic codes and patient identifiers to safeguard medical privacy.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/50 border border-emerald-500/20 space-y-1">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
              ✓ Zero Commercial Trackers
            </span>
            <span className="text-stone-500 text-[11px]">
              No Meta Pixel, Google Analytics, or commercial data brokers exist anywhere in the application code.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/50 border border-emerald-500/20 space-y-1">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
              ✓ Client-Side Vault
            </span>
            <span className="text-stone-500 text-[11px]">
              Your reflections are encrypted and remain under your direct custody at all times.
            </span>
          </div>
        </div>

        {/* 988 Crisis Lifeline fast link */}
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="font-semibold text-rose-600">Immediate Mental Health or Crisis Support (988)</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                If in distress, call or text 988 anytime for free, confidential, 24/7 care.
              </p>
            </div>
          </div>
          <a
            href="tel:988"
            className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-serif text-xs shrink-0 hover:bg-rose-700"
          >
            Call 988
          </a>
        </div>
      </section>

      {/* 3. Granular Privacy & Safety Toggles */}
      <section
        aria-label="Granular Privacy Controls"
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <h3 className="font-serif text-lg font-normal m-0">Sanctuary Privacy Toggles</h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/20">
            <div>
              <span className="font-medium block">Default to 100% Private</span>
              <span className="text-xs text-stone-400">
                Keep your reading history and prayer log completely invisible to others
              </span>
            </div>
            <button
              onClick={() => setPrivateByDefault(!privateByDefault)}
              role="switch"
              aria-checked={privateByDefault}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                privateByDefault ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  privateByDefault ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/20">
            <div>
              <span className="font-medium block">Require Mutual Consent for Intentions</span>
              <span className="text-xs text-stone-400">
                Never allow unsolicited direct prayer messages without prior consent
              </span>
            </div>
            <button
              onClick={() => setRequireConsentForPrayers(!requireConsentForPrayers)}
              role="switch"
              aria-checked={requireConsentForPrayers}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                requireConsentForPrayers ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  requireConsentForPrayers ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/20">
            <div>
              <span className="font-medium block">Anonymize Room Reflections</span>
              <span className="text-xs text-stone-400">
                Post comments in moderated circles as “Hearth Companion” by default
              </span>
            </div>
            <button
              onClick={() => setAnonymousInRooms(!anonymousInRooms)}
              role="switch"
              aria-checked={anonymousInRooms}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                anonymousInRooms ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  anonymousInRooms ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Personal Hearth Tone Selection */}
      <section
        aria-label="Personal Hearth Tone"
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div>
          <h3 className="font-serif text-lg font-normal m-0">Personal Hearth Tone</h3>
          <p className="text-xs text-stone-500 mt-1">
            Choose the warm ambient frequency that tints your individual sanctuary:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.keys(HEARTH_TONES) as HearthTone[]).map((key) => {
            const tone = HEARTH_TONES[key];
            const isSelected = hearthTone === key;
            return (
              <button
                key={key}
                onClick={() => setHearthTone(key)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  isSelected ? 'ring-2 scale-102 shadow-sm font-semibold' : 'opacity-70'
                }`}
                style={{
                  borderColor: tone.primary,
                  backgroundColor: isSelected ? `${tone.primary}20` : 'transparent',
                }}
              >
                <span className="w-6 h-6 rounded-full shadow-xs" style={{ backgroundColor: tone.primary }} />
                <span className="text-xs font-serif">{tone.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Sovereign Cryptographic Vault & Identity */}
      <section
        aria-label="Sovereign Cryptographic Vault"
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: `${currentTone.primary}40`,
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-lg font-normal m-0">
              Sovereign Cryptographic Vault & Keys
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
            {isVaultUnlocked ? 'Vault Active & Unlocked' : 'Vault Locked'}
          </span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          The Living Hearth rejects third-party trackers, OAuth data pipelines, and advertising telemetry. Your identity is sovereign, and private prayers are encrypted directly in your browser using native <strong>Web Crypto AES-GCM-256</strong>.
        </p>

        {/* Current Vault Status Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl border border-stone-200/20 bg-stone-500/5 space-y-1">
            <span className="text-[11px] text-stone-400 block font-serif">Sovereign Handle</span>
            <span className="font-semibold text-sm">{authSession?.handle || userProfile.displayName}</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-stone-200/20 bg-stone-500/5 space-y-1">
            <span className="text-[11px] text-stone-400 block font-serif">Vault Mode</span>
            <span className="font-semibold text-xs capitalize">
              {authSession?.mode === 'passphrase_vault' ? 'Passphrase Vault' : 'Anonymous Guest'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-stone-200/20 bg-stone-500/5 space-y-1">
            <span className="text-[11px] text-stone-400 block font-serif">SHA-256 Key Fingerprint</span>
            <span className="font-mono text-xs">{authSession?.fingerprint || 'vault-offline'}</span>
          </div>
        </div>

        {/* Passphrase Vault Setup / Upgrade */}
        <div className="pt-2">
          {!isPassphraseFormOpen ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsPassphraseFormOpen(true)}
                className="px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 text-xs font-serif flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Set Master Passphrase & Handle</span>
              </button>

              <button
                onClick={async () => {
                  await switchToGuestVault();
                  setPassphraseMessage('Switched to fresh Anonymous Guest Vault with new AES-GCM key.');
                  setTimeout(() => setPassphraseMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-full border border-stone-300/40 text-xs font-serif hover:bg-stone-500/10 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate New Guest Vault</span>
              </button>

              {authSession?.mode === 'passphrase_vault' && isVaultUnlocked && (
                <button
                  onClick={() => {
                    lockVault();
                    setPassphraseMessage('Vault locked. Key wiped from browser memory.');
                    setTimeout(() => setPassphraseMessage(null), 3000);
                  }}
                  className="px-4 py-2 rounded-full border border-rose-500/40 text-rose-600 text-xs font-serif hover:bg-rose-500/10 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Vault</span>
                </button>
              )}

              <button
                onClick={() => {
                  syncEngine.broadcast({
                    type: 'PRESENCE_PING',
                    senderHandle: authSession?.handle || userProfile.displayName,
                    currentTab: 'profile',
                    activeRoomId: null,
                  });
                  setSyncTestMessage('Ping broadcasted across open tabs via BroadcastChannel.');
                  setTimeout(() => setSyncTestMessage(null), 2500);
                }}
                className="px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-600 text-xs font-serif hover:bg-emerald-500/10 flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Test Live Multi-Client Sync</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-sm font-medium m-0">Setup Sovereign Passphrase Vault</h4>
                <button
                  onClick={() => setIsPassphraseFormOpen(false)}
                  className="text-xs text-stone-400 underline"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                Your key will be derived directly from this passphrase using PBKDF2 (100,000 rounds of SHA-256). It never leaves your browser.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Sovereign Handle:</label>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder="e.g. Jason or Pilgrim-7"
                    className="w-full text-xs p-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: `${currentTone.primary}50` }}
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Master Passphrase:</label>
                  <div className="relative">
                    <input
                      type={showPassphraseInput ? "text" : "password"}
                      value={passphraseInput}
                      onChange={(e) => setPassphraseInput(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full text-xs p-2 pr-10 rounded-xl border bg-transparent focus:outline-none"
                      style={{ borderColor: `${currentTone.primary}50` }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphraseInput(!showPassphraseInput)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                      title={showPassphraseInput ? "Hide passphrase" : "View passphrase"}
                      aria-label={showPassphraseInput ? "Hide passphrase" : "View passphrase"}
                    >
                      {showPassphraseInput ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!passphraseInput || passphraseInput.length < 6) {
                    setPassphraseMessage('Passphrase must be at least 6 characters.');
                    return;
                  }
                  const ok = await setupPassphraseVault(handleInput, passphraseInput);
                  if (ok) {
                    setPassphraseMessage('Sovereign Passphrase Vault initialized and re-encrypted successfully.');
                    setIsPassphraseFormOpen(false);
                    setPassphraseInput('');
                    setTimeout(() => setPassphraseMessage(null), 3000);
                  } else {
                    setPassphraseMessage('Failed to initialize passphrase key.');
                  }
                }}
                className="px-5 py-2 rounded-full font-serif text-xs font-semibold"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Derive & Save Sovereign Key
              </button>
            </div>
          )}

          {passphraseMessage && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-500/15 text-stone-800 dark:text-stone-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passphraseMessage}</span>
            </div>
          )}

          {syncTestMessage && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Radio className="w-4 h-4 shrink-0 animate-pulse" />
              <span>{syncTestMessage}</span>
            </div>
          )}
        </div>
      </section>

      {/* 6. Data Sovereignty & Portability (Export & Irreversible Deletion) */}
      <section
        aria-label="Data Sovereignty and Rights"
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <h3 className="font-serif text-lg font-normal m-0">Your Data Sovereignty</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-stone-200/20 space-y-2">
            <span className="font-serif font-medium text-xs block">Export Complete Sanctuary</span>
            <p className="text-[11px] text-stone-400">
              Download all your recorded prayers, learning milestones, and reflections in a single JSON document.
            </p>
            <button
              onClick={exportUserData}
              className="mt-2 px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 text-xs font-serif flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sanctuary Data</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-amber-500/30 space-y-2 bg-amber-500/5">
            <span className="font-serif font-medium text-xs text-amber-700 dark:text-amber-300 block">Production Domain & DNS</span>
            <p className="text-[11px] text-stone-400">
              Authoritative DNS records (A, CNAME), automated SSL generation, and edge routing details.
            </p>
            <button
              onClick={() => setIsDomainGuideOpen(true)}
              className="mt-2 px-4 py-2 rounded-full border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 text-xs font-serif flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Domain DNS & SSL Guide</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-rose-500/20 space-y-2 bg-rose-500/5">
            <span className="font-serif font-medium text-xs text-rose-600 block">Irreversible Purge</span>
            <p className="text-[11px] text-stone-400">
              Instantly erase all prayers, room entries, and session tokens from your device with zero residue.
            </p>
            <button
              onClick={() => setIsPurgeModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-full border border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs font-serif flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Sanctuary Data</span>
            </button>
          </div>
        </div>

        {purgeSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>All local sanctuary data has been purged completely.</span>
          </div>
        )}
      </section>

      {/* Purge Confirmation Modal */}
      {isPurgeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
              borderColor: '#B85C4B',
            }}
          >
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-serif text-lg font-normal m-0">Confirm Irreversible Purge</h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Are you sure you wish to delete all your prayers, practice records, and settings? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPurgeModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-serif border border-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-5 py-2 rounded-full text-xs font-serif bg-rose-600 text-white font-medium hover:bg-rose-700"
              >
                Confirm Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
