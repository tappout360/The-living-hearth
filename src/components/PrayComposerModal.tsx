import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { HearthFlameGlow } from './SacredGeometry';
import { ambientAudio } from '../audio/ambientAudioEngine';
import type { PrayerDestination, PrayerReminderInterval } from '../types';
import {
  Sparkles,
  Lock,
  UserCheck,
  Users,
  Globe,
  X,
  AlertTriangle,
  ShieldCheck,
  Mic,
  MicOff,
  Bell,
  CheckCircle2,
  ArrowRight,
  WifiOff,
} from 'lucide-react';

export const PrayComposerModal: React.FC = () => {
  const {
    isPrayComposerOpen,
    setIsPrayComposerOpen,
    hearthTone,
    timeOfDay,
    addPrayer,
    rooms,
    ambientSettings,
    scanForPhiAndSafety,
    isOnline,
  } = useHearth();

  const [destination, setDestination] = useState<PrayerDestination>('journal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState(rooms[0]?.title || 'Contemplative Silence & Centering');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [addToPersonalLog, setAddToPersonalLog] = useState(true);
  const [privateReminder, setPrivateReminder] = useState<PrayerReminderInterval>('none');
  const [isDictating, setIsDictating] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  if (!isPrayComposerOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];

  // Gentle templates for contemplative starting points
  const templates = [
    {
      label: 'For Peace & Solace',
      content: 'May deep healing, inner stillness, and restorative peace surround and uphold the body, mind, and spirit.',
    },
    {
      label: 'For Healing & Recovery',
      content: 'Holding gentle space for whole-being restoration, compassionate care, and courage through this season.',
    },
    {
      label: 'For Gratitude at Dawn',
      content: 'Giving thanks for the quiet light of a new day, for the breath within, and for another opportunity to walk with gentleness.',
    },
    {
      label: 'In Grief & Bereavement',
      content: 'Holding the memory of our departed with tender reverence. May comforting light soften grief and awaken enduring love.',
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

  const toggleVoiceDictation = () => {
    if (isDictating) {
      setIsDictating(false);
    } else {
      setIsDictating(true);
      // Simulate calm speech recognition transcription
      setTimeout(() => {
        setContent((prev) =>
          prev
            ? `${prev} May tranquility and clear light dwell in every breath.`
            : 'May tranquility and clear light dwell in every breath.'
        );
        setIsDictating(false);
      }, 2500);
    }
  };

  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (destination === 'person' && (!recipientName.trim() || !consentConfirmed)) {
      alert('Affirmative Consent Required: To protect recipient autonomy and privacy, please confirm explicit mutual consent before sending.');
      return;
    }

    setIsPreviewMode(true);
  };

  const handleFinalSubmit = async () => {
    const result = await addPrayer({
      type: destination === 'journal' ? 'private' : destination === 'person' ? 'direct' : 'room',
      destinationType: destination,
      title: title.trim() || (destination === 'journal' ? 'Quiet Journal Reflection' : 'Heartfelt Intention'),
      content: content.trim(),
      recipientName: destination === 'person' ? recipientName.trim() : undefined,
      consentGranted: destination === 'person' ? consentConfirmed : undefined,
      roomName: destination === 'room' ? selectedRoomName : undefined,
      isAnonymous,
      privateReminder,
    });

    if (result.error) {
      setSubmissionFeedback(result.error);
      return;
    }

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsPreviewMode(false);
      setIsPrayComposerOpen(false);
      setTitle('');
      setContent('');
      setRecipientName('');
      setConsentConfirmed(false);
      setSafetyNotice(null);
      setSubmissionFeedback(null);
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prayer-sanctuary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(28, 22, 18, 0.94)'
            : 'rgba(250, 245, 238, 0.94)',
      }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-300 overflow-hidden flex flex-col justify-between max-h-[92vh] overflow-y-auto"
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
          <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-500 relative">
            <div className="relative flex justify-center items-center h-24">
              <div
                className="w-8 h-8 rounded-full blur-xs animate-ping opacity-60"
                style={{ backgroundColor: currentTone.primary }}
              />
              <div
                className="absolute w-4 h-4 rounded-full bg-white shadow-xl animate-bounce"
                style={{ animationDuration: '2.5s' }}
              />
            </div>
            <h3 className="font-serif text-2xl font-normal m-0">
              Intention Held in the Hearth
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto font-serif italic">
              “Deep peace of the quiet earth to you, deep peace of the shining stars to you.”
            </p>
            {!isOnline && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-mono">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Saved to your local encrypted vault. Will sync gently when reconnected.</span>
              </div>
            )}
          </div>
        ) : isPreviewMode ? (
          /* Explicit Preview Screen */
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-serif text-xl font-normal m-0">Review Your Intention</h3>
                  <p className="text-xs text-stone-400">Verify destination, consent, and visibility before committing.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="p-1 rounded-full hover:bg-stone-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Destination:</span>
                <span className="font-serif font-medium" style={{ color: currentTone.primary }}>
                  {destination === 'journal'
                    ? '🔒 Private Journal (Only Visible to You)'
                    : destination === 'person'
                    ? `🕊 Specific Person: ${recipientName} (Consent Verified)`
                    : destination === 'room'
                    ? `🕯 Moderated Circle: ${selectedRoomName}`
                    : '🌐 Moderated Public Board'}
                </span>
              </div>

              {title && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Title:</span>
                  <span className="font-serif font-medium">{title}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Intention Text:</span>
                <p className="font-serif italic text-sm p-3 rounded-xl bg-stone-500/10 leading-relaxed">
                  “{content}”
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/20 text-[11px] text-stone-500">
                <div>
                  <strong>Author Visibility:</strong> {isAnonymous ? 'Anonymous' : 'Your Display Name'}
                </div>
                <div>
                  <strong>Private Reminder:</strong> {privateReminder === 'none' ? 'None' : `${privateReminder.toUpperCase()} chime`}
                </div>
                <div>
                  <strong>Personal Log:</strong> {addToPersonalLog ? 'Saved in Personal Log' : 'Not logged'}
                </div>
                <div>
                  <strong>Network:</strong> {isOnline ? 'Online' : 'Offline (Local Vault Queue)'}
                </div>
              </div>
            </div>

            {submissionFeedback && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-stone-200/20">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="px-4 py-2 rounded-full font-serif text-xs border border-stone-300/40 hover:bg-stone-500/10"
              >
                Back to Edit
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-full font-serif text-xs font-semibold flex items-center gap-2 transition-transform hover:scale-102 shadow-md"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                <span>Commit to the Hearth</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Writing Surface Form */
          <form onSubmit={handleProceedToPreview} className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2.5">
                <HearthFlameGlow size={32} color={currentTone.primary} />
                <div>
                  <h2 id="prayer-sanctuary-title" className="font-serif text-xl font-normal leading-snug m-0">
                    Prayer & Intention Sanctuary
                  </h2>
                  <p className="text-xs text-stone-400">
                    Sacred, non-exploitative writing space. Responsive across desktop, tablet, and mobile.
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

            {/* Destination Selector: 4 Choices */}
            <div className="space-y-1.5">
              <label className="font-serif text-xs font-medium block">
                Intention Destination:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'journal',
                    icon: <Lock className="w-4 h-4 text-amber-500" />,
                    title: 'Private Journal',
                    desc: 'Encrypted only for you',
                  },
                  {
                    id: 'person',
                    icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
                    title: 'Specific Person',
                    desc: 'Affirmative mutual consent',
                  },
                  {
                    id: 'room',
                    icon: <Users className="w-4 h-4 text-indigo-500" />,
                    title: 'Offer to Room',
                    desc: 'Moderated circle',
                  },
                  {
                    id: 'public_board',
                    icon: <Globe className="w-4 h-4 text-sky-500" />,
                    title: 'Public Board',
                    desc: 'Moderated community wall',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDestination(opt.id as PrayerDestination)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      destination === opt.id ? 'ring-2 font-medium shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderColor:
                        destination === opt.id ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                      backgroundColor:
                        destination === opt.id ? `${currentTone.primary}20` : 'transparent',
                    }}
                  >
                    <div>{opt.icon}</div>
                    <div className="mt-2">
                      <div className="text-xs font-serif font-medium">{opt.title}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Recipient Input with Consent Check */}
            {destination === 'person' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5 text-xs animate-in fade-in">
                <div>
                  <label className="font-serif block font-medium mb-1">
                    Recipient Display Name or Hearth Handle:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sister Miriam, Sarah M."
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

            {/* Room Selector */}
            {destination === 'room' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5 animate-in fade-in">
                <label className="font-serif font-medium block">
                  Select Moderated Circle:
                </label>
                <select
                  value={selectedRoomName}
                  onChange={(e) => setSelectedRoomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30 bg-transparent text-xs font-serif"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.title} className="text-stone-900 bg-stone-100">
                      {r.title} ({r.tradition})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Contemplative Starters & Templates */}
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

            {/* Title & Writing Area */}
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional Intention Title..."
                className="w-full px-4 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif placeholder-stone-400 focus:outline-none"
              />

              <div className="relative">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  onFocus={() => ambientSettings.fadeOnInteraction && ambientAudio.fadeForInteraction(true)}
                  onBlur={() => ambientSettings.fadeOnInteraction && ambientAudio.fadeForInteraction(false)}
                  rows={4}
                  placeholder="Pour your heart onto this quiet paper surface... (Touch, pencil, keyboard, assistive tech supported)"
                  className="w-full p-4 rounded-3xl bg-stone-500/5 border border-stone-200/30 text-sm font-serif leading-relaxed placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner"
                  required
                />

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleVoiceDictation}
                  className={`absolute bottom-3 right-3 p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs ${
                    isDictating
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-stone-500/10 hover:bg-stone-500/20 text-stone-600 dark:text-stone-300 border-stone-300/30'
                  }`}
                  title="Gentle Voice Dictation"
                  aria-label="Toggle voice dictation"
                >
                  {isDictating ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">
                    {isDictating ? 'Listening...' : 'Dictate'}
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Controls: Anonymity, Reminder, Personal Log */}
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-500">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Anonymity Toggle</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-500">
                <input
                  type="checkbox"
                  checked={addToPersonalLog}
                  onChange={(e) => setAddToPersonalLog(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Save to Personal Log</span>
              </label>

              <div className="flex items-center gap-1.5 text-stone-500">
                <Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <select
                  value={privateReminder}
                  onChange={(e) => setPrivateReminder(e.target.value as PrayerReminderInterval)}
                  className="bg-transparent border border-stone-300/30 rounded-lg px-2 py-0.5 text-[11px]"
                >
                  <option value="none">No Reminder</option>
                  <option value="daily">Daily Chime</option>
                  <option value="weekly">Weekly Chime</option>
                  <option value="evening">Evening Quiet</option>
                </select>
              </div>
            </div>

            {/* HIPAA Safety Notice */}
            {safetyNotice && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div className="leading-relaxed">
                  <strong>Privacy Notice: </strong>
                  {safetyNotice}
                </div>
              </div>
            )}

            {/* Footer with Preview Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200/20 text-xs">
              <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Commercial Trackers • Affirmative Consent</span>
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
                <span>Preview & Consent Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
