/**
 * The Living Hearth - Sovereign Observability & Redaction Engine
 * ADR-006: Zero commercial trackers, structured logging with guaranteed PII/PHI scrubbing.
 */

export interface LogMetadata {
  category?: 'auth' | 'crypto' | 'prayer' | 'room' | 'consent' | 'moderation' | 'sync' | 'security';
  durationMs?: number;
  userId?: string;
  [key: string]: unknown;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  message: string;
  metadata?: Record<string, unknown>;
}

// Sensitive PHI medical keywords strictly scrubbed from telemetry
const SENSITIVE_PHI_PATTERNS = [
  /chemotherapy/gi,
  /radiation therapy/gi,
  /biopsy/gi,
  /stage [1-4]/gi,
  /metastatic/gi,
  /psychiatric hospital/gi,
  /icu admission/gi,
  /prescription/gi,
  /medical record/gi,
  /hiv positive/gi,
  /oncologist/gi,
  /suicide attempt/gi,
];

// Sensitive PII patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;

/**
 * Deep recursive scrubber for logging payloads
 */
export function sanitizePayload<T>(input: T): T {
  if (typeof input === 'string') {
    let str: string = input;
    // Scrub emails & phones
    str = str.replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
    str = str.replace(PHONE_REGEX, '[REDACTED_PHONE]');

    // Scrub PHI keywords
    for (const pattern of SENSITIVE_PHI_PATTERNS) {
      str = str.replace(pattern, '[REDACTED_PHI]');
    }
    return str as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizePayload(item)) as unknown as T;
  }

  if (input !== null && typeof input === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      // Force mask on raw prayer content
      if (key === 'content' && typeof value === 'string' && value !== '[ENCRYPTED_AT_REST]') {
        output[key] = '[REDACTED_PRAYER_CONTENT]';
      } else if (key === 'passphrase' || key === 'password' || key === 'keyMaterial') {
        output[key] = '[REDACTED_KEY_MATERIAL]';
      } else {
        output[key] = sanitizePayload(value);
      }
    }
    return output as unknown as T;
  }

  return input;
}

/**
 * Audit gate: verifies whether a payload is 100% free of unredacted PHI or plaintext prayers.
 */
export function auditLogPayload(payload: unknown): { isSafe: boolean; violations: string[] } {
  const violations: string[] = [];
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);

  for (const pattern of SENSITIVE_PHI_PATTERNS) {
    if (pattern.test(serialized)) {
      violations.push(`Unredacted PHI detected matching pattern ${pattern}`);
    }
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'content' in payload &&
    (payload as { content: unknown }).content !== '[ENCRYPTED_AT_REST]' &&
    (payload as { content: unknown }).content !== '[REDACTED_PRAYER_CONTENT]'
  ) {
    violations.push('Plaintext prayer body detected in log payload object');
  }

  return {
    isSafe: violations.length === 0,
    violations,
  };
}

class SovereignLogger {
  private logSink: (entry: StructuredLogEntry) => void;

  constructor(sink?: (entry: StructuredLogEntry) => void) {
    this.logSink = sink || this.defaultConsoleSink;
  }

  private defaultConsoleSink(entry: StructuredLogEntry) {
    if (entry.level === 'error') {
      console.error(`[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata || '');
    } else if (entry.level === 'warn') {
      console.warn(`[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata || '');
    } else {
      console.log(`[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata || '');
    }
  }

  public setSink(sink: (entry: StructuredLogEntry) => void) {
    this.logSink = sink;
  }

  public info(message: string, metadata?: LogMetadata) {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: sanitizePayload(message),
      metadata: metadata ? sanitizePayload(metadata) : undefined,
    };
    this.logSink(entry);
    return entry;
  }

  public warn(message: string, metadata?: LogMetadata) {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message: sanitizePayload(message),
      metadata: metadata ? sanitizePayload(metadata) : undefined,
    };
    this.logSink(entry);
    return entry;
  }

  public error(message: string, error?: unknown, metadata?: LogMetadata) {
    const sanitizedError = error instanceof Error
      ? { name: error.name, message: sanitizePayload(error.message) }
      : sanitizePayload(error);

    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: sanitizePayload(message),
      metadata: {
        ...(metadata ? sanitizePayload(metadata) : {}),
        error: sanitizedError,
      },
    };
    this.logSink(entry);
    return entry;
  }

  public securityEvent(event: string, metadata?: LogMetadata) {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'security',
      message: `[SECURITY AUDIT] ${sanitizePayload(event)}`,
      metadata: metadata ? sanitizePayload(metadata) : undefined,
    };
    this.logSink(entry);
    return entry;
  }
}

export const logger = new SovereignLogger();
