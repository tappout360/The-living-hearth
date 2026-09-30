# ADR-001: Zero-Knowledge Client-Side Prayer Encryption & Key Custody

## Status
**Accepted** (Architectural Decision Record)

## Context
Private prayers, intentions, and personal reflections recorded by users on The Living Hearth represent the most intimate and sensitive data in the application. Often, prayers touch upon grief, acute illness, family vulnerability, and sacred beliefs. A database leak, employee curiosity, or third-party subpoena that exposes plaintext prayers would permanently destroy trust and create severe ethical and legal liabilities under federal consumer protection guidelines and HIPAA privacy principles.

## Decision
We enforce a **Strict Client-Side Zero-Knowledge Encryption Model**:
1. **Algorithm:** AES-GCM-256 (Galois/Counter Mode) via the standard Web Cryptography API (`window.crypto.subtle` / `globalThis.crypto.subtle`).
2. **Key Derivation:** PBKDF2 using SHA-256, 100,000 iterations, and a unique 128-bit cryptographically secure random salt per user vault.
3. **Key Custody:** Exclusive client custody. Private keys are derived solely within the user's browser runtime memory. Raw encryption keys or master passphrases are **NEVER** transmitted across HTTP/WebSocket boundaries, NEVER written to server databases, and NEVER included in telemetry or error trackers.
4. **Storage at Rest:** All persistent client storage (`localStorage` / IndexedDB / cloud mirrors) stores only the base64-encoded ciphertext, initialization vector (IV), and salt. The `content` field is sanitized to `"[ENCRYPTED_AT_REST]"`.
5. **Non-Recovery Policy:** If a user loses their master passphrase, their private prayers cannot be decrypted by anyone—including The Living Hearth core engineering team. This intentional design provides mathematical immunity against insider threat and data breaches.
6. **Crypto-Shredding:** Deletion of an entry immediately executes memory zeroization of any in-memory buffers and purges the ciphertext, rendering recovery mathematically impossible.

## Consequences
- **Positive:** Mathematical privacy guarantee; HIPAA/Federal shield compliance; immunity against database leaks.
- **Trade-off:** No server-side password reset recovery for prayer bodies; search on prayer bodies must occur client-side after vault unlock.
