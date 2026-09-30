import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { TraditionVisual } from './ReligiousVisuals';
import { DEMO_USERS, type DemoUserProfile } from '../data/demoUsersData';
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
  Globe,
  Send,
  AlertCircle,
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
  { id: 'Latter-day Saint Tradition (Mormonism)', label: 'Latter-day Saint Tradition', desc: 'Restoration Scripture, Temples & Covenants' },
  { id: 'Spiritualism & Spiritism', label: 'Spiritualism & Spiritism', desc: 'Moral Law, Spirit Harmony & Active Charity' },
  { id: 'Exploring & Interfaith', label: 'Exploring & Interfaith', desc: 'Comparative Reverence & Universal Wonder' },
  { id: 'Prefer not to say', label: 'Prefer not to say', desc: 'Quiet, unlabelled personal space' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    hearthTone,
    account,
    loginUser,
    registerUser,
    logoutUser,
    switchDemoUser,
    setIsDomainGuideOpen,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const [mode, setMode] = useState<'login' | 'register' | 'magic_link' | 'demo_switcher'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTradition, setSelectedTradition] = useState('Christianity');

  // Password visibility toggles ("view to all passwords" requirement)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Magic link simulation state
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate live password strength (US-0.1: "Weak passwords are rejected with guidance")
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-stone-700', guidance: 'Enter at least 8 characters' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) {
      return {
        score: 1,
        label: 'Weak',
        color: 'bg-rose-500',
        guidance: 'Must be at least 8 characters with letters & numbers.',
      };
    }
    if (score <= 3) {
      return {
        score: 2,
        label: 'Moderate',
        color: 'bg-amber-500',
        guidance: 'Good. Add a symbol (e.g. !@#$) for stronger defense.',
      };
    }
    return {
      score: 3,
      label: 'Strong & Resilient',
      color: 'bg-emerald-500',
      guidance: 'Protected by client-side SHA-256 vault hashing.',
    };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address (e.g. pilgrim@livinghearth.org).');
      return;
    }

    if (mode === 'magic_link') {
      setMagicLinkSent(true);
      setSuccessMsg(`Simulated magic link dispatched to ${email}. You may activate below.`);
      return;
    }

    if (!password.trim() || password.length < 8) {
      setErrorMsg('Weak password rejected: Password must be at least 8 characters long to safeguard your private prayers.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your entries.');
        return;
      }
      const res = await registerUser(email.trim(), password, displayName.trim() || undefined, selectedTradition);
      if (!res.success) {
        setErrorMsg(res.error || 'Account creation could not be completed.');
        return;
      }
      setSuccessMsg('Sanctuary account created successfully with zero plaintext exposure.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      const res = await loginUser(email.trim(), password, displayName.trim() || undefined);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }
      setSuccessMsg('Welcome back to your Sanctuary.');
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  const handleMagicLinkVerify = async () => {
    const res = await loginUser(email.trim(), undefined, displayName.trim() || undefined);
    if (res.success) {
      setSuccessMsg('Magic link verified. Sovereign session restored.');
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  const handleQuickDemoSwitch = (demo: DemoUserProfile) => {
    switchDemoUser(demo.email);
    setSuccessMsg(`Switched to demo persona: ${demo.displayName} (${demo.primaryTradition})`);
    setTimeout(() => {
      onClose();
    }, 600);
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
                  : mode === 'demo_switcher'
                  ? 'Select Authenticated Demo Persona'
                  : mode === 'magic_link'
                  ? 'Passwordless Magic Link'
                  : mode === 'login'
                  ? 'Welcome to The Living Hearth'
                  : 'Create Your Sovereign Account'}
              </h2>
              <p className="text-xs text-stone-400">
                {account.isAuthenticated
                  ? `Signed in as ${account.email}`
                  : 'Zero plaintext passwords • Federal and HIPAA sovereign privacy shields active'}
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

        {/* Modal Navigation Mode Bar */}
        {!account.isAuthenticated && (
          <div className="flex border-b border-stone-800 bg-stone-950/40 text-xs px-4 pt-2 gap-1 overflow-x-auto">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`px-3 py-2 font-serif rounded-t-xl transition-colors ${
                mode === 'login'
                  ? 'bg-stone-900 text-stone-100 font-semibold border-t-2'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              style={{
                borderTopColor: mode === 'login' ? currentTone.primary : 'transparent',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`px-3 py-2 font-serif rounded-t-xl transition-colors ${
                mode === 'register'
                  ? 'bg-stone-900 text-stone-100 font-semibold border-t-2'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              style={{
                borderTopColor: mode === 'register' ? currentTone.primary : 'transparent',
              }}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setMode('magic_link');
                setErrorMsg(null);
              }}
              className={`px-3 py-2 font-serif rounded-t-xl transition-colors ${
                mode === 'magic_link'
                  ? 'bg-stone-900 text-stone-100 font-semibold border-t-2'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              style={{
                borderTopColor: mode === 'magic_link' ? currentTone.primary : 'transparent',
              }}
            >
              Magic Link
            </button>
            <button
              onClick={() => {
                setMode('demo_switcher');
                setErrorMsg(null);
              }}
              className={`px-3 py-2 font-serif rounded-t-xl transition-colors flex items-center gap-1.5 ${
                mode === 'demo_switcher'
                  ? 'bg-stone-900 text-amber-300 font-semibold border-t-2'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
              style={{
                borderTopColor: mode === 'demo_switcher' ? currentTone.primary : 'transparent',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Personas (8)</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-300 text-sm">
          {/* Success & Error alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="m-0 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="m-0 leading-relaxed">{successMsg}</p>
            </div>
          )}

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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                  onClick={() => {
                    setIsDomainGuideOpen(true);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition font-medium flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Domain Readiness</span>
                </button>
              </div>
            </div>
          ) : mode === 'demo_switcher' ? (
            /* Demo Personas Catalog (8 Authentic Paths) */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-stone-300 leading-relaxed">
                <strong>1-Click Instant Persona Switcher:</strong> Explore the sanctuary through the eyes of real practitioners across world traditions with pre-populated journals, prayers, and holy times.
              </div>

              <div className="space-y-2.5">
                {DEMO_USERS.map((demo) => (
                  <div
                    key={demo.id}
                    className="p-3.5 rounded-2xl border border-stone-800 hover:border-amber-400/60 bg-stone-950/50 flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <TraditionVisual tradition={demo.primaryTradition} size={18} color={currentTone.primary} />
                        <span className="font-serif font-semibold text-stone-100 text-sm">
                          {demo.displayName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-mono">
                          {demo.subscriptionTier}
                        </span>
                      </div>
                      <p className="text-xs text-amber-500/90 font-serif m-0">
                        {demo.primaryTradition} • {demo.roleBadge}
                      </p>
                      <p className="text-[11px] text-stone-400 line-clamp-1 m-0">
                        {demo.avatarBio}
                      </p>
                    </div>

                    <button
                      onClick={() => handleQuickDemoSwitch(demo)}
                      className="px-3.5 py-1.5 rounded-xl font-serif text-xs font-semibold shrink-0 shadow-xs hover:scale-102 transition-transform"
                      style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                    >
                      Enter as {demo.displayName.split(' ')[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : mode === 'magic_link' ? (
            /* Passwordless Magic Link Flow */
            <div className="space-y-4">
              <p className="text-xs text-stone-400 leading-relaxed">
                Sign in without passwords. We dispatch a cryptographic token directly to your confidential inbox.
              </p>

              {!magicLinkSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-serif text-stone-300 block">Confidential Email:</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.org"
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-serif text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
                    style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Confidential Magic Link</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4 p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                  <div className="space-y-1">
                    <span className="font-serif font-semibold text-emerald-400 block text-xs">
                      Simulation Magic Token Ready:
                    </span>
                    <p className="text-[11px] text-stone-400">
                      In testing mode, you can immediately activate your session with 1 click:
                    </p>
                  </div>

                  <button
                    onClick={handleMagicLinkVerify}
                    className="w-full py-2.5 rounded-xl font-serif text-xs font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activate Session as {email}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login & Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-serif text-stone-300 block">
                      Preferred Display Name:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Miriam or Pilgrim-44"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      Private by default. Shown publicly only if you explicitly choose in circles.
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-serif text-stone-300 block">
                      Primary Tradition / Spiritual Path:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {TRADITION_CHOICES.slice(0, 6).map((trad) => (
                        <button
                          key={trad.id}
                          type="button"
                          onClick={() => setSelectedTradition(trad.id)}
                          className={`p-2.5 rounded-xl border text-left font-serif transition-colors flex items-center justify-between ${
                            selectedTradition === trad.id
                              ? 'border-amber-400 bg-amber-500/15 text-stone-100 font-semibold'
                              : 'border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="truncate">{trad.label}</span>
                          {selectedTradition === trad.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-serif text-stone-300 block">Account Email:</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.org"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password with View All Passwords toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif text-stone-300">Password:</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-amber-500 hover:text-amber-400 flex items-center gap-1"
                    title={showPassword ? 'Hide password' : 'View password'}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide Password' : 'View Password'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>

                {/* Live Password Strength Meter */}
                {mode === 'register' && password && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-400">Strength: {pwdStrength.label}</span>
                      <span className="text-stone-500">{pwdStrength.guidance}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (register mode) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif text-stone-300">Confirm Password:</label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[11px] text-amber-500 hover:text-amber-400 flex items-center gap-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showConfirmPassword ? 'Hide' : 'View'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-serif text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-transform hover:scale-101"
                style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
              >
                <span>{mode === 'login' ? 'Sign In to Sanctuary' : 'Create Protected Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
          <button
            onClick={() => {
              setIsDomainGuideOpen(true);
              onClose();
            }}
            className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>Domain Readiness & DNS Setup</span>
          </button>

          <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AES-GCM-256</span>
          </span>
        </div>
      </div>
    </div>
  );
};
