# Shiyaf Hotels Backend Service

Backend API for the Hotel Guest Registration System (Plaza Residency & Century Residency).

**Live URL:** https://shiyaf-hotels-api.vercel.app  
**API Base:** https://shiyaf-hotels-api.vercel.app/api/v1

## Tech Stack

- **Runtime:** Node.js v20+
- **Framework:** Express.js (TypeScript)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (private buckets, signed URLs)
- **Auth:** JWT (admin / manager roles)
- **Hosting:** Vercel (serverless)

## Setup

```bash
npm install
cp .env.example .env   # fill in your Supabase credentials
npm run dev            # starts on http://localhost:3000
npm run build          # production build
```

## Key Endpoints

| Method | Path                          | Description              |
|--------|-------------------------------|--------------------------|
| POST   | /api/v1/auth/login            | Login (returns JWT)      |
| POST   | /api/v1/guests                | Create guest             |
| GET    | /api/v1/guests                | List guests (by property)|
| GET    | /api/v1/guests/today          | Today's guests           |
| GET    | /api/v1/guests/search?q=      | Search guests            |
| PUT    | /api/v1/guests/:id            | Update guest / checkout  |
| DELETE | /api/v1/guests/:id            | Delete guest             |
| POST   | /api/v1/uploads/guest-photo   | Upload guest photo       |
| GET    | /api/v1/upload/guest-photo/:id| Get signed photo URL     |
| POST   | /api/v1/reports/daily         | Daily report             |

All endpoints (except login) require `Authorization: Bearer <token>` header.  
Query param `?property=plaza` or `?property=century` scopes data by property.

## Environment Variables

See `.env.example` for the full list.

## Testing

```bash
npm test
npm run lint
```

## Deployment

The backend is deployed to Vercel. Push to the `main` branch to trigger a redeploy, or use:

```bash
npx vercel --prod
```
