# Design Document: Hotel Guest Registration System

## Overview

The Hotel Guest Registration System is a full-stack mobile application that enables hotel staff to register guests digitally with offline-first capabilities. The system consists of three main components: a Flutter mobile application, a Node.js backend service, and Firebase infrastructure for data persistence and real-time synchronization. The architecture prioritizes offline functionality, data integrity, and seamless synchronization when connectivity is restored.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│                        (Flutter)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Registration │  │   Offline    │  │     Sync     │     │
│  │      UI      │  │   Storage    │  │    Engine    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/TLS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Service                           │
│                      (Node.js)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     API      │  │  Validation  │  │   WhatsApp   │     │
│  │   Gateway    │  │    Engine    │  │  Integration │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│  Firebase Store  │                  │ WhatsApp Business│
│  (Firestore/     │                  │   Cloud API      │
│   RTDB)          │                  │   (Meta)         │
└──────────────────┘                  └──────────────────┘
        │
        ▼
┌──────────────────┐
│ Firebase Storage │
│  (Documents)     │
└──────────────────┘
```

### Component Responsibilities

#### Mobile Application (Flutter)
- **Registration UI**: Multi-step form for capturing guest information
- **Offline Storage**: Local SQLite database for offline data persistence
- **Sync Engine**: Manages synchronization queue and retry logic
- **Image Management**: Camera integration, image compression, and preview
- **Network Monitor**: Tracks connectivity status and triggers sync operations

#### Backend Service (Node.js)
- **API Gateway**: RESTful endpoints for registration operations
- **Validation Engine**: Server-side validation of guest data
- **WhatsApp Integration**: Automated message sending via Meta API
- **Authentication**: JWT-based authentication and authorization
- **Logging**: Transaction logging and audit trail

#### Firebase Infrastructure
- **Firestore/RTDB**: Primary data store for guest records
- **Firebase Storage**: Document image storage with access control
- **Security Rules**: Role-based access control and data protection

## Data Models

### Guest Record

```typescript
interface GuestRecord {
  // Identifiers
  localId?: string;           // Client-generated UUID (offline)
  serverId?: string;          // Server-generated ID (after sync)
  deviceId: string;           // Source device identifier
  
  // Personal Information
  fullName: string;
  contactNumber: string;      // E.164 format recommended
  email: string;
  nationality: string;
  dateOfBirth: Date;
  
