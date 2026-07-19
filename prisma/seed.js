// prisma/seed.js - FIXED
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create adapter
const adapter = new PrismaPg(pool)

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@church.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!'

    console.log(`📧 Checking for admin user: ${adminEmail}`)

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      console.log('🔐 Creating admin user...')
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      
      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Church Administrator',
          role: 'ADMIN',
          isActive: true,
        },
      })
      
      console.log(`✅ Admin user created: ${newAdmin.email}`)
      console.log(`🔑 Password: ${adminPassword}`)
    } else {
      console.log(`✅ Admin user already exists: ${existingAdmin.email}`)
    }

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()