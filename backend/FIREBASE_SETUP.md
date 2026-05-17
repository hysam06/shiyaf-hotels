# 🔥 Firebase Configuration Guide

## You've Downloaded the Service Account JSON File - Now What?

### Step 1: Locate Your Downloaded File

The file is probably named something like:
- `shiyaf-hotels-xxxxx-firebase-adminsdk-xxxxx.json`

It's likely in your **Downloads** folder.

### Step 2: Extract the Credentials

Open the JSON file in a text editor and find these three values:

#### 1. Project ID
Look for: `"project_id"`
```json
"project_id": "shiyaf-hotels-12345"
```
Copy: `shiyaf-hotels-12345`

#### 2. Client Email
Look for: `"client_email"`
```json
"client_email": "firebase-adminsdk-abc@shiyaf-hotels-12345.iam.gserviceaccount.com"
```
Copy: `firebase-adminsdk-abc@shiyaf-hotels-12345.iam.gserviceaccount.com`

#### 3. Private Key
Look for: `"private_key"`
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
```
Copy the **entire value** including the quotes and `\n` characters.

### Step 3: Update Your .env File

Open `backend/.env` and replace these three values:

```env
# Replace this:
FIREBASE_PROJECT_ID=your-project-id-here

# With your actual project ID:
FIREBASE_PROJECT_ID=shiyaf-hotels-12345

# Replace this:
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# With your actual client email:
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@shiyaf-hotels-12345.iam.gserviceaccount.com

# Replace this:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# With your actual private key (keep the quotes!):
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Generate Security Keys

Generate a JWT secret and encryption key:

```bash
# Generate JWT secret (copy the output)
openssl rand -base64 32

# Generate encryption key (copy the output)
openssl rand -hex 16
```

Update in `.env`:
```env
JWT_SECRET=<paste-the-jwt-secret-here>
ENCRYPTION_KEY=<paste-the-encryption-key-here>
```

### Step 5: Secure the Service Account File

**IMPORTANT**: Keep the JSON file secure!

```bash
# Move it to a secure location (optional)
mkdir -p ~/.shiyaf-hotels
mv ~/Downloads/shiyaf-hotels-*-firebase-adminsdk-*.json ~/.shiyaf-hotels/

# Set restrictive permissions
chmod 600 ~/.shiyaf-hotels/*.json
```

**Never commit this file to Git!** (It's already in .gitignore)

### Step 6: Test the Connection

Once you've updated `.env`, test the Firebase connection:

```bash
cd backend
npm run dev
```

You should see:
```
🏨 Shiyaf Hotels Backend Server running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

### Quick Reference: What Goes Where

| Firebase JSON Field | .env Variable | Example |
|---------------------|---------------|---------|
| `project_id` | `FIREBASE_PROJECT_ID` | `shiyaf-hotels-12345` |
| `client_email` | `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-abc@...` |
| `private_key` | `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY...` |

### Troubleshooting

#### Error: "Invalid private key"
- Make sure you copied the **entire** private key including `-----BEGIN` and `-----END`
- Make sure the key is wrapped in **double quotes**
- Make sure the `\n` characters are preserved

#### Error: "Project not found"
- Double-check the `project_id` matches exactly
- Make sure you're using the correct Firebase project

#### Error: "Permission denied"
- Make sure the service account has the correct permissions
- In Firebase Console, go to IAM & Admin and verify the service account has "Firebase Admin" role

### Need Help?

If you're stuck, you can:
1. Check the Firebase Console for any error messages
2. Verify your credentials are correct
3. Make sure Firebase services (Firestore, Storage, Auth) are enabled

---

**Next Step**: Once Firebase is configured, we'll set up the Firebase service in the backend code!
