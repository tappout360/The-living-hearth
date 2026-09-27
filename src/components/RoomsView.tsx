import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings, VesicaPiscisSymbol } from './SacredGeometry';
import { translateSpiritualText } from '../i18n/languages';
import {
  Users,
  Shield,
  MessageSquare,
  ArrowLeft,
  Send,
  AlertTriangle,
  Flag,
  CheckCircle,
  Globe,
  Volume2,
  BadgeCheck,
  Clock,
  Sliders,
  X,
} from 'lucide-react';

interface ReportedItem {
  id: string;
  senderName: string;
  reason: 'solicitation' | 'proselytizing' | 'phi_health' | 'harassment';
  snippet: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export const RoomsView: React.FC = () => {
  const {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    addRoomMessage,
    hearthTone,
    timeOfDay,
    currentLanguage,
    t,
    scanForPhiAndSafety,
    userProfile,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const [activeMode, setActiveMode] = useState<'Practice' | 'Learning' | 'Discussion'>('Practice');
  const [messageInput, setMessageInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [sentSuccessNotification, setSentSuccessNotification] = useState(false);
  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});

  // Moderation & Thresholds State
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [slowModeSeconds, setSlowModeSeconds] = useState(60);
  const [requireConsentPledge, setRequireConsentPledge] = useState(true);

  const handleFlagMessage = (senderName: string, snippet: string) => {
    setReportedItems((prev) => [
      {
        id: `rep-${Date.now()}`,
        senderName,
        reason: 'proselytizing',
        snippet: `“${snippet.slice(0, 60)}...”`,
        timestamp: 'Just now',
        status: 'pending',
      },
      ...prev,
    ]);
    alert('Message flagged. Added to Circle Reporting Queue for review.');
  };
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([
    {
      id: 'rep-1',
      senderName: 'New Member #402',
      reason: 'solicitation',
      snippet: '“Join our investment channel for high-yield cryptocurrency…”',
      timestamp: '10 min ago',
      status: 'pending',
    },
    {
      id: 'rep-2',
      senderName: 'Eager Preacher',
      reason: 'proselytizing',
      snippet: '“Your doctrine is incomplete; you must convert to our true path…”',
      timestamp: '25 min ago',
      status: 'pending',
    },
  ]);

  const handleResolveReport = (id: string, action: 'dismiss' | 'resolve' | 'mute') => {
    setReportedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
        };
      })
    );
  };

  // Helper for role-based badges
  const getSenderRoleBadge = (senderName: string) => {
    if (senderName.includes('Sister') || senderName.includes('Master') || senderName.includes('Rabbi') || senderName.includes('Guru')) {
      return { label: 'Circle Elder', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' };
    }
    if (senderName.includes('Guide') || senderName === 'Tariq A.' || senderName === 'Ananda P.') {
      return { label: 'Circle Guide', bg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' };
    }
    return { label: 'Consent Verified', bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessageInput(val);
    if (val.trim().length > 5) {
      const check = scanForPhiAndSafety(val);
      setSafetyNotice(check.advice);
    } else {
      setSafetyNotice(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoomId) return;

    const check = scanForPhiAndSafety(messageInput);
    if (check.hasSolicitation) {
      alert('Solicitation blocked: To preserve the sanctity of our rooms, commercial pitches and recruitment are not permitted.');
      return;
    }

    addRoomMessage(selectedRoomId, messageInput.trim(), activeMode, isAnonymous);
    setMessageInput('');
    setSafetyNotice(null);
    setSentSuccessNotification(true);
    setTimeout(() => setSentSuccessNotification(false), 3000);
  };

  // If a room is selected, display Room Interior view
  if (selectedRoom) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-300">
        {/* Room Header with Back Button */}
        <div
          className="rounded-3xl p-6 border shadow-xs space-y-4 transition-all"
          style={{
            borderColor: 'rgba(232, 168, 124, 0.25)',
            backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedRoomId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              aria-label="Back to all rooms"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Circles
            </button>
            <div className="flex items-center gap-2">
              {/* Moderation Thresholds & Safety Queue Trigger */}
              <button
                onClick={() => setIsModerationModalOpen(true)}
                className="px-3 py-1 rounded-full text-[11px] font-serif border border-stone-300/40 hover:border-amber-400 flex items-center gap-1.5 transition-colors"
                title="Inspect Room Moderation Policies & Queue"
              >
                <Sliders className="w-3 h-3 text-amber-500" />
                <span>Moderation & Queue ({reportedItems.filter((i) => i.status === 'pending').length})</span>
              </button>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                Protected Circle
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-serif text-stone-400">
                  {selectedRoom.tradition}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-400 font-serif flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-500" />
                  Atmosphere: {selectedRoom.atmosphereProfile} drone
                </span>
              </div>
              <h2 className="font-serif text-2xl font-normal leading-snug m-0 mt-1">
                {selectedRoom.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                {selectedRoom.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Sync</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 flex items-center gap-2 text-xs">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{selectedRoom.memberCount} present</span>
              </div>
            </div>
          </div>

          {/* Room Covenants & Non-solicitation Rules */}
          <div className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Circle Covenants & Thresholds:
              </span>
              <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                Slow Mode: {slowModeSeconds}s reflection pause
              </span>
            </div>
            <ul className="list-disc list-inside text-stone-500 space-y-0.5">
              {selectedRoom.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Toggle between Learning / Practice / Discussion */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-200/20">
            {(['Practice', 'Learning', 'Discussion'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-4 py-1.5 rounded-full font-serif text-xs transition-all ${
                  activeMode === mode ? 'font-medium shadow-xs' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    activeMode === mode ? currentTone.primary : 'transparent',
                  color: activeMode === mode ? '#2C2520' : 'inherit',
                  border: `1px solid ${
                    activeMode === mode ? currentTone.primary : 'rgba(232, 168, 124, 0.3)'
                  }`,
                }}
              >
                {mode} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="space-y-4">
          {selectedRoom.recentMessages.map((msg) => {
            const isOriginalShown = showOriginalMap[msg.id];
            const hasTranslation = currentLanguage !== 'en' && msg.sourceLanguage === 'en';
            const translatedResult = hasTranslation
              ? translateSpiritualText(msg.content, currentLanguage)
              : null;
            const displayContent =
              hasTranslation && !isOriginalShown && translatedResult
                ? translatedResult.translated
                : msg.content;
            const roleBadge = getSenderRoleBadge(msg.senderName);

            return (
              <div
                key={msg.id}
                className="p-5 rounded-3xl border shadow-xs space-y-2 transition-all"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.2)',
                  backgroundColor:
                    timeOfDay === 'night' ? '#29221C' : '#FAF6F2',
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-semibold">{msg.senderName}</span>
                    {/* Role & Consent Badge */}
                    <span className={`text-[10px] font-serif px-2 py-0.5 rounded-full flex items-center gap-1 ${roleBadge.bg}`}>
                      <BadgeCheck className="w-3 h-3" />
                      {roleBadge.label}
                    </span>
                    {msg.traditionTag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500 font-serif">
                        {msg.traditionTag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleFlagMessage(msg.senderName, msg.content)}
                      className="hover:text-rose-500 transition-colors p-1"
                      title="Report violation of room covenant"
                      aria-label="Report message"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200">
                  {displayContent}
                </p>

                {/* Translation Notice & Toggle */}
                {hasTranslation && (
                  <div className="pt-2 border-t border-stone-200/20 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-500" />
                      <span>{t('translatedNotice')}</span>
                    </span>
                    <button
                      onClick={() =>
                        setShowOriginalMap((prev) => ({
                          ...prev,
                          [msg.id]: !prev[msg.id],
                        }))
                      }
                      className="text-stone-500 hover:text-amber-600 font-serif underline"
                    >
                      {isOriginalShown ? t('seeTranslation') : t('seeOriginal')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expanding Message Composer */}
        <form
          onSubmit={handleSendMessage}
          className="p-5 rounded-3xl border shadow-md space-y-3 sticky bottom-20 backdrop-blur-md"
          style={{
            borderColor: `${currentTone.primary}50`,
            backgroundColor:
              timeOfDay === 'night'
                ? 'rgba(42, 34, 28, 0.96)'
                : 'rgba(255, 255, 255, 0.96)',
          }}
        >
          {safetyNotice && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{safetyNotice}</span>
            </div>
          )}

          {sentSuccessNotification && (
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Your reflection has been gently offered to the room.</span>
            </div>
          )}

          <textarea
            value={messageInput}
            onChange={handleInputChange}
            rows={2}
            placeholder={`Offer a reflection or prayer in ${activeMode} mode... (Respecting 60s slow mode and affirmative consent)`}
            className="w-full bg-transparent resize-none focus:outline-none text-sm font-serif leading-relaxed placeholder-stone-400"
          />

          <div className="flex items-center justify-between pt-2 border-t border-stone-200/20">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Offer Anonymously</span>
              </label>
              <span className="text-[10px] text-stone-400 hidden sm:inline">
                Posting as: <strong>{isAnonymous ? 'Anonymous' : userProfile.displayName}</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-5 py-2 rounded-full font-serif text-xs font-medium flex items-center gap-2 transition-transform hover:scale-102 disabled:opacity-40"
              style={{
                backgroundColor: currentTone.primary,
                color: '#2C2520',
              }}
            >
              <span>Send Reflection</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Room Moderation Policies & Queue Modal */}
        {isModerationModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
          >
            <div
              className="w-full max-w-xl rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
                borderColor: currentTone.primary,
                color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif text-lg font-normal m-0">Room Moderation Policies & Reporting Queue</h3>
                </div>
                <button onClick={() => setIsModerationModalOpen(false)} className="p-1 rounded-full hover:bg-stone-500/20">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Thresholds Section */}
              <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-2.5 text-xs">
                <span className="font-serif font-semibold block text-stone-700 dark:text-stone-200">
                  Active Circle Thresholds
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-stone-300/30">
                    <span className="font-medium block">Slow Mode Pause</span>
                    <select
                      value={slowModeSeconds}
                      onChange={(e) => setSlowModeSeconds(Number(e.target.value))}
                      className="bg-transparent text-[11px] font-mono mt-1 border border-stone-300/40 rounded px-1.5 py-0.5"
                    >
                      <option value={30}>30s pause</option>
                      <option value={60}>60s pause</option>
                      <option value={120}>120s pause</option>
                    </select>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-300/30">
                    <span className="font-medium block">Affirmative Consent</span>
                    <label className="flex items-center gap-1.5 text-[11px] mt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireConsentPledge}
                        onChange={(e) => setRequireConsentPledge(e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span>Mandatory Pledge</span>
                    </label>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-300/30">
                    <span className="font-medium block">Automated PHI Scanner</span>
                    <span className="text-[11px] text-emerald-600">Active (HIPAA Safe)</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-300/30">
                    <span className="font-medium block">Commercial Solicitations</span>
                    <span className="text-[11px] text-rose-600">Strictly Blocked</span>
                  </div>
                </div>
              </div>

              {/* Reporting Queue Section */}
              <div className="space-y-2 text-xs">
                <span className="font-serif font-semibold block text-stone-700 dark:text-stone-200">
                  Circle Reporting Queue ({reportedItems.filter((i) => i.status === 'pending').length} pending)
                </span>
                <div className="space-y-2">
                  {reportedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border space-y-2"
                      style={{
                        borderColor: item.status === 'pending' ? 'rgba(232, 168, 124, 0.4)' : 'rgba(232, 168, 124, 0.1)',
                        backgroundColor: timeOfDay === 'night' ? '#322A22' : '#FFFFFF',
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-stone-600 dark:text-stone-300">
                          From: {item.senderName} • Reason: <strong className="uppercase">{item.reason}</strong>
                        </span>
                        <span className="text-stone-400">{item.timestamp}</span>
                      </div>
                      <p className="font-serif italic text-stone-500 m-0">{item.snippet}</p>

                      {item.status === 'pending' ? (
                        <div className="flex items-center gap-2 pt-1 border-t border-stone-200/20">
                          <button
                            onClick={() => handleResolveReport(item.id, 'dismiss')}
                            className="px-2.5 py-1 rounded-lg border border-stone-300/40 text-[11px] hover:bg-stone-500/10"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleResolveReport(item.id, 'resolve')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]"
                          >
                            Issue Gentle Reminder
                          </button>
                          <button
                            onClick={() => handleResolveReport(item.id, 'mute')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px]"
                          >
                            Mute Participant
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-mono capitalize">
                          Status: {item.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsModerationModalOpen(false)}
                  className="px-5 py-2 rounded-full font-serif text-xs font-semibold"
                  style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, display Grid of All Rooms
  return (
    <div className="space-y-6 pb-24">
      {/* Rooms Overview Banner */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-2"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: currentTone.primary }} />
          <h2 className="font-serif text-2xl font-normal leading-snug m-0">
            Moderated Circles of Faith & Study
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
          Step into shared rooms dedicated to your home tradition or explore others with reverent curiosity. Zero recruitment, commercial pitching, or ideological debate allowed.
        </p>
      </div>

      {/* Grid of Room Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const hasActivity = room.activityStatus === 'active' || room.activityStatus === 'glowing';
          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedRoomId(room.id);
                }
              }}
              className="p-6 rounded-3xl border cursor-pointer transition-all duration-300 hover:scale-102 flex flex-col justify-between shadow-xs"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor:
                  timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
              }}
              aria-label={`Enter room: ${room.title}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                    {room.tradition}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hasActivity && (
                      <span
                        className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                        title="Room is quietly active"
                      />
                    )}
                    <span className="text-xs text-stone-400 font-mono">
                      {room.memberCount} present
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${
                      hasActivity ? 'animate-breath' : ''
                    }`}
                    style={{
                      backgroundColor: `${currentTone.primary}20`,
                      border: `1px solid ${currentTone.primary}`,
                    }}
                  >
                    {room.motif === 'circle' ? (
                      <ConcentricRings size={36} ringsCount={2} glowColor={currentTone.primary} />
                    ) : room.motif === 'rings' ? (
                      <ConcentricRings size={36} ringsCount={3} glowColor={currentTone.primary} />
                    ) : (
                      <VesicaPiscisSymbol size={32} color={currentTone.primary} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-normal leading-snug m-0">
                      {room.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/20 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Moderated
                </span>
                <span className="font-serif hover:underline flex items-center gap-1">
                  Enter Sanctuary
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
