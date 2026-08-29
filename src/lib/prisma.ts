// // src/lib/prisma.ts
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// // Create Prisma Client with optimized settings for serverless
// function createPrismaClient() {
//   const client = new PrismaClient({
//     log: process.env.NODE_ENV === 'development'
//       ? ['query', 'error', 'warn']
//       : ['error'],
//     // Connection pool settings for serverless
//     datasources: {
//       db: {
//         url: process.env.DATABASE_URL,
//       },
//     },
//   })

//   // Add middleware for connection retry
//   client.$use(async (params, next) => {
//     const maxRetries = 3
//     let retries = 0
    
//     while (retries < maxRetries) {
//       try {
//         return await next(params)
//       } catch (error) {
//         retries++
//         console.error(`Prisma query failed (attempt ${retries}/${maxRetries}):`, error)
        
//         if (retries >= maxRetries) {
//           throw error
//         }
        
//         // Wait before retrying (exponential backoff)
//         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)))
//       }
//     }
//   })

//   return client
// }

// export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }

// // Export a function to test connection
// export async function testDatabaseConnection() {
//   try {
//     await prisma.$queryRaw`SELECT 1`
//     console.log('✅ Database connection successful')
//     return true
//   } catch (error) {
//     console.error('❌ Database connection failed:', error)
//     return false
//   }
// }

// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

  return client.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const maxRetries = 3
        let lastError: unknown

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            return await query(args)
          } catch (error) {
            lastError = error
            console.error(
              `Prisma query failed (${model}.${operation}) attempt ${attempt}/${maxRetries}:`,
              error
            )
            if (attempt < maxRetries) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * Math.pow(2, attempt))
              )
            }
          }
        }

        throw lastError
      },
    },
  })
}

export const prisma = (globalForPrisma.prisma ?? createPrismaClient()) as ReturnType<typeof createPrismaClient>

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma as unknown as PrismaClient
}

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