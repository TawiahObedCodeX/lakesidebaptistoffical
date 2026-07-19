// src/middleware.js
// Security middleware for protecting admin routes

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname
    const token = req.nextauth.token

    // Security headers for all responses
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Protect admin routes
    if (path.startsWith('/admin')) {
      // Allow login page without auth
      if (path === '/admin/login') {
        return response
      }
      
      // Check if user is authenticated and has admin role
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Protect API admin routes
    if (path.startsWith('/api/newsletters') || 
        path.startsWith('/api/payments') ||
        path.startsWith('/api/contacts')) {
      
      // Allow webhook endpoints (they don't need auth)
      if (path.includes('/webhook')) {
        return response
      }
      
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname
        
        // Allow login page without auth
        if (path === '/admin/login') {
          return true
        }
        
        // Allow webhooks without auth
        if (path.includes('/webhook')) {
          return true
        }
        
        // Require auth for admin routes
        if (path.startsWith('/admin') || 
            path.startsWith('/api/newsletters') ||
            path.startsWith('/api/payments') ||
            path.startsWith('/api/contacts')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

// Configure which routes trigger middleware
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}