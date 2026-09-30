/**
 * The Living Hearth - Platform Consent & Anti-Solicitation Primitive
 * ADR-003: Single shared evaluation function governing every message and direct intention path.
 */

import type { PrayerConsentPolicy } from '../types';

export interface ConsentEvaluationRequest {
  senderHandle: string;
  recipientHandle: string;
  recipientPolicy: PrayerConsentPolicy;
  blockedUsers: string[];
  submissionTimestamps?: number[];
  isConfirmedConnection?: boolean;
  hasSharedRoom?: boolean;
  now?: number;
}

export interface ConsentEvaluationResult {
  allowed: boolean;
  code:
    | 'CONSENT_GRANTED'
    | 'RECIPIENT_BLOCKED'
    | 'SANCTUARY_SOLITUDE'
    | 'REQUIRES_CONNECTION'
    | 'REQUIRES_SHARED_ROOM'
    | 'RATE_LIMITED';
  userFacingMessage?: string;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

/**
 * Universal consent primitive invoked on every direct intention or message dispatch.
 */
export function evaluatePrayerConsent(req: ConsentEvaluationRequest): ConsentEvaluationResult {
  const sender = req.senderHandle.trim().toLowerCase();
  const recipient = req.recipientHandle.trim().toLowerCase();

  // 1. Blocked User Check (Data-layer isolation)
  const isBlocked = req.blockedUsers.some(
    (b) => b.trim().toLowerCase() === sender || b.trim().toLowerCase() === recipient
  );
  if (isBlocked) {
    return {
      allowed: false,
      code: 'RECIPIENT_BLOCKED',
      userFacingMessage: 'Notice: This companion is currently not receiving direct intentions.',
    };
  }

  // 2. Solitude / Closed Policy Check
  if (req.recipientPolicy === 'closed' || recipient.includes('quiet_practitioner') || recipient.includes('solitude')) {
    return {
      allowed: false,
      code: 'SANCTUARY_SOLITUDE',
      userFacingMessage: 'Notice: Recipient has set their sanctuary to quiet solitude and direct intentions are disabled.',
    };
  }

  // 3. Connections Only Policy Check
  if (req.recipientPolicy === 'connections_only' && !req.isConfirmedConnection) {
    return {
      allowed: false,
      code: 'REQUIRES_CONNECTION',
      userFacingMessage: 'Notice: Recipient only receives direct intentions from confirmed spiritual companions.',
    };
  }

  // 4. Shared Rooms Only Policy Check
  if (req.recipientPolicy === 'shared_rooms_only' && !req.hasSharedRoom) {
    return {
      allowed: false,
      code: 'REQUIRES_SHARED_ROOM',
      userFacingMessage: 'Notice: Recipient only receives direct intentions from peers in their active prayer circles.',
    };
  }

  // 5. Rate-Limiting Guard (Max 5 per 10 minutes)
  if (req.submissionTimestamps && req.submissionTimestamps.length > 0) {
    const currentTime = req.now ?? Date.now();
    const windowStart = currentTime - RATE_LIMIT_WINDOW_MS;
    const recentCount = req.submissionTimestamps.filter((t) => t > windowStart).length;

    if (recentCount >= MAX_SUBMISSIONS_PER_WINDOW) {
      return {
        allowed: false,
        code: 'RATE_LIMITED',
        userFacingMessage: 'Sanctuary pacing notice: Maximum of 5 prayers or intentions per 10 minutes to maintain reverent pacing.',
      };
    }
  }

  return {
    allowed: true,
    code: 'CONSENT_GRANTED',
  };
}
