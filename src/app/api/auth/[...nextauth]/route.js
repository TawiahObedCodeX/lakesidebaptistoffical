// src/app/api/auth/[...nextauth]/route.js
// NextAuth API route for admin authentication

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }