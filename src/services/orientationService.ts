/**
 * Sacred Orientation & Compass Bearing Calculation Engine
 * Calculates accurate geodesic forward azimuth (great circle bearing)
 * from any observer coordinates to sacred focal sanctuaries (Mecca, Jerusalem, Acre, etc.)
 */

export interface GeodesicResult {
  bearingDegrees: number;
  roundedBearing: number;
  cardinalLabel: string;
  distanceKm: number;
  distanceMiles: number;
}

export interface CityReferenceCoordinate {
  id: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const COMMON_GLOBAL_REFERENCE_CITIES: CityReferenceCoordinate[] = [
  { id: 'nyc', city: 'New York', region: 'North America (East)', latitude: 40.7128, longitude: -74.006 },
  { id: 'la', city: 'Los Angeles', region: 'North America (West)', latitude: 34.0522, longitude: -118.2437 },
  { id: 'chicago', city: 'Chicago', region: 'North America (Central)', latitude: 41.8781, longitude: -87.6298 },
  { id: 'london', city: 'London', region: 'Western Europe', latitude: 51.5074, longitude: -0.1278 },
  { id: 'paris', city: 'Paris', region: 'Western Europe', latitude: 48.8566, longitude: 2.3522 },
  { id: 'cairo', city: 'Cairo', region: 'North Africa / Middle East', latitude: 30.0444, longitude: 31.2357 },
  { id: 'dubai', city: 'Dubai', region: 'Middle East', latitude: 25.2048, longitude: 55.2708 },
  { id: 'delhi', city: 'New Delhi', region: 'South Asia', latitude: 28.6139, longitude: 77.209 },
  { id: 'tokyo', city: 'Tokyo', region: 'East Asia', latitude: 35.6762, longitude: 139.6503 },
  { id: 'sao_paulo', city: 'São Paulo', region: 'South America', latitude: -23.5505, longitude: -46.6333 },
  { id: 'sydney', city: 'Sydney', region: 'Oceania', latitude: -33.8688, longitude: 151.2093 },
  { id: 'nairobi', city: 'Nairobi', region: 'East Africa', latitude: -1.2921, longitude: 36.8219 },
];

/**
 * Converts degrees to radians
 */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 */
function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Converts azimuth bearing (0-360 deg) to 16-point cardinal compass text
 */
export function getCompassCardinalLabel(bearing: number): string {
  const normalized = (bearing % 360 + 360) % 360;
  const cardinals = [
    'North',
    'North-Northeast',
    'Northeast',
    'East-Northeast',
    'East',
    'East-Southeast',
    'Southeast',
    'South-Southeast',
    'South',
    'South-Southwest',
    'Southwest',
    'West-Southwest',
    'West',
    'West-Northwest',
    'Northwest',
    'North-Northwest',
  ];
  const idx = Math.round(normalized / 22.5) % 16;
  return cardinals[idx];
}

/**
 * Calculates Great Circle forward azimuth (bearing) and distance
 */
export function calculateGeodesicOrientation(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): GeodesicResult {
  const phi1 = toRadians(fromLat);
  const phi2 = toRadians(toLat);
  const deltaLambda = toRadians(toLng - fromLng);

  // Great Circle Initial Bearing (Forward Azimuth)
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const rawBearing = toDegrees(Math.atan2(y, x));
  const normalizedBearing = (rawBearing + 360) % 360;
  const roundedBearing = Math.round(normalizedBearing);

  // Haversine formula for distance
  const earthRadiusKm = 6371;
  const deltaPhi = toRadians(toLat - fromLat);
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(earthRadiusKm * c);
  const distanceMiles = Math.round(distanceKm * 0.621371);

  return {
    bearingDegrees: normalizedBearing,
    roundedBearing,
    cardinalLabel: getCompassCardinalLabel(normalizedBearing),
    distanceKm,
    distanceMiles,
  };
}

/**
 * Safe browser Geolocation request wrapper with fallback
 */
export async function requestUserCoordinates(): Promise<{
  success: boolean;
  latitude?: number;
  longitude?: number;
  cityName?: string;
  errorMessage?: string;
}> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      errorMessage: 'Geolocation is not supported by your current browser environment.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          cityName: 'Your Current Location',
        });
      },
      (error) => {
        let msg = 'Unable to determine your precise orientation location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was declined. You can select your closest global city from the list below.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please select your closest city.';
        }
        resolve({
          success: false,
          errorMessage: msg,
        });
      },
      { timeout: 8000, maximumAge: 600000, enableHighAccuracy: false }
    );
  });
}
