// src/app/api/sms/status-callback/route.ts
// Africa's Talking Delivery Status Callback
// Receives delivery status updates for SMS messages

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AfricaTalkingCallback {
  id?: string;
  status?: string;
  phoneNumber?: string;
  networkCode?: string;
  failureReason?: string;
  retryCount?: number;
}

export async function POST(request: Request) {
  try {
    // Africa's Talking sends delivery status as JSON
    const body = await request.json() as AfricaTalkingCallback;
    
    console.log('📱 Africa\'s Talking Status Callback:', {
      body,
      timestamp: new Date().toISOString()
    });
    
    const messageId = body.id;
    const deliveryStatus = body.status;
    const failureReason = body.failureReason;
    
    // Map Africa's Talking status to our database status
    let smsStatus = 'SENT';
    if (deliveryStatus === 'Success' || deliveryStatus === 'Delivered') {
      smsStatus = 'DELIVERED';
    } else if (deliveryStatus === 'Failed' || deliveryStatus === 'Rejected' || deliveryStatus === 'Expired') {
      smsStatus = 'FAILED';
    }
    
    // Update the SMS notification record
    if (messageId) {
      const result = await prisma.smsNotification.updateMany({
        where: { 
          smsProviderId: messageId 
        },
        data: {
          smsStatus: smsStatus,
          errorMessage: failureReason || null
        }
      });
      
      console.log(`📱 Updated ${result.count} SMS notification record(s)`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Status callback error:', errorMessage);
    // Always return 200 to prevent retries
    return NextResponse.json({ received: true });
  }
}