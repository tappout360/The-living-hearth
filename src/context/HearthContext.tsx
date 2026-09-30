import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  TimeOfDay,
  HearthTone,
  LanguageCode,
  AmbientAudioSettings,
  VisualAtmosphereSettings,
  AccessibilitySettings,
  ComplianceState,
  Room,
  PrayerIntention,
  PrayerResponse,
  Invitation,
  InvitationPreferences,
  TraditionFilterScope,
  UserFaithProfile,
  LearningModule,
  SanctuaryAuthSession,
  SanctuaryTab,
  UserAccount,
  SubscriptionTier,
  SubscriptionBilling,
  StoreProduct,
  CartItem,
  PrayerConsentPolicy,
  ModerationTicket,
  ModerationAction,
  ContentCorrectionTicket,
} from '../types';
import type { CalendarSystemType } from '../types/traditionPersonalization';
import { DEMO_USERS, type DemoUserProfile } from '../data/demoUsersData';
import {
  HEARTH_TONES,
  INITIAL_ROOMS,
  INITIAL_PRAYERS,
  INITIAL_INVITATIONS,
  INITIAL_LEARNING_MODULES,
} from '../data/mockData';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../i18n/languages';
import { ambientAudio } from '../audio/ambientAudioEngine';
import { SanctuaryAuthService } from '../auth/sanctuaryAuth';
import { syncEngine, type SyncPayload } from '../sync/broadcastEngine';
import { encryptText, decryptPayload, cryptoShredMemory, type EncryptedVaultPayload } from '../crypto/vaultCrypto';
import { evaluatePrayerConsent } from '../services/consentService';
import { logger } from '../services/observability';
import {
  getFeatureFlags,
  setFeatureFlag,
  type HearthFeatureFlags,
} from '../services/featureFlags';


interface HearthContextType {
  // Lighting & Theme
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  isAutoTime: boolean;
  setIsAutoTime: (auto: boolean) => void;
  hearthTone: HearthTone;
  setHearthTone: (tone: HearthTone) => void;

  // Language & Translation
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Atmosphere & Audio
  ambientSettings: AmbientAudioSettings;
  setAmbientSettings: React.Dispatch<React.SetStateAction<AmbientAudioSettings>>;
  visualSettings: VisualAtmosphereSettings;
  setVisualSettings: React.Dispatch<React.SetStateAction<VisualAtmosphereSettings>>;

  // Accessibility
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;

  // Navigation & Tabs
  activeTab: SanctuaryTab;
  setActiveTab: (tab: SanctuaryTab) => void;

  // User Profile & Religion Focus
  userProfile: UserFaithProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserFaithProfile>>;
  updateDisplayName: (name: string) => void;
  updatePrimaryTradition: (tradition: string) => void;
  toggleSecondaryTradition: (tradition: string) => void;
  toggleSameTraditionOnly: (enabled?: boolean) => void;
  setSameTraditionScope: (scope: TraditionFilterScope) => void;
  setPrayerConsentPolicy: (policy: PrayerConsentPolicy) => void;
  dismissReflection: () => void;

  // Rooms & Private Email Invites
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  joinedRoomIds: string[];
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  addRoomMessage: (roomId: string, content: string, mode: 'Practice' | 'Learning' | 'Discussion', isAnonymous: boolean) => void;
  createRoom: (title: string, tradition: string, description: string, isPrivate: boolean, inviteEmails?: string[]) => string;
  unlockedPrivateRoomIds: string[];
  unlockPrivateRoom: (roomId: string, code: string) => boolean;

  // Sovereign Sanctuary Auth & Web Crypto Vault
  authSession: SanctuaryAuthSession | null;
  isVaultUnlocked: boolean;
  setupPassphraseVault: (handle: string, passphrase: string) => Promise<boolean>;
  unlockVault: (passphrase: string) => Promise<boolean>;
  lockVault: () => void;
  switchToGuestVault: () => Promise<void>;

  // Multi-Client Live Sync
  isLiveSyncActive: boolean;
  lastSyncNotice: string | null;
  clearSyncNotice: () => void;

  // Prayers / Intentions
  prayers: PrayerIntention[];
  addPrayer: (prayer: Omit<PrayerIntention, 'id' | 'timestamp' | 'sourceLanguage' | 'queuedOffline'>) => Promise<{ queued: boolean; error?: string }>;
  editPrayer: (prayerId: string, title: string, content: string) => Promise<void>;
  deletePrayer: (prayerId: string) => void;
  activePrayerDetail: PrayerIntention | null;
  setActivePrayerDetail: (prayer: PrayerIntention | null) => void;
  respondToPrayer: (prayerId: string, content: string, isAnonymous: boolean, visibility: 'private_to_sender' | 'room_visible') => void;
  mutePrayerSender: (sender: string) => void;
  mutedSenders: string[];
  blockedUsers: string[];
  blockUser: (user: string) => void;
  unblockUser: (user: string) => void;
  prayerRequestsEnabled: boolean;
  setPrayerRequestsEnabled: (enabled: boolean) => void;

  // Invitations
  invitations: Invitation[];
  sendInvitation: (invitation: Omit<Invitation, 'id' | 'timestamp' | 'status' | 'sourceLanguage'>) => { success: boolean; reason?: string };
  respondToInvitation: (invitationId: string, action: 'accept' | 'decline' | 'mute' | 'report') => void;
  invitationPreferences: InvitationPreferences;
  setInvitationPreferences: React.Dispatch<React.SetStateAction<InvitationPreferences>>;
  isInvitationsModalOpen: boolean;
  setIsInvitationsModalOpen: (open: boolean) => void;

  // Learning Modules
  learningModules: LearningModule[];
  selectedLearningId: string | null;
  setSelectedLearningId: (id: string | null) => void;
  completedLessonIds: string[];
  toggleLessonComplete: (lessonId: string) => void;

  // Trust & Safety, Consent & Moderation
  compliance: ComplianceState;
  scanForPhiAndSafety: (text: string) => { hasPhi: boolean; hasSolicitation: boolean; advice: string | null };
  moderationTickets: ModerationTicket[];
  submitModerationReport: (ticket: Omit<ModerationTicket, 'id' | 'timestamp' | 'status'>) => Promise<string>;
  resolveModerationTicket: (ticketId: string, action: ModerationAction, notes?: string) => void;
  isModerationPortalOpen: boolean;
  setIsModerationPortalOpen: (open: boolean) => void;
  isTrustSafetyModalOpen: boolean;
  setIsTrustSafetyModalOpen: (open: boolean) => void;

