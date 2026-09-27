/**
 * The Living Hearth - Sovereign Sanctuary Auth & Key Custody
 * Non-commercial, zero-tracker, zero-OAuth sovereign identity.
 * 
 * Complies with HIPAA Security Rule 45 CFR § 164.312 (Access Control & Encryption)
 * and eliminates third-party tracking cookies, Google OAuth, and ad pixels.
 */

import {
  deriveKeyFromPassphrase,
  generateAnonymousVaultKey,
  computeKeyFingerprint,
  bufferToBase64,
  base64ToBuffer,
  type EncryptedVaultPayload,
} from '../crypto/vaultCrypto';

export type AuthMode = 'anonymous_vault' | 'passphrase_vault';

export interface SanctuaryAuthSession {
  mode: AuthMode;
  handle: string;
  fingerprint: string;
  isUnlocked: boolean;
  createdAt: string;
  lastActiveAt: string;
}

const STORAGE_KEY_SESSION = 'hearth_sanctuary_session';
const STORAGE_KEY_SALT = 'hearth_sanctuary_salt';
const STORAGE_KEY_ANON_RAW = 'hearth_sanctuary_anon_raw';
const STORAGE_KEY_VERIFICATION = 'hearth_sanctuary_verification';

// In-memory active key (cleared on logout or lock)
let inMemoryCryptoKey: CryptoKey | null = null;

export class SanctuaryAuthService {
  /**
   * Get the active in-memory CryptoKey for encryption/decryption
   */
  static getActiveKey(): CryptoKey | null {
    return inMemoryCryptoKey;
  }

  /**
   * Load or initialize the active sovereign session
   */
  static async initSession(): Promise<{ session: SanctuaryAuthSession; key: CryptoKey | null }> {
    const rawSession = localStorage.getItem(STORAGE_KEY_SESSION);

    if (rawSession) {
      try {
        const session: SanctuaryAuthSession = JSON.parse(rawSession);

        if (session.mode === 'anonymous_vault') {
          // Restore anonymous guest key
          const rawKeyBase64 = localStorage.getItem(STORAGE_KEY_ANON_RAW);
          if (rawKeyBase64 && window.crypto?.subtle) {
            const rawKeyBuffer = base64ToBuffer(rawKeyBase64);
            const importedKey = await window.crypto.subtle.importKey(
              'raw',
              rawKeyBuffer,
              { name: 'AES-GCM', length: 256 },
              true,
              ['encrypt', 'decrypt']
            );
            inMemoryCryptoKey = importedKey;
            session.isUnlocked = true;
            session.lastActiveAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
            return { session, key: importedKey };
          }
        } else if (session.mode === 'passphrase_vault') {
          // Passphrase vaults require unlocking unless in same browser session
          session.isUnlocked = inMemoryCryptoKey !== null;
          return { session, key: inMemoryCryptoKey };
        }
      } catch (err) {
        console.warn('Failed to parse sanctuary session, re-initializing guest vault', err);
      }
    }

    // Default: initialize Anonymous Sovereign Guest Vault
    return this.createAnonymousGuestVault();
  }

  /**
   * Create a new Anonymous Guest Vault with fresh AES-256-GCM key
   */
  static async createAnonymousGuestVault(): Promise<{ session: SanctuaryAuthSession; key: CryptoKey }> {
    let key: CryptoKey;
    let fingerprint = 'vault-guest-offline';

    if (window.crypto?.subtle) {
      key = await generateAnonymousVaultKey();
      const rawKeyBuffer = await window.crypto.subtle.exportKey('raw', key);
      const rawKeyBase64 = bufferToBase64(rawKeyBuffer);
      localStorage.setItem(STORAGE_KEY_ANON_RAW, rawKeyBase64);
      fingerprint = await computeKeyFingerprint(rawKeyBase64);
    } else {
      // Insecure context fallback mock key
      key = {} as CryptoKey;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const session: SanctuaryAuthSession = {
      mode: 'anonymous_vault',
      handle: `Pilgrim-${randomSuffix}`,
      fingerprint,
      isUnlocked: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    inMemoryCryptoKey = key;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    return { session, key };
  }

  /**
   * Upgrade current guest or initialize a Passphrase / Handle Sovereign Vault
   */
  static async setupPassphraseVault(
    handle: string,
    passphrase: string
  ): Promise<{ session: SanctuaryAuthSession; key: CryptoKey }> {
    // Generate fresh salt (16 bytes)
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = bufferToBase64(saltBytes.buffer);
    localStorage.setItem(STORAGE_KEY_SALT, saltBase64);

    // Derive key via PBKDF2
    const key = await deriveKeyFromPassphrase(passphrase, saltBytes);
    inMemoryCryptoKey = key;

    const rawKeyBuffer = await window.crypto.subtle.exportKey('raw', key);
    const rawKeyBase64 = bufferToBase64(rawKeyBuffer);
    const fingerprint = await computeKeyFingerprint(rawKeyBase64);

    // Store verification token encrypted with this key to verify unlock later
    const encoder = new TextEncoder();
    const verificationPayload = encoder.encode('HEARTH_SANCTUARY_VAULT_VERIFIED');
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      verificationPayload
    );

    const verificationObj: EncryptedVaultPayload = {
      version: 1,
      algorithm: 'AES-GCM-256',
      iv: bufferToBase64(iv.buffer),
      salt: saltBase64,
      cipherText: bufferToBase64(cipherBuffer),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_VERIFICATION, JSON.stringify(verificationObj));

    // Clear anonymous key if any
    localStorage.removeItem(STORAGE_KEY_ANON_RAW);

    const cleanHandle = handle.trim() || 'Sovereign Pilgrim';
    const session: SanctuaryAuthSession = {
      mode: 'passphrase_vault',
      handle: cleanHandle,
      fingerprint,
      isUnlocked: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    return { session, key };
  }

  /**
   * Unlock an existing Passphrase Vault
   */
  static async unlockVault(passphrase: string): Promise<boolean> {
    const saltBase64 = localStorage.getItem(STORAGE_KEY_SALT);
    const verificationRaw = localStorage.getItem(STORAGE_KEY_VERIFICATION);
    if (!saltBase64 || !verificationRaw) return false;

    try {
      const saltBuffer = base64ToBuffer(saltBase64);
      const saltBytes = new Uint8Array(saltBuffer);
      const key = await deriveKeyFromPassphrase(passphrase, saltBytes);

      // Verify key by attempting to decrypt verification token
      const verificationObj: EncryptedVaultPayload = JSON.parse(verificationRaw);
      const ivBuffer = base64ToBuffer(verificationObj.iv);
      const cipherBuffer = base64ToBuffer(verificationObj.cipherText);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) as BufferSource },
        key,
        cipherBuffer
      );

      const text = new TextDecoder().decode(decrypted);
      if (text === 'HEARTH_SANCTUARY_VAULT_VERIFIED') {
        inMemoryCryptoKey = key;
        const rawSession = localStorage.getItem(STORAGE_KEY_SESSION);
        if (rawSession) {
          const session: SanctuaryAuthSession = JSON.parse(rawSession);
          session.isUnlocked = true;
          session.lastActiveAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Unlock verification failed (incorrect passphrase or corrupted data)', err);
      return false;
    }
  }

  /**
   * Lock the vault and wipe cryptographic keys from memory
   */
  static lockVault(): SanctuaryAuthSession | null {
    inMemoryCryptoKey = null;
    const rawSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (rawSession) {
      const session: SanctuaryAuthSession = JSON.parse(rawSession);
      session.isUnlocked = false;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      return session;
    }
    return null;
  }
}
