import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { translateSpiritualText } from '../i18n/languages';
import {
  Sparkles,
  Lock,
  UserCheck,
  Users,
  X,
  Languages,
  VolumeX,
  AlertTriangle,
  BookmarkCheck,
} from 'lucide-react';

export const PrayerDetailModal: React.FC = () => {
  const {
    activePrayerDetail,
    setActivePrayerDetail,
    respondToPrayer,
    mutePrayerSender,
    blockUser,
    hearthTone,
    timeOfDay,
    currentLanguage,
  } = useHearth();

  const [showTranslation, setShowTranslation] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyVisibility, setReplyVisibility] = useState<'private_to_sender' | 'room_visible'>('private_to_sender');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSavedToList, setIsSavedToList] = useState(false);

  if (!activePrayerDetail) return null;

  const currentTone = HEARTH_TONES[hearthTone];
  const translated = translateSpiritualText(activePrayerDetail.content, currentLanguage);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    respondToPrayer(activePrayerDetail.id, replyContent.trim(), isAnonymous, replyVisibility);
    setReplyContent('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prayer-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(28, 22, 18, 0.94)'
            : 'rgba(250, 245, 238, 0.94)',
      }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-300 flex flex-col justify-between max-h-[92vh] overflow-y-auto"
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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: `${currentTone.primary}20`,
              }}
            >
              {activePrayerDetail.destinationType === 'journal' ? (
                <Lock className="w-5 h-5 text-amber-500" />
              ) : activePrayerDetail.destinationType === 'person' ? (
                <UserCheck className="w-5 h-5 text-emerald-500" />
              ) : (
                <Users className="w-5 h-5 text-indigo-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${currentTone.primary}20`, color: currentTone.primary }}>
                  {activePrayerDetail.destinationType === 'journal'
                    ? 'Private Sanctuary Vault'
                    : activePrayerDetail.destinationType === 'person'
                    ? 'Direct Intention (Consented)'
                    : activePrayerDetail.destinationType === 'room'
                    ? `Moderated Circle • ${activePrayerDetail.roomName}`
                    : 'Public Hearth Board'}
                </span>
                <span className="text-[11px] text-stone-400">{activePrayerDetail.timestamp}</span>
              </div>
              <h2 id="prayer-detail-title" className="font-serif text-xl font-normal leading-snug m-0 mt-0.5">
                {activePrayerDetail.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActivePrayerDetail(null)}
            className="p-1.5 rounded-full hover:bg-stone-500/20"
            aria-label="Close prayer detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intention Body */}
        <div className="py-5 space-y-4">
          <div className="p-5 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {activePrayerDetail.isAnonymous
                  ? 'Offered anonymously with gentle reverence'
                  : `From: ${activePrayerDetail.senderName || 'Hearth Companion'}`}
                {activePrayerDetail.recipientName && ` → To: ${activePrayerDetail.recipientName}`}
              </span>

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-xs font-serif flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-300/30 hover:border-amber-400 transition-colors"
              >
                <Languages className="w-3.5 h-3.5 text-amber-500" />
                <span>{showTranslation ? 'See original' : 'See translation'}</span>
              </button>
            </div>

            <p className="font-serif text-base leading-relaxed italic text-stone-800 dark:text-stone-200">
              “{showTranslation ? translated.translated : activePrayerDetail.content}”
            </p>

            {showTranslation && translated.termInfo && (
              <div className="pt-2 border-t border-stone-200/20 text-xs text-stone-500">
                <span className="font-medium text-amber-600 block mb-1">
                  Sacred Term Retained:
                </span>
                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px]">
                  <strong>{translated.termInfo.transliteration}</strong> ({translated.termInfo.gloss})
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSavedToList(!isSavedToList)}
                className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                  isSavedToList ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'hover:bg-stone-500/10 border-stone-300/40'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{isSavedToList ? 'Added to Personal List' : 'Add to Personal Prayer List'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-stone-400">
              {activePrayerDetail.senderName && (
                <button
                  onClick={() => {
                    mutePrayerSender(activePrayerDetail.senderName!);
                    alert(`Muted future requests from ${activePrayerDetail.senderName}.`);
                  }}
                  className="p-1.5 rounded-full hover:text-stone-600 hover:bg-stone-500/10"
                  title="Mute future requests from this sender"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (activePrayerDetail.senderName) blockUser(activePrayerDetail.senderName);
                  alert('Intention reported to safety moderators. Sender blocked.');
                  setActivePrayerDetail(null);
                }}
                className="p-1.5 rounded-full hover:text-rose-500 hover:bg-stone-500/10"
                title="Report inappropriate content or solicitation"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Existing Responses */}
          {activePrayerDetail.responses && activePrayerDetail.responses.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="font-serif text-xs font-medium text-stone-400 block">
                Responses & Counter-Intentions ({activePrayerDetail.responses.length})
              </span>
              <div className="space-y-2">
                {activePrayerDetail.responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="font-serif font-semibold text-stone-600 dark:text-stone-300">
                        {resp.isAnonymous ? 'Compassionate Companion' : resp.responderName}
                      </span>
                      <span>{resp.timestamp}</span>
                    </div>
                    <p className="font-serif italic text-stone-700 dark:text-stone-200">
                      “{resp.content}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Respond with Intention */}
          {activePrayerDetail.destinationType !== 'journal' && (
            <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-stone-200/20">
              <span className="font-serif text-xs font-medium block">
                Reply with your own intention or quiet affirmation:
              </span>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                placeholder="Offer a word of solace, strength, or shared light..."
                className="w-full p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif leading-relaxed focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Reply anonymously</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                    <input
                      type="radio"
                      name="replyVis"
                      checked={replyVisibility === 'private_to_sender'}
                      onChange={() => setReplyVisibility('private_to_sender')}
                    />
                    <span>Private to sender</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 rounded-full font-serif text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-40"
                  style={{
                    backgroundColor: currentTone.primary,
                    color: '#2C2520',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send Intention</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
