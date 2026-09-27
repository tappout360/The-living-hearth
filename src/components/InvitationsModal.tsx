import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ConcentricRings } from './SacredGeometry';
import type { InvitationType } from '../types';
import {
  Mail,
  Send,
  Check,
  X,
  VolumeX,
  AlertTriangle,
  Users,
  Sparkles,
  BookOpen,
  UserPlus,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const InvitationsModal: React.FC = () => {
  const {
    isInvitationsModalOpen,
    setIsInvitationsModalOpen,
    invitations,
    sendInvitation,
    respondToInvitation,
    invitationPreferences,
    setInvitationPreferences,
    hearthTone,
    timeOfDay,
    rooms,
    learningModules,
    scanForPhiAndSafety,
    userProfile,
  } = useHearth();

  const [activeTab, setActiveTab] = useState<'inbox' | 'send' | 'preferences'>('inbox');
  const [sendType, setSendType] = useState<InvitationType>('room');
  const [recipientQuery, setRecipientQuery] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [selectedTargetTitle, setSelectedTargetTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const [isPreviewStep, setIsPreviewStep] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  if (!isInvitationsModalOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];
  const pendingInvitations = invitations.filter((i) => i.status === 'pending');

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPersonalNote(text);
    if (text.length > 5) {
      const check = scanForPhiAndSafety(text);
      setSafetyNotice(check.advice);
    } else {
      setSafetyNotice(null);
    }
  };

  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientQuery.trim()) {
      alert('Please specify a recipient display name or handle.');
      return;
    }

    // Determine target title if not set
    let title = selectedTargetTitle;
    let targetId = selectedTargetId;
    if (sendType === 'room') {
      const room = rooms.find((r) => r.id === targetId) || rooms[0];
      targetId = room.id;
      title = room.title;
    } else if (sendType === 'learning') {
      const module = learningModules.find((m) => m.id === targetId) || learningModules[0];
      targetId = module.id;
      title = module.title;
    } else if (sendType === 'prayer') {
      title = 'Intentional Prayer & Well-Wishing';
      targetId = 'prayer-circle-custom';
    } else if (sendType === 'connection') {
      title = 'Sacred Companion Connection';
      targetId = 'connection-peer';
    }

    setSelectedTargetId(targetId);
    setSelectedTargetTitle(title);
    setIsPreviewStep(true);
  };

  const handleFinalSend = () => {
    const result = sendInvitation({
      senderName: userProfile.displayName,
      recipientName: recipientQuery.trim(),
      type: sendType,
      targetId: selectedTargetId,
      targetTitle: selectedTargetTitle,
      personalNote: personalNote.trim(),
    });

    if (result.success) {
      setSendFeedback('Invitation delivered with gentle respect.');
      setTimeout(() => {
        setSendFeedback(null);
        setIsPreviewStep(false);
        setRecipientQuery('');
        setPersonalNote('');
        setActiveTab('inbox');
      }, 1800);
    } else {
      setSendFeedback(result.reason || 'Could not send invitation.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitations-modal-title"
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
              <Mail className="w-5 h-5" style={{ color: currentTone.primary }} />
            </div>
            <div>
              <h2 id="invitations-modal-title" className="font-serif text-xl font-normal leading-snug m-0">
                Invitations & Sacred Connections
              </h2>
              <p className="text-xs text-stone-400">
                Non-solicitation, respectful community invites with affirmative consent.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInvitationsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-500/20"
            aria-label="Close invitations window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-stone-200/10 text-xs">
          <button
            onClick={() => {
              setActiveTab('inbox');
              setIsPreviewStep(false);
            }}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'inbox' ? 'font-semibold shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'inbox' ? `${currentTone.primary}25` : 'transparent',
              color: activeTab === 'inbox' ? currentTone.primary : 'inherit',
            }}
          >
            <span>Inbox ({pendingInvitations.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('send');
              setIsPreviewStep(false);
            }}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'send' ? 'font-semibold shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'send' ? `${currentTone.primary}25` : 'transparent',
              color: activeTab === 'send' ? currentTone.primary : 'inherit',
            }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Invite</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('preferences');
              setIsPreviewStep(false);
            }}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'preferences' ? 'font-semibold shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'preferences' ? `${currentTone.primary}25` : 'transparent',
              color: activeTab === 'preferences' ? currentTone.primary : 'inherit',
            }}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab 1: Inbox */}
        {activeTab === 'inbox' && (
          <div className="py-4 space-y-3 flex-1 overflow-y-auto">
            {invitations.length === 0 ? (
              <div className="py-12 text-center text-stone-400 font-serif text-sm">
                Your invitation inbox is quiet and clear.
              </div>
            ) : (
              invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl border transition-all space-y-2.5"
                  style={{
                    borderColor:
                      inv.status === 'pending' ? currentTone.primary : 'rgba(232, 168, 124, 0.2)',
                    backgroundColor:
                      timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-mono text-[10px]"
                            style={{ backgroundColor: `${currentTone.primary}20`, color: currentTone.primary }}>
                        {inv.type}
                      </span>
                      <span className="font-serif text-xs font-semibold">
                        {inv.senderName}
                      </span>
                      <span className="text-[10px] text-stone-400">• {inv.timestamp}</span>
                    </div>

                    <span
                      className={`text-[11px] font-mono capitalize px-2 py-0.5 rounded-full ${
                        inv.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-600'
                          : inv.status === 'accepted'
                          ? 'bg-emerald-500/20 text-emerald-600'
                          : 'bg-stone-500/20 text-stone-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-sm font-medium leading-snug">{inv.targetTitle}</h4>
                    {inv.personalNote && (
                      <p className="font-serif text-xs text-stone-600 dark:text-stone-300 italic mt-1 bg-stone-500/5 p-2 rounded-xl">
                        “{inv.personalNote}”
                      </p>
                    )}
                  </div>

                  {inv.status === 'pending' && (
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => respondToInvitation(inv.id, 'accept')}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-transform hover:scale-102 shadow-xs"
                          style={{
                            backgroundColor: currentTone.primary,
                            color: '#2C2520',
                          }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept & Open
                        </button>
                        <button
                          onClick={() => respondToInvitation(inv.id, 'decline')}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-stone-300/40 hover:bg-stone-500/10"
                        >
                          Decline Quietly
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-stone-400">
                        <button
                          onClick={() => respondToInvitation(inv.id, 'mute')}
                          className="p-1.5 rounded-full hover:text-stone-600 hover:bg-stone-500/10"
                          title="Mute future invites from this companion"
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => respondToInvitation(inv.id, 'report')}
                          className="p-1.5 rounded-full hover:text-rose-500 hover:bg-stone-500/10"
                          title="Report solicitation or unwanted contact"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Send Invitation */}
        {activeTab === 'send' && (
          <div className="py-4 space-y-4 flex-1">
            {sendFeedback ? (
              <div className="py-12 text-center space-y-3 animate-in zoom-in-95">
                <ConcentricRings size={64} ringsCount={2} glowColor={currentTone.primary} className="mx-auto" />
                <h3 className="font-serif text-lg font-medium">{sendFeedback}</h3>
              </div>
            ) : isPreviewStep ? (
              /* Preview Step */
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                  <span className="font-serif font-semibold text-amber-700 dark:text-amber-300 block">
                    Review Invitation Before Sending
                  </span>
                  <div className="space-y-1">
                    <p>
                      <strong>Recipient:</strong> @{recipientQuery}
                    </p>
                    <p>
                      <strong>Type:</strong> {sendType.toUpperCase()}
                    </p>
                    <p>
                      <strong>Target:</strong> {selectedTargetTitle}
                    </p>
                    {personalNote && (
                      <p>
                        <strong>Note:</strong> “{personalNote}”
                      </p>
                    )}
                  </div>
                  <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Privacy Assured: No email or phone numbers are exposed. Recipient can decline quietly without notifying you.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewStep(false)}
                    className="px-4 py-2 rounded-full text-xs font-serif border border-stone-300/40"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSend}
                    className="px-6 py-2 rounded-full text-xs font-serif font-semibold shadow-md flex items-center gap-2"
                    style={{
                      backgroundColor: currentTone.primary,
                      color: '#2C2520',
                    }}
                  >
                    <span>Confirm & Send Invitation</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleProceedToPreview} className="space-y-4">
                {/* 1. Select Invitation Type */}
                <div className="space-y-1.5">
                  <label className="font-serif text-xs font-medium block">
                    Invitation Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'room', label: 'Invite to Room', icon: <Users className="w-3.5 h-3.5" /> },
                      { id: 'connection', label: 'Connect', icon: <UserPlus className="w-3.5 h-3.5" /> },
                      { id: 'prayer', label: 'Pray with Me', icon: <Sparkles className="w-3.5 h-3.5" /> },
                      { id: 'learning', label: 'Share Lesson', icon: <BookOpen className="w-3.5 h-3.5" /> },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSendType(t.id as InvitationType)}
                        className={`p-2.5 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                          sendType === t.id ? 'ring-2 font-semibold' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          borderColor: sendType === t.id ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                          backgroundColor: sendType === t.id ? `${currentTone.primary}20` : 'transparent',
                        }}
                      >
                        {t.icon}
                        <span className="text-[11px] font-serif">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Recipient Username Picker */}
                <div className="space-y-1.5">
                  <label className="font-serif text-xs font-medium block">
                    Recipient Username / Display Name:
                  </label>
                  <input
                    type="text"
                    value={recipientQuery}
                    onChange={(e) => setRecipientQuery(e.target.value)}
                    placeholder="Enter display name (e.g. Sister Miriam, Ananda P.)"
                    className="w-full px-3.5 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-stone-400">
                    Zero email or phone harvesting. Search occurs purely by sanctuary handle.
                  </span>
                </div>

                {/* 3. Room or Learning Module Selector if applicable */}
                {sendType === 'room' && (
                  <div className="space-y-1.5">
                    <label className="font-serif text-xs font-medium block">
                      Select Room to Invite to:
                    </label>
                    <select
                      value={selectedTargetId || rooms[0]?.id}
                      onChange={(e) => {
                        setSelectedTargetId(e.target.value);
                        const r = rooms.find((rm) => rm.id === e.target.value);
                        if (r) setSelectedTargetTitle(r.title);
                      }}
                      className="w-full px-3.5 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id} className="text-stone-900 bg-stone-100">
                          {r.title} ({r.tradition})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {sendType === 'learning' && (
                  <div className="space-y-1.5">
                    <label className="font-serif text-xs font-medium block">
                      Select Learning Path or Module:
                    </label>
                    <select
                      value={selectedTargetId || learningModules[0]?.id}
                      onChange={(e) => {
                        setSelectedTargetId(e.target.value);
                        const m = learningModules.find((lm) => lm.id === e.target.value);
                        if (m) setSelectedTargetTitle(m.title);
                      }}
                      className="w-full px-3.5 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif"
                    >
                      {learningModules.map((m) => (
                        <option key={m.id} value={m.id} className="text-stone-900 bg-stone-100">
                          {m.title} ({m.tradition})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 4. Optional Personal Note */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-serif font-medium">
                      Personal Note (Character-limited & Moderated):
                    </label>
                    <span className="text-[10px] text-stone-400">{personalNote.length}/180</span>
                  </div>
                  <textarea
                    value={personalNote}
                    onChange={handleNoteChange}
                    maxLength={180}
                    rows={2}
                    placeholder="Brief, warm note explaining your invitation..."
                    className="w-full p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs font-serif leading-relaxed focus:outline-none"
                  />
                </div>

                {safetyNotice && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{safetyNotice}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full font-serif text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    style={{
                      backgroundColor: currentTone.primary,
                      color: '#2C2520',
                    }}
                  >
                    <span>Preview Invitation</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Invitation Preferences */}
        {activeTab === 'preferences' && (
          <div className="py-4 space-y-4 flex-1 text-xs">
            <div className="p-4 rounded-2xl border space-y-3"
                 style={{
                   borderColor: 'rgba(232, 168, 124, 0.25)',
                   backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
                 }}>
              <span className="font-serif font-semibold text-sm block">Global Invitation Policy</span>
              <div className="space-y-2">
                {[
                  { id: 'all', title: 'Allow all respectful invitations', desc: 'Accept from any verified sanctuary practitioner.' },
                  { id: 'connections_only', title: 'Connections only', desc: 'Only receive invites from companions you have already connected with.' },
                  { id: 'review_all', title: 'Strict review queue', desc: 'Require manual screening before notifications are triggered.' },
                  { id: 'off', title: 'Turn off all invitations', desc: 'Do not allow any invitations or connection requests.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer border transition-colors ${
                      invitationPreferences.policy === opt.id ? 'ring-1 border-amber-400' : 'border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invitationPolicy"
                      checked={invitationPreferences.policy === opt.id}
                      onChange={() =>
                        setInvitationPreferences((prev) => ({ ...prev, policy: opt.id as any }))
                      }
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <div className="font-serif font-medium">{opt.title}</div>
                      <div className="text-[11px] text-stone-400">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border space-y-3"
                 style={{
                   borderColor: 'rgba(232, 168, 124, 0.25)',
                   backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
                 }}>
              <span className="font-serif font-semibold text-sm block">Allowed Invitation Categories</span>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Room Invitations</span>
                  <input
                    type="checkbox"
                    checked={invitationPreferences.allowRoomInvites}
                    onChange={(e) =>
                      setInvitationPreferences((prev) => ({ ...prev, allowRoomInvites: e.target.checked }))
                    }
                    className="rounded text-amber-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>“Pray with me / for this intention” Requests</span>
                  <input
                    type="checkbox"
                    checked={invitationPreferences.allowPrayerInvites}
                    onChange={(e) =>
                      setInvitationPreferences((prev) => ({ ...prev, allowPrayerInvites: e.target.checked }))
                    }
                    className="rounded text-amber-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Connection Requests</span>
                  <input
                    type="checkbox"
                    checked={invitationPreferences.allowConnectionRequests}
                    onChange={(e) =>
                      setInvitationPreferences((prev) => ({ ...prev, allowConnectionRequests: e.target.checked }))
                    }
                    className="rounded text-amber-600"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Learning Path & Lesson Shares</span>
                  <input
                    type="checkbox"
                    checked={invitationPreferences.allowLearningShares}
                    onChange={(e) =>
                      setInvitationPreferences((prev) => ({ ...prev, allowLearningShares: e.target.checked }))
                    }
                    className="rounded text-amber-600"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
