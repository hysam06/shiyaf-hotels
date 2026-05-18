# 🏨 Shiyaf Hotels - Guest Registration System

A complete hotel management system for Plaza Residency and Century Residency.

---

## 📱 Project Structure

```
shiyaf-hotels/
├── backend/              # Node.js/Express API
├── mobile/               # Mobile app (Capacitor)
├── README.md            # This file
└── DEPLOYMENT_STATUS.md # Current deployment info
```

---

## 🚀 Quick Start

### Backend (Already Deployed)
- **URL:** https://shiyaf-hotels-api.vercel.app
- **Status:** ✅ Live on Vercel
- **Database:** Supabase

### Mobile App
- **APK:** `Shiyaf-Hotels-App-v2.apk` on Desktop
- **Status:** ✅ Ready to install
- **Platform:** Android 5.0+

---

## 🔧 Development

### Run Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Run Mobile App Locally
```bash
cd mobile
npm install
npm run dev
```

### Build APK
```bash
cd mobile
npm run build
npx cap sync
cd android
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ~/Desktop/Shiyaf-Hotels-App.apk
```

---

## 📚 Documentation

- **Backend API:** `backend/API_DOCUMENTATION.md`
- **Deployment:** `DEPLOYMENT_STATUS.md`
- **Mobile README:** `mobile/README.md`

---

## 🔑 Environment Variables

See `backend/.env.example` for required variables.

**Current Setup:**
- Backend: Vercel
- Database: Supabase
- Storage: Supabase Storage

---

## ✨ Features

- ✅ Guest registration
- ✅ Property management (Plaza/Century)
- ✅ Dashboard statistics
- ✅ Search and filter
- ✅ Auto-generated registration numbers
- ✅ Data validation
- ✅ Mobile-optimized UI

---

## 📞 Support

For issues or questions, check `DEPLOYMENT_STATUS.md` for current status and URLs.

---

**Made for Shiyaf Hotels** 🏨
