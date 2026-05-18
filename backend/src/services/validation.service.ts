/**
 * Validation Service
 * Handles all input validation and sanitization
 */

import { CreateGuestRequest, Property, ProofType, PaymentMode, RoomType } from '../models/guest.model';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ValidationService {
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (Indian format)
   * Accepts: 10 digits, optional +91 prefix
   */
  static validatePhoneNumber(phone: string): boolean {
    if (!phone) return false;
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    // Check for 10 digits or +91 followed by 10 digits
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(cleaned);
  }

  /**
   * Validate PIN code (Indian 6-digit)
   */
  static validatePinCode(pin: string): boolean {
    if (!pin) return false;
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pin);
  }

  /**
   * Validate GSTIN (Indian GST number)
   * Format: 22AAAAA0000A1Z5
   */
  static validateGSTIN(gstin: string): boolean {
    if (!gstin) return true; // Optional field
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  }

  /**
   * Validate Aadhaar number (12 digits)
   */
  static validateAadhaar(aadhaar: string): boolean {
    if (!aadhaar) return false;
    const cleaned = aadhaar.replace(/[\s-]/g, '');
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(cleaned);
  }

  /**
   * Validate property value
   */
  static validateProperty(property: string): property is Property {
    return property === 'plaza' || property === 'century';
  }

  /**
   * Validate proof type
   */
  static validateProofType(proofType: string): proofType is ProofType {
    const validTypes: ProofType[] = ['DL', 'EID', 'Aadhaar', 'Passport', 'Voter ID'];
    return validTypes.includes(proofType as ProofType);
  }

  /**
   * Validate payment mode
   */
  static validatePaymentMode(mode: string): mode is PaymentMode {
    const validModes: PaymentMode[] = ['Cash', 'Paytm', 'Credit Card', 'Card', 'UPI', 'Net Banking', 'Other'];
    return validModes.includes(mode as PaymentMode);
  }

  /**
   * Validate room type
   */
  static validateRoomType(roomType: string): roomType is RoomType {
    const validTypes: RoomType[] = ['S/AC', 'S/Non-AC', 'Dbl/C', 'D/Non-AC', 'T/AC', 'T/Non-AC', 'Suite', 'Standard', 'Deluxe', 'Executive'];
    return validTypes.includes(roomType as RoomType);
  }

  /**
   * Validate date is not in the past (for arrival dates)
   */
  static validateFutureDate(date: Date | string, allowToday: boolean = true): boolean {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (allowToday) {
      return inputDate >= today;
    }
    return inputDate > today;
  }

  /**
   * Validate date range (departure after arrival)
   */
  static validateDateRange(arrivalDate: Date | string, departureDate: Date | string): boolean {
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    return departure > arrival;
  }

  /**
   * Sanitize string input (prevent XSS, SQL injection)
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Remove SQL injection patterns
    sanitized = sanitized.replace(/('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter)/gi, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
  }

  /**
   * Validate guest registration request
   */
  static validateGuestRegistration(data: CreateGuestRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.guest_name || data.guest_name.trim() === '') {
      errors.push({
        field: 'guest_name',
        message: 'Guest name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!data.contact_number) {
      errors.push({
        field: 'contact_number',
        message: 'Contact number is required',
        code: 'REQUIRED_FIELD'
      });
    } else if (!this.validatePhoneNumber(data.contact_number)) {
      errors.push({
        field: 'contact_number',
        message: 'Invalid phone number format. Use 10 digits or +91 followed by 10 digits',
        code: 'INVALID_FORMAT'
      });
    }

    if (!data.nationality || data.nationality.trim() === '') {
      errors.push({
        field: 'nationality',
        message: 'Nationality is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!data.property) {
      errors.push({
        field: 'property',
        message: 'Property is required',
        code: 'REQUIRED_FIELD'
      });
    } else if (!this.validateProperty(data.property)) {
      errors.push({
        field: 'property',
        message: 'Property must be either "plaza" or "century"',
        code: 'INVALID_VALUE'
      });
    }

    if (!data.room_number || data.room_number.trim() === '') {
      errors.push({
        field: 'room_number',
        message: 'Room number is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!data.arrival_date) {
      errors.push({
        field: 'arrival_date',
        message: 'Arrival date is required',
        code: 'REQUIRED_FIELD'
      });
    }

    // Optional field validations
    if (data.email && !this.validateEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_FORMAT'
      });
    }

    if (data.pin && !this.validatePinCode(data.pin)) {
      errors.push({
        field: 'pin',
        message: 'PIN code must be 6 digits',
        code: 'INVALID_FORMAT'
      });
    }

    if (data.gstin && !this.validateGSTIN(data.gstin)) {
      errors.push({
        field: 'gstin',
        message: 'Invalid GSTIN format',
        code: 'INVALID_FORMAT'
      });
    }

    if (data.proof_type && !this.validateProofType(data.proof_type)) {
      errors.push({
        field: 'proof_type',
        message: 'Invalid proof type',
        code: 'INVALID_VALUE'
      });
    }

    if (data.mode_of_payment && !this.validatePaymentMode(data.mode_of_payment)) {
      errors.push({
        field: 'mode_of_payment',
        message: 'Invalid payment mode',
        code: 'INVALID_VALUE'
      });
    }

    if (data.room_type && !this.validateRoomType(data.room_type)) {
      errors.push({
        field: 'room_type',
        message: 'Invalid room type',
        code: 'INVALID_VALUE'
      });
    }

    // Date validations
    if (data.arrival_date && data.departure_date) {
      if (!this.validateDateRange(data.arrival_date, data.departure_date)) {
        errors.push({
          field: 'departure_date',
          message: 'Departure date must be after arrival date',
          code: 'INVALID_DATE_RANGE'
        });
      }
    }

    // Numeric validations
    if (data.advance_payment !== undefined && data.advance_payment < 0) {
      errors.push({
        field: 'advance_payment',
        message: 'Advance payment cannot be negative',
        code: 'INVALID_VALUE'
      });
    }

    if (data.tariff !== undefined && data.tariff < 0) {
      errors.push({
        field: 'tariff',
        message: 'Tariff cannot be negative',
        code: 'INVALID_VALUE'
      });
    }

    if (data.number_of_rooms !== undefined && data.number_of_rooms < 1) {
      errors.push({
        field: 'number_of_rooms',
        message: 'Number of rooms must be at least 1',
        code: 'INVALID_VALUE'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize guest registration data
   */
  static sanitizeGuestData(data: CreateGuestRequest): CreateGuestRequest {
    return {
      ...data,
      guest_name: this.sanitizeString(data.guest_name),
      address: data.address ? this.sanitizeString(data.address) : undefined,
      city: data.city ? this.sanitizeString(data.city) : undefined,
      po: data.po ? this.sanitizeString(data.po) : undefined,
      state: data.state ? this.sanitizeString(data.state) : undefined,
      purpose_of_visit: data.purpose_of_visit ? this.sanitizeString(data.purpose_of_visit) : undefined,
      vehicle_number: data.vehicle_number ? this.sanitizeString(data.vehicle_number) : undefined,
      proof_place_of_issue: data.proof_place_of_issue ? this.sanitizeString(data.proof_place_of_issue) : undefined,
    };
  }
}

export default ValidationService;
