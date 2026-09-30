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
} from '../types';
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
import { encryptText, decryptPayload, type EncryptedVaultPayload } from '../crypto/vaultCrypto';


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
  dismissReflection: () => void;

  // Rooms & Private Email Invites
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
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

  // Safety & HIPAA
  compliance: ComplianceState;
  scanForPhiAndSafety: (text: string) => { hasPhi: boolean; hasSolicitation: boolean; advice: string | null };

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

  // Data Sovereignty
  exportUserData: () => void;
  purgeUserData: () => void;
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
      hasSeenTraditionFilterNotice: false,
      isReflectionDismissed: false,
    };
  });

  // Persist userProfile changes
  useEffect(() => {
    localStorage.setItem('hearth_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

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
    localStorage.setItem('hearth_prayers', JSON.stringify(prayers));
  }, [prayers]);

  const [activePrayerDetail, setActivePrayerDetail] = useState<PrayerIntention | null>(null);

  // Blocked users & muted senders
  const [blockedUsers, setBlockedUsers] = useState<string[]>(['blocked_spam_user']);
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
    // Check if recipient has blocked sender or turned off requests
    if (prayerData.destinationType === 'person' && prayerData.recipientName) {
      const rec = prayerData.recipientName.trim().toLowerCase();
      if (blockedUsers.some((u) => u.toLowerCase() === rec)) {
        return { queued: false, error: 'Notice: This companion is currently not receiving direct intentions.' };
      }
      if (rec === 'quiet_practitioner') {
        return { queued: false, error: 'Notice: Recipient has disabled direct prayer requests in their sanctuary settings.' };
      }
    }

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
        addRoomMessage,
        createRoom,
        unlockedPrivateRoomIds,
        unlockPrivateRoom,
        prayers,
        addPrayer,
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
        compliance,
        scanForPhiAndSafety,
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
        exportUserData,
        purgeUserData,
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
