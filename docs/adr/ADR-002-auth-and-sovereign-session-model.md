# ADR-002: Sovereign Authentication & Privacy-Preserving Session Model

## Status
**Accepted**

## Context
Standard commercial authentication patterns rely on third-party identity providers (Google, Facebook, Apple) that inject tracking pixels, monitor user login activity across the web, and link spiritual inquiries to commercial ad profiles. The Living Hearth requires an authentication model that preserves sovereignty, enables anonymous guest exploration, and protects spiritual identity from commercial profiling.

## Decision
1. **Dual-Tier Authentication:**
   - **Anonymous Guest Vault:** Users can immediately begin using the application without creating an account. The client generates an in-memory ephemeral AES-GCM-256 key and stores local state strictly on the device.
   - **Registered Sovereign Account:** Users create credentials with email and a password hash (salted PBKDF2/SHA-256). Password hashes are verified locally or against an isolated auth table, while the user's master passphrase derives the independent prayer encryption vault key.
2. **Session Persistence:**
   - Sessions are persisted using secure local storage tokens (`hearth_session`) containing cryptographic fingerprints, display handles, and expiry timestamps.
   - Browser refresh and restart restore active sessions without re-authenticating unless explicitly logged out or expired.
3. **Logout & Session Termination:**
   - Explicit logout wipes in-memory encryption keys (`cryptoShredMemory`), clears session tokens, and resets the active user context.
   - Multi-device sync uses local `BroadcastChannel` rather than remote third-party trackers, preventing network correlation.

## Consequences
- **Positive:** Zero dependency on commercial ad-network SSO; full offline-first functionality; complete anonymity supported for vulnerable pilgrims.
- **Trade-off:** Account recovery requires user custody of their registered email and passphrase.
