import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { HearthFlameGlow } from './SacredGeometry';
import {
  Sparkles,
  Lock,
  UserCheck,
  Users,
  X,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export const PrayComposerModal: React.FC = () => {
  const {
    isPrayComposerOpen,
    setIsPrayComposerOpen,
    hearthTone,
    timeOfDay,
    addPrayer,
    rooms,
    scanForPhiAndSafety,
  } = useHearth();

  const [prayerType, setPrayerType] = useState<'private' | 'direct' | 'room'>('private');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState(rooms[0]?.title || 'Contemplative Silence & Centering');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isPrayComposerOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];

  // Templates for quick starting
  const templates = [
    {
      label: 'For Healing & Solace',
      content: 'May deep healing, inner stillness, and restorative peace surround and uphold the body, mind, and spirit.',
    },
    {
      label: 'Gratitude for Dawn',
      content: 'Giving thanks for the quiet light of a new day, for the breath within, and for another opportunity to walk with gentleness.',
    },
    {
      label: 'Strength in Bereavement',
      content: 'Holding the memory of our departed with tender reverence. May comforting light soften grief and awaken enduring love.',
    },
    {
      label: 'Seeking Guidance & Clarity',
      content: 'Quiet the noise of anxious decisions. Let wisdom and righteous intuition guide my footsteps toward that which is truly good.',
    },
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (val.trim().length > 6) {
      const check = scanForPhiAndSafety(val);
      setSafetyNotice(check.advice);
    } else {
      setSafetyNotice(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (prayerType === 'direct' && (!recipientName.trim() || !consentConfirmed)) {
      alert('Consent Required: To protect recipient autonomy and privacy, please confirm explicit consent before sending.');
      return;
    }

    addPrayer({
      type: prayerType,
      title: title.trim() || (prayerType === 'private' ? 'Quiet Journal Reflection' : 'Heartfelt Intention'),
      content: content.trim(),
      recipientName: prayerType === 'direct' ? recipientName.trim() : undefined,
      consentGranted: prayerType === 'direct' ? consentConfirmed : undefined,
      roomName: prayerType === 'room' ? selectedRoomName : undefined,
      isAnonymous,
    });

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsPrayComposerOpen(false);
      setTitle('');
      setContent('');
      setRecipientName('');
      setConsentConfirmed(false);
      setSafetyNotice(null);
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prayer-sanctuary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md transition-all duration-500 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(28, 22, 18, 0.94)'
            : 'rgba(250, 245, 238, 0.94)',
      }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-500 overflow-hidden flex flex-col justify-between max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
          borderColor: currentTone.primary,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
          backgroundImage:
            timeOfDay === 'night'
              ? 'radial-gradient(circle at 50% 0%, rgba(232, 168, 124, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
        }}
      >
        {/* Soft rising-light confirmation screen on submit */}
        {isSubmittedSuccess ? (
          <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-500">
            <div className="flex justify-center">
              <HearthFlameGlow size={84} color={currentTone.primary} />
            </div>
            <h3 className="font-serif text-2xl font-normal">
              Intention Held in the Hearth
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto font-serif italic">
              “Deep peace of the quiet earth to you, deep peace of the shining stars to you.”
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2.5">
                <HearthFlameGlow size={36} color={currentTone.primary} />
                <div>
                  <h2 id="prayer-sanctuary-title" className="font-serif text-xl font-normal leading-snug m-0">
                    Prayer & Intention Sanctuary
                  </h2>
                  <p className="text-xs text-stone-400">
                    Sacred, non-exploitative writing space. Never broadcast to a public feed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrayComposerOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-500/20"
                aria-label="Close prayer composer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Three Soft Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'private',
                  icon: <Lock className="w-4 h-4 text-amber-500" />,
                  title: 'Private Journal',
                  desc: 'Encrypted only for you',
                },
                {
                  id: 'direct',
                  icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
                  title: 'Send to a Person',
                  desc: 'Requires explicit mutual consent',
                },
                {
                  id: 'room',
                  icon: <Users className="w-4 h-4 text-indigo-500" />,
                  title: 'Offer to a Room',
                  desc: 'Shared in a moderated circle',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrayerType(opt.id as any)}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    prayerType === opt.id
                      ? 'ring-2 shadow-xs font-medium'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    borderColor:
                      prayerType === opt.id ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                    backgroundColor:
                      prayerType === opt.id ? `${currentTone.primary}20` : 'transparent',
                  }}
                >
                  <div className="mt-0.5">{opt.icon}</div>
                  <div>
                    <div className="text-xs font-serif font-medium">{opt.title}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Direct Recipient or Room Selection Options */}
            {prayerType === 'direct' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 text-xs animate-in fade-in">
                <div>
                  <label className="font-serif block font-medium mb-1">
                    Recipient Full Name or Hearth Handle:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sister Miriam"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-500/30 bg-transparent text-xs"
                    required
                  />
                </div>
                <label className="flex items-start gap-2 text-stone-600 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600"
                    required
                  />
                  <span>
                    I confirm that the recipient has consented to receive personal prayers and positive intentions from me. (Non-solicitation pledge)
                  </span>
                </label>
              </div>
            )}

            {prayerType === 'room' && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5 animate-in fade-in">
                <label className="font-serif font-medium block">
                  Select Moderated Circle:
                </label>
                <select
                  value={selectedRoomName}
                  onChange={(e) => setSelectedRoomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-transparent text-xs"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.title} className="text-stone-900 bg-stone-100">
                      {r.title} ({r.tradition})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Templates Pill Row */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-serif text-stone-400 block">
                Contemplative Starters & Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {templates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(tmpl.label);
                      setContent(tmpl.content);
                      setSafetyNotice(null);
                    }}
                    className="px-3 py-1 rounded-full text-[11px] border border-stone-300/40 hover:border-amber-400 text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Writing Surface */}
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional Intention Title..."
                className="w-full px-4 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-sm font-serif placeholder-stone-400 focus:outline-none"
              />

              <div className="relative">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  rows={5}
                  placeholder="Pour your heart onto this quiet paper surface... (Dynamic type and screen readers fully supported)"
                  className="w-full p-4 rounded-3xl bg-stone-500/5 border border-stone-200/30 text-base font-serif leading-relaxed placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner"
                  required
                />
              </div>
            </div>

            {/* HIPAA / Health Privacy & Safety Warning Notification */}
            {safetyNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div className="leading-relaxed">
                  <strong>Privacy Notice: </strong>
                  {safetyNotice}
                </div>
              </div>
            )}

            {/* Footer with Consent Preview & Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200/20 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Record Anonymously</span>
                </label>
                <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  No Ads / No Sale
                </span>
              </div>

              <button
                type="submit"
                disabled={!content.trim()}
                className="px-6 py-2.5 rounded-full font-serif text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-102 disabled:opacity-40 shadow-md"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                <span>Commit to the Hearth</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