  // Document References
  documentImages: DocumentImage[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  syncStatus: SyncStatus;
  
  // WhatsApp Integration
  whatsappStatus?: WhatsAppStatus;
}

interface DocumentImage {
  localPath?: string;         // Local file path (offline)
  remoteUrl?: string;         // Firebase Storage URL (after sync)
  format: 'jpeg' | 'png';
  sizeBytes: number;
  capturedAt: Date;
  uploadedAt?: Date;
}

enum SyncStatus {
  PENDING = 'pending',
  SYNCING = 'syncing',
  SYNCED = 'synced',
  FAILED = 'failed'
}

interface WhatsAppStatus {
  messageId?: string;
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  errorMessage?: string;
}
```

### Sync Queue Item

```typescript
interface SyncQueueItem {
  id: string;                 // Queue item UUID
  guestRecordLocalId: string;
  operation: 'CREATE' | 'UPDATE';
  createdAt: Date;
  attempts: number;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  error?: string;
}
```

### Configuration

```typescript
interface AppConfiguration {
  whatsappTemplate: WhatsAppTemplate;
  customFields?: CustomField[];
  validationRules: ValidationRules;
}

interface WhatsAppTemplate {
  templateId: string;
  content: string;            // Template with {{variables}}
  variables: string[];        // ['guestName', 'hotelName', 'checkInDate']
}

interface CustomField {
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  validationRule?: string;    // Regex or validation function name
  options?: string[];         // For select fields
}
```

## Component Design

### Mobile Application Components

#### 1. Registration Form Component

**Responsibilities:**
- Multi-step form navigation
- Input validation
- Image capture and preview
- Form state management

**Key Methods:**
```dart
class RegistrationFormController {
  Future<void> captureDocument(ImageSource source);
  Future<bool> validateForm();
  Future<void> submitRegistration();
  void navigateToStep(int step);
  Future<void> recoverUnsavedData();
}
```

#### 2. Offline Storage Manager

**Responsibilities:**
- Local database operations
- Data encryption (AES-256)
- Sync queue management

**Key Methods:**
```dart
class OfflineStorageManager {
  Future<void> saveGuestRecord(GuestRecord record);
  Future<void> saveDocumentImage(String localId, File image);
  Future<List<SyncQueueItem>> getPendingSync();
  Future<void> markAsSynced(String localId, String serverId);
  Future<GuestRecord?> recoverLastSession();
}
```

#### 3. Sync Engine

**Responsibilities:**
- Network status monitoring
- Sync queue processing
- Retry logic with exponential backoff
- Conflict resolution

**Key Methods:**
```dart
class SyncEngine {
  void startNetworkMonitoring();
  Future<void> processSyncQueue();
  Future<void> syncGuestRecord(SyncQueueItem item);
  Future<void> retryFailedSync(SyncQueueItem item);
  Duration calculateBackoff(int attempts);
}
```

**Exponential Backoff Algorithm:**
```dart
Duration calculateBackoff(int attempts) {
  // Base delay: 2 seconds, max delay: 60 seconds
  final delaySeconds = min(2 * pow(2, attempts - 1), 60);
  return Duration(seconds: delaySeconds.toInt());
}
```

#### 4. Image Processor

**Responsibilities:**
- Image compression
- Format conversion
- Size validation
- Preview generation

**Key Methods:**
```dart
class ImageProcessor {
  Future<File> compressImage(File original, {int maxSizeBytes = 5 * 1024 * 1024});
  Future<bool> validateImageSize(File image);
  Future<Uint8List> generateThumbnail(File image);
}
```

### Backend Service Components

#### 1. API Gateway

**Endpoints:**

```typescript
// Registration endpoint
POST /api/v1/registrations
Headers: Authorization: Bearer <token>
Body: {
  guestRecord: GuestRecord,
  documents: File[]
}
Response: {
  serverId: string,
  syncedAt: Date
}

// Configuration endpoint
GET /api/v1/configuration
Response: AppConfiguration
```

#### 2. Validation Service

**Responsibilities:**
- Input validation
- Data sanitization
- Business rule enforcement

**Key Methods:**
```typescript
class ValidationService {
  validateGuestRecord(record: GuestRecord): ValidationResult;
  validateEmail(email: string): boolean;
  validatePhoneNumber(phone: string): boolean;
  sanitizeInput(input: string): string;
  validateCustomFields(data: any, rules: CustomField[]): ValidationResult;
}
```

**Validation Rules:**
```typescript
const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneNumber: /^\+?[0-9]{10,15}$/,
  requiredFields: ['fullName', 'contactNumber', 'email', 'nationality', 'dateOfBirth']
};
```

#### 3. WhatsApp Integration Service

**Responsibilities:**
- Message template rendering
- WhatsApp API communication
- Delivery status tracking
- Error handling

**Key Methods:**
```typescript
class WhatsAppService {
  async sendWelcomeMessage(guestRecord: GuestRecord): Promise<WhatsAppStatus>;
  renderTemplate(template: WhatsAppTemplate, data: any): string;
  async trackDeliveryStatus(messageId: string): Promise<string>;
}
```

**Message Template Example:**
```
Hello {{guestName}}! 👋

Welcome to {{hotelName}}! We're delighted to have you with us.

Your check-in has been confirmed for {{checkInDate}}.

If you need any assistance during your stay, please don't hesitate to reach out.

Enjoy your stay! 🏨
```

#### 4. Firebase Service

**Responsibilities:**
- Firestore operations
- Firebase Storage operations
- Transaction management
- Security rule enforcement

**Key Methods:**
```typescript
class FirebaseService {
  async saveGuestRecord(record: GuestRecord): Promise<string>;
  async uploadDocument(file: Buffer, metadata: any): Promise<string>;
  async getConfiguration(): Promise<AppConfiguration>;
  async logTransaction(transaction: TransactionLog): Promise<void>;
}
```

## Data Flow

### Registration Flow (Online)

```
1. User fills registration form
   ↓
2. Mobile app validates input
   ↓
3. User captures document images
   ↓
4. Mobile app compresses images
   ↓
5. Mobile app sends data to backend
   ↓
6. Backend validates data
   ↓
7. Backend stores record in Firestore
   ↓
8. Backend uploads images to Firebase Storage
   ↓
