// Encryption utilities for sensitive data
import CryptoJS from 'crypto-js'

// Encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

/**
 * Encrypt sensitive data like card numbers, bank details
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string
 */
export function encryptData(text) {
  try {
    if (!text) return null
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text
 * @returns {string} Decrypted plain text
 */
export function decryptData(encryptedText) {
  try {
    if (!encryptedText) return null
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

/**
 * Generate a secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length]
  }
  return token
}

/**
 * Hash sensitive data for comparison (not reversible)
 * @param {string} data - Data to hash
 * @returns {string} Hashed value
 */
export function hashData(data) {
  return CryptoJS.SHA256(data).toString()
}

/**
 * Redact sensitive information for logging
 * @param {string} data - Data to redact
 * @param {number} visibleChars - Number of characters to keep visible
 * @returns {string} Redacted string
 */
export function redactSensitiveData(data, visibleChars = 4) {
  if (!data) return null
  if (data.length <= visibleChars * 2) return '***'
  const start = data.slice(0, visibleChars)
  const end = data.slice(-visibleChars)
  return `${start}...${end}`
}