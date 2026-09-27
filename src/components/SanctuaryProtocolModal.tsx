import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  ShieldCheck,
  Lock,
  HeartHandshake,
  PhoneCall,
  BookOpen,
  Sliders,
  Smartphone,
  X,
  Download,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const SanctuaryProtocolModal: React.FC = () => {
  const {
    isProtocolModalOpen,
    setIsProtocolModalOpen,
    hearthTone,
    timeOfDay,
  } = useHearth();

  const [activeSection, setActiveSection] = useState<number>(1);

  if (!isProtocolModalOpen) return null;

  const currentTone = HEARTH_TONES[hearthTone];

  const sections = [
    {
      id: 1,
      title: 'HIPAA & Federal Privacy',
      shortTitle: 'HIPAA Privacy',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-emerald-700 dark:text-emerald-400">
            1. Clinical-Grade Safeguards & PHI Protection
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            Spiritual practice and intentional prayer frequently occur at moments of profound human vulnerability (medical diagnoses, grief, surgery, addiction recovery). The Living Hearth enforces clinical-grade confidentiality to prevent commercialization or interception of health information:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                ✓ Real-time In-Browser PHI Shield
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Active scanner detects clinical diagnostic codes, oncology/ICU terms, and health identifiers prior to transmission, prompting users to generalize details or keep them in the private vault.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                ✓ Zero Third-Party Ad Trackers (HHS OCR Bulletins)
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                No Meta Pixels, Google Analytics, or commercial tracking tags exist in the source code. Strict Content Security Policy (CSP) forbids external leakage.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                ✓ Sovereign Client-Side Vault & Immediate Purge
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Reflections are held in client-side storage with one-click full JSON export and instantaneous local/remote cryptographic purge.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Zero-Solicitation Covenant',
      shortTitle: 'Non-Solicitation',
      icon: <Lock className="w-4 h-4 text-amber-500" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-amber-700 dark:text-amber-400">
            2. Absolute Non-Commercialization Protocol
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            Faith practice must remain untainted by financial solicitation, conversion bounties, or recruitment funnels.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Strict Financial Link Interception
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Automated filtering blocks links to Venmo, CashApp, PayPal, GoFundMe, and cryptocurrency wallet addresses.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • No Dating, Marketplace, or Multi-Level Schemes
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                The platform prohibits romantic matching, marketplace selling of religious paraphernalia, and institutional membership recruitment.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • 3-Tier Escalation Matrix
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                First incident: educational notice. Second incident: 7-day room suspension. Third incident: permanent sanctuary ban.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Affirmative Mutual Consent',
      shortTitle: 'Affirmative Consent',
      icon: <HeartHandshake className="w-4 h-4 text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-indigo-700 dark:text-indigo-400">
            3. Autonomous Consent & Privacy-Preserving Communication
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            Every direct communication requires prior, explicit, affirmative agreement:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Double Opt-In Direct Intentions
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                No unsolicited private prayer requests. Senders must confirm recipient consent, and recipients can mute or disable requests globally.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Privacy-Preserving Silent Rejection
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Declining an invitation produces zero notification or rejection reason to the sender, eliminating retaliatory harassment.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Zero Contact Book Harvesting
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Recipient search operates purely by chosen display handle. External contacts, phone numbers, and emails are never scraped.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Crisis Support & 988 Lifeline',
      shortTitle: 'Crisis Safety (988)',
      icon: <PhoneCall className="w-4 h-4 text-rose-500" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-rose-700 dark:text-rose-400">
            4. Emergency Lifeline Routing & Boundary Protocol
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            The Living Hearth maintains explicit non-clinical boundaries while providing immediate emergency resources:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-rose-700 dark:text-rose-300 block">
                  988 Suicide & Crisis Lifeline (24/7 Free & Confidential)
                </span>
                <p className="text-[11px] text-stone-500 m-0">
                  Direct dialing and texting available nationwide across the US and Canada.
                </p>
              </div>
              <a
                href="tel:988"
                className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-serif text-xs hover:bg-rose-700 shrink-0"
              >
                Call 988
              </a>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Non-Punitive Warm Escalation
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Users expressing acute crisis are presented with compassionate professional care rather than punitive account termination.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Scholarly Integrity & Inclusivity',
      shortTitle: 'Scholarly Standards',
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-amber-800 dark:text-amber-300">
            5. “Leave Out None” Mandate & Sacred Glossaries
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            All educational modules must satisfy rigorous scholarly and interfaith criteria:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Peer-Reviewed Citations & Internal Diversity
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                All 12 curated paths cite university press scholarship and present internal denominational varieties fairly without triumphalism.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Preserved Sacred Terminology Lexicon
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Transliterated sacred terms (*Tawḥīd, Ḥesed, Karuṇā, Agápē, Anattā, Mokṣa, Ik Onkar, Seva, Ahiṃsā, Wu Wei, Kami*) are protected from clumsy machine translation.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Circle Governance & Moderation',
      shortTitle: 'Circle Governance',
      icon: <Sliders className="w-4 h-4 text-purple-500" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-purple-700 dark:text-purple-300">
            6. Role-Based Moderation & Restorative Queue
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            Rooms operate under communal covenants enforced through gentle pacing and community leadership:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Reflection Pause (Slow Mode: 30s–120s)
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Enforces quiet intervals between posts to de-escalate emotional reactivity and promote contemplative reflection.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • Role Badges: Elders, Guides & Verified Practitioners
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Visible community accountability indicators distinguish trusted educators and facilitators without algorithmic ranking.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Technical Standards & A11y',
      shortTitle: 'Technical Protocol',
      icon: <Smartphone className="w-4 h-4 text-teal-500" />,
      content: (
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold m-0 text-teal-700 dark:text-teal-400">
            7. Cross-Platform Parity & Accessibility Standards
          </h4>
          <p className="text-stone-500 leading-relaxed text-xs">
            Universal accessibility across desktop, tablet, mobile, and screen-readers:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • WCAG 2.2 Level AA / AAA Conformance
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Dynamic font scaling up to 200%, high-contrast mode, reduced-motion controls, and keyboard navigation shortcuts (`P` for Pray, `Escape` to close).
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
              <span className="font-semibold block text-stone-700 dark:text-stone-200">
                • PWA Standalone & Encrypted Offline Vault
              </span>
              <p className="text-stone-500 text-[11px] m-0">
                Installable web app manifest with local encrypted vault queueing that automatically syncs intentions when connection resumes.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleDownloadProtocol = () => {
    window.open('https://github.com/tappout360/The-living-hearth/blob/main/docs/PROTOCOL.md', '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="protocol-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(28, 22, 18, 0.94)'
            : 'rgba(250, 245, 238, 0.94)',
      }}
    >
      <div
        className="w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all duration-300 flex flex-col justify-between max-h-[92vh] overflow-y-auto"
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
              <FileText className="w-5 h-5" style={{ color: currentTone.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                  Federal & HIPAA Safe Master Protocol
                </span>
                <span className="text-[11px] text-stone-400">v1.0.0 Production Master</span>
              </div>
              <h2 id="protocol-modal-title" className="font-serif text-xl sm:text-2xl font-normal leading-snug m-0 mt-0.5">
                The Living Hearth: Complete Operating Protocol
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsProtocolModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-500/20"
            aria-label="Close Protocol window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (7 Sections) */}
        <div className="flex items-center gap-1.5 py-3 border-b border-stone-200/10 overflow-x-auto scrollbar-none text-xs">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 transition-all font-serif ${
                activeSection === sec.id
                  ? 'font-semibold shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeSection === sec.id ? `${currentTone.primary}25` : 'transparent',
                color: activeSection === sec.id ? currentTone.primary : 'inherit',
                border: `1px solid ${activeSection === sec.id ? currentTone.primary : 'transparent'}`,
              }}
            >
              {sec.icon}
              <span>{sec.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="py-5 flex-1 overflow-y-auto">
          {sections.find((s) => s.id === activeSection)?.content}
        </div>

        {/* Footer with Actions */}
        <div className="pt-4 border-t border-stone-200/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audited & verified against HHS, HIPAA, and federal consumer privacy standards.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadProtocol}
              className="px-4 py-2 rounded-full border border-stone-300/40 hover:bg-stone-500/10 flex items-center gap-1.5 font-serif"
            >
              <Download className="w-3.5 h-3.5" />
              <span>View Markdown on GitHub</span>
            </button>
            <button
              onClick={() => setIsProtocolModalOpen(false)}
              className="px-5 py-2 rounded-full font-serif font-semibold"
              style={{
                backgroundColor: currentTone.primary,
                color: '#2C2520',
              }}
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