9. Backend triggers WhatsApp message
   ↓
10. Backend returns serverId to mobile app
   ↓
11. Mobile app displays success confirmation
```

### Registration Flow (Offline)

```
1. User fills registration form
   ↓
2. Mobile app validates input
   ↓
3. User captures document images
   ↓
4. Mobile app compresses images
   ↓
5. Mobile app encrypts and stores data locally
   ↓
6. Mobile app adds item to sync queue
   ↓
7. Mobile app displays success with offline indicator
   ↓
8. [Network becomes available]
   ↓
9. Sync engine processes queue
   ↓
10. Mobile app sends data to backend
   ↓
11. Backend processes and stores data
   ↓
12. Mobile app removes item from queue
   ↓
13. Mobile app updates UI to show synced status
```

### Sync Retry Flow

```
1. Sync attempt fails
   ↓
2. Sync engine increments attempt counter
   ↓
3. Sync engine calculates backoff delay
   ↓
4. Sync engine schedules retry
   ↓
5. [Wait for backoff period]
   ↓
6. Sync engine retries operation
   ↓
7. If attempts < 5: repeat from step 1
   ↓
8. If attempts >= 5: mark as failed, notify user
```

## Security Design

### Mobile Application Security

1. **Local Data Encryption**
   - AES-256 encryption for sensitive data in SQLite
   - Secure key storage using platform keychain (iOS Keychain, Android Keystore)
   - Encrypted document images in local storage

2. **Authentication**
   - JWT token-based authentication
   - Secure token storage
   - Automatic token refresh

3. **Input Validation**
   - Client-side validation before submission
   - Sanitization of user inputs

### Backend Security

1. **API Security**
   - HTTPS/TLS enforcement
   - JWT token validation on all endpoints
   - Rate limiting to prevent abuse

2. **Input Sanitization**
   - SQL injection prevention
   - XSS prevention
   - Command injection prevention

3. **Firebase Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestRecords/{recordId} {
      allow read: if request.auth != null && 
                     request.auth.token.role == 'staff';
      allow create: if request.auth != null && 
                       request.auth.token.role == 'staff';
      allow update: if request.auth != null && 
                       request.auth.token.role == 'admin';
    }
    
    match /configuration/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin';
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{documentId} {
      allow read: if request.auth != null && 
                     request.auth.token.role in ['staff', 'admin'];
      allow write: if request.auth != null && 
                      request.auth.token.role == 'staff' &&
                      request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## Error Handling

### Error Categories

1. **Validation Errors**
   - Invalid email format
   - Invalid phone number
   - Missing required fields
   - Document size exceeds limit

2. **Network Errors**
   - Connection timeout
   - Backend unreachable
   - DNS resolution failure

3. **Storage Errors**
   - Local storage full
   - Firebase quota exceeded
   - Permission denied

4. **Integration Errors**
   - WhatsApp API failure
   - Image processing failure

### Error Response Format

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Example error codes
const ErrorCodes = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  WHATSAPP_FAILED: 'WHATSAPP_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};
```

### Error Recovery Strategies

| Error Type | Recovery Strategy |
|------------|------------------|
| Network Error | Switch to offline mode, queue for sync |
| Validation Error | Display error message, allow correction |
| Storage Full | Prompt user to free space, sync pending items |
| WhatsApp Failure | Log error, continue registration (non-blocking) |
| Image Capture Failure | Allow retry, preserve other form data |
| Backend Unreachable | Automatic offline mode, retry with backoff |

## Performance Considerations

### Mobile Application

1. **Image Optimization**
   - Compress images to max 5MB
   - Use progressive JPEG encoding
   - Generate thumbnails for previews
   - Lazy load images in list views

2. **Database Optimization**
   - Index on syncStatus and createdAt
   - Batch operations for sync queue
   - Limit in-memory cache to 100MB

3. **Memory Management**
   - Release image resources after upload
   - Clear form data after successful submission
   - Implement pagination for guest list views

### Backend Service

1. **Request Processing**
   - Async/await for I/O operations
   - Connection pooling for Firebase
   - Request timeout: 30 seconds

2. **Concurrency**
   - Support 50+ concurrent connections
   - Queue-based processing for WhatsApp messages
   - Rate limiting: 100 requests/minute per device

