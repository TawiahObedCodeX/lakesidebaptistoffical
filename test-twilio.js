// test-twilio.js - Save and run with: node test-twilio.mjs
// NOTE: Save this file with .mjs extension for ES module support

import twilio from 'twilio';

// Replace with YOUR actual values from .env
const ACCOUNT_SID = 'your_real_account_sid_here';
const AUTH_TOKEN = 'your_real_auth_token_here';
const FROM_PHONE = 'your_twilio_phone_number_here';
const TO_PHONE = '+233539526814'; // Your church number

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function testSms() {
  try {
    const message = await client.messages.create({
      body: '✅ Test SMS from Lakeside Baptist Church - Twilio is working!',
      from: FROM_PHONE,
      to: TO_PHONE,
    });
    console.log('✅ SUCCESS! SMS sent. Check your phone.');
    console.log('Message SID:', message.sid);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

testSms();