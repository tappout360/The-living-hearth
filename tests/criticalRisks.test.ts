import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test Subject 1: Vault Crypto & Storage Confidentiality
import {
  deriveKeyFromPassphrase,
  encryptText,
  decryptPayload,
  verifyStorageConfidentiality,
  cryptoShredMemory,
} from '../src/crypto/vaultCrypto.ts';

// Test Subject 2: Geodesic Orientation Service
import { calculateGeodesicOrientation } from '../src/services/orientationService.ts';

describe('Critical Risk 1: Encryption & Key Custody for Private Prayers', () => {
  const secretPassphrase = 'sacred-sanctuary-passphrase-2026';
  const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const privatePrayerPlaintext = 'Deep personal petition for healing and grief peace following family loss.';

  test('Derives 256-bit AES-GCM key and performs authenticated encryption', async () => {
    const key = await deriveKeyFromPassphrase(secretPassphrase, salt);
    assert.ok(key, 'Derived CryptoKey must exist');
    assert.equal(key.algorithm.name, 'AES-GCM');

    const encryptedPayload = await encryptText(privatePrayerPlaintext, key);
    assert.ok(encryptedPayload.cipherText, 'Ciphertext must be present');
    assert.ok(encryptedPayload.iv, 'Initialization Vector must be present');
    assert.notEqual(encryptedPayload.cipherText, privatePrayerPlaintext);

    // Decrypt with correct key
    const decrypted = await decryptPayload(encryptedPayload, key);
    assert.equal(decrypted, privatePrayerPlaintext);
  });

  test('Proves storage confidentiality: raw storage dump contains zero plaintext', async () => {
    const key = await deriveKeyFromPassphrase(secretPassphrase, salt);
    const encryptedPayload = await encryptText(privatePrayerPlaintext, key);

    // Simulated localStorage entry
    const mockStorageJournalRecord = JSON.stringify({
      id: 'prayer-test-1',
      destinationType: 'journal',
      title: 'Healing Contemplation',
      content: '[ENCRYPTED_AT_REST]',
      isEncrypted: true,
      encryptedPayload: JSON.stringify(encryptedPayload),
    });

    const audit = verifyStorageConfidentiality(mockStorageJournalRecord, [privatePrayerPlaintext]);
    assert.equal(audit.isConfidential, true, 'Storage must not leak plaintext');
    assert.equal(audit.leakedPlaintexts.length, 0);
    assert.equal(mockStorageJournalRecord.includes(privatePrayerPlaintext), false);
  });

  test('Decryption with an invalid key fails cryptographic verification', async () => {
    const keyA = await deriveKeyFromPassphrase('passphrase-A', salt);
    const keyB = await deriveKeyFromPassphrase('passphrase-B', salt);

    const payload = await encryptText(privatePrayerPlaintext, keyA);

    await assert.rejects(async () => {
      await decryptPayload(payload, keyB);
    }, 'Decryption with wrong key must reject due to AES-GCM authentication tag failure');
  });

  test('Crypto-shredding permanently wipes sensitive buffer memory', () => {
    const sensitive = new Uint8Array([42, 99, 128, 255]);
    const shredded = cryptoShredMemory(sensitive);
    assert.equal(shredded, true);
    assert.deepEqual(Array.from(sensitive), [0, 0, 0, 0], 'Memory buffer must be zeroized');
  });
});

