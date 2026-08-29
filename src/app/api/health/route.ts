// src/app/api/health/route.ts
// This endpoint keeps the database connection alive
// Can be called by uptime monitors to prevent Neon from sleeping

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    return NextResponse.json({
      ok: true,
      message: 'Database connection healthy',
      timestamp: new Date().toISOString(),
      database_time: (result as any)[0]?.current_time || null
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      ok: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}