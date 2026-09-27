export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export type HearthTone = 'ember' | 'sage' | 'indigo' | 'rose' | 'golden';

export interface HearthToneConfig {
  id: HearthTone;
  name: string;
  primary: string;
  glow: string;
  lightBg: string;
  darkBg: string;
  accent: string;
}

export interface Room {
  id: string;
  title: string;
  tradition: string;
  description: string;
  motif: string; // 'circle' | 'rings' | 'vesica' | 'flame'
  memberCount: number;
  activityStatus: 'quiet' | 'glowing' | 'active';
  isPrivate: boolean;
  rules: string[];
  recentMessages: RoomMessage[];
}

export interface RoomMessage {
  id: string;
  senderName: string;
  isAnonymous: boolean;
  content: string;
  timestamp: string;
  mode: 'Practice' | 'Learning' | 'Discussion';
  traditionTag?: string;
}

export interface PrayerIntention {
  id: string;
  type: 'private' | 'direct' | 'room';
  title: string;
  content: string;
  recipientName?: string;
  consentGranted?: boolean;
  roomName?: string;
  isAnonymous: boolean;
  timestamp: string;
  traditionOrPath?: string;
}

export type PathLevelName = 'Beginner' | 'Intermediate' | 'Deeper Exploration';

export type TraditionCategory =
  | 'Abrahamic & Related'
  | 'Dharmic / Indian-Origin'
  | 'East Asian & Related'
  | 'Iranian & Ancient Near Eastern'
  | 'Indigenous & Traditional'
  | 'Spiritualism & Spiritism'
  | 'New Religious & Esoteric'
  | 'Modern, Interfaith & Contemplative'
  | 'Historical Antiquity Continuities';

export type CoverageStatus = 'Live' | 'In Research' | 'Queued' | 'Needs Expert Partner';

export interface SubLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  summary: string;
  internalDiversityNotes: string;
  comparativeLinks?: string[];
}

export interface LevelModuleGroup {
  level: PathLevelName;
  estimatedTime: string;
  lessons: SubLesson[];
}

export interface ComprehensiveLearningPath {
  id: string;
  title: string;
  tradition: string;
  category: TraditionCategory;
  shortDescription: string;
  learningOutcomes: string[];
  levelGroups: LevelModuleGroup[];
  scholarlyCitations: string[];
  lastScholarlyReviewDate: string;
  coverageStatus: CoverageStatus;
  comparativePairs?: {
    partnerTradition: string;
    sharedPrinciple: string;
    traditionAPerspective: string;
    traditionBPerspective: string;
    intersectionInsight: string;
  };
}

export interface LearningModule {
  id: string;
  title: string;
  tradition: string;
  shortDescription: string;
  timeEstimate: string;
  progressPercent: number;
  scholarlyCitation: string;
  contentSections: {
    heading: string;
    body: string;
  }[];
  comparativePair?: {
    partnerTradition: string;
    sharedPrinciple: string;
    traditionAPerspective: string;
    traditionBPerspective: string;
    intersectionInsight: string;
  };
}

export interface LivingInventoryEntry {
  id: string;
  name: string;
  category: TraditionCategory;
  coverageStatus: CoverageStatus;
  notes: string;
  communityPresence: string;
  scholarlyPartnership?: string;
}

export interface AccessibilitySettings {
  fontSizePercent: number; // 100, 115, 130, 150, 200
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface ComplianceState {
  hipaaSafetyActive: boolean;
  phiDetectedWarnings: string[];
  trackersBlockedCount: number;
  encryptionStatus: 'AES-256-LocalVault' | 'TLS-1.3';
}