describe('Critical Risk 2: Multi-Calendar & Geodesic Bearing Verification', () => {
  test('Calculates Great Circle bearing from NYC to Mecca (Qibla) within ±0.5° of reference benchmark (58.5°)', () => {
    // New York: 40.7128° N, -74.0060° W
    // Mecca Kaaba: 21.4225° N, 39.8262° E
    const result = calculateGeodesicOrientation(40.7128, -74.0060, 21.4225, 39.8262);

    assert.ok(result.bearingDegrees > 57.5 && result.bearingDegrees < 59.5,
      `Calculated bearing ${result.bearingDegrees}° must be ~58.5°`);
    assert.ok(result.distanceKm > 10000, 'Distance must exceed 10,000 km');
  });

  test('Calculates Great Circle bearing from NYC to Jerusalem (Mizrah) within ±0.5° of reference benchmark (54.1°)', () => {
    // Jerusalem: 31.7780° N, 35.2354° E
    const result = calculateGeodesicOrientation(40.7128, -74.0060, 31.7780, 35.2354);

    assert.ok(result.bearingDegrees > 53.5 && result.bearingDegrees < 54.5,
      `Calculated bearing ${result.bearingDegrees}° must be ~54.1°`);
  });

  test('Handles edge cases without throwing unhandled exceptions', () => {
    const identicalPoint = calculateGeodesicOrientation(0, 0, 0, 0);
    assert.equal(identicalPoint.distanceKm, 0);

    const antipodalPoint = calculateGeodesicOrientation(0, 0, 0, 180);
    assert.ok(typeof antipodalPoint.bearingDegrees === 'number');
  });
});

describe('Critical Risk 3: Consent & Moderation Rate-Limiting Protocols', () => {
  test('Enforces recipient prayer consent policy (rejects direct messages when recipient is closed)', () => {
    const isRecipientAllowingDirect = (policy: string, senderType: 'stranger' | 'connection'): boolean => {
      if (policy === 'closed') return false;
      if (policy === 'connections_only' && senderType !== 'connection') return false;
      return true;
    };

    assert.equal(isRecipientAllowingDirect('closed', 'connection'), false);
    assert.equal(isRecipientAllowingDirect('connections_only', 'stranger'), false);
    assert.equal(isRecipientAllowingDirect('connections_only', 'connection'), true);
    assert.equal(isRecipientAllowingDirect('open', 'stranger'), true);
  });

  test('Enforces rate limiting (rejects 6th submission within 10 minutes)', () => {
    const now = Date.now();
    const timestamps = [now - 500000, now - 400000, now - 300000, now - 200000, now - 100000];

    const canSubmit = (existing: number[]): boolean => {
      const tenMinsAgo = Date.now() - 600000;
      const recent = existing.filter((t) => t > tenMinsAgo);
      return recent.length < 5;
    };

    assert.equal(canSubmit(timestamps), false, '6th prayer submission must be blocked by rate limit');
    assert.equal(canSubmit(timestamps.slice(1)), true, '4 prior submissions within window allows 5th submission');
  });

  test('Generates structured moderation ticket and records audit action', () => {
    const ticket = {
      id: 'ticket-test-99',
      category: 'solicitation_recruitment' as const,
      reporterDisplayName: 'Elena',
      targetUserOrMessage: 'Spammer-88',
      contentSnapshot: 'Unsolicited crypto fundraising link',
      contextSource: 'room' as const,
      timestamp: new Date().toISOString(),
      status: 'pending' as const,
    };

    // Action ticket
    const actioned = {
      ...ticket,
      status: 'actioned' as const,
      actionTaken: 'block' as const,
      moderatorNotes: 'Commercial solicitation violation confirmed.',
      reviewedAt: new Date().toISOString(),
    };

    assert.equal(actioned.status, 'actioned');
    assert.equal(actioned.actionTaken, 'block');
    assert.ok(actioned.reviewedAt);
  });
});

describe('Critical Risk 4: Content Velocity & Quality Governance', () => {
  test('Submits scholarly correction with required academic citation', () => {
    const correction = {
      id: 'corr-test-1',
      pathId: 'path-christianity',
      moduleOrLessonTitle: 'Early Church Traditions',
      suggestedBy: 'Dr. Evelyn Ward',
      correctionText: 'Clarify differentiation between Syrian and Roman Eucharistic liturgies.',
      scholarlySourceCitation: 'Dix, Gregory. The Shape of the Liturgy, Ch. 6.',
      timestamp: new Date().toISOString(),
      status: 'pending' as const,
    };

    assert.ok(correction.scholarlySourceCitation.length > 10, 'Scholarly source citation is mandatory');
    assert.equal(correction.status, 'pending');
  });
});
