/**
 * The Living Hearth - Sovereign Web Crypto Vault
 * HIPAA & Federal Privacy Compliance: Client-side AES-GCM-256 Encryption Engine
 * 
 * Guarantees zero plaintext PHI (Protected Health Information) stored at rest,
 * zero server-side key custody, and zero reliance on commercial tracking SDKs.
 */

// Format for an encrypted payload stored in persistent client storage
export interface EncryptedVaultPayload {
  version: 1;
  algorithm: 'AES-GCM-256';
  iv: string; // Base64 encoded 96-bit initialization vector
  salt: string; // Base64 encoded PBKDF2 salt
  cipherText: string; // Base64 encoded ciphertext
  createdAt: string;
}

// Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Compute SHA-256 fingerprint for display (e.g., "7f8b:9e12:...")
export async function computeKeyFingerprint(keyMaterial: string): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    return 'vault-offline-fingerprint';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(keyMaterial);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':');
}

/**
 * Derive an AES-GCM 256-bit key from a user passphrase and salt using PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    true, // extractable for client export
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random sovereign key for Anonymous Guest sessions
 */
export async function generateAnonymousVaultKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext string with AES-GCM-256
 */
export async function encryptText(
  plainText: string,
  key: CryptoKey,
  saltHex?: string
): Promise<EncryptedVaultPayload> {
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(plainText);

  // Generate 96-bit (12-byte) IV recommended for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    encodedText
  );

  return {
    version: 1,
    algorithm: 'AES-GCM-256',
    iv: bufferToBase64(iv.buffer),
    salt: saltHex || '',
    cipherText: bufferToBase64(cipherBuffer),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Decrypt an EncryptedVaultPayload back into plaintext
 */
export async function decryptPayload(
  payload: EncryptedVaultPayload,
  key: CryptoKey
): Promise<string> {
  const ivBuffer = base64ToBuffer(payload.iv);
  const cipherBuffer = base64ToBuffer(payload.cipherText);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer) as BufferSource,
    },
    key,
    cipherBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}
