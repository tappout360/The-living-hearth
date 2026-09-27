import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { HearthTone } from '../types';
import { ConcentricRings, HearthFlameGlow } from './SacredGeometry';
import { ShieldCheck, Compass, Heart, Lock, ArrowRight, Check, KeyRound, UserCheck } from 'lucide-react';

const TRADITION_CHOICES = [
  'Christianity',
  'Islam',
  'Judaism',
  'Hinduism',
  'Buddhism',
  'Sikhism',
  'Bahá\'í Faith',
  'Jainism',
  'Taoism',
  'Shinto',
  'Indigenous & Celtic Traditions',
  'Spiritualism & Spiritism',
  'Interfaith & Contemplative Seeking',
];

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    hearthTone,
    setHearthTone,
    timeOfDay,
    userProfile,
    updatePrimaryTradition,
    setupPassphraseVault,
    switchToGuestVault,
  } = useHearth();

  const [step, setStep] = useState<number>(1);
  const [selectedTraditionStance, setSelectedTraditionStance] = useState<string>('rooted');
  const [chosenTradition, setChosenTradition] = useState<string>(userProfile.primaryTradition);
  const [vaultChoice, setVaultChoice] = useState<'guest' | 'passphrase'>('guest');
  const [passHandle, setPassHandle] = useState<string>(userProfile.displayName !== 'Jason' ? userProfile.displayName : '');
  const [passphrase, setPassphrase] = useState<string>('');
  const [passError, setPassError] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];

  const handleVaultStepSubmit = async () => {
    setPassError(null);
    if (vaultChoice === 'passphrase') {
      if (!passphrase || passphrase.length < 6) {
        setPassError('Please enter a passphrase of at least 6 characters to derive your sovereign key.');
        return;
      }
      const success = await setupPassphraseVault(passHandle || 'Sovereign Pilgrim', passphrase);
      if (!success) {
        setPassError('Could not initialize cryptographic key. Please check your browser settings.');
        return;
      }
    } else {
      await switchToGuestVault();
    }
    setStep(4);
  };

  const handleFinishOnboarding = () => {
    updatePrimaryTradition(chosenTradition);
    setIsOnboardingOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-colors duration-700 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(26, 21, 18, 0.92)'
            : 'rgba(253, 246, 240, 0.92)',
      }}
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-500 overflow-hidden my-auto"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A241F' : '#FFFFFF',
          borderColor: `${currentTone.primary}40`,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Sacred Geometry background watermark */}
        <div className="absolute -top-12 -right-12 opacity-10 pointer-events-none">
          <ConcentricRings size={220} ringsCount={4} glowColor={currentTone.primary} />
        </div>

        {/* Step 1: Welcome & Path of Light */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-in fade-in duration-400">
            <div className="flex justify-center">
              <HearthFlameGlow size={64} color={currentTone.primary} />
            </div>

            <div>
              <h2
                id="onboarding-title"
                className="font-serif text-2xl sm:text-3xl font-normal leading-snug"
              >
                Welcome to The Living Hearth
              </h2>
              <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
                A warm, quiet sanctuary for your personal spiritual path, respectful interfaith exploration, and non-exploitative prayer.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto text-left leading-relaxed">
              <p className="font-serif italic text-center text-sm font-medium">
                “You are welcome here exactly as you are.”
              </p>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-stone-500 flex-wrap">
                <span>• No Ads</span>
                <span>• No Solicitation</span>
                <span>• No Algorithms</span>
                <span>• No Dating Mechanics</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-serif text-sm font-medium transition-transform hover:scale-103 shadow-md"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Step Into the Hearth
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tradition Alignment & Stance */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-400 max-h-[80vh] overflow-y-auto pr-1">
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                Your Spiritual Stance & Tradition
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Choose how you approach your time here. You can refine this at any time in your sanctuary.
              </p>
            </div>

            {/* Three Stance Cards */}
            <div className="space-y-2">
              {[
                {
                  id: 'rooted',
                  icon: <Heart className="w-4 h-4 text-rose-500" />,
                  title: 'Rooted in a specific tradition',
                  description: 'Deepen personal liturgy, sacred texts, and connect in dedicated tradition rooms.',
                },
                {
                  id: 'exploring',
                  icon: <Compass className="w-4 h-4 text-amber-500" />,
                  title: 'Open exploration & Interfaith learning',
                  description: 'Engage with peer-reviewed scholarly modules across all world traditions.',
                },
                {
                  id: 'private',
                  icon: <Lock className="w-4 h-4 text-indigo-500" />,
                  title: 'Encrypted Personal Sanctuary',
                  description: 'Use strictly as an AES-GCM encrypted private reflection and prayer journal.',
                },
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedTraditionStance(card.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selectedTraditionStance === card.id
                      ? 'ring-2 shadow-xs font-medium'
                      : 'hover:border-stone-400 opacity-90'
                  }`}
                  style={{
                    borderColor:
                      selectedTraditionStance === card.id
                        ? currentTone.primary
                        : 'rgba(232, 168, 124, 0.25)',
                    backgroundColor:
                      selectedTraditionStance === card.id
                        ? `${currentTone.primary}18`
                        : timeOfDay === 'night'
                        ? '#322B25'
                        : '#FCFAF8',
                  }}
                >
                  <div className="mt-0.5">{card.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-serif">{card.title}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{card.description}</div>
                  </div>
                  {selectedTraditionStance === card.id && (
                    <Check className="w-4 h-4 shrink-0 text-amber-600 mt-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Primary Tradition Selector */}
            <div>
              <label className="text-xs font-serif block text-stone-500 mb-1.5">
                Primary Tradition Focus:
              </label>
              <select
                value={chosenTradition}
                onChange={(e) => setChosenTradition(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border bg-transparent font-serif focus:outline-none"
                style={{
                  borderColor: `${currentTone.primary}60`,
                  color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
                }}
              >
                {TRADITION_CHOICES.map((t) => (
                  <option key={t} value={t} className="text-stone-900 bg-white dark:bg-stone-900 dark:text-stone-100">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Hearth Tone Selection */}
            <div>
              <label className="text-xs font-serif block text-stone-500 mb-1.5">
                Choose your Personal Hearth Tone:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(HEARTH_TONES) as HearthTone[]).map((toneKey) => {
                  const tone = HEARTH_TONES[toneKey];
                  const isSelected = hearthTone === toneKey;
                  return (
                    <button
                      key={toneKey}
                      onClick={() => setHearthTone(toneKey)}
                      className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                        isSelected ? 'ring-2 scale-102 shadow-xs' : 'opacity-70'
                      }`}
                      style={{
                        borderColor: tone.primary,
                        backgroundColor: isSelected ? `${tone.primary}25` : 'transparent',
                      }}
                      aria-label={`Select ${tone.name}`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: tone.primary }}
                      />
                      <span className="text-[10px] truncate max-w-full">
                        {tone.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 underline"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-serif text-sm font-medium transition-transform hover:scale-102"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Next: Sovereign Vault
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sovereign Sanctuary Vault Setup */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-400">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <KeyRound className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                Sovereign Sanctuary Vault
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                No third-party trackers, Google OAuth, or ad IDs. Choose how you secure your private intentions.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setVaultChoice('guest')}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  vaultChoice === 'guest'
                    ? 'ring-2 shadow-xs font-medium'
                    : 'hover:border-stone-400 opacity-90'
                }`}
                style={{
                  borderColor:
                    vaultChoice === 'guest'
                      ? currentTone.primary
                      : 'rgba(232, 168, 124, 0.25)',
                  backgroundColor:
                    vaultChoice === 'guest'
                      ? `${currentTone.primary}18`
                      : timeOfDay === 'night'
                      ? '#322B25'
                      : '#FCFAF8',
                }}
              >
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-serif flex items-center gap-2">
                    <span>Anonymous Sovereign Guest Vault</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-sans">
                      Instant Setup
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Auto-generates a local AES-GCM 256-bit encryption key in your browser. Zero sign-up required.
                  </div>
                </div>
                {vaultChoice === 'guest' && <Check className="w-4 h-4 text-amber-600 shrink-0 mt-1" />}
              </button>

              <button
                onClick={() => setVaultChoice('passphrase')}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  vaultChoice === 'passphrase'
                    ? 'ring-2 shadow-xs font-medium'
                    : 'hover:border-stone-400 opacity-90'
                }`}
                style={{
                  borderColor:
                    vaultChoice === 'passphrase'
                      ? currentTone.primary
                      : 'rgba(232, 168, 124, 0.25)',
                  backgroundColor:
                    vaultChoice === 'passphrase'
                      ? `${currentTone.primary}18`
                      : timeOfDay === 'night'
                      ? '#322B25'
                      : '#FCFAF8',
                }}
              >
                <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-serif flex items-center gap-2">
                    <span>Sanctuary Handle & Passphrase</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-sans">
                      Client PBKDF2
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Derives your cryptographic key directly from a secret passphrase. Unlocks across browser sessions.
                  </div>
                </div>
                {vaultChoice === 'passphrase' && <Check className="w-4 h-4 text-amber-600 shrink-0 mt-1" />}
              </button>
            </div>

            {vaultChoice === 'passphrase' && (
              <div className="p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
                <div>
                  <label className="text-xs font-serif block text-stone-500 mb-1">
                    Sovereign Sanctuary Handle (Visible name):
                  </label>
                  <input
                    type="text"
                    value={passHandle}
                    onChange={(e) => setPassHandle(e.target.value)}
                    placeholder="e.g. Jason or Pilgrim-42"
                    className="w-full text-xs sm:text-sm p-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: `${currentTone.primary}60` }}
                  />
                </div>
                <div>
                  <label className="text-xs font-serif block text-stone-500 mb-1">
                    Master Sanctuary Passphrase:
                  </label>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs sm:text-sm p-2 rounded-xl border bg-transparent focus:outline-none"
                    style={{ borderColor: `${currentTone.primary}60` }}
                  />
                </div>
                {passError && (
                  <p className="text-xs text-rose-500">{passError}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-stone-500 underline"
              >
                Back
              </button>
              <button
                onClick={handleVaultStepSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-sm font-medium transition-transform hover:scale-102"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Next: Sacred Covenant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Sacred Privacy Covenant & Federal Safeguards */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-400">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <ShieldCheck className="w-9 h-9 text-emerald-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                Our Non-Negotiable Covenant
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                Before entering, we pledge that your soul’s sanctuary will remain safe, sovereign, and clinical-compliant.
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                <span className="text-emerald-600 font-bold text-base">1</span>
                <div>
                  <strong className="block text-emerald-700 dark:text-emerald-400 font-serif">
                    Zero Solicitation & Zero Recruitment
                  </strong>
                  <span className="text-stone-500 text-xs">
                    No fundraising, no commercial ads, no conversion campaigns. Violators are immediately removed.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <span className="text-amber-600 font-bold text-base">2</span>
                <div>
                  <strong className="block text-amber-700 dark:text-amber-400 font-serif">
                    Client Consent & HIPAA Compliance
                  </strong>
                  <span className="text-stone-500 text-xs">
                    Direct prayers require mutual consent. Automated clinical PHI warnings protect vulnerable medical details.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex gap-3">
                <span className="text-sky-600 font-bold text-base">3</span>
                <div>
                  <strong className="block text-sky-700 dark:text-sky-400 font-serif">
                    988 Crisis Support & Sovereign Data Portability
                  </strong>
                  <span className="text-stone-500 text-xs">
                    Immediate lifeline access provided. Instant one-click cryptographic purge and JSON export.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-stone-500 underline"
              >
                Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-serif text-sm font-semibold shadow-lg transition-transform hover:scale-103"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Enter the Sanctuary
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Gentle 4-Step Progress Dots */}
        <div className="flex justify-center items-center gap-2 mt-5">
          {[1, 2, 3, 4].map((dotIndex) => (
            <div
              key={dotIndex}
              className={`rounded-full transition-all duration-300 ${
                step === dotIndex ? 'w-5 h-2' : 'w-2 h-2 opacity-35'
              }`}
              style={{ backgroundColor: currentTone.primary }}
              aria-label={`Step ${dotIndex} of 4`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
