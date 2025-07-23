// src/utils/decryptMessage.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-frontend-shared-secret'; // same as ENCRYPTION_SECRET used in backend
const SALT = 'sprinklelittlesalt'; // same as backend

function deriveKey(secret, salt) {
  // Simulate scryptSync with PBKDF2 (compatible enough for frontend)
  return CryptoJS.PBKDF2(secret, salt, {
    keySize: 256 / 32, // AES-256 = 32 bytes
    iterations: 1000,
  });
}

export default function decryptMessage(encryptedData) {
  if (!encryptedData || typeof encryptedData !== 'string') return encryptedData;

  const parts = encryptedData.split(':');
  if (parts.length !== 2) return encryptedData;

  try {
    const iv = CryptoJS.enc.Base64.parse(parts[0]);
    const ciphertext = CryptoJS.enc.Base64.parse(parts[1]);

    const key = deriveKey(SECRET_KEY, SALT);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext },
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Decryption failed:', err.message);
    return encryptedData;
  }
}
