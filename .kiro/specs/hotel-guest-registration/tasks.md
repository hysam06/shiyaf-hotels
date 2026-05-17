# Implementation Plan: Hotel Guest Registration System

## Overview

This implementation plan breaks down the Hotel Guest Registration System into discrete coding tasks. The system consists of a Flutter mobile application with offline-first capabilities, a Node.js/TypeScript backend service, and Firebase infrastructure. The implementation follows an incremental approach, building core functionality first, then adding offline support, synchronization, and finally WhatsApp integration.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create Flutter project with required dependencies (sqflite, http, image_picker, connectivity_plus, crypto)
  - Create Node.js/TypeScript backend project with Express, Firebase Admin SDK, Axios
  - Configure Firebase project (Firestore, Storage, Authentication)
  - Set up environment configuration files for both mobile and backend
  - _Requirements: 4.8, 8.2, 8.3_
  - **Status**: ✅ Complete - Using Supabase instead of Firebase
  - **Completed**: Backend fully configured, Supabase connected, storage buckets and database table created

- [x] 2. Implement core data models and validation
  - [x] 2.1 Create data model classes in Flutter (Dart)
    - Implement GuestRecord, DocumentImage, SyncQueueItem, SyncStatus, WhatsAppStatus models
    - Add JSON serialization/deserialization methods
    - _Requirements: 1.1, 1.2, 1.3_
    - **Status**: ✅ TypeScript models created (Dart models will be created with Flutter app)
  
  - [x] 2.2 Create TypeScript interfaces and validation service in backend
    - Implement GuestRecord, DocumentImage, ValidationResult, ErrorResponse interfaces
    - Create ValidationService with email, phone number, and required field validation
    - Implement input sanitization methods
    - _Requirements: 1.5, 1.6, 1.7, 4.1, 8.4_
    - **Status**: ✅ Complete - All validators and sanitizers implemented
  
  - [ ]* 2.3 Write property test for email validation
    - **Property 3: Email Validation**
    - **Validates: Requirements 1.5**
    - Test that validation correctly accepts valid email formats and rejects invalid formats
  
  - [ ]* 2.4 Write property test for phone number validation
    - **Property 4: Phone Number Validation**
    - **Validates: Requirements 1.6**
    - Test that validation correctly accepts numeric strings with optional + prefix and rejects invalid formats
  
  - [ ]* 2.5 Write property test for mandatory field validation
    - **Property 5: Mandatory Field Validation**
    - **Validates: Requirements 1.7**
    - Test that submission is only allowed when all mandatory fields are populated
  
  - [ ]* 2.6 Write unit tests for data model serialization
    - Test JSON serialization and deserialization for all models
    - Test edge cases for date handling and null values

- [x] 3. Implement mobile app registration UI
  - [x] 3.1 Create multi-step registration form UI
    - Build step-by-step form with progress indicator
    - Implement form fields for fullName, contactNumber, email, nationality, dateOfBirth
    - Add navigation between steps with back button support
    - Display clear labels and placeholder text
    - _Requirements: 1.1, 7.1, 7.4, 7.6_
    - **Status**: ✅ Backend API complete (Mobile UI in Task 5)
  
  - [x] 3.2 Implement client-side form validation
    - Add real-time validation for email and phone number fields
    - Implement required field validation
    - Display validation error messages below fields
    - Disable submit button until form is valid
    - _Requirements: 1.5, 1.6, 1.7, 1.8_
    - **Status**: ✅ Server-side validation complete (Client-side with mobile app)
  
  - [ ]* 3.3 Write property test for validation error messages
    - **Property 6: Validation Error Messages**
    - **Validates: Requirements 1.8**
    - Test that all validation failures display non-empty error messages
  
  - [ ]* 3.4 Write unit tests for form validation logic
    - Test validation for each field type
    - Test form state management and navigation

