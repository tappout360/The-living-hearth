import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { HearthTone } from '../types';
import { ConcentricRings, HearthFlameGlow } from './SacredGeometry';
import { ShieldCheck, Compass, Heart, Lock, ArrowRight, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    hearthTone,
    setHearthTone,
    timeOfDay,
  } = useHearth();

  const [step, setStep] = useState<number>(1);
  const [selectedTraditionStance, setSelectedTraditionStance] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];

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
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-500 overflow-hidden"
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
              <p className="font-serif italic text-center">
                “You are welcome here exactly as you are.”
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-stone-500">
                <span>• No Dating</span>
                <span>• No Solicitation</span>
                <span>• No Algorithms</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif text-sm font-medium transition-transform hover:scale-103 shadow-md"
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

        {/* Step 2: Personal Stance & Hearth Tone */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-400">
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                How would you like to begin?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Choose how you approach your time here. You can adjust this anytime.
              </p>
            </div>

            {/* Three Soft Choice Cards */}
            <div className="space-y-2.5">
              {[
                {
                  id: 'rooted',
                  icon: <Heart className="w-5 h-5 text-rose-500" />,
                  title: 'I have a specific faith or tradition',
                  description: 'Deepen your personal practice, liturgical rhythms, and connect in tradition rooms.',
                },
                {
                  id: 'exploring',
                  icon: <Compass className="w-5 h-5 text-amber-500" />,
                  title: 'I am exploring traditions with open curiosity',
                  description: 'Engage with verified scholarly modules and quiet interfaith contemplations.',
                },
                {
                  id: 'private',
                  icon: <Lock className="w-5 h-5 text-indigo-500" />,
                  title: 'I prefer to keep this completely private',
                  description: 'Use the Living Hearth strictly as an encrypted personal prayer and reflection journal.',
                },
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedTraditionStance(card.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selectedTraditionStance === card.id
                      ? 'ring-2 shadow-sm font-medium'
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

            {/* Hearth Tone Selection */}
            <div>
              <label className="text-xs font-serif block text-stone-500 mb-2">
                Choose your Personal Hearth Tone (Colors and warms your sanctuary):
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
                        isSelected ? 'ring-2 scale-104 shadow-sm' : 'opacity-70'
                      }`}
                      style={{
                        borderColor: tone.primary,
                        backgroundColor: isSelected ? `${tone.primary}25` : 'transparent',
                      }}
                      aria-label={`Select ${tone.name}`}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-sm font-medium transition-transform hover:scale-102"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sacred Privacy Covenant & Federal Safeguards */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-400">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                Our Non-Negotiable Covenant
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                Before you enter, we pledge that your soul’s sanctuary will remain safe and sovereign.
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                <span className="text-emerald-600 font-bold text-base">1</span>
                <div>
                  <strong className="block text-emerald-700 dark:text-emerald-400 font-serif">
                    Zero Solicitation & Zero Recruitment
                  </strong>
                  <span className="text-stone-500">
                    No fundraising, no commercial ads, no conversion campaigns. Violators are immediately removed.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <span className="text-amber-600 font-bold text-base">2</span>
                <div>
                  <strong className="block text-amber-700 dark:text-amber-400 font-serif">
                    Client Consent & HIPAA Compliance
                  </strong>
                  <span className="text-stone-500">
                    Direct prayers require mutual consent. Automated clinical PHI warnings protect vulnerable medical details.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <span className="text-sky-600 font-bold text-base">3</span>
                <div>
                  <strong className="block text-sky-700 dark:text-sky-400 font-serif">
                    Zero Public Profiles By Default
                  </strong>
                  <span className="text-stone-500">
                    Your real identity, location, and reading patterns are never broadcast or sold to data brokers.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-stone-500 underline"
              >
                Back
              </button>
              <button
                onClick={() => setIsOnboardingOpen(false)}
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

        {/* Gentle Progress Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[1, 2, 3].map((dotIndex) => (
            <div
              key={dotIndex}
              className={`rounded-full transition-all duration-300 ${
                step === dotIndex ? 'w-5 h-2' : 'w-2 h-2 opacity-35'
              }`}
              style={{ backgroundColor: currentTone.primary }}
              aria-label={`Step ${dotIndex} of 3`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
