import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  BookOpen,
  X,
  CheckCircle,
  HelpCircle,
  Award,
  Send,
  Sparkles,
} from 'lucide-react';

interface ContentCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentCorrectionModal: React.FC<ContentCorrectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    hearthTone,
    timeOfDay,
    activeCorrectionContext,
    submitContentCorrection,
    contentCorrectionTickets,
    userProfile,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const [activeTab, setActiveTab] = useState<'suggest' | 'history' | 'standards'>('suggest');

  const [pathId, setPathId] = useState(activeCorrectionContext?.pathId || 'path-christianity');
  const [moduleTitle, setModuleTitle] = useState(
    activeCorrectionContext?.lessonTitle || 'Core Historical Context & Internal Diversity'
  );
  const [correctionText, setCorrectionText] = useState('');
  const [scholarlyCitation, setScholarlyCitation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim() || !scholarlyCitation.trim()) return;

    submitContentCorrection({
      pathId,
      moduleOrLessonTitle: moduleTitle,
      suggestedBy: userProfile.displayName || 'Anonymous Contributor',
      correctionText: correctionText.trim(),
      scholarlySourceCitation: scholarlyCitation.trim(),
    });

    setSubmitted(true);
    setCorrectionText('');
    setScholarlyCitation('');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-correction-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
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
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="content-correction-title" className="font-serif text-lg sm:text-xl font-normal m-0">
                Scholarly Content Integrity
              </h2>
              <p className="text-xs text-stone-400">
                Peer Review • Scholarly Corrections • Internal Diversity Governance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-500/20 transition-colors"
            aria-label="Close Correction Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-stone-200/20 pb-2">
          <button
            onClick={() => setActiveTab('suggest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'suggest'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Suggest Correction
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Submitted Logs ({contentCorrectionTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'standards'
                ? 'bg-amber-500/20 text-amber-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Editorial Policy
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-400" />
            <h3 className="font-serif text-base text-stone-200">
              Thank You for Enriching the Hearth
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Your scholarly citation and proposed adjustment have been submitted to our content board. Verified corrections are incorporated into future learning module editions.
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'suggest' && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-amber-300">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    The Living Hearth adheres to rigorous scholarly review and equal dignity. We require verifiable academic, historical, or authentic tradition sources to substantiate proposed updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium">Learning Pathway</label>
                    <select
                      value={pathId}
                      onChange={(e) => setPathId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="path-christianity">Christianity (Apostolic & Reformation)</option>
                      <option value="path-islam">Islam (Sunni, Shia & Sufi traditions)</option>
                      <option value="path-judaism">Judaism (Torah, Talmud & Halakha)</option>
                      <option value="path-hinduism">Hinduism (Vedanta, Bhakti & Darshana)</option>
                      <option value="path-buddhism">Buddhism (Theravada, Mahayana & Vajrayana)</option>
                      <option value="path-interfaith">Comparative & Inter-Tradition Dialogue</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium">Lesson or Module Title</label>
                    <input
                      type="text"
                      required
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">
                    Proposed Correction or Nuance
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={correctionText}
                    onChange={(e) => setCorrectionText(e.target.value)}
                    placeholder="Describe the inaccurate phrasing, omitted tradition nuance, or bias..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-medium flex items-center justify-between">
                    <span>Scholarly Citation / Canonical Source</span>
                    <span className="text-amber-400 font-normal">Required for review</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={scholarlyCitation}
                    onChange={(e) => setScholarlyCitation(e.target.value)}
                    placeholder="e.g. Oxford History of World Religions, Vol 2, p. 114; or Talm. Bavli Berakhot 28b"
                    className="w-full px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/40 text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white font-medium shadow-md transition-all flex items-center gap-1.5"
                    style={{ backgroundColor: currentTone.primary }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Suggestion
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {contentCorrectionTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3.5 rounded-2xl border border-stone-200/10 bg-stone-500/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-200">
                        {ticket.moduleOrLessonTitle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          ticket.status === 'applied'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-stone-300">{ticket.correctionText}</p>
                    <p className="text-[11px] text-amber-400/90 font-mono">
                      Ref: {ticket.scholarlySourceCitation}
                    </p>
                    <div className="text-[10px] text-stone-500 flex justify-between">
                      <span>Submitted by: {ticket.suggestedBy}</span>
                      <span>{new Date(ticket.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'standards' && (
              <div className="p-4 rounded-2xl bg-stone-500/10 border border-stone-200/10 space-y-3 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Award className="w-4 h-4" />
                  Equal Depth & Non-Privileging Review Workflow
                </div>
                <p className="text-stone-300">
                  Every learning module on The Living Hearth undergoes a multi-stage review process before publication:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="font-semibold text-amber-300">1. Draft & Fact Check</span>
                    <p className="text-stone-400 mt-1">Written with authentic tradition voices without comparative bias.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="font-semibold text-amber-300">2. Scholarly Review</span>
                    <p className="text-stone-400 mt-1">Cross-checked against canonical literature and historical scholarship.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="font-semibold text-amber-300">3. Internal Diversity Notice</span>
                    <p className="text-stone-400 mt-1">Acknowledges regional, liturgical, and theological variations.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-700/30">
                    <span className="font-semibold text-amber-300">4. Community Re-Verification</span>
                    <p className="text-stone-400 mt-1">Subject to ongoing peer feedback via scholarly correction tickets.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/10">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Scholarly Governance Council
          </span>
          <span>Zero Monolithic Portrayals</span>
        </div>
      </div>
    </div>
  );
};
