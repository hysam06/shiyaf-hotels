# Shiyaf Hotels Backend Service

Backend API service for the Hotel Guest Registration System supporting Plaza Residency and Century Residency properties.

## Features

- 🔐 JWT-based authentication
- 🔥 Firebase Firestore integration
- 📱 WhatsApp Business Cloud API integration
- 🖼️ Image upload and storage
- 🔄 Multi-property data scoping
- 📊 Daily report generation
- 🔒 AES-256 encryption for sensitive data
- ⚡ Rate limiting and security hardening

## Tech Stack

- **Runtime**: Node.js v20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth + JWT
- **WhatsApp**: Meta WhatsApp Business Cloud API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `JWT_SECRET` - Secret key for JWT token signing
- `WHATSAPP_API_TOKEN` - WhatsApp Business API token
- `PLAZA_WHATSAPP_GROUP_ID` - WhatsApp group ID for Plaza Residency
- `CENTURY_WHATSAPP_GROUP_ID` - WhatsApp group ID for Century Residency

### 3. Set Up Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Firebase Authentication
5. Download service account credentials
6. Add credentials to `.env` file

### 4. Set Up WhatsApp Business API

1. Create a Meta Business account
2. Set up WhatsApp Business API
3. Get your API token and phone number ID
4. Create WhatsApp groups for each property
5. Add the bot to both groups
6. Get group IDs and add to `.env`

### 5. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Registration
```
POST /api/v1/registrations
Headers: Authorization: Bearer <token>
Body: multipart/form-data with guest record and images
```

### Configuration
```
GET /api/v1/configuration
Headers: Authorization: Bearer <token>
```

### Rooms
```
GET /api/v1/rooms/available?property=plaza
POST /api/v1/rooms
```

### Reports
```
POST /api/v1/reports/daily?property=plaza
GET /api/v1/reports/date/:date?property=plaza
```

### Guests
```
GET /api/v1/guests?property=plaza
GET /api/v1/guests/:id
GET /api/v1/guests/today?property=plaza
GET /api/v1/guests/search?q=query&property=plaza
PUT /api/v1/guests/:id
DELETE /api/v1/guests/:id
```

## Property Scoping

All endpoints support property-based data scoping using the `property` query parameter:
- `property=plaza` - Plaza Residency
- `property=century` - Century Residency

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Linting

```bash
npm run lint
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration files
│   ├── models/               # Data models and interfaces
│   ├── services/             # Business logic services
│   │   ├── firebase.service.ts
│   │   ├── validation.service.ts
│   │   ├── whatsapp.service.ts
│   │   └── encryption.service.ts
│   ├── routes/               # API route handlers
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   └── utils/                # Utility functions
├── dist/                     # Compiled JavaScript (generated)
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## Security Considerations

- All API endpoints require authentication
- Rate limiting: 100 requests per minute per IP
- Input sanitization to prevent injection attacks
- HTTPS/TLS required in production
- Sensitive data encrypted at rest
- Firebase security rules enforced
- CORS configured for specific origins

## Deployment

### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
1. Connect your GitHub repository
2. Create a new Web Service
3. Set environment variables
4. Deploy

### Option 3: Google Cloud Run
```bash
# Build Docker image
docker build -t shiyaf-hotels-backend .

# Deploy to Cloud Run
gcloud run deploy shiyaf-hotels-backend --image shiyaf-hotels-backend
```

## Monitoring

- Health check endpoint: `/health`
- Logs: Check console output or configure log aggregation
- Metrics: Monitor request latency, error rates, and throughput

## Support

For issues or questions, contact: Shiyaf Hotels Group
- Phone: 0483 2735395
- Mobile: 9446885395
- Location: Thangal's Shopping Complex, Down Hill, Malappuram

## License

MIT License - Copyright (c) 2026 Shiyaf Hotels Group
