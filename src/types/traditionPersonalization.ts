/**
 * The Living Hearth — Tradition-Aware Personalization System Data Models
 * Universal Framework guaranteeing equal dignity, depth, and quality across every tradition.
 */

export type TraditionFamily =
  | 'Abrahamic'
  | 'Dharmic'
  | 'East Asian'
  | 'Indigenous & Earth-Honoring'
  | 'Spiritualism & Esoteric'
  | 'Universal, Interfaith & Contemplative';

export type TraditionOrientationType =
  | 'fixed_point'
  | 'cardinal'
  | 'symbolic_east'
  | 'inward_none';

export interface OrientationTarget {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  description: string;
  theologicalSignificance: string;
}

export interface DailyRhythmWindow {
  id: string;
  name: string;
  traditionalName: string;
  timeWindow: string;
  description: string;
  practiceType: 'prayer' | 'meditation' | 'reflection' | 'study' | 'puja' | 'chanting' | 'contemplation';
}

export type CalendarSystemType =
  | 'gregorian'
  | 'liturgical_christian'
  | 'hebrew'
  | 'hijri'
  | 'hindu_panchang'
  | 'bahai_badi'
  | 'nanakshahi'
  | 'chinese_lunisolar'
  | 'seasonal_solstice';

export interface SacredObservance {
  id: string;
  traditionId: string;
  name: string;
  calendarSystem: CalendarSystemType;
  dateDisplay: string;
  beginsAtSunset?: boolean;
  description: string;
  spiritualTheme: string;
  internalDiversityNotes: string;
}

export interface SpatialHeritageCard {
  id: string;
  traditionId: string;
  systemName: string;
  corePrinciple: string;
  gentleGuidance: string[];
  educationalDisclaimer: string;
}

export interface TraditionPersonalizationProfile {
  id: string;
  traditionName: string;
  family: TraditionFamily;
  coverageStatus: 'Live' | 'In Research' | 'Community Review';
  orientation: {
    type: TraditionOrientationType;
    target?: OrientationTarget;
    cardinalDirection?: 'East' | 'North' | 'Center' | 'Inward' | 'All';
    advisoryNote: string;
  };
  dailyRhythm: DailyRhythmWindow[];
  calendar: {
    primarySystem: CalendarSystemType;
    systemDisplayName: string;
    currentEraYear: string;
    upcomingObservances: SacredObservance[];
    astronomicalNotice?: string;
  };
  spatialHeritage: SpatialHeritageCard;
  toneAndLanguage: {
    greetingAffirmation: string;
    intentionPromptTemplate: string;
    closingBlessing: string;
  };
  ambientProfileDefault: 'contemplative' | 'study' | 'interfaith' | 'luminous' | 'nature';
  abstractAccentColor: string;
  internalDiversityStatement: string;
}

export interface UserPersonalizationSettings {
  orientationHelperEnabled: boolean;
  activeCalendarSystems: CalendarSystemType[];
  dailyRhythmEnabled: boolean;
  spatialHeritageEnabled: boolean;
  customCoordinates?: {
    latitude: number;
    longitude: number;
    cityName?: string;
  };
}
