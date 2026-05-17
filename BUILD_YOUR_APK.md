# 📱 Build Your Android APK - Complete Guide

## 🎯 Two Methods to Build APK

### Method A: Cloud Build (EASIEST - No Android Studio!) ⭐ RECOMMENDED
### Method B: Local Build (Requires Android Studio)

---

## ⭐ Method A: Cloud Build with Expo EAS (RECOMMENDED)

This is the **fastest and easiest** way to get your APK!

### What You Need:
- ✅ Node.js (already installed)
- ✅ Internet connection
- ✅ Free Expo account (create at expo.dev)

### Steps:

#### 1. Open Terminal and navigate to mobile folder:
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile"
```

#### 2. Install dependencies:
```bash
npm install
```
*Takes ~2 minutes*

#### 3. Build the web app:
```bash
npm run build
```
*Takes ~30 seconds*

#### 4. Install Expo EAS CLI globally:
```bash
npm install -g eas-cli
```
*Takes ~1 minute*

#### 5. Login to Expo (create free account if needed):
```bash
eas login
```
*Follow prompts to create account or login*

#### 6. Build APK in the cloud:
```bash
eas build -p android --profile preview
```

**What happens:**
- EAS will ask if you want to create a new project → Say **Yes**
- It uploads your code to Expo servers
- Builds the APK in the cloud (~10 minutes)
- Gives you a download link

#### 7. Download your APK:
- Click the link provided in terminal
- Or visit: https://expo.dev/accounts/[your-username]/projects/shiyaf-hotels/builds
- Download the APK file

#### 8. Share via WhatsApp:
- Send the APK file via WhatsApp
- Recipients can install directly!

### Total Time: ~15 minutes ⚡

---

## 🔧 Method B: Local Build with Android Studio

Use this if you want to build locally or need more control.

### What You Need:
- ✅ Node.js (already installed)
- ⏳ Android Studio (need to install - 5GB download)
- ⏳ Java JDK (comes with Android Studio)

### Steps:

#### 1. Install Android Studio:

**Download:** https://developer.android.com/studio

1. Download Android Studio for Mac
2. Open the `.dmg` file
3. Drag to Applications folder
4. Open Android Studio
5. Follow setup wizard
6. Install SDK components
7. Wait ~20 minutes for installation

#### 2. Open Terminal and navigate to mobile folder:
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile"
```

#### 3. Run the build script:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

This will:
- Install dependencies
- Build web app
- Initialize Capacitor
- Add Android platform
- Sync everything

#### 4. Open project in Android Studio:
```bash
npx cap open android
```

#### 5. Build APK in Android Studio:
1. Wait for Gradle sync to complete
2. Click **Build** menu
3. Click **Build Bundle(s) / APK(s)**
4. Click **Build APK(s)**
5. Wait 2-5 minutes
6. Click **locate** when done

#### 6. Find your APK:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

#### 7. Share via WhatsApp!

### Total Time: ~45 minutes (first time)

---

## 🔥 Quick Comparison

| Feature | Method A (Cloud) | Method B (Local) |
|---------|------------------|------------------|
| **Time** | ~15 minutes | ~45 minutes |
| **Disk Space** | ~500 MB | ~6 GB |
| **Android Studio** | Not needed ✅ | Required ⏳ |
| **Internet** | Required | Optional |
| **Difficulty** | Easy ⭐⭐⭐⭐⭐ | Medium ⭐⭐⭐ |
| **Best For** | Quick builds | Full control |

**Recommendation: Use Method A (Cloud Build)** 🚀

---

## ⚠️ Important: Backend Configuration

Before building, you need to update the backend URL in `app.js`.

### For Testing on Your Phone:

1. Find your Mac's IP address:
   - Open System Preferences
   - Click Network
   - Note your IP (e.g., 192.168.1.100)

2. Edit `mobile/app.js` line 1:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api/v1';
```

3. Make sure backend is running:
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/backend"
npm run dev
```

### For Production:

1. Deploy backend to a cloud service:
   - **Railway**: https://railway.app (easiest)
   - **Render**: https://render.com (free tier)
   - **Heroku**: https://heroku.com
   - **DigitalOcean**: https://digitalocean.com

2. Update `mobile/app.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api/v1';
```

3. Rebuild the APK

---

## 🎨 Optional: Customize App Icon

The app currently uses default icons. To customize:

1. Create a 1024x1024 PNG image with your hotel logo
2. Use this tool: https://icon.kitchen
3. Upload your logo
4. Download the icon pack
5. Replace files in `mobile/assets/` folder
6. Rebuild APK

---

## 🆘 Troubleshooting

### "npm install fails"
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### "eas command not found"
```bash
npm install -g eas-cli
# If still fails, try:
sudo npm install -g eas-cli
```

### "Build failed in EAS"
- Check your internet connection
- Make sure `package.json` is valid
- Try again: `eas build -p android --profile preview`

### "Android Studio won't open project"
- Make sure Gradle sync completed
- File > Invalidate Caches > Restart
- Try opening again

### "APK won't install on phone"
- Enable "Install from Unknown Sources" in phone settings
- Make sure Android version is 5.0 or higher

---

## ✅ Testing Your APK

### On Your Phone:

1. **Transfer APK to phone:**
   - Via WhatsApp
   - Via Email
   - Via USB cable
   - Via Google Drive

2. **Install:**
   - Open the APK file
   - Click "Install"
   - If blocked, enable "Unknown Sources"
   - Open the app

3. **Test:**
   - Select property (Plaza/Century)
   - View dashboard
   - Register a test guest
   - Check if data saves

### Backend Must Be Running:

Make sure your backend is accessible:
- If testing locally: Backend must run on your Mac
- If production: Backend must be deployed online

---

## 📦 APK Details

**File Name:** `app-debug.apk` (or `shiyaf-hotels.apk` from EAS)
**Size:** ~15-25 MB
**Min Android Version:** 5.0 (Lollipop)
**Permissions:**
- Camera (for photo capture)
- Storage (for documents)
- Network (for API calls)

---

## 🚀 Next Steps After Building APK

1. **Test thoroughly:**
   - Register guests
   - Upload photos
   - Check data in Supabase dashboard
   - Test on multiple devices

2. **Deploy backend to production:**
   - Choose a hosting service
   - Deploy backend code
   - Update API URL in app
   - Rebuild APK

3. **Distribute to staff:**
   - Share APK via WhatsApp groups
   - Create installation guide for staff
   - Train staff on app usage

4. **Monitor and improve:**
   - Collect feedback
   - Fix bugs
   - Add new features
   - Release updates

---

## 🎉 You're Ready!

Choose your method:
- **Quick & Easy:** Method A (Cloud Build) ⭐
- **Full Control:** Method B (Local Build)

Both methods produce the same APK that you can share via WhatsApp!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Read error messages carefully
3. Google the specific error
4. Check Expo documentation: https://docs.expo.dev
5. Check Capacitor documentation: https://capacitorjs.com

---

**Estimated Build Times:**
- Method A: 15 minutes ⚡
- Method B: 45 minutes (first time), 5 minutes (subsequent builds)

**Recommended:** Start with Method A to get your APK quickly! 🚀
