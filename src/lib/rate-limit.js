// src/lib/rate-limit.js - FIXED

import prisma from '@/lib/prisma'

// In-memory store for rate limiting (fallback)
const rateLimitStore = new Map()

/**
 * Rate Limiter for API endpoints
 */
export async function rateLimiter(key, action, limit = 10, windowMs = 3600000) {
  const storeKey = `${action}:${key}`
  const now = Date.now()
  
  let data = rateLimitStore.get(storeKey)
  
  if (!data || (now - data.windowStart) > windowMs) {
    data = {
      count: 0,
      windowStart: now,
    }
  }
  
  if (data.count >= limit) {
    const resetTime = new Date(data.windowStart + windowMs)
    return {
      success: false,
      message: `Rate limit exceeded. Please try again after ${resetTime.toLocaleTimeString()}`,
      resetAt: resetTime,
    }
  }
  
  data.count += 1
  rateLimitStore.set(storeKey, data)
  
  // ✅ FIXED: Try database but don't fail if model doesn't exist
  try {
    await prisma.rateLimit.upsert({
      where: { key: storeKey },
      update: {
        count: { increment: 1 },
        resetAt: new Date(data.windowStart + windowMs),
      },
      create: {
        key: storeKey,
        count: 1,
        resetAt: new Date(data.windowStart + windowMs),
      },
    })
  } catch (error) {
    // ✅ FIXED: Silently continue if rateLimit table doesn't exist yet
    console.debug('Rate limit database error (non-critical):', error.message)
  }
  
  return {
    success: true,
    remaining: limit - data.count,
    resetAt: new Date(data.windowStart + windowMs),
  }
}

export function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if ((now - data.windowStart) > 3600000) {
      rateLimitStore.delete(key)
    }
  }
}

setInterval(cleanupRateLimits, 3600000)