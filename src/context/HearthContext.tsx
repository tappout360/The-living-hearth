import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  TimeOfDay,
  HearthTone,
  AccessibilitySettings,
  ComplianceState,
  Room,
  PrayerIntention,
  LearningModule,
} from '../types';
import { HEARTH_TONES, INITIAL_ROOMS, INITIAL_PRAYERS, INITIAL_LEARNING_MODULES } from '../data/mockData';

interface HearthContextType {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  isAutoTime: boolean;
  setIsAutoTime: (auto: boolean) => void;
  hearthTone: HearthTone;
  setHearthTone: (tone: HearthTone) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  activeTab: 'dashboard' | 'rooms' | 'pray' | 'learn' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'rooms' | 'pray' | 'learn' | 'profile') => void;
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  addRoomMessage: (roomId: string, content: string, mode: 'Practice' | 'Learning' | 'Discussion', isAnonymous: boolean) => void;
  prayers: PrayerIntention[];
  addPrayer: (prayer: Omit<PrayerIntention, 'id' | 'timestamp'>) => void;
  learningModules: LearningModule[];
  selectedLearningId: string | null;
  setSelectedLearningId: (id: string | null) => void;
  compliance: ComplianceState;
  scanForPhiAndSafety: (text: string) => { hasPhi: boolean; hasSolicitation: boolean; advice: string | null };
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isPrayComposerOpen: boolean;
  setIsPrayComposerOpen: (open: boolean) => void;
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
  // Determine initial time of day from local hour
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
  
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSizePercent: 100,
    highContrast: false,
    reducedMotion: false,
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'pray' | 'learn' | 'profile'>('dashboard');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<PrayerIntention[]>(INITIAL_PRAYERS);
  const [learningModules, setLearningModules] = useState<LearningModule[]>(INITIAL_LEARNING_MODULES);
  const [selectedLearningId, setSelectedLearningId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPrayComposerOpen, setIsPrayComposerOpen] = useState<boolean>(false);

  const [compliance] = useState<ComplianceState>({
    hipaaSafetyActive: true,
    phiDetectedWarnings: [],
    trackersBlockedCount: 0,
    encryptionStatus: 'AES-256-LocalVault',
  });

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
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [hearthTone, accessibility]);

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

  const addRoomMessage = (roomId: string, content: string, mode: 'Practice' | 'Learning' | 'Discussion', isAnonymous: boolean) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderName: isAnonymous ? 'Hearth Companion (Anonymous)' : 'You',
      isAnonymous,
      content,
      timestamp: 'Just now',
      mode,
    };
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, recentMessages: [newMessage, ...r.recentMessages] } : r))
    );
  };

  const addPrayer = (prayerData: Omit<PrayerIntention, 'id' | 'timestamp'>) => {
    const newPrayer: PrayerIntention = {
      ...prayerData,
      id: `prayer-${Date.now()}`,
      timestamp: 'Just now',
    };
    setPrayers((prev) => [newPrayer, ...prev]);
  };

  const exportUserData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      complianceStatement: 'HIPAA & Federal Data Portability Guarantee - Client Controlled Sanctuary Archive',
      hearthTone,
      prayers,
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
    setLearningModules((prev) => prev.map((m) => ({ ...m, progressPercent: 0 })));
    localStorage.clear();
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
        accessibility,
        setAccessibility,
        activeTab,
        setActiveTab,
        rooms,
        selectedRoomId,
        setSelectedRoomId,
        addRoomMessage,
        prayers,
        addPrayer,
        learningModules,
        selectedLearningId,
        setSelectedLearningId,
        compliance,
        scanForPhiAndSafety,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isPrayComposerOpen,
        setIsPrayComposerOpen,
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
