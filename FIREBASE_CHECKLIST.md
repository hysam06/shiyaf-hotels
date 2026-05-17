# ✅ Firebase Setup Checklist

Follow these steps in order. Check off each step as you complete it.

## Part 1: Firebase Console Setup

### [ ] Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create a project"
3. Name: `Shiyaf Hotels` or `shiyaf-hotels`
4. Click Continue → Continue → Create project
5. Wait for creation, then click Continue

### [ ] Step 2: Enable Firestore Database
1. In left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Click Next
5. Select location: `asia-south1 (Mumbai)` or `asia-southeast1 (Singapore)`
6. Click Enable
7. Wait for database creation

### [ ] Step 3: Enable Firebase Storage
1. In left sidebar, click "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Click Next
5. Use same location as Firestore
6. Click Done

### [ ] Step 4: Enable Authentication
1. In left sidebar, click "Authentication"
2. Click "Get started"
3. Click on "Email/Password" provider
4. Toggle Enable to ON
5. Click Save

### [ ] Step 5: Download Service Account Key
1. Click ⚙️ gear icon (Settings) in left sidebar
2. Click "Project settings"
3. Go to "Service accounts" tab
4. Click "Generate new private key"
5. Click "Generate key" in popup
6. Save the downloaded JSON file securely
7. **Remember where you saved it!**

## Part 2: Backend Configuration

### [ ] Step 6: Open the Service Account JSON File
1. Find the downloaded file (probably in Downloads folder)
2. Open it with a text editor (TextEdit, VS Code, etc.)
3. Keep it open - you'll need to copy values from it

### [ ] Step 7: Update .env File
1. Open `backend/.env` in your editor
2. Find these three lines and update them:

```env
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

3. Copy values from your JSON file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes!)

### [ ] Step 8: Generate Security Keys
1. Open Terminal
2. Generate JWT secret:
   ```bash
   openssl rand -base64 32
   ```
3. Copy the output and paste it in `.env` as `JWT_SECRET`

4. Generate encryption key:
   ```bash
   openssl rand -hex 16
   ```
5. Copy the output and paste it in `.env` as `ENCRYPTION_KEY`

### [ ] Step 9: Save .env File
1. Make sure all values are filled in
2. Save the file
3. **Never share this file or commit it to Git!**

## Part 3: Test Firebase Connection

### [ ] Step 10: Start Backend Server
1. Open Terminal
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   ✅ Firebase initialized successfully
   📦 Project: your-project-id
   🔥 Firestore, Storage, and Auth services ready
   🏨 Shiyaf Hotels Backend Server running on port 3000
   ```

### [ ] Step 11: Test Firebase Connection
1. Open a new Terminal window
2. Test the API:
   ```bash
   curl http://localhost:3000/api/v1/test-firebase
   ```
3. You should see:
   ```json
   {
     "success": true,
     "message": "Firebase connection successful!",
     "firestore": "Connected",
     "data": { ... }
   }
   ```

### [ ] Step 12: Check Firebase Console
1. Go back to Firebase Console
2. Click "Firestore Database" in left sidebar
3. You should see a new collection called `_test`
4. Click on it to see the test document
5. **Success!** Firebase is working! 🎉

## Part 4: WhatsApp (Optional - Set Later)

### [ ] Step 13: WhatsApp Configuration (Skip for Now)
- Leave `WHATSAPP_ENABLED=false` in `.env`
- You can set up WhatsApp later
- The app will work without it
- Daily reports will be generated but not sent until WhatsApp is configured

## Troubleshooting

### ❌ Error: "Missing Firebase credentials"
- Check that all three Firebase variables in `.env` are filled in
- Make sure there are no extra spaces
- Make sure the private key is wrapped in quotes

### ❌ Error: "Invalid private key"
- Copy the entire private key including `-----BEGIN` and `-----END`
- Make sure `\n` characters are preserved
- Keep the double quotes around the key

### ❌ Error: "Project not found"
- Double-check the project ID matches exactly
- Make sure you're using the correct Firebase project

### ❌ Server won't start
- Make sure you ran `npm install` in the backend folder
- Check for any error messages in the terminal
- Make sure port 3000 is not already in use

## ✅ All Done?

If all steps are checked and the test passed, you're ready to continue with development!

**Next**: We'll implement the data models and start building the registration features.

---

**Need Help?**
- Check `backend/FIREBASE_SETUP.md` for detailed instructions
- Review the error messages in the terminal
- Make sure all Firebase services are enabled in the console
