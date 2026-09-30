import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { TraditionVisual } from './ReligiousVisuals';
import { SacredVisualsGalleryModal } from './SacredVisualsGalleryModal';
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
  Sparkles,
  X,
  Lock,
  KeyRound,
  Plus,
  Mail,
} from 'lucide-react';
import { analyzeContentSafety } from '../services/aiSafetyGuardian';

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
    createRoom,
    unlockedPrivateRoomIds,
    unlockPrivateRoom,
    hearthTone,
    timeOfDay,
    currentLanguage,
    t,
    scanForPhiAndSafety,
    userProfile,
    setActiveTab,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const [activeMode, setActiveMode] = useState<'Practice' | 'Learning' | 'Discussion'>('Practice');
  const [messageInput, setMessageInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [sentSuccessNotification, setSentSuccessNotification] = useState(false);
  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Faith Boundary & Room Filtering
  const [roomFilterMode, setRoomFilterMode] = useState<'my_faith' | 'all'>('my_faith');

  // Private Room Unlock State
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [roomToUnlock, setRoomToUnlock] = useState<any | null>(null);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState<string | null>(null);

  // Create Room State
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomTradition, setNewRoomTradition] = useState(userProfile.primaryTradition);
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomIsPrivate, setNewRoomIsPrivate] = useState(false);
  const [newRoomEmails, setNewRoomEmails] = useState('');

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

    const safety = analyzeContentSafety(
      messageInput,
      userProfile.primaryTradition,
      selectedRoom?.tradition
    );

    if (!safety.isSafe) {
      alert(safety.blockedReason || 'Message blocked to preserve sacred tranquility.');
      return;
    }

    addRoomMessage(selectedRoomId, safety.sanitizedText, activeMode, isAnonymous);
    setMessageInput('');
    setSafetyNotice(null);
    setSentSuccessNotification(true);
    setTimeout(() => setSentSuccessNotification(false), 3000);
  };

  const isMatchingUserFaith = selectedRoom
    ? selectedRoom.tradition.toLowerCase().includes(userProfile.primaryTradition.toLowerCase()) ||
      userProfile.primaryTradition.toLowerCase().includes(selectedRoom.tradition.toLowerCase()) ||
      selectedRoom.tradition.toLowerCase().includes('universal') ||
      selectedRoom.tradition.toLowerCase().includes('interfaith') ||
      selectedRoom.tradition.toLowerCase().includes('contemplative')
    : false;

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
            <div className="flex items-start gap-4">
              <button
                onClick={() => setIsGalleryOpen(true)}
                title="Inspect Sacred Iconography"
                className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border shadow-xs hover:scale-105 transition-transform cursor-pointer"
                style={{
                  backgroundColor: `${currentTone.primary}20`,
                  borderColor: `${currentTone.primary}50`,
                  color: currentTone.primary,
                }}
              >
                <TraditionVisual tradition={selectedRoom.tradition || selectedRoom.title} size={40} color={currentTone.primary} />
              </button>
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
                  {selectedRoom.isPrivate && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-serif flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Private Circle
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl font-normal leading-snug m-0 mt-1">
                  {selectedRoom.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                  {selectedRoom.description}
                </p>
              </div>
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

        {/* Expanding Message Composer or Faith-Boundary Protection Notice */}
        {isMatchingUserFaith ? (
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
        ) : (
          <div
            className="p-6 rounded-3xl border shadow-sm space-y-3 sticky bottom-20 backdrop-blur-md"
            style={{
              borderColor: 'rgba(232, 168, 124, 0.4)',
              backgroundColor:
                timeOfDay === 'night'
                  ? 'rgba(42, 34, 28, 0.96)'
                  : 'rgba(255, 255, 255, 0.96)',
            }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-medium text-stone-800 dark:text-stone-200 m-0">
                  Faith-Boundary Protection Active (Guest Contemplation Mode)
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed m-0">
                  You are viewing a <strong>{selectedRoom.tradition}</strong> sanctuary while your home tradition is set to <strong>{userProfile.primaryTradition}</strong>. To guarantee zero cross-faith friction, attacks, or theological debate, posting abilities are reserved for adherents of this tradition. You are warmly invited to listen and reflect.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-200/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400 font-serif">
                To study this tradition's scriptures and history without polemics:
              </span>
              <button
                onClick={() => setActiveTab('learn')}
                className="px-4 py-1.5 rounded-full text-xs font-serif border hover:bg-amber-500/15 transition-colors"
                style={{
                  borderColor: currentTone.primary,
                  color: currentTone.primary,
                }}
              >
                Inspect {selectedRoom.tradition} in The Library →
              </button>
            </div>
          </div>
        )}

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

        {/* Sacred Visuals Gallery Modal */}
        <SacredVisualsGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          initialTradition={selectedRoom?.tradition}
        />
      </div>
    );
  }

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim() || !newRoomDesc.trim()) return;

    const emailList = newRoomEmails
      .split(',')
      .map((em) => em.trim().toLowerCase())
      .filter(Boolean);

    createRoom(
      newRoomTitle,
      newRoomTradition,
      newRoomDesc,
      newRoomIsPrivate,
      emailList.length > 0 ? emailList : undefined
    );

    setIsCreateRoomModalOpen(false);
    setNewRoomTitle('');
    setNewRoomDesc('');
    setNewRoomEmails('');
    setNewRoomIsPrivate(false);
  };

  const handleRoomClick = (room: (typeof rooms)[0]) => {
    if (room.isPrivate && !unlockedPrivateRoomIds.includes(room.id)) {
      setRoomToUnlock(room);
      setInviteCodeInput('');
      setInviteCodeError(null);
      setIsUnlockModalOpen(true);
      return;
    }
    setSelectedRoomId(room.id);
  };

  const handleUnlockPrivateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomToUnlock) return;

    const entered = inviteCodeInput.trim();
    const ok = unlockPrivateRoom(roomToUnlock.id, entered);
    if (ok) {
      setIsUnlockModalOpen(false);
      setSelectedRoomId(roomToUnlock.id);
    } else {
      setInviteCodeError('Invalid invite code or uninvited email address.');
    }
  };

  const displayedRooms = rooms.filter((r) => {
    if (roomFilterMode === 'my_faith') {
      return (
        r.tradition.toLowerCase().includes(userProfile.primaryTradition.toLowerCase()) ||
        userProfile.primaryTradition.toLowerCase().includes(r.tradition.toLowerCase()) ||
        r.tradition.toLowerCase().includes('universal') ||
        r.tradition.toLowerCase().includes('interfaith') ||
        r.tradition.toLowerCase().includes('contemplative')
      );
    }
    return true;
  });

  // Otherwise, display Grid of All Rooms
  return (
    <div className="space-y-6 pb-24">
      {/* Rooms Overview Banner */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-3"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: currentTone.primary }} />
            <h2 className="font-serif text-2xl font-normal leading-snug m-0">
              Moderated Circles of Faith & Study
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateRoomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium border hover:scale-102 transition-transform shadow-xs"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: currentTone.primary,
                color: '#2C2520',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Create Circle
            </button>
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif border hover:scale-102 transition-transform shadow-xs"
              style={{
                borderColor: `${currentTone.primary}80`,
                backgroundColor: `${currentTone.primary}18`,
                color: currentTone.primary,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sacred Visuals Gallery
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed m-0">
          Step into shared rooms dedicated to your home tradition or explore others with reverent curiosity. Zero recruitment, commercial pitching, or ideological debate allowed.
        </p>

        {/* Filter Toggle: My Faith Sanctuary vs All Circles */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => setRoomFilterMode('my_faith')}
            className={`px-4 py-1.5 rounded-full font-serif text-xs transition-all flex items-center gap-1.5 ${
              roomFilterMode === 'my_faith'
                ? 'font-medium shadow-xs'
                : 'text-stone-500 border border-stone-300/40 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
            style={{
              backgroundColor: roomFilterMode === 'my_faith' ? `${currentTone.primary}25` : 'transparent',
              borderColor: roomFilterMode === 'my_faith' ? currentTone.primary : undefined,
              color: roomFilterMode === 'my_faith' ? currentTone.primary : undefined,
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>My Faith Sanctuary ({userProfile.primaryTradition})</span>
          </button>
          <button
            onClick={() => setRoomFilterMode('all')}
            className={`px-4 py-1.5 rounded-full font-serif text-xs transition-all flex items-center gap-1.5 ${
              roomFilterMode === 'all'
                ? 'font-medium shadow-xs'
                : 'text-stone-500 border border-stone-300/40 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
            style={{
              backgroundColor: roomFilterMode === 'all' ? `${currentTone.primary}25` : 'transparent',
              borderColor: roomFilterMode === 'all' ? currentTone.primary : undefined,
              color: roomFilterMode === 'all' ? currentTone.primary : undefined,
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Global Traditions ({rooms.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Room Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedRooms.map((room) => {
          const hasActivity = room.activityStatus === 'active' || room.activityStatus === 'glowing';
          const isLockedPrivate = room.isPrivate && !unlockedPrivateRoomIds.includes(room.id);

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRoomClick(room);
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
                    {room.isPrivate && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-serif flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Private
                      </span>
                    )}
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
                    className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform shadow-xs ${
                      hasActivity ? 'animate-breath' : ''
                    }`}
                    style={{
                      backgroundColor: `${currentTone.primary}20`,
                      border: `1px solid ${currentTone.primary}50`,
                      color: currentTone.primary,
                    }}
                  >
                    <TraditionVisual tradition={room.tradition || room.title} size={30} color={currentTone.primary} />
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
                  {isLockedPrivate ? (
                    <>
                      <span>Enter with Code</span>
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    </>
                  ) : (
                    <>
                      <span>Enter Sanctuary</span>
                      <MessageSquare className="w-3.5 h-3.5" />
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Private Room Unlock Modal */}
      {isUnlockModalOpen && roomToUnlock && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-normal m-0">Private Sanctuary Access</h3>
              </div>
              <button onClick={() => setIsUnlockModalOpen(false)} className="p-1 rounded-full hover:bg-stone-500/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-stone-500 leading-relaxed m-0">
                <strong>{roomToUnlock.title}</strong> is an invitation-only circle for members and invited guests. Please enter your Circle Invite Code or your authorized email.
              </p>
              {roomToUnlock.inviteCode && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[11px]">
                  Sample test invite code: <strong>{roomToUnlock.inviteCode}</strong>
                </div>
              )}
            </div>

            <form onSubmit={handleUnlockPrivateRoom} className="space-y-3">
              <div>
                <label className="text-xs font-serif block mb-1 text-stone-500">
                  Invite Code or Email
                </label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  placeholder="e.g. HEARTH-7721 or user@example.com"
                  className="w-full p-2.5 rounded-xl border border-stone-300/40 bg-stone-500/5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
              </div>

              {inviteCodeError && (
                <div className="text-xs text-rose-500 font-serif flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{inviteCodeError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="px-4 py-2 rounded-full font-serif text-xs border border-stone-300/40 hover:bg-stone-500/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inviteCodeInput.trim()}
                  className="px-5 py-2 rounded-full font-serif text-xs font-medium transition-transform hover:scale-102 disabled:opacity-40"
                  style={{
                    backgroundColor: currentTone.primary,
                    color: '#2C2520',
                  }}
                >
                  Enter Private Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-normal m-0">Create a Sacred Circle</h3>
              </div>
              <button onClick={() => setIsCreateRoomModalOpen(false)} className="p-1 rounded-full hover:bg-stone-500/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-serif">
              <div>
                <label className="block mb-1 text-stone-500">Circle Name / Title</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Wednesday Morning Psalms & Contemplation"
                  className="w-full p-2.5 rounded-xl border border-stone-300/40 bg-stone-500/5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif"
                />
              </div>

              <div>
                <label className="block mb-1 text-stone-500">Religious Tradition</label>
                <select
                  value={newRoomTradition}
                  onChange={(e) => setNewRoomTradition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300/40 bg-stone-500/5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif"
                >
                  <option value="Christianity">Christianity</option>
                  <option value="Islam">Islam</option>
                  <option value="Judaism">Judaism</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Interfaith">Interfaith / Contemplative</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-stone-500">Purpose & Sanctuary Description</label>
                <textarea
                  required
                  rows={3}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Describe the meditative focus, text to study, or prayer intentions for this circle..."
                  className="w-full p-2.5 rounded-xl border border-stone-300/40 bg-stone-500/5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif resize-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={newRoomIsPrivate}
                    onChange={(e) => setNewRoomIsPrivate(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    Make this a Private Circle (Invite Code or Email Required)
                  </span>
                </label>

                {newRoomIsPrivate && (
                  <div className="space-y-2 pt-1 border-t border-stone-200/20">
                    <label className="block text-[11px] text-stone-500">
                      Allowed Email Invites (comma-separated, optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        value={newRoomEmails}
                        onChange={(e) => setNewRoomEmails(e.target.value)}
                        placeholder="pastor@church.org, member@faith.net"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300/40 bg-stone-500/5 text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 m-0">
                      A unique invite code will also be generated automatically that you can share with trusted members.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomModalOpen(false)}
                  className="px-4 py-2 rounded-full font-serif text-xs border border-stone-300/40 hover:bg-stone-500/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-serif text-xs font-medium transition-transform hover:scale-102"
                  style={{
                    backgroundColor: currentTone.primary,
                    color: '#2C2520',
                  }}
                >
                  Launch Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sacred Visuals Gallery Modal */}
      <SacredVisualsGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};
