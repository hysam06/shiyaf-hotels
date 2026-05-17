/**
 * Validation Service Tests
 * Unit tests for validation logic
 */

import { ValidationService } from '../validation.service';
import { CreateGuestRequest } from '../../models/guest.model';

describe('ValidationService', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(ValidationService.validateEmail('test@example.com')).toBe(true);
      expect(ValidationService.validateEmail('user.name@domain.co.in')).toBe(true);
      expect(ValidationService.validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(ValidationService.validateEmail('invalid')).toBe(false);
      expect(ValidationService.validateEmail('invalid@')).toBe(false);
      expect(ValidationService.validateEmail('@example.com')).toBe(false);
      expect(ValidationService.validateEmail('invalid@.com')).toBe(false);
      expect(ValidationService.validateEmail('')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should accept valid Indian phone numbers', () => {
      expect(ValidationService.validatePhoneNumber('9876543210')).toBe(true);
      expect(ValidationService.validatePhoneNumber('+919876543210')).toBe(true);
      expect(ValidationService.validatePhoneNumber('8765432109')).toBe(true);
      expect(ValidationService.validatePhoneNumber('7654321098')).toBe(true);
      expect(ValidationService.validatePhoneNumber('6543210987')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(ValidationService.validatePhoneNumber('123456789')).toBe(false); // Too short
      expect(ValidationService.validatePhoneNumber('12345678901')).toBe(false); // Too long
      expect(ValidationService.validatePhoneNumber('5876543210')).toBe(false); // Starts with 5
      expect(ValidationService.validatePhoneNumber('abcdefghij')).toBe(false); // Letters
      expect(ValidationService.validatePhoneNumber('')).toBe(false);
    });

    it('should handle phone numbers with spaces and dashes', () => {
      expect(ValidationService.validatePhoneNumber('987-654-3210')).toBe(true);
      expect(ValidationService.validatePhoneNumber('987 654 3210')).toBe(true);
    });
  });

  describe('validatePinCode', () => {
    it('should accept valid 6-digit PIN codes', () => {
      expect(ValidationService.validatePinCode('673001')).toBe(true);
      expect(ValidationService.validatePinCode('110001')).toBe(true);
      expect(ValidationService.validatePinCode('400001')).toBe(true);
    });

    it('should reject invalid PIN codes', () => {
      expect(ValidationService.validatePinCode('12345')).toBe(false); // Too short
      expect(ValidationService.validatePinCode('1234567')).toBe(false); // Too long
      expect(ValidationService.validatePinCode('abcdef')).toBe(false); // Letters
      expect(ValidationService.validatePinCode('')).toBe(false);
    });
  });

  describe('validateGSTIN', () => {
    it('should accept valid GSTIN format', () => {
      expect(ValidationService.validateGSTIN('22AAAAA0000A1Z5')).toBe(true);
      expect(ValidationService.validateGSTIN('29ABCDE1234F1Z5')).toBe(true);
    });

    it('should reject invalid GSTIN format', () => {
      expect(ValidationService.validateGSTIN('INVALID')).toBe(false);
      expect(ValidationService.validateGSTIN('22AAAAA0000A1Z')).toBe(false); // Too short
      expect(ValidationService.validateGSTIN('22aaaaa0000a1z5')).toBe(false); // Lowercase
    });

    it('should accept empty GSTIN (optional field)', () => {
      expect(ValidationService.validateGSTIN('')).toBe(true);
    });
  });

  describe('validateProperty', () => {
    it('should accept valid property values', () => {
      expect(ValidationService.validateProperty('plaza')).toBe(true);
      expect(ValidationService.validateProperty('century')).toBe(true);
    });

    it('should reject invalid property values', () => {
      expect(ValidationService.validateProperty('invalid')).toBe(false);
      expect(ValidationService.validateProperty('Plaza')).toBe(false); // Case sensitive
      expect(ValidationService.validateProperty('')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('should accept valid date ranges', () => {
      const arrival = new Date('2026-05-17');
      const departure = new Date('2026-05-20');
      expect(ValidationService.validateDateRange(arrival, departure)).toBe(true);
    });

    it('should reject invalid date ranges', () => {
      const arrival = new Date('2026-05-20');
      const departure = new Date('2026-05-17');
      expect(ValidationService.validateDateRange(arrival, departure)).toBe(false);
    });

    it('should reject same arrival and departure dates', () => {
      const date = new Date('2026-05-17');
      expect(ValidationService.validateDateRange(date, date)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(ValidationService.sanitizeString('<script>alert("xss")</script>')).toBe('');
      expect(ValidationService.sanitizeString('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should remove SQL injection patterns', () => {
      expect(ValidationService.sanitizeString("'; DROP TABLE users; --")).toBe('  TABLE users ');
      expect(ValidationService.sanitizeString('SELECT * FROM users')).toBe('   users');
    });

    it('should trim whitespace', () => {
      expect(ValidationService.sanitizeString('  hello  ')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(ValidationService.sanitizeString('')).toBe('');
    });
  });

  describe('validateGuestRegistration', () => {
    const validGuestData: CreateGuestRequest = {
      property: 'plaza',
      guest_name: 'John Doe',
      contact_number: '9876543210',
      nationality: 'Indian',
      room_number: '101',
      arrival_date: new Date('2026-05-20')
    };

    it('should accept valid guest registration data', () => {
      const result = ValidationService.validateGuestRegistration(validGuestData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const invalidData = { ...validGuestData, guest_name: '' };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'guest_name')).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const invalidData = { ...validGuestData, contact_number: '123' };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'contact_number')).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = { ...validGuestData, email: 'invalid-email' };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should reject invalid property value', () => {
      const invalidData = { ...validGuestData, property: 'invalid' as any };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'property')).toBe(true);
    });

    it('should reject negative payment amounts', () => {
      const invalidData = { ...validGuestData, advance_payment: -100 };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'advance_payment')).toBe(true);
    });

    it('should reject invalid date range', () => {
      const invalidData = {
        ...validGuestData,
        arrival_date: new Date('2026-05-20'),
        departure_date: new Date('2026-05-18')
      };
      const result = ValidationService.validateGuestRegistration(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'departure_date')).toBe(true);
    });
  });

  describe('sanitizeGuestData', () => {
    it('should sanitize all string fields', () => {
      const dirtyData: CreateGuestRequest = {
        property: 'plaza',
        guest_name: '<script>alert("xss")</script>John',
        contact_number: '9876543210',
        nationality: 'Indian',
        room_number: '101',
        arrival_date: new Date(),
        address: "'; DROP TABLE users; --",
        city: '  Mumbai  '
      };

      const sanitized = ValidationService.sanitizeGuestData(dirtyData);
      
      expect(sanitized.guest_name).not.toContain('<script>');
      expect(sanitized.address).not.toContain('DROP');
      expect(sanitized.city).toBe('Mumbai');
    });
  });
});
