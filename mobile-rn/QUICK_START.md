# 🚀 Quick Start Guide

## Get Your App Running in 5 Minutes!

---

## Step 1: Install Dependencies (1 minute)

```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile-rn"
npm install
```

---

## Step 2: Start Development Server (30 seconds)

```bash
npm start
```

You'll see a QR code in the terminal!

---

## Step 3: Test on Your Phone (2 minutes)

### iPhone:
1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan the QR code
4. App opens in Expo Go!

### Android:
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Scan the QR code
4. App opens!

---

## Step 4: Test the App (2 minutes)

1. **Login** with PIN: `1234`
2. **Select Property**: Plaza or Century
3. **View Dashboard**: See live stats
4. **Register Guest**: Fill the form
5. **View Guests**: See the list
6. **Search**: Try searching
7. **Checkout**: Checkout a guest

---

## 🎉 That's It!

Your app is running on your phone!

---

## 📦 Build APK (Optional)

Want to share the app? Build an APK:

```bash
# Install EAS CLI (one time)
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

Wait ~10-15 minutes, download APK from the link!

---

## 🔧 Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Build APK
eas build -p android --profile preview

# Build production APK
eas build -p android --profile production
```

---

## 🐛 Troubleshooting

### Can't scan QR code?
- Make sure phone and computer are on same WiFi
- Try pressing `w` in terminal to open in web browser

### App won't load?
```bash
npm start -- --clear
```

### Build fails?
```bash
rm -rf node_modules
npm install
```

---

## 📱 App Features

✅ PIN Login (1234)  
✅ Property Selection  
✅ Live Dashboard  
✅ Guest Registration  
✅ Guest List & Search  
✅ Guest Checkout  
✅ Offline Support  
✅ Pull to Refresh  

---

## 🎨 Design

- **Navy Blue** (#1A2744) - Primary color
- **Gold** (#C9A84C) - Accent color
- **Modern UI** - Touch-optimized
- **Smooth Animations** - 60 FPS

---

## 🔐 Default Credentials

- **Staff PIN**: `1234`
- **API URL**: `https://shiyaf-hotels-api.vercel.app/api/v1`

---

## 📚 Documentation

- `README.md` - Full documentation
- `MIGRATION_GUIDE.md` - Migration details
- `QUICK_START.md` - This file

---

## 🆘 Need Help?

1. Check `README.md` for detailed docs
2. Check `MIGRATION_GUIDE.md` for comparisons
3. Check Expo docs: https://docs.expo.dev/

---

**Happy Coding! 🎉**

