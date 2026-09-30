# ADR-004: Geodesic Orientation & Multi-Calendar Governance with Disclaimers & Feature Flags

## Status
**Accepted**

## Context
Various traditions utilize directional facing during prayer (e.g. Qibla toward Mecca in Islam, Mizrah toward Jerusalem in Judaism, or Eastward facing in historic Christianity). Additionally, diverse calendars (Hebrew, Hijri, Hindu Panchang, Solar Nanakshahi, Buddhist lunar phases) govern sacred observances. Because spherical trigonometry and lunar sightings involve local variations and traditional rulings, an algorithmically asserted calculation could inadvertently cause devotional conflict if presented dogmatically.

## Decision
1. **Mathematical Engine:**
   - Great Circle geodesic calculations use the standard Haversine and spherical trigonometry equations on the WGS-84 reference ellipsoid.
   - Global reference benchmarks:
     - New York (40.7128° N, -74.0060° W) to Mecca (21.4225° N, 39.8262° E) &rarr; `58.48°` (Due ENE).
     - New York to Jerusalem (31.7780° N, 35.2354° E) &rarr; `54.06°` (Due NE).
2. **Prominent Uncertainty & Provenance Disclaimers:**
   - Every orientation surface and calendar display must prominently display:
     > *"Approximate — Confirm with your local community, local mosque/synagogue/temple authority, or physical moon sighting."*
3. **Graceful Degradation:**
   - Geolocation or calculation failure must never block or crash the UI, and never prevent a user from saving a prayer or entering a room.
4. **Instant Kill Switch Feature Flags:**
   - `enableOrientationHelper` and `enableMultiCalendar` can be disabled globally or locally via feature flags.
5. **In-App Inaccuracy Reporting:**
   - Users and community elders can report local liturgical variations directly into the scholarly governance queue.

## Consequences
- **Positive:** Protects theological nuance, respects local religious authorities, eliminates dogmatic calculation disputes.
- **Trade-off:** Requires explicit disclaimer banners on compass and calendar widgets.
