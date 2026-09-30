import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  TRADITION_PERSONALIZATION_PROFILES,
  getTraditionPersonalizationProfile,
} from '../data/traditionPersonalizationData';
import type { CalendarSystemType } from '../types/traditionPersonalization';
import {
  Sliders,
  X,
  Compass,
  Calendar,
  Shield,
  Clock,
  Home,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TraditionPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TraditionPersonalizationModal: React.FC<TraditionPersonalizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    userProfile,
    hearthTone,
    timeOfDay,
    orientationHelperEnabled,
    setOrientationHelperEnabled,
    activeCalendarSystems,
    setActiveCalendarSystems,
    dailyRhythmEnabled,
    setDailyRhythmEnabled,
    spatialHeritageEnabled,
    setSpatialHeritageEnabled,
  } = useHearth();

  const [activeTab, setActiveTab] = useState<'preferences' | 'matrix'>('preferences');
  const currentTone = HEARTH_TONES[hearthTone];
  const profile = getTraditionPersonalizationProfile(userProfile.primaryTradition);

  if (!isOpen) return null;

  const allCalendarOptions: { id: CalendarSystemType; label: string; tradition: string; note: string }[] = [
    { id: 'gregorian', label: 'Christian & Western Liturgical Seasons', tradition: 'Christianity / Universal', note: 'Advent, Christmas, Lent, Easter, Ordinary Time' },
    { id: 'hebrew', label: 'Hebrew Lunisolar Calendar (לוח עברי)', tradition: 'Judaism', note: 'Shabbat, High Holy Days, Pesach, Sukkot (begins at sunset)' },
    { id: 'hijri', label: 'Hijri Pure Lunar Calendar (التقويم الهجري)', tradition: 'Islam', note: 'Ramadan, Eid al-Fitr, Eid al-Adha, Jumu’ah' },
    { id: 'hindu_panchang', label: 'Vedic Lunisolar Panchang (पञ्चाङ्ग)', tradition: 'Hinduism', note: 'Diwali, Navaratri, Maha Shivaratri, Janmashtami' },
    { id: 'seasonal_solstice', label: 'Buddhist Lunar & Seasonal Earth Solstice', tradition: 'Buddhism & Indigenous', note: 'Uposatha Moon phases, Vesak, Equinoxes & Solstices' },
    { id: 'bahai_badi', label: 'Badí‘ 19-Month Solar Calendar', tradition: 'Bahá\'í Faith', note: 'Naw-Rúz, Ridván, Ayyám-i-Há' },
    { id: 'nanakshahi', label: 'Nanakshahi Solar Calendar (ਨਾਨਕਸ਼ਾਹੀ)', tradition: 'Sikhism', note: 'Vaisakhi, Gurpurabs, Bandi Chhor Divas' },
  ];

  const handleToggleCalendar = (calId: CalendarSystemType) => {
    setActiveCalendarSystems((prev) =>
      prev.includes(calId) ? prev.filter((id) => id !== calId) : [...prev, calId]
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tradition-personalization-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(28, 22, 18, 0.94)'
            : 'rgba(250, 245, 238, 0.94)',
      }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-300 flex flex-col justify-between max-h-[92vh] overflow-y-auto space-y-5"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
          borderColor: currentTone.primary,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                borderColor: `${currentTone.primary}50`,
                backgroundColor: `${currentTone.primary}20`,
                color: currentTone.primary,
              }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  Universal Dignity Framework
                </span>
                <span className="text-xs text-stone-400">• Opt-In & Additive</span>
              </div>
              <h3 id="tradition-personalization-title" className="font-serif text-xl font-normal leading-snug m-0 mt-0.5">
                Tradition-Aware Personalization Controls
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-500/20 text-stone-400 hover:text-stone-600"
            aria-label="Close personalization settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Preferences vs Equality Matrix */}
        <div className="flex items-center gap-2 border-b border-stone-200/20 pb-2 text-xs font-serif">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'font-medium shadow-xs'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
            style={{
              backgroundColor: activeTab === 'preferences' ? `${currentTone.primary}25` : 'transparent',
              color: activeTab === 'preferences' ? currentTone.primary : undefined,
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Personalization Modules</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'font-medium shadow-xs'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
            style={{
              backgroundColor: activeTab === 'matrix' ? `${currentTone.primary}25` : 'transparent',
              color: activeTab === 'matrix' ? currentTone.primary : undefined,
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Equal Dignity & Coverage Matrix ({Object.keys(TRADITION_PERSONALIZATION_PROFILES).length})</span>
          </button>
        </div>

        {activeTab === 'preferences' ? (
          <div className="space-y-4 text-xs">
            {/* Non-negotiable Equality Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="font-serif font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                The Living Hearth Equality Covenant
              </span>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed m-0 text-[11px]">
                No tradition is algorithmically, visually, or functionally privileged. All features below are <strong>strictly opt-in and additive</strong>. Turning them off returns your sanctuary to the same serene, equal base experience.
              </p>
            </div>

            {/* Feature 1: Sacred Facing Direction & Geodesic Compass */}
            <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span className="font-serif font-semibold text-sm">Sacred Orientation Helper</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-mono">
                    {profile.orientation.type === 'fixed_point'
                      ? `Facing ${profile.orientation.target?.city}`
                      : profile.orientation.type === 'symbolic_east'
                      ? 'Due East'
                      : 'Inward Centering'}
                  </span>
                </div>
                <p className="text-stone-500 leading-relaxed text-[11px] m-0">
                  Displays an optional geodesic compass dial on the Dashboard showing traditional intention and prayer facing directions (e.g. Qibla to Mecca, Mizrah to Jerusalem, or symbolic sunrise East).
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={orientationHelperEnabled}
                  onChange={(e) => setOrientationHelperEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Feature 2: Daily Practice Rhythm Windows */}
            <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="font-serif font-semibold text-sm">Suggested Daily Practice Rhythms</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-mono">
                    {profile.dailyRhythm.length} Suggested Windows
                  </span>
                </div>
                <p className="text-stone-500 leading-relaxed text-[11px] m-0">
                  Displays calm, suggested contemplation intervals (e.g., 5 daily prayers in Islam, 3 in Judaism, Sandhyas in Hinduism, Morning/Evening prayer in Christianity) as gentle guideposts — never as mandatory timers or streaks.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={dailyRhythmEnabled}
                  onChange={(e) => setDailyRhythmEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Feature 3: Spatial & Domestic Heritage Reflections */}
            <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-500" />
                  <span className="font-serif font-semibold text-sm">Spatial & Environmental Heritage</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-mono">
                    {profile.spatialHeritage.systemName}
                  </span>
                </div>
                <p className="text-stone-500 leading-relaxed text-[11px] m-0">
                  Cultural architectural and room harmony suggestions (such as Vastu Shastra principles, Feng Shui qi circulation, Mizrah wall plaques, or home altars). Treated as educational heritage — never prescriptive or superstitious.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={spatialHeritageEnabled}
                  onChange={(e) => setSpatialHeritageEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Feature 4: Multi-Calendar System Overlays */}
            <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="font-serif font-semibold text-sm">Sacred Calendars & Holy Times</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {activeCalendarSystems.length} active calendars
                </span>
              </div>
              <p className="text-stone-500 leading-relaxed text-[11px] m-0">
                Select which sacred calendars and holy days to display in your Dashboard Sacred Times strip. You can overlay multiple traditions or stick to your home path.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {allCalendarOptions.map((cal) => {
                  const isChecked = activeCalendarSystems.includes(cal.id);
                  return (
                    <div
                      key={cal.id}
                      onClick={() => handleToggleCalendar(cal.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-amber-400/60 bg-amber-500/10'
                          : 'border-stone-300/30 hover:border-stone-400/40 bg-stone-500/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="rounded text-amber-600 mt-0.5 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="font-serif font-medium text-stone-700 dark:text-stone-200 block text-xs">
                          {cal.label}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {cal.tradition}
                        </span>
                        <span className="text-[10px] text-stone-500 block leading-tight">
                          {cal.note}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Equality & Transparent Coverage Matrix */
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1.5">
              <span className="font-serif font-semibold block text-stone-800 dark:text-stone-200">
                Transparent Multi-Tradition Depth Audit
              </span>
              <p className="text-stone-500 leading-relaxed text-[11px] m-0">
                In strict compliance with our Non-Negotiable Equality Principle, every tradition supported in The Living Hearth is documented along identical dimensions: Sacred Orientation, Daily Rhythm, Calendar System, Spatial Heritage, Tone/Microcopy, and Internal Diversity.
              </p>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {Object.values(TRADITION_PERSONALIZATION_PROFILES).map((prof) => (
                <div
                  key={prof.id}
                  className="p-3.5 rounded-2xl border border-stone-200/25 bg-stone-500/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-sm text-stone-800 dark:text-stone-200">
                        {prof.traditionName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-mono">
                        {prof.family}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {prof.coverageStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-500">
                    <div>
                      <strong className="block text-stone-600 dark:text-stone-300">Orientation:</strong>
                      <span>{prof.orientation.type === 'fixed_point' ? prof.orientation.target?.city : prof.orientation.type}</span>
                    </div>
                    <div>
                      <strong className="block text-stone-600 dark:text-stone-300">Daily Rhythm:</strong>
                      <span>{prof.dailyRhythm.length} Practice Windows</span>
                    </div>
                    <div>
                      <strong className="block text-stone-600 dark:text-stone-300">Calendar:</strong>
                      <span className="truncate block">{prof.calendar.systemDisplayName.split('(')[0]}</span>
                    </div>
                    <div>
                      <strong className="block text-stone-600 dark:text-stone-300">Spatial Heritage:</strong>
                      <span className="truncate block">{prof.spatialHeritage.systemName.split('&')[0]}</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-stone-200/10 text-[10px] text-stone-400 italic">
                    Internal Diversity: {prof.internalDiversityStatement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-stone-400 font-serif flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>Preferences saved automatically in your encrypted local sanctuary.</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full font-serif font-medium shadow-xs"
            style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
