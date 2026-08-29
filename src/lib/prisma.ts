// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma Client with optimized settings for serverless
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    // Connection pool settings for serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  // Add middleware for connection retry
  client.$use(async (params, next) => {
    const maxRetries = 3
    let retries = 0
    
    while (retries < maxRetries) {
      try {
        return await next(params)
      } catch (error) {
        retries++
        console.error(`Prisma query failed (attempt ${retries}/${maxRetries}):`, error)
        
        if (retries >= maxRetries) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      }
    }
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export a function to test connection
export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}