3. **Caching**
   - Cache configuration data (TTL: 5 minutes)
   - Cache WhatsApp templates
   - Use Firebase local cache

### Firebase Configuration

1. **Indexing**
```javascript
// Firestore indexes
{
  "indexes": [
    {
      "collectionGroup": "guestRecords",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "deviceId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "guestRecords",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "syncStatus", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    }
  ]
}
```

2. **Storage Rules**
   - Automatic cleanup of orphaned images
   - Lifecycle policies for old documents

## Testing Strategy

The system will employ a dual testing approach:

1. **Unit Tests**: Verify specific examples, edge cases, and error conditions
2. **Property-Based Tests**: Verify universal properties across all inputs (minimum 100 iterations per property)

Property tests will reference design properties using the tag format:
**Feature: hotel-guest-registration, Property {number}: {property_text}**

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Minimum Document Requirement

*For any* registration attempt, the system SHALL prevent submission if no document image is provided.

**Validates: Requirements 1.2**

### Property 2: Multiple Document Support

*For any* valid number of document images (1 to N, where N ≤ 10), the system SHALL correctly store and associate all images with the guest record.

**Validates: Requirements 1.3**

### Property 3: Email Validation

*For any* string input in the email field, the validation SHALL correctly accept valid email formats (containing @ and domain) and reject invalid formats.

**Validates: Requirements 1.5**

### Property 4: Phone Number Validation

*For any* string input in the contact number field, the validation SHALL correctly accept numeric strings with optional + prefix and reject strings containing non-numeric characters (excluding the leading +).

**Validates: Requirements 1.6**

### Property 5: Mandatory Field Validation

*For any* registration form state, submission SHALL only be allowed when all mandatory fields (fullName, contactNumber, email, nationality, dateOfBirth) are populated with non-empty values.

**Validates: Requirements 1.7**

### Property 6: Validation Error Messages

*For any* validation failure scenario, the system SHALL display a non-empty error message to the user.

**Validates: Requirements 1.8**

### Property 7: Offline Registration Persistence

*For any* valid guest record created when network status is offline, the system SHALL store the guest data in local storage, store all document images in local storage, and add a corresponding entry to the sync queue.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 8: Network-Independent Registration

*For any* network status (online or offline), the system SHALL allow creation of new guest record entries.

**Validates: Requirements 2.5**

### Property 9: Local Identifier Uniqueness

*For any* set of guest records created in offline mode, all local identifiers SHALL be unique.

**Validates: Requirements 2.6**

### Property 10: Sync Queue Persistence

*For any* sync queue state, after application restart, the queue SHALL contain the same items that were present before restart.

**Validates: Requirements 2.7**

### Property 11: Sync Data Upload

*For any* item in the sync queue (guest record or document image), the system SHALL upload the data to the backend service during synchronization.

**Validates: Requirements 3.2, 3.3**

### Property 12: Sync Queue Chronological Processing

*For any* sync queue containing multiple items, the system SHALL process items in chronological order based on their creation timestamp.

**Validates: Requirements 3.4**

### Property 13: Successful Sync Removal

*For any* sync operation that completes successfully, the system SHALL remove the corresponding item from the sync queue.

**Validates: Requirements 3.5**

### Property 14: Sync Retry with Exponential Backoff

*For any* sync operation that fails, the system SHALL retry the operation with exponential backoff (delays: 2s, 4s, 8s, 16s, 32s) up to 5 attempts.

**Validates: Requirements 3.6**

### Property 15: Sync Progress Display

*For any* sync queue size N, the displayed pending item count SHALL equal N.

**Validates: Requirements 3.8**

### Property 16: Conflict Resolution

*For any* sync conflict scenario (local and server data differ), the system SHALL prioritize server data and create a log entry for the conflict.

**Validates: Requirements 3.9**

### Property 17: Backend Required Field Validation

*For any* guest record received by the backend, the system SHALL accept records containing all required fields and reject records missing any required field with a validation error response.

**Validates: Requirements 4.1**

### Property 18: Backend Data Storage

*For any* valid guest record received by the backend, the system SHALL store the guest data in Firebase Store and store all document images in Firebase Storage, and both SHALL be retrievable.

**Validates: Requirements 4.2, 4.3**

### Property 19: Server Identifier Uniqueness

*For any* set of guest records processed by the backend, all server-side identifiers SHALL be unique.

**Validates: Requirements 4.4**

