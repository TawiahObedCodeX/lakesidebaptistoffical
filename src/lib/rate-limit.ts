// src/lib/rate-limit.ts
// Simple rate limiting to prevent spam

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export async function rateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // If no record or window expired, create fresh record
  if (!record || now > record.resetTime) {
    const resetTime = now + windowSeconds * 1000
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return { success: true, remaining: maxRequests - 1, resetTime }
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime }
  }

  // Increment count
  record.count++
  rateLimitStore.set(identifier, record)

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 10 * 60 * 1000)