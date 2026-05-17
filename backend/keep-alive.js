// Keep-Alive Script for Render Free Tier
// This pings the backend every 10 minutes to keep it awake

const https = require('https');

const BACKEND_URL = 'https://shiyaf-hotels-backend.onrender.com/api/v1/health';

function ping() {
    https.get(BACKEND_URL, (res) => {
        console.log(`[${new Date().toISOString()}] Ping successful - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
    });
}

// Ping immediately
ping();

// Ping every 10 minutes (600000 ms)
setInterval(ping, 600000);

console.log('Keep-alive service started. Pinging every 10 minutes...');