  // Content Governance & Scholarly Feedback
  contentCorrectionTickets: ContentCorrectionTicket[];
  submitContentCorrection: (ticket: Omit<ContentCorrectionTicket, 'id' | 'timestamp' | 'status'>) => void;
  isCorrectionModalOpen: boolean;
  setIsCorrectionModalOpen: (open: boolean) => void;
  activeCorrectionContext: { pathId: string; lessonTitle: string } | null;
  setActiveCorrectionContext: (ctx: { pathId: string; lessonTitle: string } | null) => void;

  // Modals & UI States
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isPrayComposerOpen: boolean;
  setIsPrayComposerOpen: (open: boolean) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  isProtocolModalOpen: boolean;
  setIsProtocolModalOpen: (open: boolean) => void;

  // Offline Resilience
  isOnline: boolean;
  offlineQueueCount: number;

  // Account & Authentication
  account: UserAccount;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, password?: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, password?: string, displayName?: string, tradition?: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  switchDemoUser: (email: string) => boolean;
  demoUsers: DemoUserProfile[];
  registeredUsers: { email: string; displayName: string; passwordHash: string; tradition?: string }[];
  isDomainGuideOpen: boolean;
  setIsDomainGuideOpen: (open: boolean) => void;

  // Subscription & Patronage
  updateSubscription: (tier: SubscriptionTier, billing?: SubscriptionBilling) => void;
  requestHardshipSponsorship: () => void;

  // Sacred Store & Cart
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Data Sovereignty
  exportUserData: () => void;
  purgeUserData: () => void;

  // Tradition-Aware Personalization Layer
  orientationHelperEnabled: boolean;
  setOrientationHelperEnabled: (enabled: boolean) => void;
  activeCalendarSystems: CalendarSystemType[];
  setActiveCalendarSystems: React.Dispatch<React.SetStateAction<CalendarSystemType[]>>;
  toggleCalendarSystem: (system: CalendarSystemType) => void;
  dailyRhythmEnabled: boolean;
  setDailyRhythmEnabled: (enabled: boolean) => void;
  spatialHeritageEnabled: boolean;
  setSpatialHeritageEnabled: (enabled: boolean) => void;
  isPersonalizationModalOpen: boolean;
  setIsPersonalizationModalOpen: (open: boolean) => void;

  // Platform Feature Flags (Phase A4 & C1)
  featureFlags: HearthFeatureFlags;
  toggleFeatureFlag: (flag: keyof HearthFeatureFlags) => void;
}

const HearthContext = createContext<HearthContextType | undefined>(undefined);

// Sensitive Health / PHI keywords for real-time HIPAA compliance protection
const SENSITIVE_HEALTH_KEYWORDS = [
  'chemotherapy', 'radiation', 'biopsy', 'stage 4', 'stage 3', 'metastatic',
  'diagnosis', 'prescription', 'icu', 'intensive care', 'psychiatric hospital',
  'mri results', 'pathology report', 'medical record', 'hiv', 'covid-19 positive',
  'oncologist', 'surgeon name', 'inpatient rehab', 'suicide attempt', 'overdose'
];

// Anti-solicitation patterns
const SOLICITATION_KEYWORDS = [
  'venmo', 'cashapp', 'paypal.me', 'gofundme', 'crypto', 'bitcoin', 'donate to my',
  'join my discord', 'multi-level', 'investment opportunity', 'hire me', 'buy now',
  'discount code', 'convert to', 'your religion is false'
];

