// test-at.mjs
// Test Africa's Talking credentials (ESM version)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnv();

const AT_API_KEY = process.env.AFRICAS_TALKING_API_KEY;
const AT_USERNAME = process.env.AFRICAS_TALKING_USERNAME || 'sandbox';

console.log('Testing Africa\'s Talking credentials...');
console.log('API Key:', AT_API_KEY ? AT_API_KEY.substring(0, 10) + '...' : 'MISSING');
console.log('Username:', AT_USERNAME || 'MISSING');
console.log('Full API Key:', AT_API_KEY); // For debugging only - remove later

async function testCredentials() {
  try {
    // Test user info endpoint
    const response = await fetch(`https://api.africastalking.com/version1/user?username=${AT_USERNAME}`, {
      method: 'GET',
      headers: {
        'apiKey': AT_API_KEY || '',
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Authentication successful!');
      console.log('User data:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Authentication failed!');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (response.status === 401) {
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Go to https://account.africastalking.com/');
        console.log('2. Click on "Apps" → "Sandbox" (for testing)');
        console.log('3. Copy the API Key from the sandbox app');
        console.log('4. Make sure username is "sandbox"');
        console.log('5. Update your .env file');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCredentials();