/**
 * The Living Hearth - Platform Feature Flags Engine
 * Phase A4 & C1: Hard Gates, Kill Switches, and Experimental Feature Management
 */

export interface HearthFeatureFlags {
  enableOrientationHelper: boolean;
  enableMultiCalendar: boolean;
  enableDirectIntentions: boolean;
  enableAmbientAudio: boolean;
  enableScholarlyFeedback: boolean;
  enableCrisisSupportBanner: boolean;
  enableStrictPhiScanning: boolean;
  enableCommerceStore: boolean;
}

export const DEFAULT_FEATURE_FLAGS: HearthFeatureFlags = {
  enableOrientationHelper: true,
  enableMultiCalendar: true,
  enableDirectIntentions: true,
  enableAmbientAudio: true,
  enableScholarlyFeedback: true,
  enableCrisisSupportBanner: true,
  enableStrictPhiScanning: true,
  enableCommerceStore: true,
};

const STORAGE_KEY = 'hearth_feature_flags';
type FlagListener = (flags: HearthFeatureFlags) => void;
const listeners = new Set<FlagListener>();
let memoryCache: HearthFeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

export function getFeatureFlags(): HearthFeatureFlags {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryCache = {
          ...DEFAULT_FEATURE_FLAGS,
          ...JSON.parse(raw),
        };
      }
    } catch {
      // storage unavailable
    }
  }
  return { ...memoryCache };
}

export function isFeatureEnabled(flag: keyof HearthFeatureFlags): boolean {
  const flags = getFeatureFlags();
  return Boolean(flags[flag]);
}

export function setFeatureFlag(flag: keyof HearthFeatureFlags, value: boolean): HearthFeatureFlags {
  const current = getFeatureFlags();
  const updated: HearthFeatureFlags = {
    ...current,
    [flag]: value,
  };
  memoryCache = updated;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  }
  listeners.forEach((fn) => fn(updated));
  return updated;
}

export function resetFeatureFlags(): HearthFeatureFlags {
  memoryCache = { ...DEFAULT_FEATURE_FLAGS };
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  }
  const defaults = { ...DEFAULT_FEATURE_FLAGS };
  listeners.forEach((fn) => fn(defaults));
  return defaults;
}

export function subscribeToFeatureFlags(listener: FlagListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