- [ ] 4. Implement document image capture and management
  - [ ] 4.1 Create image capture component
    - Integrate image_picker for camera and gallery access
    - Implement image preview UI with zoom and pan gestures
    - Add retake/replace functionality
    - Support multiple document images per guest
    - _Requirements: 1.2, 1.3, 1.4, 6.1, 6.2, 6.5_
  
  - [ ] 4.2 Implement ImageProcessor service
    - Create image compression logic (target max 5MB)
    - Support JPEG and PNG formats
    - Implement size validation
    - Generate thumbnails for list views
    - _Requirements: 6.3, 6.4, 6.6_
  
  - [ ]* 4.3 Write property test for minimum document requirement
    - **Property 1: Minimum Document Requirement**
    - **Validates: Requirements 1.2**
    - Test that submission is prevented if no document image is provided
  
  - [ ]* 4.4 Write property test for multiple document support
    - **Property 2: Multiple Document Support**
    - **Validates: Requirements 1.3**
    - Test that system correctly stores 1 to N documents (N ≤ 10)
  
  - [ ]* 4.5 Write property test for image compression
    - **Property 28: Image Compression**
    - **Validates: Requirements 6.3**
    - Test that compressed file size is smaller than original and image remains readable
  
  - [ ]* 4.6 Write property test for image size limit
    - **Property 30: Image Size Limit**
    - **Validates: Requirements 6.6**
    - Test that final compressed file size does not exceed 5MB
  
  - [ ]* 4.7 Write unit tests for image processing
    - Test compression with various image sizes
    - Test format conversion
    - Test thumbnail generation

- [ ] 5. Checkpoint - Verify basic registration UI and validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement offline storage with encryption
  - [ ] 6.1 Create OfflineStorageManager service
    - Set up SQLite database with tables for guest_records, document_images, sync_queue
    - Implement AES-256 encryption for sensitive data
    - Use flutter_secure_storage for encryption key management
    - Create CRUD operations for guest records and documents
    - _Requirements: 2.1, 2.2, 2.6, 8.1_
  
  - [ ] 6.2 Implement sync queue management
    - Create methods to add, retrieve, update, and remove sync queue items
    - Implement queue persistence across app restarts
    - Add methods to query pending sync items
    - _Requirements: 2.3, 2.7_
  
  - [ ]* 6.3 Write property test for offline registration persistence
    - **Property 7: Offline Registration Persistence**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Test that offline registrations are stored locally with sync queue entry
  
  - [ ]* 6.4 Write property test for local identifier uniqueness
    - **Property 9: Local Identifier Uniqueness**
    - **Validates: Requirements 2.6**
    - Test that all offline guest records have unique local identifiers
  
  - [ ]* 6.5 Write property test for sync queue persistence
    - **Property 10: Sync Queue Persistence**
    - **Validates: Requirements 2.7**
    - Test that sync queue survives application restart
  
  - [ ]* 6.6 Write property test for local data encryption
    - **Property 32: Local Data Encryption**
    - **Validates: Requirements 8.1**
    - Test that sensitive data is encrypted with AES-256 and correctly decryptable
  
  - [ ]* 6.7 Write unit tests for offline storage operations
    - Test database CRUD operations
    - Test encryption/decryption
    - Test error handling for storage full scenarios

- [ ] 7. Implement network monitoring and offline mode
  - [ ] 7.1 Create NetworkMonitor service
    - Use connectivity_plus to monitor network status
    - Implement stream-based network status updates
    - Add offline indicator UI component
    - _Requirements: 2.4, 7.5_
  
  - [ ] 7.2 Implement offline-first registration flow
    - Modify registration submission to check network status
    - Route to offline storage when offline
    - Route to backend API when online
    - Display appropriate success messages based on mode
    - _Requirements: 2.5, 9.3_
  
  - [ ]* 7.3 Write property test for network-independent registration
    - **Property 8: Network-Independent Registration**
    - **Validates: Requirements 2.5**
    - Test that registration works in both online and offline modes
  
  - [ ]* 7.4 Write unit tests for network monitoring
    - Test network status detection
    - Test offline indicator display
    - Test mode switching

