# ADR-003: Platform Consent State Machine & Anti-Solicitation Architecture

## Status
**Accepted**

## Context
Digital spiritual platforms are frequently targeted by commercial fundraisers, multi-level marketing pitches, hostile theological proselytizers, and unsolicited direct messages. To preserve The Living Hearth as a contemplative sanctuary, consent and moderation must not simply be cosmetic UI toggles; they must exist as mandatory platform primitives guarding every interaction path.

## Decision
1. **Universal Consent Primitive:**
   - Every message dispatch and direct prayer send invokes a single authoritative check: `evaluatePrayerConsent(sender, recipient, policy, roomContext)`.
   - The recipient's `PrayerConsentPolicy` supports 4 immutable states:
     - `'open'`: Recipient permits intention previews from any Hearth participant.
     - `'connections_only'`: Recipient permits intentions strictly from confirmed spiritual companions.
     - `'shared_rooms_only'`: Recipient permits intentions strictly from participants sharing at least one active prayer room.
     - `'closed'`: Recipient is in contemplative solitude; direct delivery is rejected unconditionally.
2. **Platform-Layer Block List:**
   - Block lists (`hearth_blocked_users`) are checked before any invitation, message, or intention reaches a recipient's inbox.
   - Senders receive neutral notices ("Recipient is not currently receiving direct messages") without confirming if they are specifically blocked.
3. **Pacing & Anti-Flooding Rate Limiter:**
   - Direct submissions are capped at **5 intentions per 10 minutes** per account to prevent harassment flooding, script bots, and emotional spam.
4. **Moderation Queue & Audit Log:**
   - Triage reports categorize incidents into 5 primary groups: `solicitation_recruitment`, `harassment`, `spiritual_abuse`, `hate_discrimination`, `spam`.
   - All moderator resolutions (`warn`, `mute`, `block`, `dismiss`) are committed to an immutable audit log with reviewer notes and timestamps.
5. **Crisis Escalation Integration:**
   - The platform provides immediate 24/7 routing to the **988 Suicide & Crisis Lifeline** (USA/Canada) and **111** (UK) whenever acute distress or self-harm risk is detected.

## Consequences
- **Positive:** Unsolicited outreach and predatory commercial behavior are blocked at the platform level; user autonomy is guaranteed.
- **Trade-off:** Growth speed is constrained in favor of safety and reverent pacing.
