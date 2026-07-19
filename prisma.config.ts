// prisma.config.ts
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { defineConfig } from 'prisma/config'

console.log('📡 Checking DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Not Found')

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  process.exit(1)
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,  // ✅ Database URL moved here
  },
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'node prisma/seed.js',
  },
})