# The Living Hearth – Phase 0 & 1 Production Engineering Tickets

This document serves as the authoritative traceability matrix linking User Stories, Architectural Decision Records (ADRs), Acceptance Criteria, and Automated Test Gates.

---

## Ticket LH-001: Sovereign Account Creation & Session Lifecycle
- **User Story:** [US-0.1 Account Creation & US-0.2 Secure Session]
- **Linked ADR:** [`docs/adr/ADR-002-auth-and-sovereign-session-model.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-002-auth-and-sovereign-session-model.md)
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Sign-up form reachable from landing modal and header.
  - [x] Valid email + password creates user credentials.
  - [x] Duplicate email rejected with clear pastoral guidance.
  - [x] Passwords never stored in plain text (salted PBKDF2/SHA-256).
  - [x] Successful sign-up routes to Dashboard and restores session on refresh.
  - [x] Logout completely clears session and shreds volatile in-memory keys.
- **Automated Test Gate:** `tests/verticalSliceProductionPath.test.ts` (Step 1, Step 4, Step 5)

---

## Ticket LH-002: Zero-Knowledge Client-Side Prayer Vault
- **User Story:** [US-0.4 Data Protection for Prayers & US-1.1 Write Private Prayer]
- **Linked ADR:** [`docs/adr/ADR-001-prayer-encryption-and-key-custody.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-001-prayer-encryption-and-key-custody.md)
- **Threat Model:** [TV-1: Private Prayer Plaintext Exfiltration]
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Private journal entries encrypted with AES-GCM-256 derived via PBKDF2 (100,000 iterations).
  - [x] Raw persistent storage (`localStorage`) serializes ciphertext and stores placeholder `"[ENCRYPTED_AT_REST]"` in `content`.
  - [x] Storage confidentiality audit proves raw storage dumps never expose plaintext.
  - [x] Non-recovery policy clearly documented; no server-side backdoor keys exist.
  - [x] Entry deletion performs cryptographic memory zeroization (`cryptoShredMemory`).
  - [x] Empty prayer body cannot be saved.
- **Automated Test Gate:** `tests/criticalRisks.test.ts` (Risk 1) & `tests/verticalSliceProductionPath.test.ts` (Step 3, Step 4, Step 5)

---

## Ticket LH-003: Faith Profile, Dignity & Prayer Consent Policy
- **User Story:** [US-0.3 Basic Profile & US-1.3 Same-Tradition Filter]
- **Linked ADR:** [`docs/adr/ADR-003-platform-consent-state-machine-and-moderation.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-003-platform-consent-state-machine-and-moderation.md)
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] User can set display name and choose primary tradition.
  - [x] Display name is private by default; anonymous mode available in circles.
  - [x] Four-mode prayer consent policy (`open`, `connections_only`, `shared_rooms_only`, `closed`).
  - [x] Universal consent primitive (`evaluatePrayerConsent`) enforces recipient policy at the platform data layer.
  - [x] Rate limiter strictly enforces maximum 5 submissions per 10 minutes.
- **Automated Test Gate:** `tests/criticalRisks.test.ts` (Risk 3) & `tests/verticalSliceProductionPath.test.ts` (Step 2, Step 6)

---

## Ticket LH-004: Sacred Orientation & Multi-Calendar Governance
- **User Story:** [Phase C1 Calendar & Orientation Discipline]
- **Linked ADR:** [`docs/adr/ADR-004-geodesic-orientation-and-calendar-provenance.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-004-geodesic-orientation-and-calendar-provenance.md)
- **Threat Model:** [TV-4: Geolocation De-anonymization]
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Geodesic bearings calculated locally via WGS-84 Great Circle spherical trigonometry (zero coordinates sent to external servers).
  - [x] Prominent provenance and uncertainty disclaimer on compass and calendars ("Approximate — confirm with local community or trusted authority").
  - [x] Feature flag `enableOrientationHelper` provides instant kill switch.
  - [x] In-app "Report Inaccuracy" link routes to scholarly correction queue.
  - [x] Geodesic calculation benchmarks verified against Mecca (58.5° ±0.5°) and Jerusalem (54.1° ±0.5°).
- **Automated Test Gate:** `tests/criticalRisks.test.ts` (Risk 2) & `tests/verticalSliceProductionPath.test.ts` (Step 7)

---

## Ticket LH-005: Trust & Safety Triage Queue & Crisis Response
- **User Story:** [Phase B2 Consent & Moderation as Platform Primitives]
- **Linked ADR:** [`docs/adr/ADR-003-platform-consent-state-machine-and-moderation.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-003-platform-consent-state-machine-and-moderation.md)
- **Threat Model:** [TV-2: Consent Bypass & TV-3: Commercial Solicitation]
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Report submission flow categorizes incidents (`solicitation_recruitment`, `harassment`, `spiritual_abuse`, `hate_discrimination`, `spam`).
  - [x] Moderation portal renders triage queue and audit log.
  - [x] Actions (`warn`, `mute`, `block`, `dismiss`) update tickets and enforce blocks.
  - [x] Blocked users cannot message or invite reporting companion.
  - [x] 24/7 **988 Suicide & Crisis Lifeline** emergency protocol accessible from header and portal.
- **Automated Test Gate:** `tests/criticalRisks.test.ts` (Risk 3) & `tests/verticalSliceProductionPath.test.ts` (Step 6)

---

## Ticket LH-006: Scholarly Content Quality & Review Lifecycle
- **User Story:** [Phase C2 Content Pipeline as Engineering]
- **Linked ADR:** [`docs/adr/ADR-005-scholarly-content-governance-and-equal-depth.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-005-scholarly-content-governance-and-equal-depth.md)
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Editorial review status tracked (`draft`, `in_review`, `scholarly_reviewed`, `published`).
  - [x] Canonical and scholarly source citations attached to every module.
  - [x] Community correction modal requires academic or canonical citations.
  - [x] Equal depth matrix ensures no tradition is algorithmically or volumetrically privileged.
- **Automated Test Gate:** `tests/criticalRisks.test.ts` (Risk 4)

---

## Ticket LH-007: Observability Baseline & PHI Redaction Boundary
- **User Story:** [Phase A4 Observability Baseline & Phase B3 Security Gates]
- **Linked ADR:** [`docs/adr/ADR-006-observability-error-tracking-and-phi-boundary.md`](file:///d:/Jason/the-living-hearth/docs/adr/ADR-006-observability-error-tracking-and-phi-boundary.md)
- **Threat Model:** [TV-6: Observability PHI Leak]
- **Status:** **VERIFIED & CLOSED**
- **Acceptance Criteria:**
  - [x] Structured logger enforces automatic regex scrubbing for emails, phone numbers, and clinical keywords.
  - [x] Plaintext prayer bodies in log payloads are automatically masked (`[REDACTED_PRAYER_CONTENT]`).
  - [x] Automated audit gate detects and rejects unredacted telemetry.
  - [x] Zero commercial advertising or tracking SDKs in production bundle.
- **Automated Test Gate:** `tests/verticalSliceProductionPath.test.ts` (Step 8)