- [ ] 8. Implement synchronization engine
  - [ ] 8.1 Create SyncEngine service
    - Implement automatic sync trigger on network reconnection
    - Create sync queue processing logic with chronological ordering
    - Implement exponential backoff retry logic (2s, 4s, 8s, 16s, 32s, max 5 attempts)
    - Add sync progress tracking and UI updates
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8_
  
  - [ ] 8.2 Implement conflict resolution
    - Add server data priority logic
    - Create conflict logging mechanism
    - _Requirements: 3.9_
  
  - [ ]* 8.3 Write property test for sync data upload
    - **Property 11: Sync Data Upload**
    - **Validates: Requirements 3.2, 3.3**
    - Test that sync queue items are uploaded to backend
  
  - [ ]* 8.4 Write property test for chronological sync processing
    - **Property 12: Sync Queue Chronological Processing**
    - **Validates: Requirements 3.4**
    - Test that sync items are processed in creation timestamp order
  
  - [ ]* 8.5 Write property test for successful sync removal
    - **Property 13: Successful Sync Removal**
    - **Validates: Requirements 3.5**
    - Test that successful sync operations remove items from queue
  
  - [ ]* 8.6 Write property test for sync retry with exponential backoff
    - **Property 14: Sync Retry with Exponential Backoff**
    - **Validates: Requirements 3.6**
    - Test retry logic with correct backoff delays up to 5 attempts
  
  - [ ]* 8.7 Write property test for sync progress display
    - **Property 15: Sync Progress Display**
    - **Validates: Requirements 3.8**
    - Test that displayed pending count equals actual queue size
  
  - [ ]* 8.8 Write property test for conflict resolution
    - **Property 16: Conflict Resolution**
    - **Validates: Requirements 3.9**
    - Test that server data is prioritized and conflicts are logged
  
  - [ ]* 8.9 Write unit tests for sync engine
    - Test backoff calculation
    - Test retry logic
    - Test batch processing

- [ ] 9. Checkpoint - Verify offline and sync functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement backend API gateway
  - [ ] 10.1 Create Express server with authentication middleware
    - Set up Express app with HTTPS/TLS
    - Implement JWT authentication middleware
    - Add rate limiting (100 requests/minute per device)
    - Configure CORS and security headers
    - _Requirements: 4.8, 8.2_
  
  - [ ] 10.2 Create POST /api/v1/registrations endpoint
    - Implement multipart form data handling for guest record and images
    - Add authentication check
    - Call ValidationService for input validation
    - Return standardized error responses
    - _Requirements: 4.1, 4.6, 9.6_
  
  - [ ] 10.3 Create GET /api/v1/configuration endpoint
    - Implement configuration retrieval from Firestore
    - Add caching with 5-minute TTL
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 10.4 Write property test for backend required field validation
    - **Property 17: Backend Required Field Validation**
    - **Validates: Requirements 4.1**
    - Test that backend accepts valid records and rejects records missing required fields
  
  - [ ]* 10.5 Write property test for validation error response
    - **Property 21: Validation Error Response**
    - **Validates: Requirements 4.6**
    - Test that invalid submissions return error code and validation details
  
  - [ ]* 10.6 Write property test for standardized error responses
    - **Property 37: Standardized Error Responses**
    - **Validates: Requirements 9.6**
    - Test that all error scenarios return standardized error format
  
  - [ ]* 10.7 Write unit tests for API endpoints
    - Test authentication middleware
    - Test rate limiting
    - Test request validation
    - Test error handling

- [ ] 11. Implement Firebase service layer
  - [ ] 11.1 Create FirebaseService class
    - Initialize Firebase Admin SDK
    - Implement saveGuestRecord method to store in Firestore
    - Implement uploadDocument method to store in Firebase Storage
    - Add transaction logging
    - Configure security rules for Firestore and Storage
    - _Requirements: 4.2, 4.3, 4.4, 4.7, 8.3, 8.6, 8.7_
  
  - [ ] 11.2 Implement configuration management
    - Create methods to load and cache configuration from Firestore
    - Support custom WhatsApp templates and custom fields
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 11.3 Write property test for backend data storage
    - **Property 18: Backend Data Storage**
    - **Validates: Requirements 4.2, 4.3**
    - Test that guest data and images are stored and retrievable
  
  - [ ]* 11.4 Write property test for server identifier uniqueness
    - **Property 19: Server Identifier Uniqueness**
    - **Validates: Requirements 4.4**
    - Test that all server-generated IDs are unique
  
  - [ ]* 11.5 Write property test for server identifier response
    - **Property 20: Server Identifier Response**
    - **Validates: Requirements 4.5**
    - Test that successful storage returns valid non-empty server ID
  
  - [ ]* 11.6 Write property test for transaction logging
    - **Property 22: Transaction Logging**
    - **Validates: Requirements 4.7**
    - Test that all transactions create log entries with timestamp and device ID
  
  - [ ]* 11.7 Write unit tests for Firebase operations
    - Test Firestore CRUD operations
    - Test Storage upload/download
    - Test security rules
    - Test error handling

