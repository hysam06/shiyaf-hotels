# Shiyaf Hotels - Guest Registration System

A complete hotel management system for Plaza Residency and Century Residency.

## Project Structure

```
shiyaf-hotels/
├── backend/          # Node.js/Express API (TypeScript)
│   ├── src/          # Source code
│   ├── package.json
│   └── tsconfig.json
├── mobile-rn/        # React Native (Expo) mobile app
│   ├── src/          # Source code
│   ├── android/      # Android native project
│   ├── ios/          # iOS native project
│   ├── App.tsx
│   └── package.json
└── README.md
```

## Quick Start

### Backend
- **Live URL:** https://shiyaf-hotels-api.vercel.app
- **API Base:** https://shiyaf-hotels-api.vercel.app/api/v1
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT-based (admin & manager roles)

### Mobile App
- **Platform:** React Native / Expo
- **Android APK:** Build via `eas build -p android --profile preview`

### Run Locally

**Backend:**
```bash
cd backend
cp .env.example .env   # fill in credentials
npm install
npm run dev
```

**Mobile:**
```bash
cd mobile-rn
npm install
npm start              # scan QR with Expo Go
```

## Credentials

| Role    | Email                    | Password  |
|---------|--------------------------|-----------|
| Admin   | admin@shiyafhotels.com   | admin123  |
| Manager | manager@shiyafhotels.com | manager123|

## Features

- Guest registration with photo upload
- Property management (Plaza / Century Residency)
- Live dashboard with KPI cards
- Guest list with search, filter, checkout
- Revenue reports, occupancy, average tariff
- Role-based access (admin / manager)
- Clean, mobile-optimized UI with SVG icons

## Environment Variables

See `backend/.env.example` for required variables.

---
