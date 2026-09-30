# ADR-006: Observability, Error Tracking & PII/PHI Sanitization Boundary

## Status
**Accepted**

## Context
Standard enterprise observability pipelines (Datadog, Sentry, CloudWatch, Google Analytics) automatically ingest payload bodies, exception traces, URLs, and state snapshots. In a digital sanctuary where prayers contain intimate personal health information (PHI) or personal identifiable information (PII), third-party monitoring could inadvertently store and leak sensitive health and religious reflections in violation of HIPAA and consumer privacy standards.

## Decision
1. **Zero Third-Party Commercial Tracking SDKs:**
   - No Google Analytics, Meta Pixel, FullStory, or commercial ad-tech SDKs are permitted in the client bundle.
2. **Structured Logging with Mandatory Sanitization:**
   - All logging passes through an isolated platform logger (`src/services/observability.ts`).
   - Automated regex scrubbers redact:
     - Plaintext prayer bodies (replaced with `"[ENCRYPTED_AT_REST]"` or `"[REDACTED_PRAYER_CONTENT]"`)
     - Clinical health keywords / ICD diagnostic terms (`chemotherapy`, `biopsy`, `psychiatric`, etc.)
     - Social Security Numbers, phone numbers, and full email addresses
3. **Automated CI Logging Test Gate:**
   - A dedicated automated test suite audits serialization strings to fail CI builds if any plaintext prayer or unmasked health data enters console or telemetry streams.
4. **Client-Controlled Error Reporting:**
   - Exception captures only log file names, line numbers, and anonymized error codes. Stack traces with variable state captures are scrubbed before output.

## Consequences
- **Positive:** Complete HIPAA compliance; absolute protection against accidental data leakage via error telemetry.
- **Trade-off:** Debugging complex client-side crypto issues requires sanitized error codes rather than full payload snapshots.