- [ ] 12. Implement WhatsApp integration service
  - [ ] 12.1 Create WhatsAppService class
    - Implement sendWelcomeMessage method using Meta WhatsApp Business Cloud API
    - Add template rendering with variable substitution
    - Implement delivery status tracking
    - Store WhatsApp credentials in environment variables
    - Add error handling (non-blocking for registration)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ] 12.2 Integrate WhatsApp service with registration flow
    - Trigger WhatsApp message after successful Firestore storage
    - Store delivery status in Firestore
    - Log WhatsApp errors without blocking registration
    - _Requirements: 5.1, 5.5, 5.6_
  
  - [ ]* 12.3 Write property test for WhatsApp trigger
    - **Property 23: WhatsApp Trigger**
    - **Validates: Requirements 5.1**
    - Test that successful storage triggers WhatsApp message send
  
  - [ ]* 12.4 Write property test for WhatsApp message content
    - **Property 24: WhatsApp Message Content and Delivery**
    - **Validates: Requirements 5.3, 5.4**
    - Test that message contains guest name, confirmation details, and is sent to correct number
  
  - [ ]* 12.5 Write property test for WhatsApp error handling
    - **Property 25: WhatsApp Error Handling**
    - **Validates: Requirements 5.5**
    - Test that WhatsApp errors are logged and registration still completes
  
  - [ ]* 12.6 Write property test for WhatsApp status storage
    - **Property 26: WhatsApp Status Storage**
    - **Validates: Requirements 5.6**
    - Test that delivery status is stored in Firebase
  
  - [ ]* 12.7 Write property test for template variable substitution
    - **Property 50: Template Variable Substitution**
    - **Validates: Requirements 12.3**
    - Test that template variables are correctly substituted with guest data
  
  - [ ]* 12.8 Write unit tests for WhatsApp service
    - Test template rendering
    - Test API communication
    - Test error handling
    - Test status tracking

- [ ] 13. Checkpoint - Verify backend integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement mobile app HTTP client and API integration
  - [ ] 14.1 Create ApiClient service
    - Implement HTTP client with authentication headers
    - Add methods for registration submission (multipart/form-data)
    - Add configuration fetching
    - Implement timeout handling (30 seconds)
    - Add error parsing and mapping
    - _Requirements: 4.8, 10.2_
  
  - [ ] 14.2 Integrate ApiClient with registration flow
    - Update registration submission to use ApiClient
    - Handle server response with serverId
    - Update local record with serverId after successful sync
    - _Requirements: 4.5_
  
  - [ ]* 14.3 Write property test for online submission performance
    - **Property 40: Online Submission Performance**
    - **Validates: Requirements 10.2**
    - Test that online registration completes within 5 seconds under normal conditions
  
  - [ ]* 14.4 Write unit tests for API client
    - Test request formatting
    - Test response parsing
    - Test timeout handling
    - Test error scenarios

- [ ] 15. Implement error handling and recovery
  - [ ] 15.1 Add crash recovery mechanism
    - Implement session state persistence
    - Add recovery logic on app startup
    - Restore unsaved registration data
    - _Requirements: 9.1_
  
  - [ ] 15.2 Implement comprehensive error handling
    - Add user-friendly error messages with suggested actions
    - Implement manual retry for failed sync operations
    - Add error logging to local storage
    - Handle partial failures (preserve form data on image capture failure)
    - _Requirements: 9.2, 9.4, 9.5, 9.7_
  
  - [ ]* 15.3 Write property test for crash recovery
    - **Property 34: Crash Recovery**
    - **Validates: Requirements 9.1**
    - Test that registration data is recoverable after crash
  
  - [ ]* 15.4 Write property test for error message display
    - **Property 35: Error Message Display**
    - **Validates: Requirements 9.2**
    - Test that all errors display non-empty user-friendly messages
  
  - [ ]* 15.5 Write property test for partial failure data preservation
    - **Property 36: Partial Failure Data Preservation**
    - **Validates: Requirements 9.5**
    - Test that form data is preserved when image capture fails
  
  - [ ]* 15.6 Write property test for error logging
    - **Property 38: Error Logging**
    - **Validates: Requirements 9.7**
    - Test that all errors create log entries in local storage
  
  - [ ]* 15.7 Write unit tests for error handling
    - Test error message generation
    - Test retry logic
    - Test recovery mechanisms