### Property 20: Server Identifier Response

*For any* successfully stored guest record, the backend response SHALL contain a valid non-empty server-side identifier.

**Validates: Requirements 4.5**

### Property 21: Validation Error Response

*For any* invalid guest record submitted to the backend, the response SHALL contain an error code and specific validation failure details.

**Validates: Requirements 4.6**

### Property 22: Transaction Logging

*For any* registration transaction processed by the backend, a log entry SHALL exist containing a timestamp and source device identifier.

**Validates: Requirements 4.7**

### Property 23: WhatsApp Trigger

*For any* guest record successfully stored in Firebase Store, the backend SHALL trigger a WhatsApp message send operation.

**Validates: Requirements 5.1**

### Property 24: WhatsApp Message Content and Delivery

*For any* guest record, the WhatsApp message SHALL contain the guest's name and check-in confirmation details, and SHALL be sent to the contact number provided in the guest record.

**Validates: Requirements 5.3, 5.4**

### Property 25: WhatsApp Error Handling

*For any* WhatsApp API error, the backend SHALL log the error and the registration SHALL still complete successfully (non-blocking).

**Validates: Requirements 5.5**

### Property 26: WhatsApp Status Storage

*For any* WhatsApp message attempt, the delivery status SHALL be stored in Firebase Store.

**Validates: Requirements 5.6**

### Property 27: Document Image Preview

*For any* captured document image, the mobile app SHALL display a preview of the image.

**Validates: Requirements 6.1**

### Property 28: Image Compression

*For any* document image, the compressed file size SHALL be smaller than the original size and the image SHALL remain readable (not corrupted).

**Validates: Requirements 6.3**

### Property 29: Image Format Support

*For any* image in JPEG or PNG format, the system SHALL correctly process and store the image.

**Validates: Requirements 6.4**

### Property 30: Image Size Limit

*For any* document image, the final compressed file size SHALL not exceed 5MB.

**Validates: Requirements 6.6**

### Property 31: Save/Sync Visual Feedback

*For any* save or synchronization operation, the mobile app SHALL display visual feedback (loading indicator, progress bar, or status message).

**Validates: Requirements 7.2**

### Property 32: Local Data Encryption

*For any* sensitive data stored in local storage, the data SHALL be encrypted using AES-256 and SHALL be correctly decryptable.

**Validates: Requirements 8.1**

### Property 33: Input Sanitization

*For any* input containing potential injection payloads (SQL, XSS, command injection patterns), the backend SHALL sanitize the input such that the payload does not execute.

**Validates: Requirements 8.4**

### Property 34: Crash Recovery

*For any* registration session state at the time of application crash, the data SHALL be recoverable when the application restarts.

**Validates: Requirements 9.1**

### Property 35: Error Message Display

*For any* error scenario during registration, the mobile app SHALL display a non-empty user-friendly error message with suggested actions.

**Validates: Requirements 9.2**

### Property 36: Partial Failure Data Preservation

*For any* registration where document image capture fails, all other form data SHALL be preserved and remain accessible.

**Validates: Requirements 9.5**

### Property 37: Standardized Error Responses

*For any* backend error scenario, the response SHALL contain a standardized error code and error message.

**Validates: Requirements 9.6**

### Property 38: Error Logging

*For any* error that occurs in the mobile app, a log entry SHALL be created in local storage.

**Validates: Requirements 9.7**

### Property 39: Local Storage Performance

*For any* local data storage operation, the operation SHALL complete within 2 seconds.

**Validates: Requirements 10.1**

### Property 40: Online Submission Performance

*For any* online registration submission under normal network conditions (latency < 200ms, bandwidth > 1Mbps), the operation SHALL complete within 5 seconds.

**Validates: Requirements 10.2**

### Property 41: Backend Processing Performance

*For any* guest record submission, the backend processing SHALL complete within 3 seconds.

**Validates: Requirements 10.3**

### Property 42: Concurrent Request Support

*For any* set of 50 concurrent registration requests, the backend SHALL successfully process all requests without errors.

**Validates: Requirements 10.4**

### Property 43: Image Cache Memory Limit

*For any* set of cached document images, the total memory usage SHALL not exceed 100MB.

**Validates: Requirements 10.5**

### Property 44: Batch Processing for Large Queues

