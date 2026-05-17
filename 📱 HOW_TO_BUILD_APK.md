# 📱 How to Build Your Android APK

## 🎯 I've Created Everything You Need!

Your app is **100% ready** to build. I can't run Terminal commands directly, but I've created simple guides for you to follow.

---

## ⭐ EASIEST METHOD - One Command

### Step 1: Create Expo Account (1 minute)
Go to: **https://expo.dev/signup**
- Enter your email
- Create a password
- Verify email
- Done!

### Step 2: Open Terminal
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

### Step 3: Copy & Paste This ONE Command

Open the file: **`ONE_COMMAND_BUILD.txt`**

Copy the entire command and paste it in Terminal!

---

## 📋 STEP-BY-STEP METHOD

If the one command doesn't work, use this:

Open the file: **`COPY_PASTE_THIS.txt`**

It has all commands separated step-by-step. Just copy each one and paste in Terminal.

---

## 📁 Files I Created For You

### To Build APK:
- **⭐ START_HERE_TO_BUILD_APK.txt** - Read this first!
- **ONE_COMMAND_BUILD.txt** - Single command to build
- **COPY_PASTE_THIS.txt** - Step-by-step commands
- **RUN_THIS.sh** - Automated script (make executable first)

### Documentation:
- **START_HERE.md** - Complete overview
- **BUILD_YOUR_APK.md** - Detailed guide
- **APK_BUILD_READY.md** - Status summary
- **TASK4_COMPLETE.md** - What was completed

### In mobile folder:
- **mobile/README.md** - Mobile app info
- **mobile/QUICK_START.md** - Quick reference
- **mobile/COMMANDS.txt** - All commands
- **mobile/build-apk.sh** - Build script

---

## ⚡ Quick Summary

**What you need to do:**

1. ✅ Create Expo account (https://expo.dev/signup)
2. ✅ Open Terminal
3. ✅ Copy commands from `ONE_COMMAND_BUILD.txt`
4. ✅ Paste in Terminal
5. ✅ Wait ~15 minutes
6. ✅ Download APK!

**That's it!** 🎉

---

## 🎯 What Happens When You Run Commands

1. **npm install** - Downloads all required packages (~2 min)
2. **npm run build** - Builds your web app (~30 sec)
3. **npm install -g eas-cli** - Installs build tool (~1 min)
4. **eas login** - You login with Expo account
5. **eas build** - Builds APK in cloud (~10 min)
6. **Download link** - Click and download your APK!

---

## 📱 What You'll Get

- **File:** `shiyaf-hotels.apk`
- **Size:** ~15-25 MB
- **Works on:** Android 5.0 and above
- **Share via:** WhatsApp, Email, USB, Drive

---

## ⚠️ Important Notes

### Backend URL
Before building, you might want to update the backend URL in `mobile/app.js` line 17:

```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

**For testing on phone:**
- Find your Mac's IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Change to: `http://YOUR_IP:3000/api/v1`

**For production:**
- Deploy backend to cloud
- Change to: `https://your-backend-url.com/api/v1`

### Backend Must Be Running
When testing the app, make sure backend is running:
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/backend"
npm run dev
```

---

## 🆘 Troubleshooting

### "npm install fails"
```bash
npm cache clean --force
npm install
```

### "eas command not found"
```bash
sudo npm install -g eas-cli
```

### "Permission denied"
Add `sudo` before the command:
```bash
sudo npm install -g eas-cli
```

### "Build failed"
- Check internet connection
- Make sure you're logged in: `eas whoami`
- Try again: `eas build -p android --profile preview`

---

## ✅ Checklist

Before building:
- [ ] Created Expo account at expo.dev
- [ ] Opened Terminal
- [ ] Have internet connection
- [ ] Backend is running (for testing)

After building:
- [ ] Downloaded APK
- [ ] Transferred to phone
- [ ] Installed on phone
- [ ] Tested the app
- [ ] Shared with staff

---

## 🎉 You're All Set!

Everything is ready. Just follow the commands in **`ONE_COMMAND_BUILD.txt`** or **`COPY_PASTE_THIS.txt`**!

**Estimated time: 15-20 minutes total**

---

## 📞 Need More Help?

Read these files:
1. **START_HERE.md** - Complete overview
2. **BUILD_YOUR_APK.md** - Detailed instructions
3. **COPY_PASTE_THIS.txt** - Exact commands

---

**Ready? Open Terminal and start! 🚀**

The APK is just a few commands away!
