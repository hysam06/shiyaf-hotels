# 📱 Shiyaf Hotels Mobile App - React Native

**Modern React Native app built with Expo for guest registration management**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Run the App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or run directly on platform
npm run android  # For Android
npm run ios      # For iOS (Mac only)
```

### Test on Your Phone

1. Run `npm start`
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. App will load on your phone!

---

## 📦 Build APK for Android

### Option 1: EAS Build (Recommended - Cloud Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build APK
eas build -p android --profile preview
```

Wait ~10-15 minutes, then download the APK from the link provided!

### Option 2: Local Build

```bash
# Build locally (requires Android Studio)
npm run android -- --variant=release
```

---

## 🎯 Features

✅ **PIN Login** - Secure staff access (PIN: 1234)  
✅ **Property Selection** - Plaza or Century Residency  
✅ **Live Dashboard** - Real-time statistics  
✅ **Guest Registration** - Complete form with validation  
✅ **Guest List** - View all guests with search  
✅ **Guest Checkout** - One-tap checkout  
✅ **Offline Support** - Cached data for offline viewing  
✅ **Modern UI** - Beautiful, touch-optimized design  

---

## 🏗️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform & build service
- **TypeScript** - Type safety
- **React Navigation** - Navigation (ready to add)
- **Axios** - API communication
- **AsyncStorage** - Local data persistence

---

## 📁 Project Structure

```
mobile-rn/
├── App.tsx                      # Main app entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── src/
│   ├── config/
│   │   └── api.ts              # API configuration
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── theme/
│   │   ├── colors.ts           # Color palette
│   │   └── spacing.ts          # Spacing system
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── PropertySelectionScreen.tsx
│       ├── DashboardScreen.tsx
│       ├── RegistrationScreen.tsx
│       └── GuestsListScreen.tsx
└── assets/                      # Images, fonts, etc.
```

---

## 🎨 Design System

### Colors
- **Navy Blue** (#1A2744) - Primary
- **Gold** (#C9A84C) - Accent
- **White** (#FFFFFF) - Background
- **Success Green** (#4CAF50)
- **Error Red** (#F44336)

### Spacing
- Base unit: 8px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, XXL: 48px

### Typography
- System fonts (San Francisco on iOS, Roboto on Android)
- Sizes: 12px - 32px

---

## 🔧 Configuration

### Update API URL

Edit `src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://your-api-url.com/api/v1';
```

### Update App Details

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0"
  }
}
```

---

## 📱 Screens

### 1. Login Screen
- PIN entry (default: 1234)
- Secure authentication
- Persistent login

### 2. Property Selection
- Choose Plaza or Century Residency
- Beautiful card-based UI
- Logout option

### 3. Dashboard
- Live statistics (auto-refresh)
- Total guests, rooms occupied, departures, check-ins
- Quick action buttons
- Pull to refresh

### 4. Registration
- Complete guest form
- Real-time validation
- Dropdowns for selections
- Success confirmation

### 5. Guest List
- View all guests
- Search functionality
- Guest details popup
- One-tap checkout
- Status badges

---

## 🧪 Testing

### Test on Expo Go

1. Install Expo Go on your phone
2. Run `npm start`
3. Scan QR code
4. Test all features

### Test Checklist

- [ ] Login with PIN 1234
- [ ] Select property
- [ ] View dashboard stats
- [ ] Register new guest
- [ ] View guest list
- [ ] Search guests
- [ ] Checkout guest
- [ ] Test offline mode
- [ ] Test pull to refresh

---

## 🚀 Deployment

### Build for Production

```bash
# Build production APK
eas build -p android --profile production

# Build for iOS (requires Apple Developer account)
eas build -p ios --profile production
```

### Publish Updates (OTA)

```bash
# Publish update without rebuilding
eas update --branch production
```

---

## 🔐 Security

- PIN authentication
- Secure API communication (HTTPS)
- Input validation
- Error handling
- No sensitive data in logs

---

## 📊 Performance

- Fast startup time
- Smooth animations (60 FPS)
- Optimized images
- Cached data for offline
- Efficient re-renders

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and restart
npm start -- --clear
```

### Build fails
```bash
# Clean and reinstall
rm -rf node_modules
npm install
```

### Can't connect to API
- Check API URL in `src/config/api.ts`
- Ensure backend is running
- Check network connection

---

## 📚 Learn More

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Navigation](https://reactnavigation.org/)

---

## 🎯 Next Steps

### Recommended Enhancements

1. **Add React Navigation** - Better navigation flow
2. **Add Camera** - Photo capture for documents
3. **Add Push Notifications** - Guest check-in alerts
4. **Add Analytics** - Track usage
5. **Add Dark Mode** - Theme switching
6. **Add Biometric Auth** - Face ID / Fingerprint
7. **Add Offline Queue** - Sync when back online
8. **Add Reports** - Generate PDF reports

---

## 📞 Support

**Shiyaf Hotels**  
Plaza Residency & Century Residency  
Down Hill, Malappuram  
📞 0483 2735395 | 9446885395

---

## 📄 License

MIT License - Feel free to use and modify!

---

**Built with ❤️ using React Native & Expo**