*For any* sync queue containing more than 20 items, the system SHALL process items in batches and memory usage SHALL remain bounded (not grow linearly with queue size).

**Validates: Requirements 10.7**

### Property 45: Multi-Device Concurrent Support

*For any* set of concurrent registration submissions from multiple mobile app instances, the backend SHALL successfully process all submissions.

**Validates: Requirements 11.1**

### Property 46: Concurrent Identifier Uniqueness

*For any* set of concurrent registrations from multiple devices, all guest records SHALL receive unique server-side identifiers.

**Validates: Requirements 11.3**

### Property 47: Device Identification

*For any* backend request from the mobile app, the request SHALL include a unique device identifier.

**Validates: Requirements 11.4**

### Property 48: Device Tracking

*For any* guest record stored in the backend, the record SHALL have an associated device identifier indicating which device created it.

**Validates: Requirements 11.5**

### Property 49: Custom Template Selection

*For any* backend configuration, if a custom WhatsApp template is configured, the system SHALL use the custom template; otherwise, the system SHALL use the default template.

**Validates: Requirements 12.1**

### Property 50: Template Variable Substitution

*For any* WhatsApp template containing variables (guestName, hotelName, checkInDate), the system SHALL correctly substitute all variables with corresponding values from the guest record.

**Validates: Requirements 12.3**

### Property 51: Custom Field Display

*For any* custom field configuration, the mobile app SHALL display those fields in the registration form.

**Validates: Requirements 12.4**

### Property 52: Custom Field Validation

*For any* custom field with configured validation rules, the backend SHALL validate the field data according to those rules and reject invalid data.

**Validates: Requirements 12.5**

## Deployment Architecture

### Mobile Application Deployment

- **Platform**: iOS (App Store) and Android (Google Play Store)
- **Minimum Versions**: iOS 13+, Android 8.0+
- **Distribution**: Enterprise distribution for hotel staff devices
- **Updates**: Over-the-air updates for non-breaking changes

### Backend Service Deployment

- **Platform**: Cloud hosting (AWS, Google Cloud, or Azure)
- **Container**: Docker container
- **Orchestration**: Kubernetes or Cloud Run
- **Scaling**: Horizontal auto-scaling based on CPU/memory
- **Regions**: Multi-region deployment for high availability

### Firebase Configuration

- **Project**: Dedicated Firebase project per environment (dev, staging, prod)
- **Firestore**: Multi-region configuration
- **Storage**: Regional buckets with lifecycle policies
- **Backup**: Daily automated backups

## Monitoring and Observability

### Metrics to Track

1. **Mobile App Metrics**
   - Registration completion rate
   - Offline registration percentage
   - Sync success rate
   - Average sync queue size
   - Image compression ratio
   - Crash rate

2. **Backend Metrics**
   - Request latency (p50, p95, p99)
   - Error rate by endpoint
   - WhatsApp delivery rate
   - Firebase operation latency
   - Concurrent connection count

3. **Business Metrics**
   - Daily registrations
   - Average registration time
   - Document upload success rate
   - WhatsApp message delivery rate

### Logging Strategy

1. **Mobile App Logs**
   - Local log storage (encrypted)
   - Log levels: ERROR, WARN, INFO, DEBUG
   - Automatic log upload on sync
   - Log retention: 7 days locally

2. **Backend Logs**
   - Structured JSON logging
   - Centralized log aggregation (CloudWatch, Stackdriver)
   - Log retention: 30 days
   - Alert on ERROR level logs

### Alerting

- Backend error rate > 5%
- WhatsApp delivery failure rate > 10%
- Average request latency > 5 seconds
- Sync failure rate > 15%
- Firebase quota approaching limit

## Future Enhancements

1. **Offline-First Improvements**
   - Conflict resolution UI for manual resolution
   - Differential sync for bandwidth optimization
   - Background sync using WorkManager (Android) / Background Tasks (iOS)

2. **Feature Additions**
   - OCR for automatic document data extraction
   - Facial recognition for guest verification
   - Multi-language support
   - Guest self-registration kiosk mode

3. **Integration Expansions**
   - SMS fallback for WhatsApp failures
   - Email confirmation integration
   - PMS (Property Management System) integration
   - Payment gateway integration

4. **Analytics**
   - Guest demographics dashboard
   - Registration trends and patterns
   - Staff performance metrics
   - Device usage analytics

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation

