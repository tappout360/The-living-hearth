import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { DEMO_USERS } from '../data/demoUsersData';
import { TraditionVisual } from './ReligiousVisuals';
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

export const DemoPersonaBar: React.FC = () => {
  const {
    account,
    userProfile,
    hearthTone,
    timeOfDay,
    switchDemoUser,
    setIsDomainGuideOpen,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Testing and Demo Persona Switcher"
      className="w-full border-b transition-all duration-300 relative z-20 text-xs"
      style={{
        backgroundColor:
          timeOfDay === 'night' ? 'rgba(34, 28, 23, 0.95)' : 'rgba(251, 245, 237, 0.95)',
        borderColor: `${currentTone.primary}30`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-serif text-stone-500 hidden sm:inline">Testing Mode:</span>
          <div className="flex items-center gap-1.5 font-medium truncate text-stone-700 dark:text-stone-200">
            <TraditionVisual tradition={userProfile.primaryTradition} size={15} color={currentTone.primary} />
            <span className="font-serif font-semibold">{account.displayName}</span>
            <span className="text-[10px] text-stone-400 font-serif hidden md:inline">
              ({userProfile.primaryTradition})
            </span>
            {account.subscriptionTier !== 'free' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                {account.subscriptionTier}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded-full font-serif text-[11px] border border-stone-300/40 hover:border-amber-400 transition-colors flex items-center gap-1"
            title="Switch demo persona accounts across 8 world traditions"
            aria-expanded={isOpen}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Switch Persona (8)</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setIsDomainGuideOpen(true)}
            className="px-2.5 py-1 rounded-full font-serif text-[11px] border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
            title="Production Domain Attachment & DNS Guide"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Add Domain</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors rounded-full"
            title="Dismiss demo banner"
            aria-label="Dismiss demo banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable 8-Persona Switcher Tray */}
      {isOpen && (
        <div
          className="border-t border-stone-200/20 p-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 animate-in fade-in"
        >
          {DEMO_USERS.map((demo) => {
            const isCurrent = demo.email.toLowerCase() === account.email.toLowerCase();
            return (
              <button
                key={demo.id}
                onClick={() => {
                  switchDemoUser(demo.email);
                  setIsOpen(false);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isCurrent
                    ? 'ring-2 border-amber-400 font-semibold shadow-xs'
                    : 'border-stone-300/30 hover:border-amber-400/60 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isCurrent ? `${currentTone.primary}20` : 'transparent',
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <TraditionVisual tradition={demo.primaryTradition} size={16} color={currentTone.primary} />
                    <span className="font-serif text-xs truncate text-stone-800 dark:text-stone-100">
                      {demo.displayName}
                    </span>
                  </div>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-serif">
                  <span className="truncate">{demo.primaryTradition}</span>
                  <span className="font-mono uppercase">{demo.subscriptionTier}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
