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

export type LanguageCode =
  | 'en' // English
  | 'es' // Spanish
  | 'ar' // Arabic (RTL)
  | 'he' // Hebrew (RTL)
  | 'hi' // Hindi (Devanagari)
  | 'zh' // Chinese
  | 'pt' // Portuguese (Spiritism core)
  | 'fr' // French
  | 'ja' // Japanese
  | 'sw'; // Swahili

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  scriptFamily: string;
}

export interface SacredGlossaryTerm {
  term: string;
  originalScript?: string;
  transliteration: string;
  tradition: string;
  gloss: string;
  scholarlyNotes: string;
}

export type AudioAtmosphereProfile =
  | 'contemplative'
  | 'study'
  | 'interfaith'
  | 'luminous'
  | 'nature';

export interface AmbientAudioSettings {
  isEnabled: boolean;
  volume: number; // 0.0 to 1.0
  fadeOnInteraction: boolean;
  activeProfile: AudioAtmosphereProfile;
  perRoomMuted: Record<string, boolean>;
}

export type VisualBreathingIntensity = 'gentle' | 'deep' | 'still';

export interface VisualAtmosphereSettings {
  breathingIntensity: VisualBreathingIntensity;
  lightFieldActive: boolean;
  floatingGeometryActive: boolean;
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
  inviteCode?: string;
  allowedEmails?: string[];
  atmosphereProfile?: AudioAtmosphereProfile;
  rules: string[];
  recentMessages: RoomMessage[];
}

export interface RoomMessage {
  id: string;
  senderName: string;
  isAnonymous: boolean;
  content: string;
  sourceLanguage?: LanguageCode;
  timestamp: string;
  mode: 'Practice' | 'Learning' | 'Discussion';
  traditionTag?: string;
  translatedContent?: Record<LanguageCode, string>;
}

export type PrayerDestination = 'journal' | 'person' | 'room' | 'public_board';
export type PrayerReminderInterval = 'none' | 'daily' | 'weekly' | 'evening';

export interface PrayerResponse {
  id: string;
  responderName: string;
  content: string;
  timestamp: string;
  sourceLanguage?: LanguageCode;
  isAnonymous: boolean;
  visibility: 'private_to_sender' | 'room_visible';
}

export interface PrayerIntention {
  id: string;
  type: 'private' | 'direct' | 'room';
  destinationType: PrayerDestination;
  title: string;
  content: string;
  sourceLanguage?: LanguageCode;
  translatedContent?: Record<LanguageCode, string>;
  recipientName?: string;
  senderName?: string;
  consentGranted?: boolean;
  roomName?: string;
  isAnonymous: boolean;
  timestamp: string;
  traditionOrPath?: string;
  privateReminder?: PrayerReminderInterval;
  queuedOffline?: boolean;
  responses?: PrayerResponse[];
  isEncrypted?: boolean;
  encryptedPayload?: string;
}

export type InvitationType = 'room' | 'connection' | 'prayer' | 'learning';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'muted';

export interface Invitation {
  id: string;
  senderName: string;
  recipientName: string;
  type: InvitationType;
  targetId: string;
  targetTitle: string;
  personalNote?: string;
  timestamp: string;
  status: InvitationStatus;
  sourceLanguage?: LanguageCode;
}

export interface InvitationPreferences {
  policy: 'all' | 'connections_only' | 'review_all' | 'off';
  allowRoomInvites: boolean;
  allowPrayerInvites: boolean;
  allowConnectionRequests: boolean;
  allowLearningShares: boolean;
}

export type PrayerConsentPolicy = 'open' | 'connections_only' | 'shared_rooms_only' | 'closed';

export type ReportReason =
  | 'solicitation_recruitment'
  | 'harassment'
  | 'hate_discrimination'
  | 'spiritual_abuse'
  | 'spam'
  | 'other';

export type ModerationStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed';
export type ModerationAction = 'none' | 'warn' | 'mute' | 'block' | 'ban' | 'dismiss';

export interface ModerationTicket {
  id: string;
  category: ReportReason;
  reporterDisplayName: string;
  targetUserOrMessage: string;
  contentSnapshot: string;
  contextSource: 'room' | 'prayer' | 'invitation' | 'profile';
  timestamp: string;
  status: ModerationStatus;
  actionTaken?: ModerationAction;
  moderatorNotes?: string;
  reviewedAt?: string;
}

export type ReviewWorkflowStatus = 'draft' | 'in_review' | 'scholarly_reviewed' | 'published';

export interface ContentCorrectionTicket {
  id: string;
  pathId: string;
  moduleOrLessonTitle: string;
  suggestedBy: string;
  correctionText: string;
  scholarlySourceCitation?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'applied' | 'declined';
}

export type TraditionFilterScope = 'learning' | 'rooms' | 'both';

export interface UserFaithProfile {
  displayName: string;
  email?: string;
  showNameInPublicRooms: boolean;
  primaryTradition: string;
  secondaryTraditions: string[];
  sameTraditionOnly: boolean;
  sameTraditionScope: TraditionFilterScope;
  prayerConsentPolicy: PrayerConsentPolicy;
  hasSeenTraditionFilterNotice: boolean;
  isReflectionDismissed: boolean;
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

export type AuthMode = 'anonymous_vault' | 'passphrase_vault';

export interface SanctuaryAuthSession {
  mode: AuthMode;
  handle: string;
  fingerprint: string;
  isUnlocked: boolean;
  createdAt: string;
  lastActiveAt: string;
}

export type SanctuaryTab =
  | 'dashboard'
  | 'rooms'
  | 'pray'
  | 'learn'
  | 'scripture'
  | 'churches'
  | 'store'
  | 'subscription'
  | 'profile';

export type SubscriptionTier = 'free' | 'pilgrim' | 'congregation';
export type SubscriptionBilling = 'monthly' | 'annual';

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  isAuthenticated: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionBilling: SubscriptionBilling;
  subscriptionRenewsAt?: string;
  joinedAt: string;
  hardshipSponsored?: boolean;
}

export type StoreCategory =
  | 'scriptures_bibles'
  | 'prayer_aids'
  | 'sanctuary_home'
  | 'class_study';

export interface StoreProduct {
  id: string;
  traditionId: 'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism' | 'lds' | 'spiritism' | 'interfaith';
  traditionName: string;
  title: string;
  subtitle: string;
  category: StoreCategory;
  price: number;
  pilgrimPrice: number;
  description: string;
  details: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  supplierName: string;
  sku: string;
  tags: string[];
  iconEmoji: string;
  associatedStudyClass?: string;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}