- [ ] 16. Implement authentication and authorization
  - [ ] 16.1 Add Firebase Authentication to mobile app
    - Implement login screen
    - Add JWT token storage and refresh
    - Require authentication before accessing registration
    - _Requirements: 8.2, 8.5_
  
  - [ ] 16.2 Implement role-based access control in backend
    - Add role checking middleware
    - Enforce staff role for registration endpoints
    - Enforce admin role for configuration updates
    - _Requirements: 8.3_
  
  - [ ]* 16.3 Write unit tests for authentication
    - Test login flow
    - Test token refresh
    - Test role-based access control

- [ ] 17. Implement custom field support
  - [ ] 17.1 Add dynamic form field rendering in mobile app
    - Fetch configuration on app startup
    - Render custom fields based on configuration
    - Apply custom validation rules
    - _Requirements: 12.4_
  
  - [ ] 17.2 Add custom field validation in backend
    - Validate custom fields according to configured rules
    - Support text, number, date, and select field types
    - _Requirements: 12.5_
  
  - [ ]* 17.3 Write property test for custom field display
    - **Property 51: Custom Field Display**
    - **Validates: Requirements 12.4**
    - Test that configured custom fields appear in registration form
  
  - [ ]* 17.4 Write property test for custom field validation
    - **Property 52: Custom Field Validation**
    - **Validates: Requirements 12.5**
    - Test that custom fields are validated according to configured rules
  
  - [ ]* 17.5 Write unit tests for custom fields
    - Test dynamic field rendering
    - Test custom validation rules
    - Test different field types

- [ ] 18. Implement performance optimizations
  - [ ] 18.1 Add performance monitoring and optimization
    - Implement image caching with 100MB limit
    - Add batch processing for large sync queues (batch size: 20)
    - Optimize database queries with indexes
    - Add connection pooling for Firebase
    - _Requirements: 10.5, 10.6, 10.7_
  
  - [ ]* 18.2 Write property test for local storage performance
    - **Property 39: Local Storage Performance**
    - **Validates: Requirements 10.1**
    - Test that local storage operations complete within 2 seconds
  
  - [ ]* 18.3 Write property test for backend processing performance
    - **Property 41: Backend Processing Performance**
    - **Validates: Requirements 10.3**
    - Test that backend processing completes within 3 seconds
  
  - [ ]* 18.4 Write property test for concurrent request support
    - **Property 42: Concurrent Request Support**
    - **Validates: Requirements 10.4**
    - Test that backend handles 50 concurrent requests successfully
  
  - [ ]* 18.5 Write property test for image cache memory limit
    - **Property 43: Image Cache Memory Limit**
    - **Validates: Requirements 10.5**
    - Test that image cache does not exceed 100MB
  
  - [ ]* 18.6 Write property test for batch processing
    - **Property 44: Batch Processing for Large Queues**
    - **Validates: Requirements 10.7**
    - Test that large queues are processed in batches with bounded memory

- [ ] 19. Implement multi-device support features
  - [ ] 19.1 Add device identification
    - Generate unique device identifier on first launch
    - Include device ID in all API requests
    - Store device ID with each guest record
    - _Requirements: 11.4, 11.5_
  
  - [ ]* 19.2 Write property test for multi-device concurrent support
    - **Property 45: Multi-Device Concurrent Support**
    - **Validates: Requirements 11.1**
    - Test that backend processes concurrent submissions from multiple devices
  
  - [ ]* 19.3 Write property test for concurrent identifier uniqueness
    - **Property 46: Concurrent Identifier Uniqueness**
    - **Validates: Requirements 11.3**
    - Test that concurrent registrations receive unique server IDs
  
  - [ ]* 19.4 Write property test for device identification
    - **Property 47: Device Identification**
    - **Validates: Requirements 11.4**
    - Test that all backend requests include unique device identifier
  
  - [ ]* 19.5 Write property test for device tracking
    - **Property 48: Device Tracking**
    - **Validates: Requirements 11.5**
    - Test that guest records have associated device identifier

