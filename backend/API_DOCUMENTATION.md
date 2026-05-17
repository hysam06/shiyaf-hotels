# 🏨 Shiyaf Hotels API Documentation

Base URL: `http://localhost:3000/api/v1`

## 📋 Table of Contents

1. [Guest Registration](#guest-registration)
2. [Guest Management](#guest-management)
3. [Search & Filter](#search--filter)
4. [Dashboard Stats](#dashboard-stats)
5. [Error Handling](#error-handling)

---

## Guest Registration

### Create New Guest

**Endpoint**: `POST /api/v1/guests`

**Description**: Register a new guest for Plaza Residency or Century Residency

**Request Body**:
```json
{
  "property": "plaza",              // Required: "plaza" or "century"
  "guest_name": "Aboobacker K",     // Required
  "contact_number": "9446885395",   // Required: 10 digits
  "email": "guest@example.com",     // Optional: valid email
  "nationality": "Indian",          // Required
  "room_number": "205",             // Required
  "arrival_date": "2026-05-20",     // Required: YYYY-MM-DD
  
  // Optional fields
  "gstin": "22AAAAA0000A1Z5",
  "address": "123 Main Street",
  "po": "Malappuram",
  "city": "Malappuram",
  "pin": "673001",
  "date_of_birth": "1990-01-15",
  "state": "Kerala",
  
  // Stay details
  "conference_hall": false,
  "number_of_rooms": 1,
  "room_type": "S/AC",              // S/AC, S/Non-AC, Dbl/C, D/Non-AC, T/AC, T/Non-AC, Suite
  "number_of_guests_male": 1,
  "number_of_guests_female": 0,
  "number_of_guests_child": 0,
  "purpose_of_visit": "Business",
  "arrival_time": "14:00",
  "departure_date": "2026-05-25",
  "departure_time": "11:00",
  "vehicle_number": "KL-10-1234",
  
  // ID Proof
  "proof_type": "Aadhaar",          // DL, EID, Aadhaar, Passport, Voter ID
  "proof_number": "123456789012",
  "proof_date_of_issue": "2020-01-01",
  "proof_valid_till": "2030-01-01",
  "proof_place_of_issue": "Malappuram",
  
  // Payment
  "mode_of_payment": "Cash",        // Cash, Paytm, Credit Card, UPI, Other
  "advance_payment": 2000,
  "tariff": 2000,
  "total_amount": 2000,
  "food_included": true,
  "water_included": true,
  "tea_included": true,
  
  // Device info (for offline sync)
  "device_id": "device-123"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "registration_number": "PLAZA-2026-0001",
    "property": "plaza",
    "guest_name": "Aboobacker K",
    "contact_number": "9446885395",
    "room_number": "205",
    "status": "checked_in",
    "created_at": "2026-05-17T12:00:00Z",
    ...
  },
  "message": "Guest registered successfully",
  "timestamp": "2026-05-17T12:00:00Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "contact_number",
        "message": "Invalid phone number format",
        "code": "INVALID_FORMAT"
      }
    ]
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

## Guest Management

### Get All Guests

**Endpoint**: `GET /api/v1/guests`

**Query Parameters**:
- `property` (optional): `plaza` or `century`
- `search` (optional): Search in name, phone, or room number
- `room_number` (optional): Filter by room number
- `status` (optional): `checked_in`, `checked_out`, `cancelled`
- `arrival_date_from` (optional): YYYY-MM-DD
- `arrival_date_to` (optional): YYYY-MM-DD
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example**:
```bash
GET /api/v1/guests?property=plaza&page=1&limit=10
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "registration_number": "PLAZA-2026-0001",
        "guest_name": "Aboobacker K",
        ...
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "total_pages": 5
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

### Get Single Guest

**Endpoint**: `GET /api/v1/guests/:id`

**Query Parameters**:
- `property` (optional): For additional security filtering

**Example**:
```bash
GET /api/v1/guests/uuid-here?property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "registration_number": "PLAZA-2026-0001",
    "property": "plaza",
    "guest_name": "Aboobacker K",
    ...
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Guest not found"
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

### Update Guest

**Endpoint**: `PUT /api/v1/guests/:id`

**Query Parameters**:
- `property` (optional): For additional security filtering

**Request Body**: Any fields from the create request (partial update)

**Example**:
```bash
PUT /api/v1/guests/uuid-here?property=plaza
Content-Type: application/json

{
  "purpose_of_visit": "Business Meeting",
  "departure_date": "2026-05-26"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "registration_number": "PLAZA-2026-0001",
    "purpose_of_visit": "Business Meeting",
    ...
  },
  "message": "Guest updated successfully",
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

### Check Out Guest

**Endpoint**: `POST /api/v1/guests/:id/checkout`

**Query Parameters**:
- `property` (optional): For additional security filtering

**Example**:
```bash
POST /api/v1/guests/uuid-here/checkout?property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "checked_out",
    "checked_out_at": "2026-05-17T12:00:00Z",
    ...
  },
  "message": "Guest checked out successfully",
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

### Delete Guest (Soft Delete)

**Endpoint**: `DELETE /api/v1/guests/:id`

**Query Parameters**:
- `property` (optional): For additional security filtering

**Example**:
```bash
DELETE /api/v1/guests/uuid-here?property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": null,
  "message": "Guest deleted successfully",
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

## Search & Filter

### Search Guests

**Endpoint**: `GET /api/v1/guests/search`

**Query Parameters**:
- `q` (required): Search term
- `property` (optional): Filter by property

**Example**:
```bash
GET /api/v1/guests/search?q=Aboobacker&property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "guest_name": "Aboobacker K",
        "contact_number": "9446885395",
        "room_number": "205",
        ...
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 50,
    "total_pages": 1
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

### Get Today's Guests

**Endpoint**: `GET /api/v1/guests/today`

**Query Parameters**:
- `property` (required): `plaza` or `century`

**Example**:
```bash
GET /api/v1/guests/today?property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "registration_number": "PLAZA-2026-0001",
      "guest_name": "Aboobacker K",
      "room_number": "205",
      "created_at": "2026-05-17T10:30:00Z",
      ...
    }
  ],
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

## Dashboard Stats

### Get Dashboard Statistics

**Endpoint**: `GET /api/v1/guests/stats`

**Query Parameters**:
- `property` (required): `plaza` or `century`

**Example**:
```bash
GET /api/v1/guests/stats?property=plaza
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "total_guests_today": 5,
    "rooms_occupied": 8,
    "departures_today": 3,
    "new_check_ins_today": 5
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  },
  "timestamp": "2026-05-17T12:00:00Z"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `INVALID_PROPERTY` | 400 | Property must be "plaza" or "century" |
| `MISSING_SEARCH_TERM` | 400 | Search term is required |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Testing the API

### Using cURL

```bash
# Create a guest
curl -X POST http://localhost:3000/api/v1/guests \
  -H "Content-Type: application/json" \
  -d '{
    "property": "plaza",
    "guest_name": "Test Guest",
    "contact_number": "9876543210",
    "nationality": "Indian",
    "room_number": "101",
    "arrival_date": "2026-05-20"
  }'

# Get all guests
curl http://localhost:3000/api/v1/guests?property=plaza

# Get dashboard stats
curl http://localhost:3000/api/v1/guests/stats?property=plaza
```

### Using the Test Script

```bash
cd backend
./test-api.sh
```

---

## Property Scoping

All endpoints support property-based data scoping:

- **Plaza Residency**: `property=plaza`
- **Century Residency**: `property=century`

When `property` parameter is provided:
- Only data for that property is returned
- Prevents cross-property data access
- Enhances security and data isolation

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Window**: 60 seconds
- **Response**: 429 Too Many Requests

---

## Next Steps

1. ✅ Guest registration working
2. ⏳ Add image upload endpoints
3. ⏳ Add authentication middleware
4. ⏳ Add WhatsApp integration
5. ⏳ Add PDF generation

---

**API Version**: 1.0.0  
**Last Updated**: May 2026
