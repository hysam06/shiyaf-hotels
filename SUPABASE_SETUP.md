# 🚀 Supabase Setup - Quick Guide

## ✅ What You Need to Do After Creating Your Project

### Step 1: Get Your Credentials from Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **⚙️ Settings** (bottom of left sidebar)
3. Click **"API"**
4. Copy these 3 values:

#### Value 1: Project URL
```
Look for: "Project URL"
Example: https://abcdefghijk.supabase.co
```

#### Value 2: anon public key
```
Look for: "Project API keys" → "anon" → "public"
It's a long string starting with: eyJ...
Click the copy icon
```

#### Value 3: service_role key
```
Look for: "Project API keys" → "service_role"
Click "Reveal" first
Then copy the long string starting with: eyJ...
⚠️ Keep this secret!
```

---

### Step 2: Update Your .env File

Open `backend/.env` and fill in these values:

```env
# Replace these with your actual Supabase credentials:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=your-database-password
```

**Also keep these (already generated):**
```env
JWT_SECRET=<your-generated-value>
ENCRYPTION_KEY=<your-generated-value>
```

---

### Step 3: Install Supabase Package

Open Terminal:

```bash
cd backend
npm install @supabase/supabase-js
```

---

### Step 4: Test the Connection

Start the server:

```bash
npm run dev
```

You should see:
```
✅ Supabase initialized successfully
📦 Project URL: https://xxxxx.supabase.co
🗄️  Database and Storage ready
🏨 Shiyaf Hotels Backend Server running on port 3000
```

Test the API (in a new terminal):

```bash
curl http://localhost:3000/api/v1/test-supabase
```

Expected response:
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "database": "Connected",
  "storage": "Connected",
  "buckets": ["guest-documents", "guest-photos"]
}
```

---

## ✅ Success Checklist

- [ ] Created Supabase account
- [ ] Created project (waited for setup to complete)
- [ ] Created storage buckets: `guest-documents` and `guest-photos`
- [ ] Created database table: `guest_records`
- [ ] Copied 3 credentials from Settings → API
- [ ] Updated `backend/.env` with credentials
- [ ] Ran `npm install @supabase/supabase-js`
- [ ] Started server with `npm run dev`
- [ ] Tested with curl command
- [ ] Saw `"success": true` in response

---

## 🎉 All Done?

Once the test passes, you're ready to continue building features!

**Next steps:**
- Implement data models
- Build registration API
- Create Flutter mobile app

---

## 🆘 Troubleshooting

### Error: "Missing Supabase credentials"
- Check that all 3 values are in `.env`
- Make sure there are no extra spaces
- Make sure you saved the `.env` file

### Error: "Invalid API key"
- Double-check you copied the full key
- Make sure you're using `service_role` key (not `anon` key) for SUPABASE_SERVICE_KEY
- Try revealing and copying again

### Error: "relation guest_records does not exist"
- Go to Supabase Dashboard → Table Editor
- Make sure you created the `guest_records` table
- Check the table name is exactly `guest_records` (lowercase, underscore)

---

**Need help?** Check the values in Supabase Dashboard → Settings → API
