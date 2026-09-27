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
} from 'lucide-react';

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
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const [activeMode, setActiveMode] = useState<'Practice' | 'Learning' | 'Discussion'>('Practice');
  const [messageInput, setMessageInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [sentSuccessNotification, setSentSuccessNotification] = useState(false);
  const [reportedMessageId, setReportedMessageId] = useState<string | null>(null);
  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});

  // Check safety/HIPAA/solicitation as user types
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

    // Check anti-solicitation block
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
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                Moderated Sanctuary
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

            <div className="flex items-center gap-2">
              <div className="p-3 rounded-2xl bg-amber-500/10 flex items-center gap-2 text-xs">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{selectedRoom.memberCount} present</span>
              </div>
            </div>
          </div>

          {/* Room Covenants & Non-solicitation Rules */}
          <div className="p-3.5 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs space-y-1">
            <span className="font-serif font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Circle Covenants:
            </span>
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
                className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all ${
                  activeMode === mode ? 'font-semibold shadow-xs' : 'opacity-60 hover:opacity-90'
                }`}
                style={{
                  backgroundColor:
                    activeMode === mode ? currentTone.primary : 'transparent',
                  color: activeMode === mode ? '#2C2520' : 'inherit',
                  border: `1px solid ${currentTone.primary}50`,
                }}
              >
                {mode === 'Practice' ? '🕯 Practice' : mode === 'Learning' ? '📖 Learning' : '💬 Discussion'}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-serif text-stone-400 px-2">
            <span>
              Messages in {activeMode} Mode ({selectedRoom.recentMessages.filter(m => m.mode === activeMode).length})
            </span>
            {currentLanguage !== 'en' && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                <Globe className="w-3 h-3" />
                Live Translation Active ({currentLanguage.toUpperCase()})
              </span>
            )}
          </div>

          {selectedRoom.recentMessages
            .filter((m) => m.mode === activeMode)
            .map((msg) => {
              const isShowingOriginal = showOriginalMap[msg.id];
              const translation = translateSpiritualText(msg.content, currentLanguage);
              const displayContent = isShowingOriginal || currentLanguage === 'en' ? msg.content : translation.translated;

              return (
                <div
                  key={msg.id}
                  className="p-4 rounded-3xl border transition-all space-y-2 relative"
                  style={{
                    borderColor: 'rgba(232, 168, 124, 0.2)',
                    backgroundColor:
                      timeOfDay === 'night' ? '#27201A' : '#FFFDFB',
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-medium">{msg.senderName}</span>
                      {msg.traditionTag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-500">
                          {msg.traditionTag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <span>{msg.timestamp}</span>
                      {reportedMessageId === msg.id ? (
                        <span className="text-rose-500 font-mono text-[10px]">Reported to Moderators</span>
                      ) : (
                        <button
                          onClick={() => {
                            setReportedMessageId(msg.id);
                            alert('Message reported to human moderators for review. Thank you for safeguarding our community.');
                          }}
                          className="hover:text-stone-600 p-0.5"
                          title="Report inappropriate content or solicitation"
                          aria-label="Report message to moderators"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-sm leading-relaxed text-stone-700 dark:text-stone-200">
                    {displayContent}
                  </p>

                  {/* Cross-Language Translation Indicator & Original Toggle */}
                  {currentLanguage !== 'en' && (
                    <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-stone-200/20 text-stone-400">
                      <span className="italic">
                        {isShowingOriginal ? 'Showing original text' : t('translatedNotice')}
                      </span>
                      <button
                        onClick={() =>
                          setShowOriginalMap((prev) => ({
                            ...prev,
                            [msg.id]: !prev[msg.id],
                          }))
                        }
                        className="underline hover:text-stone-600 font-serif"
                      >
                        {isShowingOriginal ? t('seeTranslation') : t('seeOriginal')}
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
            placeholder={`Offer a reflection or prayer in ${activeMode} mode...`}
            className="w-full bg-transparent resize-none focus:outline-none text-sm font-serif leading-relaxed placeholder-stone-400"
          />

          <div className="flex items-center justify-between pt-2 border-t border-stone-200/20">
            <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Offer Anonymously</span>
            </label>

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
              className="group p-5 rounded-3xl border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-102 flex flex-col justify-between"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.3)',
                backgroundColor:
                  timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
              }}
              aria-label={`Enter room: ${room.title}`}
            >
              <div className="space-y-3">
                {/* Header with Circular motif and status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      hasActivity ? 'animate-breath' : ''
                    }`}
                    style={{
                      backgroundColor: `${currentTone.primary}20`,
                      border: `1.5px solid ${currentTone.primary}`,
                    }}
                  >
                    {room.motif === 'vesica' ? (
                      <VesicaPiscisSymbol size={32} color={currentTone.primary} />
                    ) : (
                      <ConcentricRings size={32} ringsCount={2} glowColor={currentTone.primary} />
                    )}
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-stone-500/10 text-stone-400">
                    {room.memberCount} members
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                    {room.tradition}
                  </span>
                  <h3 className="font-serif text-base font-normal leading-snug group-hover:underline">
                    {room.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-200/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {room.recentMessages.length} reflections
                </span>
                <span
                  className="font-serif font-medium text-xs group-hover:translate-x-1 transition-transform"
                  style={{ color: currentTone.primary }}
                >
                  Enter Room →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
