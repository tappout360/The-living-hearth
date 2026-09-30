import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import type { TraditionPersonalizationProfile } from '../types/traditionPersonalization';
import { getTraditionPersonalizationProfile } from '../data/traditionPersonalizationData';
import {
  calculateGeodesicOrientation,
  requestUserCoordinates,
  COMMON_GLOBAL_REFERENCE_CITIES,
  type GeodesicResult,
} from '../services/orientationService';
import {
  Compass,
  Navigation as NavIcon,
  MapPin,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SacredOrientationCompassProps {
  profile?: TraditionPersonalizationProfile;
  onDismiss?: () => void;
}

export const SacredOrientationCompass: React.FC<SacredOrientationCompassProps> = ({
  profile: propProfile,
  onDismiss,
}) => {
  const {
    hearthTone,
    timeOfDay,
    userProfile,
    setOrientationHelperEnabled,
    setIsCorrectionModalOpen,
    setActiveCorrectionContext,
    featureFlags,
  } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];
  const profile = propProfile || getTraditionPersonalizationProfile(userProfile.primaryTradition);

  // Observer coordinates: default to New York City if unselected
  const [selectedCityId, setSelectedCityId] = useState<string>('nyc');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 40.7128,
    lng: -74.006,
    label: 'New York (Default)',
  });

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [isTheologyExpanded, setIsTheologyExpanded] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

  // If orientation is symbolic east or cardinal
  const isFixedPoint = profile.orientation.type === 'fixed_point' && profile.orientation.target;
  const isEast = profile.orientation.type === 'symbolic_east';
  const isInward = profile.orientation.type === 'inward_none';

  // Calculate bearing
  const geodesic: GeodesicResult = React.useMemo(() => {
    if (isFixedPoint && profile.orientation.target) {
      return calculateGeodesicOrientation(
        userCoords.lat,
        userCoords.lng,
        profile.orientation.target.latitude,
        profile.orientation.target.longitude
      );
    }
    if (isEast) {
      return {
        bearingDegrees: 90,
        roundedBearing: 90,
        cardinalLabel: 'Due East',
        distanceKm: 0,
        distanceMiles: 0,
      };
    }
    return {
      bearingDegrees: 0,
      roundedBearing: 0,
      cardinalLabel: 'Inward Sanctuary',
      distanceKm: 0,
      distanceMiles: 0,
    };
  }, [isFixedPoint, isEast, userCoords, profile.orientation.target]);

  const handleUseMyLocation = async () => {
    setGeoLoading(true);
    setGeoNotice(null);
    const res = await requestUserCoordinates();
    setGeoLoading(false);

    if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
      setUserCoords({
        lat: res.latitude,
        lng: res.longitude,
        label: 'My Device Location',
      });
      setSelectedCityId('custom');
      setGeoNotice('Orientation adjusted to your current device location.');
      setTimeout(() => setGeoNotice(null), 4000);
    } else {
      setGeoNotice(res.errorMessage || 'Could not retrieve coordinates.');
    }
  };

  const handleSelectCity = (cityId: string) => {
    const city = COMMON_GLOBAL_REFERENCE_CITIES.find((c) => c.id === cityId);
    if (city) {
      setSelectedCityId(city.id);
      setUserCoords({
        lat: city.latitude,
        lng: city.longitude,
        label: `${city.city} (${city.region})`,
      });
      setIsCitySelectorOpen(false);
    }
  };

  if (featureFlags && !featureFlags.enableOrientationHelper) {
    return null;
  }

  return (
    <div
      className="p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 relative transition-all"
      style={{
        borderColor: 'rgba(232, 168, 124, 0.3)',
        backgroundColor: timeOfDay === 'night' ? '#2B231D' : '#FFFDFB',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center border"
            style={{
              borderColor: `${currentTone.primary}50`,
              backgroundColor: `${currentTone.primary}18`,
              color: currentTone.primary,
            }}
          >
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
                Optional Devotional Helper
              </span>
              <span className="text-xs text-stone-400">• {profile.traditionName}</span>
            </div>
            <h4 className="font-serif text-lg font-normal leading-snug m-0 mt-0.5">
              Sacred Facing Direction & Geodesic Bearing
            </h4>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            title="Dismiss Orientation Helper"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-stone-500 leading-relaxed m-0">
        {profile.orientation.advisoryNote}
      </p>

      {/* Main Dial and Bearing Data */}
      {!isInward ? (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-2">
          {/* SVG Sacred Compass Rose */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full transform transition-transform duration-700"
              >
                {/* Outer Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="none"
                  stroke={currentTone.primary}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="4 2"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke={currentTone.primary}
                  strokeWidth="1"
                  strokeOpacity="0.2"
                />

                {/* 16 Cardinal Compass Ticks */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const deg = i * 22.5;
                  const isMajor = i % 4 === 0;
                  return (
                    <line
                      key={i}
                      x1="80"
                      y1={isMajor ? '12' : '16'}
                      x2="80"
                      y2="20"
                      stroke={currentTone.primary}
                      strokeWidth={isMajor ? '2' : '1'}
                      strokeOpacity={isMajor ? '0.8' : '0.4'}
                      transform={`rotate(${deg} 80 80)`}
                    />
                  );
                })}

                {/* Cardinal Letters */}
                <text x="80" y="28" textAnchor="middle" fontSize="10" fontWeight="600" fill={currentTone.primary} opacity="0.9">N</text>
                <text x="136" y="84" textAnchor="middle" fontSize="10" fontWeight="600" fill={currentTone.primary} opacity="0.9">E</text>
                <text x="80" y="142" textAnchor="middle" fontSize="10" fontWeight="600" fill={currentTone.primary} opacity="0.9">S</text>
                <text x="24" y="84" textAnchor="middle" fontSize="10" fontWeight="600" fill={currentTone.primary} opacity="0.9">W</text>

                {/* Dynamic Bearing Needle */}
                <g transform={`rotate(${geodesic.bearingDegrees} 80 80)`}>
                  {/* Needle Pointer North/Target */}
                  <polygon
                    points="80,30 86,80 80,74 74,80"
                    fill={currentTone.primary}
                    className="drop-shadow-xs"
                  />
                  {/* Needle South Balance */}
                  <polygon
                    points="80,130 85,80 80,84 75,80"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  {/* Center Pivot */}
                  <circle cx="80" cy="80" r="5" fill="#FFFFFF" stroke={currentTone.primary} strokeWidth="2" />
                </g>
              </svg>

              {/* Angle Badge in Center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-900/80 text-amber-200 border border-amber-400/30">
                  {geodesic.roundedBearing}°
                </span>
              </div>
            </div>

            <span className="text-[11px] font-serif font-medium text-stone-600 dark:text-stone-300 mt-2">
              {geodesic.cardinalLabel} ({geodesic.roundedBearing}°)
            </span>
          </div>

          {/* Details & Sanctuary Focal Point */}
          <div className="sm:col-span-7 space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1.5">
              <div className="flex items-center justify-between text-stone-400">
                <span>Sanctuary Focal Point</span>
                <span className="font-mono text-emerald-600">Great Circle Geodesic</span>
              </div>
              <div className="font-serif text-sm font-semibold text-stone-800 dark:text-stone-200">
                {profile.orientation.target?.name || 'Historic Eastward Dawn'}
              </div>
              {profile.orientation.target && (
                <div className="text-[11px] text-stone-500">
                  {profile.orientation.target.city} • {geodesic.distanceMiles.toLocaleString()} miles ({geodesic.distanceKm.toLocaleString()} km) from observer
                </div>
              )}
            </div>

            {/* Observer Location Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate max-w-[180px]">{userCoords.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUseMyLocation}
                  disabled={geoLoading}
                  className="px-2.5 py-1 rounded-full border border-stone-300/40 hover:border-amber-400 text-[11px] font-serif flex items-center gap-1 transition-colors"
                  title="Detect GPS coordinates safely in browser"
                >
                  <NavIcon className="w-3 h-3 text-amber-500" />
                  <span>{geoLoading ? 'Detecting...' : 'My Device'}</span>
                </button>

                <button
                  onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
                  className="px-2.5 py-1 rounded-full border border-stone-300/40 hover:border-amber-400 text-[11px] font-serif flex items-center gap-1 transition-colors"
                >
                  <span>Select City</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Dropdown City Picker */}
            {isCitySelectorOpen && (
              <div className="p-2 rounded-2xl border border-stone-300/30 bg-stone-50 dark:bg-stone-900 grid grid-cols-2 gap-1 animate-in fade-in">
                {COMMON_GLOBAL_REFERENCE_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city.id)}
                    className={`text-left px-2.5 py-1 rounded-xl text-[11px] font-serif transition-colors flex items-center justify-between ${
                      selectedCityId === city.id
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium'
                        : 'hover:bg-stone-500/10 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <span>{city.city}</span>
                    {selectedCityId === city.id && <Check className="w-3 h-3 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}

            {geoNotice && (
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200">
                {geoNotice}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-xs space-y-2">
          <div className="flex items-center gap-2 font-serif text-stone-700 dark:text-stone-200 font-medium">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>The Inward Sacred Compass</span>
          </div>
          <p className="text-stone-500 leading-relaxed m-0">
            In {profile.traditionName}, communion is an interior attunement of consciousness rather than a physical directional axis. The sacred center is the quiet heart, open to divine love and guidance in all directions.
          </p>
        </div>
      )}

      {/* Theological Significance Accordion */}
      {profile.orientation.target && (
        <div className="pt-2 border-t border-stone-200/20 text-xs">
          <button
            onClick={() => setIsTheologyExpanded(!isTheologyExpanded)}
            className="flex items-center justify-between w-full text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-serif"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>Scriptural & Historic Origins of this Facing Direction</span>
            </span>
            {isTheologyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isTheologyExpanded && (
            <p className="mt-2 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-sans animate-in fade-in">
              {profile.orientation.target.theologicalSignificance}
            </p>
          )}
        </div>
      )}

      {/* Risk 2: Calculation Provenance & Uncertainty Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            Calculation Provenance & Local Authority Notice
          </span>
          <span className="font-mono text-[10px] text-stone-500">WGS-84 Geodesic</span>
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed m-0">
          <strong className="text-amber-900 dark:text-amber-200">Approximate</strong> — Bearings are calculated via standard Great Circle spherical trigonometry. Devotional practice should always be confirmed with your local community, local religious leadership, or verified physical sightings.
        </p>
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-amber-500/15">
          <button
            onClick={() => {
              setActiveCorrectionContext({
                pathId: profile.traditionName.toLowerCase(),
                lessonTitle: `Orientation Calculation: ${profile.traditionName} (${userCoords.label})`,
              });
              setIsCorrectionModalOpen(true);
            }}
            className="text-amber-700 dark:text-amber-300 underline hover:text-amber-800 font-medium transition-colors"
          >
            Report Inaccuracy / Propose Local Variant
          </button>
          <button
            onClick={() => setOrientationHelperEnabled(false)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            Disable Orientation Helper
          </button>
        </div>
      </div>
    </div>
  );
};
