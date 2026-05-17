# ✅ 3 Simple Steps to Complete Supabase Setup

I've done everything I can automatically. You just need to do these 3 quick things in your browser:

---

## Step 1: Create Storage Buckets (2 minutes)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click on your project: **"hysam06's Project"**
3. Click **"Storage"** in the left sidebar
4. Click **"New bucket"** button
5. Create first bucket:
   - Name: `guest-documents`
   - Public: **OFF** (uncheck it)
   - Click **"Create bucket"**
6. Click **"New bucket"** again
7. Create second bucket:
   - Name: `guest-photos`
   - Public: **OFF**
   - Click **"Create bucket"**

✅ Done! You should see 2 buckets now.

---

## Step 2: Create Database Table (1 minute)

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
3. **Copy the entire content** from this file:
   ```
   backend/supabase-setup.sql
   ```
4. **Paste it** into the SQL editor
5. Click **"Run"** button (or press Cmd+Enter)
6. You should see: "Table created successfully!" and "total_records: 1"

✅ Done! Your database table is ready.

---

## Step 3: Test Everything (30 seconds)

1. Open Terminal
2. Run:
   ```bash
   cd backend
   npm run dev
   ```
3. You should see:
   ```
   ✅ Supabase initialized successfully
   🏨 Shiyaf Hotels Backend Server running on port 3000
   ```
4. Open a NEW terminal and run:
   ```bash
   curl http://localhost:3000/api/v1/test-supabase
   ```
5. You should see:
   ```json
   {
     "success": true,
     "message": "Supabase connection successful!",
     "buckets": ["guest-documents", "guest-photos"]
   }
   ```

✅ Done! Everything is working!

---

## 🎉 That's It!

**Total time: ~3 minutes**

Once you see `"success": true`, we're ready to continue building the hotel registration features!

---

## 🆘 If Something Goes Wrong

### Can't find supabase-setup.sql file?
- It's in: `backend/supabase-setup.sql`
- Open it with any text editor
- Copy all the text
- Paste in Supabase SQL Editor

### SQL gives an error?
- Make sure you copied the ENTIRE file
- Make sure you're in the correct project
- Try running it again

### Test fails?
- Make sure both buckets are created
- Make sure SQL ran successfully
- Check that server is running (`npm run dev`)

---

**Let me know when you've completed these 3 steps!** 🚀
