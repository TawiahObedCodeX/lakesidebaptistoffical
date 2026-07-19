// test-auth.js - FIXED

import prisma from './src/lib/prisma.js'  // ✅ Use our configured client
import bcrypt from 'bcryptjs'

async function testAuth() {
  try {
    const email = 'admin@church.org'
    const password = 'SecureAdminPassword123!'

    console.log('🔐 Testing authentication...')

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('❌ User not found')
      console.log('Please run: npx prisma db seed')
      return
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
    })

    const isValid = await bcrypt.compare(password, user.password)

    if (isValid) {
      console.log('✅ Password is CORRECT!')
      console.log('🎉 You can login with:')
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
    } else {
      console.log('❌ Password is INCORRECT')
      console.log('🔧 To fix password, run:')
      console.log('   npx prisma migrate reset --force')
      console.log('   npx prisma db seed')
    }

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()