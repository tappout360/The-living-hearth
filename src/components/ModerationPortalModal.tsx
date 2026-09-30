import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { ModerationAction, ReportReason } from '../types';
import {
  ShieldAlert,
  X,
  CheckCircle,
  AlertTriangle,
  Lock,
  UserX,
  VolumeX,
  FileText,
  LifeBuoy,
  Clock,
  Send,
} from 'lucide-react';

interface ModerationPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModerationPortalModal: React.FC<ModerationPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    hearthTone,
    timeOfDay,
    moderationTickets,
    resolveModerationTicket,
    submitModerationReport,
    userProfile,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const [activeTab, setActiveTab] = useState<'queue' | 'audit' | 'crisis' | 'new_report'>('queue');
  const [moderatorNotes, setModeratorNotes] = useState<{ [ticketId: string]: string }>({});

  // Form for testing / manual report submission
  const [reportTarget, setReportTarget] = useState('');
  const [reportCategory, setReportCategory] = useState<ReportReason>('solicitation_recruitment');
  const [reportContent, setReportContent] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const pendingTickets = moderationTickets.filter((t) => t.status === 'pending');
  const actionedTickets = moderationTickets.filter((t) => t.status === 'actioned');

  const handleAction = (ticketId: string, action: ModerationAction) => {
    const notes = moderatorNotes[ticketId] || `Resolution applied: ${action}`;
    resolveModerationTicket(ticketId, action, notes);
    setModeratorNotes((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });
  };

  const handleManualReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget.trim() || !reportContent.trim()) return;

    await submitModerationReport({
      category: reportCategory,
      reporterDisplayName: userProfile.displayName,
      targetUserOrMessage: reportTarget.trim(),
      contentSnapshot: reportContent.trim(),
      contextSource: 'room',
    });

    setReportTarget('');
    setReportContent('');
    setSubmitFeedback('Triage report created and safety action logged.');
    setTimeout(() => setSubmitFeedback(null), 3500);
    setActiveTab('queue');
  };

  const categoryLabels: Record<ReportReason, string> = {
    solicitation_recruitment: 'Commercial / Recruitment Solicitation',
    harassment: 'Direct Harassment / Hostility',
    spiritual_abuse: 'Spiritual Abuse / Coercive Demands',
    hate_discrimination: 'Hate Speech / Tradition Bias',
    spam: 'Spam / Automated Flooding',
    other: 'Other Community Concern',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="moderation-portal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="w-full max-w-3xl rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
          borderColor: currentTone.primary,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: currentTone.primary }}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="moderation-portal-title" className="font-serif text-lg sm:text-xl font-normal m-0">
                Trust, Safety & Moderation Portal
              </h2>
              <p className="text-xs text-stone-400">
                Zero-Solicitation Integrity • Peer Protection • Audit Logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-500/20 transition-colors"
            aria-label="Close Moderation Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200/20 pb-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Active Queue ({pendingTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Audit Log ({actionedTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('new_report')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'new_report'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Submit Triage Report
          </button>
          <button
            onClick={() => setActiveTab('crisis')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'crisis'
                ? 'bg-rose-500/20 text-rose-400 font-semibold'
                : 'text-stone-400 hover:text-rose-300'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            988 Crisis Response
          </button>
        </div>

        {submitFeedback && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{submitFeedback}</span>
          </div>
        )}

        {/* Tab Content: Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            {pendingTickets.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500/80" />
                <p className="text-sm font-medium">All reports resolved.</p>
                <p className="text-xs text-stone-500">
                  The sanctuary remains calm, respectful, and free of open solicitation.
                </p>
              </div>
            ) : (
              pendingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-2xl border border-stone-200/20 bg-stone-500/5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {categoryLabels[ticket.category] || ticket.category}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Reported by {ticket.reporterDisplayName} • {new Date(ticket.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-stone-400">
                      Target User / Handle:{' '}
                      <span className="text-stone-200 font-medium">{ticket.targetUserOrMessage}</span>
                    </p>
                    <div className="p-2.5 rounded-xl bg-stone-900/40 border border-stone-700/30 text-stone-300 font-mono text-[11px] leading-relaxed">
                      "{ticket.contentSnapshot}"
                    </div>
                  </div>

                  {/* Moderator Resolution Controls */}
                  <div className="space-y-2 pt-2 border-t border-stone-200/10">
                    <input
                      type="text"
                      placeholder="Optional moderator notes / action rationale..."
                      value={moderatorNotes[ticket.id] || ''}
                      onChange={(e) =>
                        setModeratorNotes({ ...moderatorNotes, [ticket.id]: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-800/40 border border-stone-700/30 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                    />

                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => handleAction(ticket.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-500/10 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, 'warn')}
                        className="px-3 py-1.5 rounded-xl text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 flex items-center gap-1 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Gentle Warning
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, 'mute')}
                        className="px-3 py-1.5 rounded-xl text-xs bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 flex items-center gap-1 transition-colors"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        Mute Sender
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, 'block')}
                        className="px-3 py-1.5 rounded-xl text-xs bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600/40 flex items-center gap-1 transition-colors font-medium"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Enforce Block
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Audit Log */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            {actionedTickets.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-500">No actioned tickets yet.</div>
            ) : (
              actionedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3.5 rounded-2xl border border-stone-200/10 bg-stone-500/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-200">
                      Target: {ticket.targetUserOrMessage}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                      {ticket.actionTaken || 'Actioned'}
                    </span>
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Category: {categoryLabels[ticket.category] || ticket.category}
                  </p>
                  {ticket.moderatorNotes && (
                    <div className="p-2 rounded-lg bg-stone-900/30 text-stone-300 italic text-[11px]">
                      Notes: {ticket.moderatorNotes}
                    </div>
                  )}
                  <p className="text-[10px] text-stone-500">
                    Reviewed: {ticket.reviewedAt ? new Date(ticket.reviewedAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Submit New Triage Report */}
        {activeTab === 'new_report' && (
          <form onSubmit={handleManualReportSubmit} className="space-y-4 text-xs">
            <p className="text-stone-400">
              Submit a report on unsolicited fundraising, aggressive proselytizing, or violations of sanctuary safety.
            </p>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Target Participant or Handle</label>
              <input
                type="text"
                required
                value={reportTarget}
                onChange={(e) => setReportTarget(e.target.value)}
                placeholder="e.g. unsolicited-fundraiser-99"
                className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Violation Category</label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as ReportReason)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="solicitation_recruitment">Commercial / Recruitment Solicitation</option>
                <option value="harassment">Direct Harassment / Hostility</option>
                <option value="spiritual_abuse">Spiritual Abuse / Coercive Demands</option>
                <option value="hate_discrimination">Hate Speech / Tradition Bias</option>
                <option value="spam">Spam / Automated Flooding</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Content Excerpt or Incident Description</label>
              <textarea
                required
                rows={3}
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Paste the excerpt violating community integrity..."
                className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white font-medium shadow-md transition-all"
                style={{ backgroundColor: currentTone.primary }}
              >
                Submit Triage Report
              </button>
            </div>
          </form>
        )}

        {/* Tab Content: 988 Crisis Response */}
        {activeTab === 'crisis' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-rose-400 font-medium text-sm">
              <LifeBuoy className="w-5 h-5" />
              Immediate Crisis Escalation Protocol
            </div>
            <p className="text-stone-300">
              The Living Hearth is a contemplative sanctuary, not an emergency mental health provider. If an individual indicates acute distress or suicide risk, provide immediate supportive direction without unsolicited advice.
            </p>
            <div className="p-3 bg-stone-900/60 rounded-xl border border-rose-500/30 text-rose-200 space-y-1">
              <p className="font-semibold text-rose-300">Confidential Emergency Resources:</p>
              <p>• US & Canada: Call or text <span className="font-mono font-bold text-white">988</span> (Suicide & Crisis Lifeline, 24/7)</p>
              <p>• United Kingdom: Call <span className="font-mono font-bold text-white">111</span> (NHS Mental Health Services)</p>
              <p>• International Resources: <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline text-amber-400">findahelpline.com</a></p>
            </div>
            <p className="text-[11px] text-stone-400">
              When encountering a critical situation in any prayer circle or room, moderators automatically provide empathetic referrals to 988 and mute surrounding chatter to maintain privacy.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/10">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Non-punitive Restorative Moderation
          </span>
          <span>HIPAA & Consumer Protection Safeguard Active</span>
        </div>
      </div>
    </div>
  );
};
