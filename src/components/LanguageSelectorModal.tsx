import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { SUPPORTED_LANGUAGES, SACRED_GLOSSARY } from '../i18n/languages';
import { HEARTH_TONES } from '../data/mockData';
import {
  Globe,
  Check,
  X,
} from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setCurrentLanguage, hearthTone, timeOfDay } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [activeTab, setActiveTab] = useState<'languages' | 'glossary'>('languages');
  const [selectedGlossaryKey, setSelectedGlossaryKey] = useState<string>('tawhid');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
          borderColor: currentTone.primary,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-amber-500" />
            <div>
              <h2 id="language-modal-title" className="font-serif text-lg font-normal m-0">
                Global Language & Sacred Communication
              </h2>
              <p className="text-xs text-stone-400">
                Full UI localization, bidirectional RTL script support & sacred terminology preservation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-500/20"
            aria-label="Close Language Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Languages vs Sacred Terminology Glossary */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all ${
              activeTab === 'languages' ? 'font-semibold shadow-xs' : 'opacity-70'
            }`}
            style={{
              backgroundColor: activeTab === 'languages' ? currentTone.primary : 'transparent',
              color: activeTab === 'languages' ? '#2C2520' : 'inherit',
              border: `1px solid ${currentTone.primary}50`,
            }}
          >
            🌍 Interface & Reading Language
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all ${
              activeTab === 'glossary' ? 'font-semibold shadow-xs' : 'opacity-70'
            }`}
            style={{
              backgroundColor: activeTab === 'glossary' ? currentTone.primary : 'transparent',
              color: activeTab === 'glossary' ? '#2C2520' : 'inherit',
              border: `1px solid ${currentTone.primary}50`,
            }}
          >
            📖 Sacred Terminology Policy ({Object.keys(SACRED_GLOSSARY).length} terms)
          </button>
        </div>

        {/* TAB 1: LANGUAGE SELECTION GRID */}
        {activeTab === 'languages' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'ring-2 shadow-sm font-semibold'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isSelected ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                      backgroundColor: isSelected ? `${currentTone.primary}20` : 'transparent',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm">{lang.nativeName}</span>
                        {lang.dir === 'rtl' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang.name} • {lang.scriptFamily}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Low-Resource Languages & Dialects notice */}
            <div className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs text-stone-500 space-y-1">
              <span className="font-serif font-medium text-stone-600 dark:text-stone-300 block">
                Low-Resource Languages & Dialect Coverage
              </span>
              <p className="leading-relaxed">
                We are actively partnering with university linguistics departments to expand coverage to regional dialects, Indigenous languages, and liturgical idioms. No language community is silently excluded.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: SACRED TERMINOLOGY GLOSSARY POLICY */}
        {activeTab === 'glossary' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-600 dark:text-stone-300 space-y-1 leading-relaxed">
              <strong>Controlled Glossary & Anti-Domestication Policy: </strong>
              Religious vocabulary is high-stakes. When translating community prayers and learning modules, sacred terms are kept in their original transliteration with parenthetical explanatory glosses rather than forced into inaccurate English synonyms.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1 max-h-56 overflow-y-auto pr-1">
                {Object.keys(SACRED_GLOSSARY).map((key) => {
                  const item = SACRED_GLOSSARY[key];
                  const isSelected = selectedGlossaryKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedGlossaryKey(key)}
                      className={`w-full text-left p-2 rounded-xl text-xs font-serif transition-colors ${
                        isSelected ? 'bg-amber-500/20 font-semibold' : 'hover:bg-stone-500/10'
                      }`}
                    >
                      {item.term} ({item.tradition.split('&')[0].trim()})
                    </button>
                  );
                })}
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl border border-stone-200/20 bg-stone-500/5 text-xs space-y-2">
                {SACRED_GLOSSARY[selectedGlossaryKey] && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-normal m-0" style={{ color: currentTone.primary }}>
                        {SACRED_GLOSSARY[selectedGlossaryKey].term}
                      </h4>
                      {SACRED_GLOSSARY[selectedGlossaryKey].originalScript && (
                        <span className="font-serif text-base text-stone-400">
                          {SACRED_GLOSSARY[selectedGlossaryKey].originalScript}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-serif text-stone-400">
                        {SACRED_GLOSSARY[selectedGlossaryKey].tradition}
                      </span>
                      <div className="font-medium mt-0.5">
                        Transliteration: {SACRED_GLOSSARY[selectedGlossaryKey].transliteration}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900/40 border border-stone-200/20">
                      <strong>Preserved Gloss: </strong>
                      {SACRED_GLOSSARY[selectedGlossaryKey].gloss}
                    </div>
                    <p className="text-stone-500 leading-relaxed text-[11px]">
                      {SACRED_GLOSSARY[selectedGlossaryKey].scholarlyNotes}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full font-serif text-xs font-medium"
            style={{
              backgroundColor: currentTone.primary,
              color: '#2C2520',
            }}
          >
            Apply & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
