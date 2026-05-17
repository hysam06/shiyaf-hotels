# 🚀 Getting Started with Shiyaf Hotels Guest Registration System

Welcome! This guide will help you get the project up and running.

## ✅ Task 1 Progress: Project Setup

### What's Been Completed

#### ✅ Backend Setup (Node.js/TypeScript)
- ✅ Project structure created
- ✅ `package.json` with all dependencies configured
- ✅ TypeScript configuration (`tsconfig.json`)
- ✅ Environment variables template (`.env.example`)
- ✅ ESLint configuration for code quality
- ✅ Jest configuration for testing
- ✅ Basic Express server with security middleware
- ✅ `.gitignore` for version control
- ✅ Comprehensive README with API documentation
- 🔄 Dependencies installation (in progress)

#### ✅ Mobile App Preparation (Flutter)
- ✅ Directory structure created
- ✅ Comprehensive setup guide (`mobile/SETUP.md`)
- ⏳ Flutter installation required (see instructions below)

#### ✅ Documentation
- ✅ Main project README
- ✅ Backend README with API docs
- ✅ Mobile setup guide
- ✅ This getting started guide

### Project Structure Created

```
shiyaf-hotels/
├── backend/                    ✅ Complete
│   ├── src/
│   │   └── index.ts           # Express server entry point
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript config
│   ├── jest.config.js         # Test configuration
│   ├── .eslintrc.json         # Linting rules
│   ├── .env.example           # Environment template
│   ├── .gitignore             # Git ignore rules
│   └── README.md              # Backend documentation
│
├── mobile/                     ⏳ Needs Flutter
│   └── SETUP.md               # Flutter setup guide
│
├── .kiro/                      ✅ Spec files
│   └── specs/
│       └── hotel-guest-registration/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
├── README.md                   ✅ Main documentation
└── GETTING_STARTED.md         ✅ This file
```

## 📋 Next Steps

### Step 1: Complete Backend Setup

The backend dependencies are currently installing. Once complete:

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your credentials (see below)
nano .env  # or use your preferred editor

# Start development server
npm run dev
```

The server will start on `http://localhost:3000`

### Step 2: Install Flutter

Flutter is required for the mobile app. Follow these steps:

#### Option A: Using Homebrew (Recommended for macOS)

```bash
# Install Flutter
brew install --cask flutter

# Verify installation
flutter doctor
```

#### Option B: Manual Installation

1. Download Flutter SDK from https://flutter.dev/docs/get-started/install/macos
2. Extract and add to PATH:

```bash
export PATH="$PATH:$HOME/flutter/bin"
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
source ~/.zshrc
```

3. Run Flutter doctor:

```bash
flutter doctor
```

4. Follow any instructions to install missing dependencies

### Step 3: Set Up Firebase

1. Go to https://console.firebase.google.com
2. Create a new project: "Shiyaf Hotels"
3. Enable these services:
   - ✅ Firestore Database
   - ✅ Firebase Storage
   - ✅ Firebase Authentication

4. Create a service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

5. Add credentials to `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Step 4: Set Up WhatsApp Business API

#### Option A: Meta WhatsApp Business Cloud API (Free tier)

1. Go to https://developers.facebook.com
2. Create a Meta Business account
3. Set up WhatsApp Business API
4. Get your API token and phone number ID
5. Create two WhatsApp groups:
   - Plaza Residency Staff
   - Century Residency Staff
6. Add the WhatsApp bot to both groups
7. Get group IDs and add to `.env`:

```env
WHATSAPP_API_TOKEN=your-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
PLAZA_WHATSAPP_GROUP_ID=120363XXXXXXXXXX@g.us
CENTURY_WHATSAPP_GROUP_ID=120363YYYYYYYYYY@g.us
```

#### Option B: Twilio WhatsApp API (Easier setup, paid)

1. Sign up at https://www.twilio.com
2. Get WhatsApp sandbox credentials
3. Configure in `.env`

### Step 5: Create Flutter Project

```bash
cd mobile

# Create Flutter project
flutter create --org com.shiyafhotels --project-name shiyaf_hotels_app .

# Install dependencies (after updating pubspec.yaml)
flutter pub get
```

See `mobile/SETUP.md` for detailed Flutter setup instructions.

### Step 6: Configure Firebase for Mobile

1. In Firebase Console, add Android app:
   - Package name: `com.shiyafhotels.shiyaf_hotels_app`
   - Download `google-services.json`
   - Place in `mobile/android/app/`

2. Add iOS app:
   - Bundle ID: `com.shiyafhotels.shiyafHotelsApp`
   - Download `GoogleService-Info.plist`
   - Place in `mobile/ios/Runner/`

### Step 7: Test the Setup

#### Test Backend

```bash
cd backend
npm run dev

# In another terminal, test the API
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-17T..."
}
```

#### Test Mobile App

```bash
cd mobile
flutter doctor  # Verify setup
flutter run     # Run on emulator/device
```

## 🔑 Required Credentials Checklist

Before you can run the full system, you'll need:

- [ ] Firebase Project ID
- [ ] Firebase Service Account credentials
- [ ] JWT Secret (generate a random string)
- [ ] WhatsApp API Token
- [ ] WhatsApp Phone Number ID
- [ ] Plaza Residency WhatsApp Group ID
- [ ] Century Residency WhatsApp Group ID
- [ ] Encryption Key (32 characters)

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend

# Start dev server (auto-reload)
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

### Mobile Development

```bash
cd mobile

# Run on Android
flutter run

# Run on iOS
flutter run -d ios

# Run tests
flutter test

# Build APK
flutter build apk --release
```

## 📚 Key Documentation

- **Main README**: [README.md](README.md) - Project overview
- **Backend README**: [backend/README.md](backend/README.md) - API documentation
- **Mobile Setup**: [mobile/SETUP.md](mobile/SETUP.md) - Flutter installation
- **Requirements**: [.kiro/specs/hotel-guest-registration/requirements.md](.kiro/specs/hotel-guest-registration/requirements.md)
- **Design**: [.kiro/specs/hotel-guest-registration/design.md](.kiro/specs/hotel-guest-registration/design.md)
- **Tasks**: [.kiro/specs/hotel-guest-registration/tasks.md](.kiro/specs/hotel-guest-registration/tasks.md)

## 🎯 Current Status

### ✅ Completed (Task 1)
- Project structure
- Backend configuration
- Documentation
- Environment setup templates

### 🔄 In Progress
- Backend dependencies installation
- Flutter installation (user action required)

### ⏳ Next Tasks (Task 2)
- Implement data models (Dart & TypeScript)
- Add validation services
- Write property-based tests

## 🆘 Troubleshooting

### Backend Issues

**Problem**: Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Port 3000 already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Flutter Issues

**Problem**: Flutter command not found
```bash
# Add to PATH
export PATH="$PATH:$HOME/flutter/bin"
```

**Problem**: Flutter doctor shows issues
```bash
# Follow the specific instructions from flutter doctor
flutter doctor -v
```

### Firebase Issues

**Problem**: Authentication errors
- Verify service account credentials in `.env`
- Check that Firebase services are enabled
- Ensure service account has proper permissions

## 📞 Support

**Shiyaf Hotels Group**  
Thangal's Shopping Complex, Down Hill, Malappuram

- **Phone**: 0483 2735395
- **Mobile**: 9446885395

## 🎉 Ready to Code?

Once you've completed the setup steps above, you're ready to start implementing features!

The next task (Task 2) is to implement the core data models. See the task list for details:

```bash
# View task list
cat .kiro/specs/hotel-guest-registration/tasks.md
```

Happy coding! 🚀
