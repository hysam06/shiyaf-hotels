# 🏨 Shiyaf Hotels - Guest Registration System

## 📱 Get Your Android APK in 15 Minutes!

---

## 🎯 What You Have

A complete hotel guest registration system with:

✅ **Backend API** - Fully functional with Supabase database  
✅ **Mobile App** - Beautiful, responsive, ready to build  
✅ **Two Properties** - Plaza Residency & Century Residency (separate data)  
✅ **All Features** - Registration, dashboard, search, statistics  
✅ **Documentation** - Complete guides for everything  

---

## 🚀 Build Your APK Now - 3 Simple Steps!

### Step 1: Open Terminal

Press `Cmd + Space`, type "Terminal", press Enter

### Step 2: Copy & Paste These Commands

```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile"
npm install
npm run build
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

### Step 3: Download Your APK

After ~10 minutes, you'll get a download link. Click it and download your APK!

**That's it! Share via WhatsApp! 🎉**

---

## 📚 Need More Details?

### Quick Guides:
- **`BUILD_YOUR_APK.md`** ⭐ - Complete build guide (2 methods)
- **`APK_BUILD_READY.md`** - What's ready and next steps
- **`mobile/COMMANDS.txt`** - All commands in one place
- **`mobile/QUICK_START.md`** - Quick reference

### Technical Docs:
- **`backend/API_DOCUMENTATION.md`** - All API endpoints
- **`mobile/BUILD_APK_GUIDE.md`** - Detailed build instructions
- **`TASK3_COMPLETE.md`** - What's been completed

---

## ⚠️ Before Building - Important!

### Update Backend URL for Phone Testing

1. **Find your Mac's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   You'll see something like: `inet 192.168.1.100`

2. **Edit `mobile/app.js` line 17:**
   ```javascript
   // Change from:
   const API_BASE_URL = 'http://localhost:3000/api/v1';
   
   // To (use YOUR IP):
   const API_BASE_URL = 'http://192.168.1.100:3000/api/v1';
   ```

3. **Start your backend:**
   ```bash
   cd "/Users/hysam/Desktop/projects/shiyaf hotels/backend"
   npm run dev
   ```

---

## 🎯 Two Ways to Build

### Method A: Cloud Build ⭐ RECOMMENDED

**Time:** 15 minutes  
**Needs:** Just Node.js (you have it!)  
**No Android Studio required!**

Commands above use this method.

### Method B: Local Build

**Time:** 45 minutes  
**Needs:** Android Studio (5GB download)  
**More control, but slower**

See `BUILD_YOUR_APK.md` for instructions.

---

## 📱 After Building

### 1. Test Your APK
- Transfer to your Android phone
- Install (enable "Unknown Sources" if needed)
- Open app
- Select property
- Register a test guest

### 2. Share with Staff
- Send APK via WhatsApp
- Staff can install directly
- No Google Play Store needed!

### 3. Deploy to Production
- Deploy backend to Railway/Render
- Update API URL in `app.js`
- Rebuild APK
- Distribute new version

---

## 🔥 Quick Command Reference

### Build APK (Cloud):
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile"
npm install && npm run build
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

### Start Backend:
```bash
cd "/Users/hysam/Desktop/projects/shiyaf hotels/backend"
npm run dev
```

### Find Your IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

## ✅ Project Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete & Running |
| Database (Supabase) | ✅ Configured |
| Mobile App | ✅ Complete |
| Build Scripts | ✅ Ready |
| Documentation | ✅ Complete |
| **APK** | ⏳ **Ready to Build!** |

---

## 🎨 App Features

### For Staff:
- ✅ Select property (Plaza/Century)
- ✅ View live dashboard statistics
- ✅ Register new guests (all fields)
- ✅ Upload photos & documents
- ✅ Search guests
- ✅ View guest details
- ✅ Professional hotel design

### Technical:
- ✅ Auto-generated registration numbers
- ✅ Data validation
- ✅ Secure storage (Supabase)
- ✅ Offline-capable
- ✅ Property data separation
- ✅ RESTful API
- ✅ Mobile-optimized

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

### "Can't connect to backend"
- Make sure backend is running: `npm run dev` in backend folder
- Check API URL in `mobile/app.js`
- Use your Mac's IP, not localhost

### "APK won't install"
- Enable "Install from Unknown Sources" on phone
- Make sure Android version is 5.0+

---

## 📞 Support Resources

- **Expo Docs:** https://docs.expo.dev
- **Capacitor Docs:** https://capacitorjs.com
- **Supabase Docs:** https://supabase.com/docs
- **Your Supabase Dashboard:** https://supabase.com/dashboard

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just run the commands above and you'll have your APK in 15 minutes!

**Start here:**
1. Open Terminal
2. Run the commands from "Build APK (Cloud)" section above
3. Wait for build to complete
4. Download APK
5. Share via WhatsApp!

---

## 📋 What's Next?

### Immediate (Today):
- [ ] Build APK using cloud build
- [ ] Test on your phone
- [ ] Share with one staff member for testing

### This Week:
- [ ] Deploy backend to production (Railway/Render)
- [ ] Update API URL in app
- [ ] Rebuild APK with production URL
- [ ] Distribute to all staff

### Later:
- [ ] Customize app icon with hotel logo
- [ ] Add WhatsApp integration for reports
- [ ] Collect feedback from staff
- [ ] Add new features as needed

---

## 🏆 Success Checklist

- [ ] Backend running (`npm run dev` in backend folder)
- [ ] Updated API URL in `mobile/app.js` (use your Mac's IP)
- [ ] Ran build commands
- [ ] Created Expo account
- [ ] Build completed successfully
- [ ] Downloaded APK
- [ ] Tested on phone
- [ ] Shared with staff

---

**Ready? Open Terminal and start building! 🚀**

**Estimated time: 15 minutes**

**Questions? Check `BUILD_YOUR_APK.md` for detailed instructions!**

---

Made with ❤️ for Shiyaf Hotels
