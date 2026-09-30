import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { TraditionVisual } from './ReligiousVisuals';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Crown,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRADITION_CHOICES = [
  { id: 'Christianity', label: 'Christianity', desc: 'Gospels, Psalms, Liturgy & Contemplation' },
  { id: 'Islam', label: 'Islam', desc: 'Noble Qur\'an, Tajweed, Sunnah & Dhikr' },
  { id: 'Judaism', label: 'Judaism', desc: 'Torah, Tanakh, Mishna & Kehillah' },
  { id: 'Hinduism', label: 'Hinduism', desc: 'Bhagavad Gita, Upanishads & Vedanta' },
  { id: 'Buddhism', label: 'Buddhism', desc: 'Dhammapada, Mindfulness & Sangha' },
  { id: 'Interfaith / Seeker', label: 'Interfaith / Seeker', desc: 'Comparative Reverence & Peaceful Contemplation' },
];

const PRESET_ACCOUNTS = [
  { email: 'jason@livinghearth.org', name: 'Jason', tradition: 'Christianity', tier: 'free' },
  { email: 'fatima@livinghearth.org', name: 'Fatima', tradition: 'Islam', tier: 'pilgrim' },
  { email: 'avi@livinghearth.org', name: 'Avi', tradition: 'Judaism', tier: 'pilgrim' },
  { email: 'priya@livinghearth.org', name: 'Priya', tradition: 'Hinduism', tier: 'free' },
  { email: 'tenzin@livinghearth.org', name: 'Tenzin', tradition: 'Buddhism', tier: 'congregation' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    hearthTone,
    account,
    loginUser,
    registerUser,
    logoutUser,
    updateSubscription,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTradition, setSelectedTradition] = useState('Christianity');

  // Password visibility toggles ("view too all passwords")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your entries.');
        return;
      }
      registerUser(email.trim(), password, displayName.trim() || undefined, selectedTradition);
      setSuccessMsg('Sanctuary account created successfully.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      loginUser(email.trim(), password, displayName.trim() || undefined);
      setSuccessMsg('Welcome back to your Sanctuary.');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleQuickLogin = (preset: typeof PRESET_ACCOUNTS[0]) => {
    loginUser(preset.email, 'sanctuary2026', preset.name);
    if (preset.tier === 'pilgrim' || preset.tier === 'congregation') {
      updateSubscription(preset.tier);
    }
    setSuccessMsg(`Signed in as ${preset.name} (${preset.tradition})`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div
          className="p-6 border-b border-stone-800 flex items-center justify-between"
          style={{
            background: `radial-gradient(ellipse at top left, ${currentTone.glow} 0%, transparent 70%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner"
              style={{
                borderColor: currentTone.primary,
                background: currentTone.lightBg,
                color: currentTone.primary,
              }}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-serif text-xl text-stone-100 font-medium">
                {account.isAuthenticated
                  ? 'Your Sanctuary Account & Profile'
                  : mode === 'login'
                  ? 'Welcome to The Living Hearth'
                  : 'Create Your Sovereign Account'}
              </h2>
              <p className="text-xs text-stone-400">
                {account.isAuthenticated
                  ? `Signed in as ${account.email}`
                  : 'Private, non-monetized sanctuary protected by Federal and HIPAA privacy shields'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-300 text-sm">
          {/* If already authenticated, show account details */}
          {account.isAuthenticated ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border"
                    style={{
                      borderColor: currentTone.primary,
                      backgroundColor: currentTone.lightBg,
                      color: currentTone.primary,
                    }}
                  >
                    {account.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-stone-100 flex items-center gap-2">
                      {account.displayName}
                      {account.subscriptionTier !== 'free' && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 border"
                          style={{
                            borderColor: currentTone.primary,
                            background: currentTone.lightBg,
                            color: currentTone.primary,
                          }}
                        >
                          <Crown className="w-3 h-3" />
                          {account.subscriptionTier === 'pilgrim'
                            ? 'Sustaining Pilgrim'
                            : 'Congregation Partner'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">{account.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                    Active Sanctuary
                  </span>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-800/80">
                  <div className="text-stone-400">Patronage Tier</div>
                  <div className="text-stone-100 font-medium capitalize mt-0.5">
                    {account.subscriptionTier} Tier
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-800/80">
                  <div className="text-stone-400">Billing Cycle</div>
                  <div className="text-stone-100 font-medium capitalize mt-0.5">
                    {account.subscriptionBilling}
                  </div>
                </div>
              </div>

              {/* Federal / HIPAA Safeguards Note */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300">
                  <strong className="text-emerald-400 block mb-0.5 font-medium">
                    Federal & HIPAA Sovereign Guard Active
                  </strong>
                  Your personal identity is strictly segregated from your private prayer requests and notes. We never monetize, cross-share, or profile your faith tradition for ad networks.
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setSuccessMsg('You have been signed out.');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-700 bg-stone-800/60 hover:bg-stone-800 text-stone-300 transition font-medium"
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-stone-950 shadow-md transition"
                  style={{ backgroundColor: currentTone.primary }}
                >
                  Return to Sanctuary
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mode Toggle: Sign In vs Create Account */}
              <div className="flex p-1 bg-stone-950/80 rounded-2xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-xs transition ${
                    mode === 'login'
                      ? 'bg-stone-800 text-stone-100 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-xs transition ${
                    mode === 'register'
                      ? 'bg-stone-800 text-stone-100 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                      Display Name or Spiritual Pseudonym
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Jason, Pilgrim-42, GraceSeeker"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-600 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@sanctuary.org"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-600 text-xs"
                    />
                  </div>
                </div>

                {/* Password field with interactive Eye toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-stone-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs flex items-center gap-1 text-stone-400 hover:text-stone-200 focus:outline-none"
                      title={showPassword ? 'Hide password' : 'View password'}
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide password</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>View password</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-12 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-600 text-xs tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Registration only) */}
                {mode === 'register' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-stone-400">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-xs flex items-center gap-1 text-stone-400 hover:text-stone-200 focus:outline-none"
                        title={showConfirmPassword ? 'Hide password' : 'View password'}
                      >
                        {showConfirmPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide password</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>View password</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-12 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-600 text-xs tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Tradition Selection on Register */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-2">
                      Primary Faith Tradition (Protects Sanctuary Boundaries)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRADITION_CHOICES.map((trad) => {
                        const isSelected = selectedTradition === trad.id;
                        return (
                          <button
                            key={trad.id}
                            type="button"
                            onClick={() => setSelectedTradition(trad.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition ${
                              isSelected
                                ? 'bg-stone-800/90 shadow-sm'
                                : 'bg-stone-950/40 border-stone-800/80 hover:bg-stone-900/60'
                            }`}
                            style={{
                              borderColor: isSelected ? currentTone.primary : undefined,
                            }}
                          >
                            <TraditionVisual tradition={trad.id} size={20} />
                            <div className="min-w-0">
                              <div
                                className="text-xs font-medium truncate"
                                style={{ color: isSelected ? currentTone.primary : '#E7E5E4' }}
                              >
                                {trad.label}
                              </div>
                              <div className="text-[10px] text-stone-500 line-clamp-1">
                                {trad.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-medium text-stone-950 shadow-md transition flex items-center justify-center gap-2 mt-2"
                  style={{ backgroundColor: currentTone.primary }}
                >
                  <span>{mode === 'login' ? 'Sign In to Sanctuary' : 'Create Protected Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Quick Logins */}
              <div className="pt-2 border-t border-stone-800/80">
                <div className="text-xs font-medium text-stone-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                  <span>Quick Demo Accounts (Instant Testing)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_ACCOUNTS.map((preset) => (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => handleQuickLogin(preset)}
                      className="p-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-left transition hover:bg-stone-900/60"
                    >
                      <div className="font-medium text-xs text-stone-200">{preset.name}</div>
                      <div className="text-[10px] text-stone-500 truncate">{preset.tradition}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