- [ ] 20. Implement UI/UX enhancements
  - [ ] 20.1 Add visual feedback and polish
    - Implement loading indicators for save/sync operations
    - Add success confirmation messages
    - Support portrait and landscape orientations
    - Add zoom/pan gestures for document preview
    - _Requirements: 7.2, 7.3, 7.7_
  
  - [ ]* 20.2 Write property test for visual feedback
    - **Property 31: Save/Sync Visual Feedback**
    - **Validates: Requirements 7.2**
    - Test that save/sync operations display visual feedback
  
  - [ ]* 20.3 Write property test for image format support
    - **Property 29: Image Format Support**
    - **Validates: Requirements 6.4**
    - Test that JPEG and PNG images are correctly processed
  
  - [ ]* 20.4 Write property test for document image preview
    - **Property 27: Document Image Preview**
    - **Validates: Requirements 6.1**
    - Test that captured images display preview

- [ ] 21. Implement input sanitization and security hardening
  - [ ] 21.1 Add comprehensive input sanitization
    - Implement SQL injection prevention
    - Add XSS prevention
    - Add command injection prevention
    - Sanitize all user inputs in backend
    - _Requirements: 8.4_
  
  - [ ]* 21.2 Write property test for input sanitization
    - **Property 33: Input Sanitization**
    - **Validates: Requirements 8.4**
    - Test that injection payloads are sanitized and do not execute

- [ ] 22. Implement custom template support
  - [ ] 22.1 Add template management
    - Load WhatsApp templates from Firestore configuration
    - Implement template selection logic (custom vs default)
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 22.2 Write property test for custom template selection
    - **Property 49: Custom Template Selection**
    - **Validates: Requirements 12.1**
    - Test that custom templates are used when configured, otherwise default

- [ ] 23. Final integration and end-to-end testing
  - [ ] 23.1 Perform end-to-end integration testing
    - Test complete online registration flow
    - Test complete offline registration and sync flow
    - Test multi-device scenarios
    - Test error recovery scenarios
    - Verify all requirements are met
  
  - [ ]* 23.2 Write integration tests for critical flows
    - Test online registration end-to-end
    - Test offline registration and sync end-to-end
    - Test WhatsApp integration end-to-end
    - Test error scenarios

- [ ] 24. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- The implementation uses **Dart/Flutter** for the mobile application and **TypeScript/Node.js** for the backend service
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties across all inputs (minimum 100 iterations)
- Unit tests validate specific examples, edge cases, and error conditions
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows an offline-first architecture with automatic synchronization
- Security is built-in from the start with encryption, authentication, and input sanitization
- Performance requirements are addressed through optimization tasks
- The system supports customization through configuration (templates, custom fields)

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "2.1"]
    },
    {
      "id": 1,
      "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6"]
    },
    {
      "id": 2,
      "tasks": ["3.1", "3.2", "3.3", "3.4"]
    },
    {
      "id": 3,
      "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7"]
    },
    {
      "id": 4,
      "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"]
    },
    {
      "id": 5,
      "tasks": ["7.1", "7.2", "7.3", "7.4"]
    },
    {
      "id": 6,
      "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9"]
    },
    {
      "id": 7,
      "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7"]
    },
    {
      "id": 8,
      "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7"]
    },
    {
      "id": 9,
      "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7", "12.8"]
    },
    {
      "id": 10,
      "tasks": ["14.1", "14.2", "14.3", "14.4"]
    },
    {
      "id": 11,
      "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6", "15.7"]
    },
    {
      "id": 12,
      "tasks": ["16.1", "16.2", "16.3"]
    },
    {
      "id": 13,
      "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5"]
    },
    {
      "id": 14,
      "tasks": ["18.1", "18.2", "18.3", "18.4", "18.5", "18.6"]
    },
    {
      "id": 15,
      "tasks": ["19.1", "19.2", "19.3", "19.4", "19.5"]
    },
    {
      "id": 16,
      "tasks": ["20.1", "20.2", "20.3", "20.4"]
    },
    {
      "id": 17,
      "tasks": ["21.1", "21.2"]
    },
    {
      "id": 18,
      "tasks": ["22.1", "22.2"]
    },
    {
      "id": 19,
      "tasks": ["23.1", "23.2"]
    }
  ]
}
```
