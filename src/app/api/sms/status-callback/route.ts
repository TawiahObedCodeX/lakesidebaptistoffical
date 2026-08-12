// src/app/api/sms/status-callback/route.ts
// Twilio Status Callback - Receives delivery status updates for SMS messages

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Twilio sends delivery status as form data
    const formData = await request.formData();
    
    const messageSid = formData.get('MessageSid') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const errorCode = formData.get('ErrorCode') as string;
    
    console.log('📱 Twilio Status Callback:', {
      messageSid,
      messageStatus,
      errorCode: errorCode || 'None',
      timestamp: new Date().toISOString()
    });
    
    // Map Twilio status to our database status
    let smsStatus = 'SENT';
    if (messageStatus === 'delivered') {
      smsStatus = 'DELIVERED';
    } else if (['failed', 'undelivered'].includes(messageStatus)) {
      smsStatus = 'FAILED';
    }
    
    // Update the SMS notification record
    if (messageSid) {
      await prisma.smsNotification.updateMany({
        where: { twilioSid: messageSid },
        data: {
          smsStatus: smsStatus,
          errorMessage: errorCode ? `Twilio Error ${errorCode}: ${formData.get('ErrorMessage') || 'Unknown error'}` : null
        }
      });
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Status callback error:', error);
    // Always return 200 to Twilio to prevent retries
    return NextResponse.json({ received: true });
  }
}