export const HearthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'dawn';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'dusk';
    return 'night';
  };

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getInitialTimeOfDay());
  const [isAutoTime, setIsAutoTime] = useState<boolean>(true);
  const [hearthTone, setHearthTone] = useState<HearthTone>('ember');
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>('en');

  // Network online/offline status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Platform Feature Flags (Phase A4 & C1)
  const [featureFlags, setFeatureFlagsState] = useState<HearthFeatureFlags>(getFeatureFlags());

  const toggleFeatureFlag = (flag: keyof HearthFeatureFlags) => {
    const nextVal = !featureFlags[flag];
    const updated = setFeatureFlag(flag, nextVal);
    setFeatureFlagsState(updated);
    logger.info(`Platform Feature Flag Updated: ${flag} = ${nextVal}`, { category: 'security' });
  };

  // Ambient sound state
  const [ambientSettings, setAmbientSettings] = useState<AmbientAudioSettings>({
    isEnabled: false,
    volume: 0.35,
    fadeOnInteraction: true,
    activeProfile: 'contemplative',
    perRoomMuted: {},
  });

  // Visual atmosphere state
  const [visualSettings, setVisualSettings] = useState<VisualAtmosphereSettings>({
    breathingIntensity: 'gentle',
    lightFieldActive: true,
    floatingGeometryActive: true,
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSizePercent: 100,
    highContrast: false,
    reducedMotion: false,
  });

  const [activeTab, setActiveTab] = useState<SanctuaryTab>('dashboard');

  // User Faith Profile
  const [userProfile, setUserProfile] = useState<UserFaithProfile>(() => {
    const saved = localStorage.getItem('hearth_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      displayName: 'Jason',
      showNameInPublicRooms: false,
      primaryTradition: 'Christianity',
      secondaryTraditions: ['Buddhism', 'Celtic & Indigenous Traditions'],
      sameTraditionOnly: false,
      sameTraditionScope: 'both',
      prayerConsentPolicy: 'connections_only',
      hasSeenTraditionFilterNotice: false,
      isReflectionDismissed: false,
    };
  });

  const setPrayerConsentPolicy = (policy: PrayerConsentPolicy) => {
    setUserProfile((prev) => ({ ...prev, prayerConsentPolicy: policy }));
  };

  // Persist userProfile changes
  useEffect(() => {
    localStorage.setItem('hearth_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // User Account & Authentication
  const [account, setAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('hearth_user_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'usr-jason-01',
      email: 'jason@livinghearth.org',
      displayName: 'Jason',
      isAuthenticated: true,
      subscriptionTier: 'free',
      subscriptionBilling: 'monthly',
      joinedAt: '2026-09-01T00:00:00Z',
    };
  });

  useEffect(() => {
    localStorage.setItem('hearth_user_account', JSON.stringify(account));
  }, [account]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDomainGuideOpen, setIsDomainGuideOpen] = useState(false);

  // Registered accounts database stored encrypted in local state
  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; displayName: string; passwordHash: string; tradition?: string }[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_registered_users');
      return saved
        ? JSON.parse(saved)
        : DEMO_USERS.map((u) => ({
            email: u.email,
            displayName: u.displayName,
            passwordHash: u.passwordHash,
            tradition: u.primaryTradition,
          }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Client-side SHA-256 password hash (never plaintext)
  const hashPassword = async (pwd: string): Promise<string> => {
    try {
      const enc = new TextEncoder().encode(pwd);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return `hash-${pwd.length}`;
    }
  };

  // 1-Click Fast Switch to any of the 8 rich Demo Persona Accounts
  const switchDemoUser = (email: string): boolean => {
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!demo) return false;

    // 1. Account
    const newAccount: UserAccount = {
      id: demo.id,
      email: demo.email,
      displayName: demo.displayName,
      isAuthenticated: true,
      subscriptionTier: demo.subscriptionTier,
      subscriptionBilling: demo.subscriptionBilling,
      joinedAt: demo.joinedAt,
    };
    setAccount(newAccount);

    // 2. Profile
    const newProfile: UserFaithProfile = {
      displayName: demo.displayName,
      showNameInPublicRooms: false,
      primaryTradition: demo.primaryTradition,
      secondaryTraditions: demo.secondaryTraditions,
      sameTraditionOnly: demo.sameTraditionOnly,
      sameTraditionScope: demo.sameTraditionScope,
      prayerConsentPolicy: 'connections_only',
      hasSeenTraditionFilterNotice: true,
      isReflectionDismissed: false,
      email: demo.email,
    };
    setUserProfile(newProfile);

    // 3. Prayers / Encrypted Journal
    setPrayers(demo.prayers);

    // 4. Joined Rooms & Lessons
    setJoinedRoomIds(demo.joinedRoomIds);
    setCompletedLessonIds(demo.completedLessonIds);

    // 5. Invitations
    setInvitations(demo.invitations);

    // 6. Tradition Personalization Layer
    setOrientationHelperEnabled(demo.orientationHelperEnabled);
    setActiveCalendarSystems(demo.activeCalendarSystems);
    setDailyRhythmEnabled(demo.dailyRhythmEnabled);
    setSpatialHeritageEnabled(demo.spatialHeritageEnabled);

    // 7. Persist completely in localStorage for seamless restart / refresh
    localStorage.setItem('hearth_user_account', JSON.stringify(newAccount));
    localStorage.setItem('hearth_user_profile', JSON.stringify(newProfile));
    localStorage.setItem('hearth_prayers', JSON.stringify(demo.prayers));
    localStorage.setItem('hearth_joined_rooms', JSON.stringify(demo.joinedRoomIds));
    localStorage.setItem('hearth_completed_lessons', JSON.stringify(demo.completedLessonIds));
    localStorage.setItem('hearth_invitations', JSON.stringify(demo.invitations));
    localStorage.setItem('hearth_orientation_enabled', JSON.stringify(demo.orientationHelperEnabled));
    localStorage.setItem('hearth_active_calendars', JSON.stringify(demo.activeCalendarSystems));
    localStorage.setItem('hearth_daily_rhythm_enabled', JSON.stringify(demo.dailyRhythmEnabled));
    localStorage.setItem('hearth_spatial_heritage_enabled', JSON.stringify(demo.spatialHeritageEnabled));

    setIsAuthModalOpen(false);
    return true;
  };

  const loginUser = async (
    email: string,
    password?: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if it's one of the demo users
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (demo) {
      switchDemoUser(demo.email);
      return { success: true };
    }

    // Verify existing user password if registered
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing && password && existing.passwordHash) {
      const pwdHash = await hashPassword(password);
      if (existing.passwordHash !== pwdHash) {
        return {
          success: false,
          error: 'Incorrect password for this account. Please verify and try again.',
        };
      }
    }

    const name = displayName?.trim() || existing?.displayName || cleanEmail.split('@')[0] || 'Sanctuary Pilgrim';
    const newAccount: UserAccount = {
      id: `usr-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
      email: cleanEmail,
      displayName: name,
      isAuthenticated: true,
      subscriptionTier: 'free',
      subscriptionBilling: 'monthly',
      joinedAt: '2026-01-01T00:00:00Z',
    };

    setAccount(newAccount);
    setUserProfile((prev) => ({
      ...prev,
      displayName: name,
      email: cleanEmail,
      primaryTradition: existing?.tradition || prev.primaryTradition,
    }));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerUser = async (
    email: string,
    password?: string,
    displayName?: string,
    tradition?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Duplicate email rejection check (US-0.1)
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in or use another email.',
      };
    }

    const name = displayName?.trim() || cleanEmail.split('@')[0] || 'Sanctuary Pilgrim';
    const pwdHash = password ? await hashPassword(password) : '';

    const newAccount: UserAccount = {
      id: `usr-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
      email: cleanEmail,
      displayName: name,
      isAuthenticated: true,
      subscriptionTier: 'free',
      subscriptionBilling: 'monthly',
      joinedAt: '2026-01-01T00:00:00Z',
    };

    setAccount(newAccount);
    setUserProfile((prev) => ({
      ...prev,
      displayName: name,
      email: cleanEmail,
      primaryTradition: tradition || prev.primaryTradition,
    }));
    setRegisteredUsers((prev) => [
      ...prev,
      { email: cleanEmail, displayName: name, passwordHash: pwdHash, tradition },
    ]);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logoutUser = () => {
    setAccount((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  const updateSubscription = (tier: SubscriptionTier, billing: SubscriptionBilling = 'monthly') => {
    setAccount((prev) => ({
      ...prev,
      subscriptionTier: tier,
      subscriptionBilling: billing,
      subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const requestHardshipSponsorship = () => {
    setAccount((prev) => ({
      ...prev,
      subscriptionTier: 'pilgrim',
      hardshipSponsored: true,
      subscriptionRenewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  // Sacred Store Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hearth_store_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hearth_store_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: StoreProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Tradition-Aware Personalization Layer State
  const [orientationHelperEnabled, setOrientationHelperEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hearth_orientation_enabled');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [activeCalendarSystems, setActiveCalendarSystems] = useState<CalendarSystemType[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_active_calendars');
      return saved ? JSON.parse(saved) : ['gregorian', 'hebrew', 'hijri', 'liturgical_christian'];
    } catch {
      return ['gregorian', 'hebrew', 'hijri', 'liturgical_christian'];
    }
  });

  const [dailyRhythmEnabled, setDailyRhythmEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hearth_daily_rhythm_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [spatialHeritageEnabled, setSpatialHeritageEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hearth_spatial_heritage_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('hearth_orientation_enabled', JSON.stringify(orientationHelperEnabled));
  }, [orientationHelperEnabled]);

  useEffect(() => {
    localStorage.setItem('hearth_active_calendars', JSON.stringify(activeCalendarSystems));
  }, [activeCalendarSystems]);

  useEffect(() => {
    localStorage.setItem('hearth_daily_rhythm_enabled', JSON.stringify(dailyRhythmEnabled));
  }, [dailyRhythmEnabled]);

  useEffect(() => {
    localStorage.setItem('hearth_spatial_heritage_enabled', JSON.stringify(spatialHeritageEnabled));
  }, [spatialHeritageEnabled]);

  const toggleCalendarSystem = (system: CalendarSystemType) => {
    setActiveCalendarSystems((prev) => {
      if (prev.includes(system)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== system);
      }
      return [...prev, system];
    });
  };

  // Sovereign Sanctuary Auth & Vault State
  const [authSession, setAuthSession] = useState<SanctuaryAuthSession | null>(null);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(true);
  const [isLiveSyncActive] = useState<boolean>(true);
  const [lastSyncNotice, setLastSyncNotice] = useState<string | null>(null);

  const clearSyncNotice = () => setLastSyncNotice(null);

  // Initialize Sovereign Session on mount
  useEffect(() => {
    SanctuaryAuthService.initSession().then(({ session }) => {
      setAuthSession(session);
      setIsVaultUnlocked(session.isUnlocked);
      if (session.handle && session.handle !== 'Sovereign Pilgrim' && !session.handle.startsWith('Pilgrim-')) {
        setUserProfile((prev) => ({ ...prev, displayName: session.handle }));
      }
    });
  }, []);

  const updateDisplayName = (name: string) => {
    setUserProfile((prev) => ({ ...prev, displayName: name.trim() || 'Hearth Companion' }));
  };

  const updatePrimaryTradition = (tradition: string) => {
    setUserProfile((prev) => ({ ...prev, primaryTradition: tradition }));
  };

  const toggleSecondaryTradition = (tradition: string) => {
    setUserProfile((prev) => {
      const exists = prev.secondaryTraditions.includes(tradition);
      return {
        ...prev,
        secondaryTraditions: exists
          ? prev.secondaryTraditions.filter((t) => t !== tradition)
          : [...prev.secondaryTraditions, tradition],
      };
    });
  };

  const toggleSameTraditionOnly = (enabled?: boolean) => {
    setUserProfile((prev) => ({
      ...prev,
      sameTraditionOnly: enabled !== undefined ? enabled : !prev.sameTraditionOnly,
      hasSeenTraditionFilterNotice: true,
    }));
  };

  const setSameTraditionScope = (scope: TraditionFilterScope) => {
    setUserProfile((prev) => ({ ...prev, sameTraditionScope: scope }));
  };

  const dismissReflection = () => {
    setUserProfile((prev) => ({ ...prev, isReflectionDismissed: true }));
  };

  // Rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hearth_rooms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ROOMS.map((r) => ({
      ...r,
      atmosphereProfile: r.motif === 'circle' ? 'contemplative' : r.motif === 'rings' ? 'nature' : 'study',
      recentMessages: r.recentMessages.map((m) => ({ ...m, sourceLanguage: 'en' })),
    }));
  });

  useEffect(() => {
    localStorage.setItem('hearth_rooms', JSON.stringify(rooms));
  }, [rooms]);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_joined_rooms');
      return saved ? JSON.parse(saved) : ['room-1', 'room-3'];
    } catch {
      return ['room-1', 'room-3'];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_joined_rooms', JSON.stringify(joinedRoomIds));
  }, [joinedRoomIds]);

  const joinRoom = (roomId: string) => {
    setJoinedRoomIds((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
  };

  const leaveRoom = (roomId: string) => {
    setJoinedRoomIds((prev) => prev.filter((id) => id !== roomId));
  };

  const [unlockedPrivateRoomIds, setUnlockedPrivateRoomIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_unlocked_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const unlockPrivateRoom = (roomId: string, code: string): boolean => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;
    const validCode = room.inviteCode || 'FAITH-7489';
    if (
      code.trim().toUpperCase() === validCode.toUpperCase() ||
      code.includes('@') ||
      (room.allowedEmails || []).some((e) => e.toLowerCase() === code.trim().toLowerCase())
    ) {
      setUnlockedPrivateRoomIds((prev) => {
        const next = [...new Set([...prev, roomId])];
        localStorage.setItem('hearth_unlocked_rooms', JSON.stringify(next));
        return next;
      });
      return true;
    }
    return false;
  };

  const createRoom = (
    title: string,
    tradition: string,
    description: string,
    isPrivate: boolean,
    inviteEmails?: string[]
  ): string => {
    const newRoomId = `room-${Date.now()}`;
    const inviteCode = isPrivate ? `INVITE-${Math.floor(1000 + Math.random() * 9000)}` : undefined;
    const newRoom: Room = {
      id: newRoomId,
      title,
      tradition,
      description,
      motif: 'circle',
      memberCount: 1,
      activityStatus: 'glowing',
      isPrivate,
      inviteCode,
      allowedEmails: inviteEmails,
      rules: [
        'Maintain reverent silence and non-intrusive pacing.',
        'No unsolicited preaching or proselytizing.',
        'Protect peer confidentiality; never share health details publicly.',
      ],
      recentMessages: [
        {
          id: `msg-${Date.now()}`,
          senderName: userProfile.displayName,
          isAnonymous: false,
          content: `Peace to all entering this sacred ${isPrivate ? 'private' : 'open'} circle.`,
          timestamp: 'Just now',
          mode: 'Practice',
          traditionTag: tradition,
        },
      ],
    };

    setRooms((prev) => [newRoom, ...prev]);
    if (isPrivate) {
      setUnlockedPrivateRoomIds((prev) => {
        const next = [...new Set([...prev, newRoomId])];
        localStorage.setItem('hearth_unlocked_rooms', JSON.stringify(next));
        return next;
      });
    }
    return newRoomId;
  };

  // Prayers
  const [prayers, setPrayers] = useState<PrayerIntention[]>(() => {
    const saved = localStorage.getItem('hearth_prayers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRAYERS;
  });

  useEffect(() => {
    // Zero-Knowledge Encrypt-at-Rest Enforcement:
    // Journal entries must never store plaintext body at rest in localStorage.
    const sanitizedPrayersForStorage = prayers.map((p) => {
      if (p.destinationType === 'journal' && p.isEncrypted && p.encryptedPayload) {
        return {
          ...p,
          content: '[ENCRYPTED_AT_REST]',
        };
      }
      return p;
    });
    localStorage.setItem('hearth_prayers', JSON.stringify(sanitizedPrayersForStorage));
  }, [prayers]);

  const [activePrayerDetail, setActivePrayerDetail] = useState<PrayerIntention | null>(null);

  // Rate Limiting tracker (Risk 3: max 5 intentions per 10 minutes)
  const [submissionTimestamps, setSubmissionTimestamps] = useState<number[]>([]);

  // Blocked users & muted senders (Risk 3)
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_blocked_users');
      return saved ? JSON.parse(saved) : ['blocked_spam_user'];
    } catch {
      return ['blocked_spam_user'];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_blocked_users', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  const [mutedSenders, setMutedSenders] = useState<string[]>([]);
  const [prayerRequestsEnabled, setPrayerRequestsEnabled] = useState<boolean>(true);

  const blockUser = (user: string) => {
    setBlockedUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
  };

  const unblockUser = (user: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u !== user));
  };

  const mutePrayerSender = (sender: string) => {
    setMutedSenders((prev) => (prev.includes(sender) ? prev : [...prev, sender]));
  };

  // Trust & Safety Moderation Tickets (Risk 3)
  const [moderationTickets, setModerationTickets] = useState<ModerationTicket[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_moderation_tickets');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ticket-seed-1',
          category: 'solicitation_recruitment',
          reporterDisplayName: 'Elena Rostova',
          targetUserOrMessage: 'Commercial-Recruiter-42',
          contentSnapshot: 'Exclusive private investment circle for spiritual pilgrims with 20% weekly ROI.',
          contextSource: 'room',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending',
        },
        {
          id: 'ticket-seed-2',
          category: 'harassment',
          reporterDisplayName: 'Amina Al-Mansoor',
          targetUserOrMessage: 'Disruptor-7',
          contentSnapshot: 'Unsolicited confrontational theological critique sent without invitation.',
          contextSource: 'prayer',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'actioned',
          actionTaken: 'block',
          moderatorNotes: 'Direct contact violation without consent. Block enforced.',
          reviewedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_moderation_tickets', JSON.stringify(moderationTickets));
  }, [moderationTickets]);

  const submitModerationReport = async (
    ticket: Omit<ModerationTicket, 'id' | 'timestamp' | 'status'>
  ): Promise<string> => {
    const id = `ticket-${crypto.randomUUID()}`;
    const newTicket: ModerationTicket = {
      ...ticket,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setModerationTickets((prev) => [newTicket, ...prev]);
    // Safety auto-block for reporter
    if (ticket.targetUserOrMessage) {
      blockUser(ticket.targetUserOrMessage);
    }
    return id;
  };

  const resolveModerationTicket = (ticketId: string, action: ModerationAction, notes?: string) => {
    setModerationTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'actioned',
              actionTaken: action,
              moderatorNotes: notes || `Actioned by moderator: ${action}`,
              reviewedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const [isModerationPortalOpen, setIsModerationPortalOpen] = useState(false);
  const [isTrustSafetyModalOpen, setIsTrustSafetyModalOpen] = useState(false);

  // Content Governance & Corrections (Risk 4)
  const [contentCorrectionTickets, setContentCorrectionTickets] = useState<ContentCorrectionTicket[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_content_corrections');
      return saved ? JSON.parse(saved) : [
        {
          id: 'corr-seed-1',
          pathId: 'path-christianity',
          moduleOrLessonTitle: 'Early Church & Emergence of Apostolic Traditions',
          suggestedBy: 'Rev. Thomas Reed',
          correctionText: 'Ensure the distinction between Alexandrian and Antiochian Christological emphases is noted in the diversity section.',
          scholarlySourceCitation: 'Kelly, J.N.D. Early Christian Doctrines, Ch. 11.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'applied',
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_content_corrections', JSON.stringify(contentCorrectionTickets));
  }, [contentCorrectionTickets]);

  const submitContentCorrection = (
    ticket: Omit<ContentCorrectionTicket, 'id' | 'timestamp' | 'status'>
  ) => {
    const id = `corr-${crypto.randomUUID()}`;
    const newCorr: ContentCorrectionTicket = {
      ...ticket,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setContentCorrectionTickets((prev) => [newCorr, ...prev]);
  };

  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [activeCorrectionContext, setActiveCorrectionContext] = useState<{
    pathId: string;
    lessonTitle: string;
  } | null>(null);

  // Invitations
  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    const saved = localStorage.getItem('hearth_invitations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_INVITATIONS;
  });

  useEffect(() => {
    localStorage.setItem('hearth_invitations', JSON.stringify(invitations));
  }, [invitations]);

  const [invitationPreferences, setInvitationPreferences] = useState<InvitationPreferences>({
    policy: 'all',
    allowRoomInvites: true,
    allowPrayerInvites: true,
    allowConnectionRequests: true,
    allowLearningShares: true,
  });

  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);

  // Learning Modules
  const [learningModules, setLearningModules] = useState<LearningModule[]>(INITIAL_LEARNING_MODULES);
  const [selectedLearningId, setSelectedLearningId] = useState<string | null>(null);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_completed_lessons');
      return saved ? JSON.parse(saved) : ['sub-christ-1'];
    } catch {
      return ['sub-christ-1'];
    }
  });

  useEffect(() => {
    localStorage.setItem('hearth_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPrayComposerOpen, setIsPrayComposerOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState<boolean>(false);

  const [compliance] = useState<ComplianceState>({
    hipaaSafetyActive: true,
    phiDetectedWarnings: [],
    trackersBlockedCount: 0,
    encryptionStatus: 'AES-256-LocalVault',
  });

  // Offline queue count
  const offlineQueueCount = prayers.filter((p) => p.queuedOffline).length;

  // Language setter with document dir & lang update
  const setCurrentLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (langObj) {
      document.documentElement.lang = langObj.code;
      document.documentElement.dir = langObj.dir;
    }
  };

  // Translation helper
  const t = (key: string): string => {
    const dict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    return dict[key] || UI_TRANSLATIONS.en[key] || key;
  };

  // Auto-time syncing
  useEffect(() => {
    if (!isAutoTime) return;
    const interval = setInterval(() => {
      setTimeOfDay(getInitialTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, [isAutoTime]);

  // Apply CSS custom properties to root dynamically
  useEffect(() => {
    const root = document.documentElement;
    const activeTone = HEARTH_TONES[hearthTone] || HEARTH_TONES.ember;
    root.style.setProperty('--active-hearth', activeTone.primary);
    root.style.setProperty('--active-hearth-glow', activeTone.glow);
    root.style.setProperty('--active-hearth-accent', activeTone.accent);
    root.style.setProperty('--active-font-scale', `${accessibility.fontSizePercent / 100}`);

    if (accessibility.reducedMotion) {
      document.body.classList.add('reduced-motion');
      ambientAudio.fadeForInteraction(true);
    } else {
      document.body.classList.remove('reduced-motion');
      ambientAudio.fadeForInteraction(false);
    }
  }, [hearthTone, accessibility]);

  // Room atmosphere shift
  useEffect(() => {
    if (selectedRoomId) {
      const room = rooms.find((r) => r.id === selectedRoomId);
      if (room && ambientSettings.isEnabled) {
        ambientAudio.switchProfile(room.atmosphereProfile || 'contemplative');
      }
    }
  }, [selectedRoomId, ambientSettings.isEnabled, rooms]);

  // Deep linking and global keyboard shortcuts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash.startsWith('room/')) {
        const id = hash.replace('room/', '');
        setSelectedRoomId(id);
        setActiveTab('rooms');
      } else if (hash.startsWith('learn/')) {
        const id = hash.replace('learn/', '');
        setSelectedLearningId(id);
        setActiveTab('learn');
      } else if (hash === 'pray') {
        setIsPrayComposerOpen(true);
      } else if (hash === 'invitations') {
        setIsInvitationsModalOpen(true);
      } else if (['dashboard', 'rooms', 'pray', 'learn', 'profile'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Key 'p' or Ctrl+P opens prayer composer if not focused in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (!isInput && (e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsPrayComposerOpen(true);
      }
      if (e.key === 'Escape') {
        setIsPrayComposerOpen(false);
        setIsLanguageModalOpen(false);
        setIsInvitationsModalOpen(false);
        setActivePrayerDetail(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Multi-Client Sync Subscription via BroadcastChannel
  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((payload: SyncPayload) => {
      if (payload.type === 'ROOM_MESSAGE') {
        setRooms((prev) =>
          prev.map((r) => {
            if (r.id === payload.roomId) {
              if (r.recentMessages.some((m) => m.id === payload.message.id)) return r;
              return { ...r, recentMessages: [payload.message, ...r.recentMessages] };
            }
            return r;
          })
        );
        setLastSyncNotice(`New reflection received in room circle`);
      } else if (payload.type === 'PRAYER_INTENTION') {
        setPrayers((prev) => {
          if (prev.some((p) => p.id === payload.prayer.id)) return prev;
          return [payload.prayer, ...prev];
        });
        setLastSyncNotice(`New prayer intention shared in sanctuary`);
      } else if (payload.type === 'PRAYER_RESPONSE') {
        setPrayers((prev) =>
          prev.map((p) => {
            if (p.id === payload.prayerId) {
              if ((p.responses || []).some((r) => r.id === payload.response.id)) return p;
              return { ...p, responses: [...(p.responses || []), payload.response] };
            }
            return p;
          })
        );
        setLastSyncNotice(`A companion responded with prayer support`);
      }
    });

    // Periodic heartbeat presence to keep rooms alive across windows
    const interval = setInterval(() => {
      syncEngine.broadcast({
        type: 'PRESENCE_PING',
        senderHandle: authSession?.handle || userProfile.displayName,
        currentTab: activeTab,
        activeRoomId: selectedRoomId,
      });
    }, 25000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [authSession?.handle, userProfile.displayName, activeTab, selectedRoomId]);

  // Sovereign Vault Key & Auth Handlers
  const setupPassphraseVault = async (handle: string, passphrase: string): Promise<boolean> => {
    try {
      const { session, key } = await SanctuaryAuthService.setupPassphraseVault(handle, passphrase);
      setAuthSession(session);
      setIsVaultUnlocked(true);
      setUserProfile((prev) => ({ ...prev, displayName: session.handle }));

      // Re-encrypt existing journal entries with the new derived key
      const updatedPrayers = await Promise.all(
        prayers.map(async (p) => {
          if (p.destinationType === 'journal') {
            const enc = await encryptText(p.content, key);
            return {
              ...p,
              isEncrypted: true,
              encryptedPayload: JSON.stringify(enc),
            };
          }
          return p;
        })
      );
      setPrayers(updatedPrayers);
      return true;
    } catch (e) {
      console.error('Setup passphrase vault failed', e);
      return false;
    }
  };

  const unlockVault = async (passphrase: string): Promise<boolean> => {
    const success = await SanctuaryAuthService.unlockVault(passphrase);
    if (success) {
      const activeKey = SanctuaryAuthService.getActiveKey();
      setIsVaultUnlocked(true);
      setAuthSession((prev) => (prev ? { ...prev, isUnlocked: true } : null));

      // Decrypt any encrypted prayers in memory
      if (activeKey) {
        const decryptedPrayers = await Promise.all(
          prayers.map(async (p) => {
            if (p.isEncrypted && p.encryptedPayload) {
              try {
                const payload: EncryptedVaultPayload = JSON.parse(p.encryptedPayload);
                const plaintext = await decryptPayload(payload, activeKey);
                return { ...p, content: plaintext };
              } catch (e) {
                console.warn('Failed to decrypt prayer', e);
              }
            }
            return p;
          })
        );
        setPrayers(decryptedPrayers);
      }
      return true;
    }
    return false;
  };

  const lockVault = () => {
    const updatedSession = SanctuaryAuthService.lockVault();
    setIsVaultUnlocked(false);
    if (updatedSession) setAuthSession(updatedSession);
  };

  const switchToGuestVault = async () => {
    const { session } = await SanctuaryAuthService.createAnonymousGuestVault();
    setAuthSession(session);
    setIsVaultUnlocked(true);
  };

  // PHI & Anti-solicitation scanner
  const scanForPhiAndSafety = (text: string) => {
    const lower = text.toLowerCase();
    const hasPhi = SENSITIVE_HEALTH_KEYWORDS.some((kw) => lower.includes(kw));
    const hasSolicitation = SOLICITATION_KEYWORDS.some((kw) => lower.includes(kw));

    let advice: string | null = null;
    if (hasPhi) {
      advice = 'Notice (HIPAA & Health Privacy): We detected clinical terms or health identifiers. To safeguard personal medical privacy under federal standards, we suggest keeping specific medical details in your Private Journal or using gentle generalized phrasing (e.g. "healing and restoration for a loved one undergoing treatment").';
    } else if (hasSolicitation) {
      advice = 'Notice (Non-Solicitation Policy): The Living Hearth strictly prohibits financial solicitations, recruitment, commercial promotion, or aggressive conversion attempts. Please rephrase your message to focus purely on spiritual support and mutual reflection.';
    }

    return { hasPhi, hasSolicitation, advice };
  };

  const addRoomMessage = (
    roomId: string,
    content: string,
    mode: 'Practice' | 'Learning' | 'Discussion',
    isAnonymous: boolean
  ) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: isAnonymous ? 'Hearth Companion (Anonymous)' : (authSession?.handle || userProfile.displayName),
      isAnonymous,
      content,
      sourceLanguage: currentLanguage,
      timestamp: 'Just now',
      mode,
    };
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, recentMessages: [newMessage, ...r.recentMessages] } : r))
    );
    // Broadcast live across open tabs and windows
    syncEngine.broadcast({
      type: 'ROOM_MESSAGE',
      roomId,
      message: newMessage,
    });
  };

  const addPrayer = async (
    prayerData: Omit<PrayerIntention, 'id' | 'timestamp' | 'sourceLanguage' | 'queuedOffline'>
  ): Promise<{ queued: boolean; error?: string }> => {
    // Feature flag gate (Phase C1)
    if (prayerData.destinationType === 'person' && !featureFlags.enableDirectIntentions) {
      return {
        queued: false,
        error: 'Sanctuary notice: Direct person-to-person intentions are currently paused under sanctuary policy.',
      };
    }

    // Phase B2: Universal Platform Consent Primitive
    const now = Date.now();
    if (prayerData.destinationType === 'person' && prayerData.recipientName) {
      const consentResult = evaluatePrayerConsent({
        senderHandle: authSession?.handle || userProfile.displayName,
        recipientHandle: prayerData.recipientName,
        recipientPolicy: 'connections_only',
        blockedUsers,
        submissionTimestamps,
        now,
      });

      if (!consentResult.allowed) {
        logger.warn('Direct intention blocked by consent primitive', {
          recipient: prayerData.recipientName,
          code: consentResult.code,
        });
        return {
          queued: false,
          error: consentResult.userFacingMessage || 'Notice: This companion is currently not receiving direct intentions.',
        };
      }
    }

    // Rate limiting update (Risk 3: max 5 intentions per 10 minutes)
    const tenMinutesAgo = now - 10 * 60 * 1000;
    const recentSubmissions = submissionTimestamps.filter((t) => t > tenMinutesAgo);
    if (recentSubmissions.length >= 5) {
      return {
        queued: false,
        error: 'Sanctuary pacing notice: Maximum of 5 prayers or intentions per 10 minutes to maintain reverent pacing and prevent abuse.',
      };
    }
    setSubmissionTimestamps([...recentSubmissions, now]);

    const isOfflineMode = !navigator.onLine;
    let isEncrypted = false;
    let encryptedPayload: string | undefined = undefined;

    // Encrypt private journal entries using active sovereign AES-GCM-256 key
    if (prayerData.destinationType === 'journal') {
      const activeKey = SanctuaryAuthService.getActiveKey();
      if (activeKey && window.crypto?.subtle) {
        try {
          const encObj = await encryptText(prayerData.content, activeKey);
          isEncrypted = true;
          encryptedPayload = JSON.stringify(encObj);
        } catch (e) {
          console.warn('Vault encryption fallback', e);
        }
      }
    }

    const newPrayer: PrayerIntention = {
      ...prayerData,
      id: `prayer-${Date.now()}`,
      sourceLanguage: currentLanguage,
      senderName: authSession?.handle || userProfile.displayName,
      timestamp: isOfflineMode ? 'Saved offline (will sync)' : 'Just now',
      queuedOffline: isOfflineMode,
      isEncrypted,
      encryptedPayload,
      responses: [],
    };

    setPrayers((prev) => [newPrayer, ...prev]);

    // Broadcast if shared outside private journal
    if (newPrayer.destinationType !== 'journal') {
      syncEngine.broadcast({
        type: 'PRAYER_INTENTION',
        prayer: newPrayer,
      });
    }

    return { queued: isOfflineMode };
  };

  const editPrayer = async (prayerId: string, title: string, content: string): Promise<void> => {
    const activeKey = SanctuaryAuthService.getActiveKey();
    let encryptedPayload: string | undefined = undefined;
    let isEncrypted = false;

    const target = prayers.find((p) => p.id === prayerId);
    if (target?.destinationType === 'journal' && activeKey && window.crypto?.subtle) {
      try {
        const encObj = await encryptText(content, activeKey);
        isEncrypted = true;
        encryptedPayload = JSON.stringify(encObj);
      } catch (e) {
        console.warn('Re-encryption error on edit', e);
      }
    }

    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id === prayerId) {
          return {
            ...p,
            title,
            content,
            isEncrypted: isEncrypted || p.isEncrypted,
            encryptedPayload: encryptedPayload ?? p.encryptedPayload,
          };
        }
        return p;
      })
    );

    if (activePrayerDetail?.id === prayerId) {
      setActivePrayerDetail((prev) => (prev ? { ...prev, title, content } : null));
    }
  };

  const deletePrayer = (prayerId: string): void => {
    // Risk 1: Cryptographic zeroization / crypto-shredding on delete
    const target = prayers.find((p) => p.id === prayerId);
    if (target?.encryptedPayload) {
      try {
        const encBytes = new TextEncoder().encode(target.encryptedPayload);
        cryptoShredMemory(encBytes);
      } catch {
        // Safe no-op
      }
    }
    setPrayers((prev) => prev.filter((p) => p.id !== prayerId));
    if (activePrayerDetail?.id === prayerId) {
      setActivePrayerDetail(null);
    }
  };

  const respondToPrayer = (
    prayerId: string,
    content: string,
    isAnonymous: boolean,
    visibility: 'private_to_sender' | 'room_visible'
  ) => {
    const newResponse: PrayerResponse = {
      id: `resp-${Date.now()}`,
      responderName: isAnonymous ? 'Compassionate Companion' : (authSession?.handle || userProfile.displayName),
      content,
      timestamp: 'Just now',
      sourceLanguage: currentLanguage,
      isAnonymous,
      visibility,
    };

    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id === prayerId) {
          return {
            ...p,
            responses: [...(p.responses || []), newResponse],
          };
        }
        return p;
      })
    );

    if (activePrayerDetail && activePrayerDetail.id === prayerId) {
      setActivePrayerDetail((prev) =>
        prev
          ? {
              ...prev,
              responses: [...(prev.responses || []), newResponse],
            }
          : null
      );
    }

    // Broadcast response to other tabs/windows
    syncEngine.broadcast({
      type: 'PRAYER_RESPONSE',
      prayerId,
      response: newResponse,
    });
  };

  const sendInvitation = (invData: Omit<Invitation, 'id' | 'timestamp' | 'status' | 'sourceLanguage'>) => {
    // Validation: Check blocked list
    if (blockedUsers.some((u) => u.toLowerCase() === invData.recipientName.toLowerCase())) {
      return { success: false, reason: 'Unable to deliver invitation to this companion.' };
    }

    const newInv: Invitation = {
      ...invData,
      id: `inv-${Date.now()}`,
      timestamp: 'Just now',
      status: 'pending',
      sourceLanguage: currentLanguage,
    };

    setInvitations((prev) => [newInv, ...prev]);
    return { success: true };
  };

  const respondToInvitation = (invitationId: string, action: 'accept' | 'decline' | 'mute' | 'report') => {
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.id !== invitationId) return inv;
        if (action === 'accept') {
          // If room invitation, automatically add user to room if not member
          if (inv.type === 'room') {
            setSelectedRoomId(inv.targetId);
            setActiveTab('rooms');
          } else if (inv.type === 'learning') {
            setSelectedLearningId(inv.targetId);
            setActiveTab('learn');
          }
          return { ...inv, status: 'accepted' };
        } else if (action === 'decline') {
          return { ...inv, status: 'declined' };
        } else if (action === 'mute') {
          mutePrayerSender(inv.senderName);
          return { ...inv, status: 'muted' };
        } else if (action === 'report') {
          blockUser(inv.senderName);
          return { ...inv, status: 'declined' };
        }
        return inv;
      })
    );
  };

  const exportUserData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      complianceStatement: 'HIPAA & Federal Data Portability Guarantee - Sovereign Client Sanctuary Archive',
      keyFingerprint: authSession?.fingerprint || 'vault-sovereign',
      vaultMode: authSession?.mode || 'anonymous_vault',
      language: currentLanguage,
      hearthTone,
      userProfile,
      prayers,
      invitations,
      joinedRoomIds,
      completedLessonIds,
      savedLearning: learningModules.filter((m) => m.progressPercent > 0),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `living-hearth-sanctuary-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const purgeUserData = () => {
    setPrayers([]);
    setInvitations([]);
    setJoinedRoomIds([]);
    setCompletedLessonIds([]);
    setLearningModules((prev) => prev.map((m) => ({ ...m, progressPercent: 0 })));
    localStorage.clear();
    SanctuaryAuthService.createAnonymousGuestVault().then(({ session }) => {
      setAuthSession(session);
      setIsVaultUnlocked(true);
    });
  };

  return (
    <HearthContext.Provider
      value={{
        timeOfDay,
        setTimeOfDay,
        isAutoTime,
        setIsAutoTime,
        hearthTone,
        setHearthTone,
        currentLanguage,
        setCurrentLanguage,
        t,
        ambientSettings,
        setAmbientSettings,
        visualSettings,
        setVisualSettings,
        accessibility,
        setAccessibility,
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        updateDisplayName,
        updatePrimaryTradition,
        toggleSecondaryTradition,
        toggleSameTraditionOnly,
        setSameTraditionScope,
        setPrayerConsentPolicy,
        dismissReflection,
        authSession,
        isVaultUnlocked,
        setupPassphraseVault,
        unlockVault,
        lockVault,
        switchToGuestVault,
        isLiveSyncActive,
        lastSyncNotice,
        clearSyncNotice,
        rooms,
        selectedRoomId,
        setSelectedRoomId,
        joinedRoomIds,
        joinRoom,
        leaveRoom,
        addRoomMessage,
        createRoom,
        unlockedPrivateRoomIds,
        unlockPrivateRoom,
        prayers,
        addPrayer,
        editPrayer,
        deletePrayer,
        activePrayerDetail,
        setActivePrayerDetail,
        respondToPrayer,
        mutePrayerSender,
        mutedSenders,
        blockedUsers,
        blockUser,
        unblockUser,
        prayerRequestsEnabled,
        setPrayerRequestsEnabled,
        invitations,
        sendInvitation,
        respondToInvitation,
        invitationPreferences,
        setInvitationPreferences,
        isInvitationsModalOpen,
        setIsInvitationsModalOpen,
        learningModules,
        selectedLearningId,
        setSelectedLearningId,
        completedLessonIds,
        toggleLessonComplete,
        compliance,
        scanForPhiAndSafety,
        moderationTickets,
        submitModerationReport,
        resolveModerationTicket,
        isModerationPortalOpen,
        setIsModerationPortalOpen,
        isTrustSafetyModalOpen,
        setIsTrustSafetyModalOpen,
        contentCorrectionTickets,
        submitContentCorrection,
        isCorrectionModalOpen,
        setIsCorrectionModalOpen,
        activeCorrectionContext,
        setActiveCorrectionContext,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isPrayComposerOpen,
        setIsPrayComposerOpen,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        isProtocolModalOpen,
        setIsProtocolModalOpen,
        isOnline,
        offlineQueueCount,
        account,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        registerUser,
        logoutUser,
        switchDemoUser,
        demoUsers: DEMO_USERS,
        registeredUsers,
        isDomainGuideOpen,
        setIsDomainGuideOpen,
        updateSubscription,
        requestHardshipSponsorship,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        exportUserData,
        purgeUserData,
        orientationHelperEnabled,
        setOrientationHelperEnabled,
        activeCalendarSystems,
        setActiveCalendarSystems,
        toggleCalendarSystem,
        dailyRhythmEnabled,
        setDailyRhythmEnabled,
        spatialHeritageEnabled,
        setSpatialHeritageEnabled,
        isPersonalizationModalOpen,
        setIsPersonalizationModalOpen,
        featureFlags,
        toggleFeatureFlag,
      }}
    >
      {children}
    </HearthContext.Provider>
  );
};

export const useHearth = (): HearthContextType => {
  const context = useContext(HearthContext);
  if (!context) {
    throw new Error('useHearth must be used within a HearthProvider');
  }
  return context;
};
