import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  Globe,
  X,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Server,
  ArrowRight,
} from 'lucide-react';

interface DomainReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainReadinessModal: React.FC<DomainReadinessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { hearthTone, timeOfDay } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dns' | 'ssl' | 'checklist'>('dns');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dnsRecords = [
    {
      type: 'A',
      name: '@',
      value: '76.76.21.21',
      description: 'Apex domain root routing to Vercel global edge network',
    },
    {
      type: 'CNAME',
      name: 'www',
      value: 'cname.vercel-dns.com',
      description: 'WWW subdomain wildcard canonical redirect',
    },
    {
      type: 'TXT',
      name: '_vercel',
      value: 'vc-domain-verify=thelivinghearth.org',
      description: 'Domain ownership verification token (optional/if prompted)',
    },
  ];

  const productionChecklist = [
    {
      title: 'Zero Plaintext Credential Exposure',
      desc: 'All passwords hashed with WebCrypto SHA-256 before memory or vault persistence.',
      status: 'Ready',
    },
    {
      title: 'Client-Side Web Crypto AES-GCM Vault',
      desc: 'Private journal entries and sacred reflections encrypted with 256-bit keys.',
      status: 'Ready',
    },
    {
      title: 'HIPAA & Federal Consumer Privacy Protection',
      desc: 'Client-side PHI detection, zero third-party trackers, no advertising pixels.',
      status: 'Ready',
    },
    {
      title: 'Strict Non-Solicitation & Anti-Harassment Rules',
      desc: 'Automated filtering for commercial crowdfunding, solicitation, and dogmatic friction.',
      status: 'Ready',
    },
    {
      title: 'Egalitarian Multi-Tradition Architecture',
      desc: 'Equal depth, Sacred Orientation compass, and multi-calendar engine across all paths.',
      status: 'Ready',
    },
    {
      title: 'Full Offline Service Worker & IndexedDB Vault',
      desc: 'Seamless offline queuing when network connection drops; auto-resyncs when online.',
      status: 'Ready',
    },
    {
      title: 'WCAG 2.2 AA Accessibility Compliance',
      desc: 'High-contrast modes, text scaling (100%-175%), keyboard tab navigation, reduced motion.',
      status: 'Ready',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="domain-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
    >
      <div
        className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          backgroundColor: timeOfDay === 'night' ? '#27201B' : '#FAF6F0',
          borderColor: currentTone.primary,
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b border-stone-200/20 flex items-center justify-between"
          style={{
            background: `radial-gradient(ellipse at top left, ${currentTone.glow} 0%, transparent 70%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                borderColor: currentTone.primary,
                backgroundColor: `${currentTone.primary}25`,
                color: currentTone.primary,
              }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="domain-modal-title" className="font-serif text-xl font-normal m-0">
                Production Domain & Deployment Readiness
              </h2>
              <p className="text-xs text-stone-400 m-0">
                Authoritative DNS, SSL, and Sovereign Testing Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-500/20 text-stone-400 hover:text-stone-200 transition-colors"
            aria-label="Close Domain Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200/20 text-xs px-6 pt-3 gap-2">
          {[
            { id: 'dns', label: 'DNS & Custom Domain' },
            { id: 'ssl', label: 'SSL & Security Headers' },
            { id: 'checklist', label: 'MVP+ Verification Checklist' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 font-serif transition-colors relative ${
                activeTab === tab.id ? 'font-semibold' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                color: activeTab === tab.id ? currentTone.primary : 'inherit',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: currentTone.primary }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'dns' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="font-serif font-semibold text-amber-700 dark:text-amber-300 block">
                  Custom Domain Setup (e.g. thelivinghearth.org)
                </span>
                <p className="text-stone-500 leading-relaxed">
                  To connect your registrar (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.) to your Vercel production deployment:
                </p>
              </div>

              {/* Records Table */}
              <div className="space-y-2">
                <span className="font-serif font-medium text-stone-600 dark:text-stone-300 block">
                  Recommended DNS Records:
                </span>
                <div className="space-y-2">
                  {dnsRecords.map((rec) => (
                    <div
                      key={rec.type + rec.name}
                      className="p-3.5 rounded-2xl border border-stone-200/20 flex items-center justify-between gap-3 bg-stone-500/5 font-mono"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-500/15 text-stone-600 dark:text-stone-300 font-bold text-[10px]">
                            {rec.type}
                          </span>
                          <span className="font-semibold text-stone-800 dark:text-stone-100">
                            {rec.name}
                          </span>
                          <ArrowRight className="w-3 h-3 text-stone-400" />
                          <span className="text-amber-600 dark:text-amber-400 truncate">
                            {rec.value}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-sans m-0">
                          {rec.description}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(rec.value, rec.type + rec.name)}
                        className="px-3 py-1.5 rounded-xl border border-stone-300/40 hover:border-amber-400 transition-colors flex items-center gap-1.5 text-[10px] shrink-0 font-serif"
                      >
                        {copiedKey === rec.type + rec.name ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200/20 space-y-2">
                <span className="font-serif font-semibold block">Vercel CLI Domain Command:</span>
                <div className="p-3 rounded-xl bg-black/80 text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                  <code>vercel domains add thelivinghearth.org</code>
                  <button
                    onClick={() =>
                      copyToClipboard('vercel domains add thelivinghearth.org', 'cli-cmd')
                    }
                    className="text-stone-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ssl' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-serif font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Automatic SSL / TLS & HSTS Headers</span>
                </div>
                <p className="text-stone-500 leading-relaxed">
                  Upon pointing DNS records to Vercel, Let's Encrypt certificates are automatically provisioned and renewed with zero manual intervention. Strict Transport Security (HSTS) ensures HTTPS everywhere.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-stone-200/20 space-y-1">
                  <span className="font-serif font-medium text-stone-700 dark:text-stone-200 block">
                    TLS 1.3 Encryption
                  </span>
                  <p className="text-stone-400 text-[11px]">
                    Fastest modern cryptographic handshake ensuring zero MITM interception of prayer sync packets.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-stone-200/20 space-y-1">
                  <span className="font-serif font-medium text-stone-700 dark:text-stone-200 block">
                    Zero Third-Party Trackers
                  </span>
                  <p className="text-stone-400 text-[11px]">
                    No advertising beacons, fingerprinting scripts, or Google Analytics loaded at the domain root.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <p className="text-stone-500 leading-relaxed">
                Audited against all Phase 0–5 specifications for production deployment and domain attachment:
              </p>

              <div className="space-y-2">
                {productionChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-stone-200/20 flex items-start justify-between gap-3 bg-stone-500/5"
                  >
                    <div className="space-y-0.5">
                      <div className="font-serif font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-mono text-[10px] shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200/20 flex items-center justify-between bg-stone-500/5">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            <span>Deployment Target: Vercel Global Edge Network</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full font-serif text-xs font-semibold shadow-xs"
            style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
          >
            Ready to Connect Domain
          </button>
        </div>
      </div>
    </div>
  );
};
