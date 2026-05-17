# 🏨 Shiyaf Hotels Guest Registration System

A modern, offline-first mobile application for hotel guest check-in and registration, replacing the traditional paper-based Guest Registration Card system.

## 🏢 Properties

- **Plaza Residency**
- **Century Residency**

**Location**: Thangal's Shopping Complex, Down Hill, Malappuram  
**Contact**: Ph: 0483 2735395 | Mob: 9446885395

## ✨ Features

### Core Functionality
- ✅ Digital guest registration with comprehensive form
- 📸 Guest photo capture
- 🪪 ID proof document upload (front & back)
- ✍️ Digital signature capture
- 🏨 Multi-property support (Plaza & Century Residency)
- 🔐 Property-scoped data (separate PINs and data per property)

### Offline Capabilities
- 📴 Full offline registration support
- 💾 Local SQLite storage with AES-256 encryption
- 🔄 Automatic sync when connection returns
- 📊 Sync queue with exponential backoff retry

### WhatsApp Integration
- 📱 Automated daily reports at 11 PM
- 📤 Manual report sending
- 📎 PDF attachments with guest details
- 🔔 Separate WhatsApp groups per property

### Additional Features
- 🔍 Search and filter guests
- 🛏️ Room management with occupancy status
- 📄 PDF generation (daily sheets + individual cards)
- 📈 Dashboard with occupancy statistics
- 🔒 Role-based access control
- 🎨 Modern luxury hotel aesthetic UI

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile App** | Flutter (Dart) |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | Firebase Firestore |
| **Storage** | Firebase Storage |
| **Authentication** | Firebase Auth + JWT |
| **WhatsApp** | Meta WhatsApp Business Cloud API |
| **PDF Generation** | PDFKit (backend) + flutter_pdf (mobile) |
| **Offline Storage** | SQLite with AES-256 encryption |

## 📁 Project Structure

```
shiyaf-hotels/
├── backend/              # Node.js/TypeScript backend service
│   ├── src/
│   │   ├── index.ts
│   │   ├── models/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── mobile/               # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── services/
│   │   ├── screens/
│   │   └── widgets/
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   └── SETUP.md
│
├── .kiro/                # Kiro spec files
│   └── specs/
│       └── hotel-guest-registration/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+ (for backend)
- **Flutter** SDK (for mobile app)
- **Firebase** account
- **WhatsApp Business** API access
- **macOS** (for iOS development)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Mobile App Setup

```bash
cd mobile
# Follow the setup guide to install Flutter first
```

See [mobile/SETUP.md](mobile/SETUP.md) for detailed Flutter installation and setup instructions.

## 🎨 Design Specifications

### Color Palette
- **Primary**: #1A2744 (Deep Navy)
- **Accent**: #C9A84C (Gold)
- **Background**: #F8F6F1 (Warm Off-white)
- **Card**: #FFFFFF (White)
- **Success**: #2E7D32 (Green)
- **Error**: #C62828 (Red)

### Typography
- **Headings**: Playfair Display
- **Body**: Lato / Nunito

### UI Style
Modern luxury hotel aesthetic with smooth animations, card-based layouts, and intuitive navigation.

## 📱 App Screens

1. **Property Selection** - Choose Plaza or Century Residency
2. **PIN Login** - 4-digit PIN per property (with fingerprint option)
3. **Dashboard** - Occupancy stats, quick actions
4. **Guest Registration** - Multi-section form with:
   - Guest Details (name, contact, address, etc.)
   - Stay Details (room, dates, guests count)
   - ID Proof (type, number, photos)
   - Payment (mode, amount, tariff)
   - Media (photo, ID proof, signature)
5. **Guest List** - Search, filter, view records
6. **Room Management** - Occupancy status, room details
7. **Reports** - Daily reports, WhatsApp sending
8. **Settings** - Configuration, PIN change, backup

## 🔐 Security Features

- ✅ AES-256 encryption for local data
- ✅ HTTPS/TLS for all API communication
- ✅ JWT-based authentication
- ✅ Property-scoped sessions (12-hour expiry)
- ✅ Rate limiting (100 req/min)
- ✅ Input sanitization (SQL, XSS, command injection prevention)
- ✅ Firebase security rules
- ✅ Encrypted ID numbers at rest

## 📊 Registration Number Format

- **Plaza Residency**: `PLAZA-YYYY-XXXX`
- **Century Residency**: `CNTRY-YYYY-XXXX`

Auto-generated based on property and year.

## 📲 WhatsApp Daily Report

Sent automatically at 11:00 PM (or manually triggered):

```
🏨 *Shiyaf Hotels — Plaza Residency*
📅 Daily Report — 17 May 2026
━━━━━━━━━━━━━━━━━━━━━━━━
✅ Total Check-ins Today: 5
🚪 Departures Today: 3
🛏️ Rooms Occupied: 8/20

*New Registrations:*
1. Guest Name — Room 205 — ₹2000 — Cash
...

💰 Total Revenue Today: ₹XXXX
━━━━━━━━━━━━━━━━━━━━━━━━
📎 Full sheet attached as PDF
```

## 🎯 Performance Targets

- ⚡ Local storage: < 2 seconds
- ⚡ Online submission: < 5 seconds
- ⚡ Backend processing: < 3 seconds
- ⚡ Concurrent users: 50+
- 📦 APK size: < 80 MB

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

### Mobile Tests
```bash
cd mobile
flutter test
```

## 📦 Building for Production

### Android APK
```bash
cd mobile
flutter build apk --release --target-platform android-arm64
# APK: build/app/outputs/flutter-apk/app-release.apk
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

Deploy to Railway, Render, or Google Cloud Run (see backend/README.md).

## 📋 Implementation Status

See [.kiro/specs/hotel-guest-registration/tasks.md](.kiro/specs/hotel-guest-registration/tasks.md) for detailed task list and progress.

### Completed
- ✅ Project structure setup
- ✅ Backend configuration
- ✅ Documentation

### In Progress
- 🔄 Data models implementation
- 🔄 Mobile app UI
- 🔄 Offline storage

### Upcoming
- ⏳ Sync engine
- ⏳ WhatsApp integration
- ⏳ PDF generation

## 🤝 Contributing

This is a private project for Shiyaf Hotels Group. For internal development guidelines, see the task list in `.kiro/specs/`.

## 📄 License

MIT License - Copyright (c) 2026 Shiyaf Hotels Group

## 📞 Support

**Shiyaf Hotels Group**  
Thangal's Shopping Complex, Down Hill, Malappuram

- **Phone**: 0483 2735395
- **Mobile**: 9446885395

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: In Development
