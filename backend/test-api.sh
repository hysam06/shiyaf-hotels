#!/bin/bash

# Shiyaf Hotels API Test Script
# Tests all guest registration endpoints

BASE_URL="http://localhost:3000/api/v1"

echo "🧪 Testing Shiyaf Hotels API"
echo "================================"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s $BASE_URL/../health | jq '.'
echo ""

# Test 2: API Info
echo "2️⃣  Testing API Info..."
curl -s $BASE_URL | jq '.'
echo ""

# Test 3: Create Guest (Plaza Residency)
echo "3️⃣  Creating Guest Registration (Plaza)..."
GUEST_RESPONSE=$(curl -s -X POST $BASE_URL/guests \
  -H "Content-Type: application/json" \
  -d '{
    "property": "plaza",
    "guest_name": "Aboobacker K",
    "contact_number": "9446885395",
    "email": "aboobacker@example.com",
    "nationality": "Indian",
    "room_number": "205",
    "arrival_date": "2026-05-20",
    "room_type": "S/AC",
    "mode_of_payment": "Cash",
    "advance_payment": 2000,
    "tariff": 2000
  }')

echo $GUEST_RESPONSE | jq '.'
GUEST_ID=$(echo $GUEST_RESPONSE | jq -r '.data.id')
echo "Guest ID: $GUEST_ID"
echo ""

# Test 4: Get Guest by ID
echo "4️⃣  Getting Guest by ID..."
curl -s "$BASE_URL/guests/$GUEST_ID?property=plaza" | jq '.'
echo ""

# Test 5: Get All Guests
echo "5️⃣  Getting All Guests (Plaza)..."
curl -s "$BASE_URL/guests?property=plaza&limit=5" | jq '.'
echo ""

# Test 6: Get Today's Guests
echo "6️⃣  Getting Today's Guests (Plaza)..."
curl -s "$BASE_URL/guests/today?property=plaza" | jq '.'
echo ""

# Test 7: Get Dashboard Stats
echo "7️⃣  Getting Dashboard Stats (Plaza)..."
curl -s "$BASE_URL/guests/stats?property=plaza" | jq '.'
echo ""

# Test 8: Search Guests
echo "8️⃣  Searching Guests..."
curl -s "$BASE_URL/guests/search?q=Aboobacker&property=plaza" | jq '.'
echo ""

# Test 9: Update Guest
echo "9️⃣  Updating Guest..."
curl -s -X PUT "$BASE_URL/guests/$GUEST_ID?property=plaza" \
  -H "Content-Type: application/json" \
  -d '{
    "purpose_of_visit": "Business Meeting"
  }' | jq '.'
echo ""

# Test 10: Checkout Guest
echo "🔟 Checking Out Guest..."
curl -s -X POST "$BASE_URL/guests/$GUEST_ID/checkout?property=plaza" | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "To run individual tests:"
echo "  curl http://localhost:3000/api/v1/guests"
echo "  curl http://localhost:3000/api/v1/guests/stats?property=plaza"
