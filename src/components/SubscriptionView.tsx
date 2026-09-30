import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { SubscriptionTier, SubscriptionBilling } from '../types';
import {
  Crown,
  Check,
  Heart,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface TierCardProps {
  id: SubscriptionTier;
  title: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  billing: SubscriptionBilling;
  features: string[];
  isPopular?: boolean;
  currentTier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  accentColor: string;
}

const TierCard: React.FC<TierCardProps> = ({
  id,
  title,
  subtitle,
  monthlyPrice,
  annualPrice,
  billing,
  features,
  isPopular,
  currentTier,
  onSelect,
  accentColor,
}) => {
  const isCurrent = currentTier === id;
  const price = billing === 'monthly' ? monthlyPrice : Math.round(annualPrice / 12);

  return (
    <div
      className={`rounded-3xl border p-6 flex flex-col justify-between transition relative ${
        isPopular
          ? 'bg-stone-900/90 border-stone-700 shadow-xl'
          : 'bg-stone-900/50 border-stone-800'
      }`}
      style={{
        borderColor: isPopular ? accentColor : undefined,
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-950 shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          Most Beloved Patronage
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg text-stone-100 font-medium">{title}</h3>
          {id === 'congregation' ? (
            <Building2 className="w-5 h-5 text-stone-400" />
          ) : id === 'pilgrim' ? (
            <Crown className="w-5 h-5" style={{ color: accentColor }} />
          ) : (
            <Heart className="w-5 h-5 text-stone-500" />
          )}
        </div>

        <p className="text-xs text-stone-400 min-h-[32px]">{subtitle}</p>

        {/* Pricing */}
        <div className="mt-4 mb-6">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-3xl font-normal text-stone-100">${price}</span>
            <span className="text-xs text-stone-400">/month</span>
          </div>
          {billing === 'annual' && price > 0 && (
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Billed annually (${annualPrice}/yr) • Save ~17%
            </div>
          )}
          {price === 0 && (
            <div className="text-[11px] text-stone-500 mt-0.5">Free forever sanctuary access</div>
          )}
        </div>

        {/* Features list */}
        <div className="space-y-2.5 text-xs text-stone-300 border-t border-stone-800/80 pt-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4">
        {isCurrent ? (
          <div className="w-full py-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-400 font-medium text-xs text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Tier</span>
          </div>
        ) : (
          <button
            onClick={() => onSelect(id)}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-stone-950 text-xs shadow-md transition hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            <span>{id === 'free' ? 'Switch to Free' : `Select ${title}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const SubscriptionView: React.FC = () => {
  const {
    hearthTone,
    account,
    updateSubscription,
    requestHardshipSponsorship,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [billing, setBilling] = useState<SubscriptionBilling>(account.subscriptionBilling);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSelectTier = (tier: SubscriptionTier) => {
    updateSubscription(tier, billing);
    setNotification(
      tier === 'free'
        ? 'Switched to Free Sanctuary Tier.'
        : `Upgraded to ${tier === 'pilgrim' ? 'Sustaining Pilgrim' : 'House of Worship Partner'}!`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleHardshipClick = () => {
    requestHardshipSponsorship();
    setNotification(
      'Sponsored Sanctuary Pass activated with our warmest blessings. Zero fee applied.'
    );
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-8 pb-28 animate-in fade-in duration-300">
      {/* 1. Header Banner & Non-Predatory Ethos */}
      <div
        className="p-6 md:p-8 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at top right, ${currentTone.glow} 0%, rgba(28, 25, 23, 0.95) 70%)`,
        }}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border"
              style={{
                borderColor: currentTone.primary,
                background: currentTone.lightBg,
                color: currentTone.primary,
              }}
            >
              Ethical Patronage & Subscription Details
            </span>
            <span className="text-xs text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-full border border-stone-800">
              No Ad Traps • 1-Click Cancel
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl text-stone-100 font-normal">
            Sustaining The Living Hearth Sanctuary
          </h1>
          <p className="text-stone-300 text-xs md:text-sm mt-2 leading-relaxed">
            The Living Hearth is free of commercial advertising, data profiling, and algorithmic outrage. We are sustained through the voluntary patronage of pilgrims, students, and houses of worship.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex p-1 bg-stone-950/80 rounded-2xl border border-stone-800">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${
                billing === 'monthly'
                  ? 'bg-stone-800 text-stone-100 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                billing === 'annual'
                  ? 'bg-stone-800 text-stone-100 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Three Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free */}
        <TierCard
          id="free"
          title="Free Sanctuary"
          subtitle="Essential spiritual practice, canonical study, and safe fellowship."
          monthlyPrice={0}
          annualPrice={0}
          billing={billing}
          features={[
            'Full access to all rooms in your home faith tradition',
            'Daily canonical scripture reading and 4-tone highlighter',
            'Full access to The Library interfaith scholarly curriculum',
            'Live public liturgical broadcasts & sermon streams',
            'Client-side AES-GCM-256 encrypted private prayer journal',
            'Zero commercial ads, trackers, or data harvesting',
          ]}
          currentTier={account.subscriptionTier}
          onSelect={handleSelectTier}
          accentColor={currentTone.primary}
        />

        {/* Tier 2: Sustaining Pilgrim */}
        <TierCard
          id="pilgrim"
          title="Sustaining Pilgrim"
          subtitle="For devoted practitioners who wish to deepen their study and support others."
          monthlyPrice={7}
          annualPrice={70}
          billing={billing}
          isPopular={true}
          features={[
            'Everything included in Free Sanctuary',
            '15% discount across all sacred store study Bibles & workbooks',
            'Unlimited scripture study margin notes & local vaults',
            'Offline scripture downloads & high-fidelity liturgical audio',
            'Golden Supporter Halo displayed on your sanctuary profile',
            'Directly sponsors free passes for pilgrims experiencing financial hardship',
          ]}
          currentTier={account.subscriptionTier}
          onSelect={handleSelectTier}
          accentColor={currentTone.primary}
        />

        {/* Tier 3: House of Worship */}
        <TierCard
          id="congregation"
          title="House of Worship"
          subtitle="For churches, mosques, synagogues, mandirs, and temples."
          monthlyPrice={29}
          annualPrice={290}
          billing={billing}
          features={[
            'Everything in Sustaining Pilgrim for up to 5 clergy/leaders',
            'Verified House of Worship Profile with location & pastoral bio',
            'Host live liturgical video streams & archived sermon broadcasts',
            'Host weekly scripture study & prayer video classes with workbooks',
            'Custom congregation private room with email whitelisting',
            'Dedicated pastoral moderation and real-time AI safety portal',
          ]}
          currentTier={account.subscriptionTier}
          onSelect={handleSelectTier}
          accentColor={currentTone.primary}
        />
      </div>

      {/* 3. Financial Hardship Guarantee (ROSCA & Pastoral Ethos) */}
      <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-300">
            <strong className="text-stone-100 block font-medium mb-0.5">
              Financial Hardship Guarantee (No One Turned Away)
            </strong>
            If you are facing financial limitations, you should never be deprived of study materials or sanctuary tools. Request a sponsored pilgrim pass with a single click—no justification or paperwork required.
          </div>
        </div>

        <button
          onClick={handleHardshipClick}
          className="px-4 py-2 rounded-xl text-xs border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 whitespace-nowrap transition"
        >
          {account.hardshipSponsored ? 'Sponsored Pass Active' : 'Request Sponsored Pass'}
        </button>
      </div>

      {/* 4. Complete Comparison Matrix */}
      <div className="bg-stone-900/40 rounded-3xl border border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-800">
          <h3 className="font-serif text-lg text-stone-100 font-medium">
            Detailed Sanctuary Feature Matrix
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Complete transparency on capabilities across all three patronage tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/60 text-stone-400 border-b border-stone-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">Feature Capability</th>
                <th className="p-4 text-center">Free Sanctuary</th>
                <th className="p-4 text-center">Sustaining Pilgrim</th>
                <th className="p-4 text-center pr-6">House of Worship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Home Tradition Rooms & Circles</td>
                <td className="p-4 text-center text-emerald-400">Unlimited</td>
                <td className="p-4 text-center text-emerald-400">Unlimited</td>
                <td className="p-4 text-center text-emerald-400 pr-6">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Canonical Scripture Study & Highlighting</td>
                <td className="p-4 text-center text-stone-300">All 5 Canons</td>
                <td className="p-4 text-center text-emerald-400">Unlimited Vaults</td>
                <td className="p-4 text-center text-emerald-400 pr-6">Unlimited Vaults</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Sacred Store Discount (Study Bibles & Workbooks)</td>
                <td className="p-4 text-center text-stone-500">—</td>
                <td className="p-4 text-center text-amber-400 font-semibold">15% Off</td>
                <td className="p-4 text-center text-amber-400 font-semibold pr-6">15% Off</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Private Encrypted Prayer Journal</td>
                <td className="p-4 text-center text-emerald-400">AES-256</td>
                <td className="p-4 text-center text-emerald-400">AES-256</td>
                <td className="p-4 text-center text-emerald-400 pr-6">AES-256</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Liturgical Stream & Broadcast Hosting</td>
                <td className="p-4 text-center text-stone-500">Viewer Only</td>
                <td className="p-4 text-center text-stone-500">Viewer Only</td>
                <td className="p-4 text-center text-emerald-400 font-semibold pr-6">Host Streams</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Prayer & Scripture Video Class Hosting</td>
                <td className="p-4 text-center text-stone-500">Attendee Only</td>
                <td className="p-4 text-center text-stone-500">Attendee Only</td>
                <td className="p-4 text-center text-emerald-400 font-semibold pr-6">Host Classes</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Pastoral Moderation & Whitelist Admin</td>
                <td className="p-4 text-center text-stone-500">—</td>
                <td className="p-4 text-center text-stone-500">—</td>
                <td className="p-4 text-center text-emerald-400 font-semibold pr-6">Full Portal</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-stone-200">Federal & HIPAA PHI Protection</td>
                <td className="p-4 text-center text-emerald-400">Active Shield</td>
                <td className="p-4 text-center text-emerald-400">Active Shield</td>
                <td className="p-4 text-center text-emerald-400 pr-6">Active Shield</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
