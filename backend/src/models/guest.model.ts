/**
 * Guest Record Data Models
 * Defines the structure for hotel guest registration data
 */

export type Property = 'plaza' | 'century';

export type RoomType = 'S/AC' | 'S/Non-AC' | 'Dbl/C' | 'D/Non-AC' | 'T/AC' | 'T/Non-AC' | 'Suite';

export type ProofType = 'DL' | 'EID' | 'Aadhaar' | 'Passport' | 'Voter ID';

export type PaymentMode = 'Cash' | 'Paytm' | 'Credit Card' | 'UPI' | 'Other';

export type GuestStatus = 'checked_in' | 'checked_out' | 'cancelled';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface GuestCount {
  male: number;
  female: number;
  child: number;
}

export interface GuestRecord {
  // Identifiers
  id?: string;
  registration_number?: string;
  
  // Property
  property: Property;
  
  // Guest Details
  guest_name: string;
  gstin?: string;
  address?: string;
  po?: string;
  city?: string;
  pin?: string;
  nationality: string;
  contact_number: string;
  email?: string;
  date_of_birth?: Date | string;
  state?: string;
  
  // Stay Details
  room_number: string;
  conference_hall?: boolean;
  number_of_rooms?: number;
  room_type?: RoomType;
  number_of_guests_male?: number;
  number_of_guests_female?: number;
  number_of_guests_child?: number;
  purpose_of_visit?: string;
  arrival_date: Date | string;
  arrival_time?: string;
  departure_date?: Date | string;
  departure_time?: string;
  vehicle_number?: string;
  
  // ID Proof
  proof_type?: ProofType;
  proof_number?: string;
  proof_date_of_issue?: Date | string;
  proof_valid_till?: Date | string;
  proof_place_of_issue?: string;
  
  // Payment
  mode_of_payment?: PaymentMode;
  advance_payment?: number;
  tariff?: number;
  total_amount?: number;
  food_included?: boolean;
  water_included?: boolean;
  tea_included?: boolean;
  
  // Media URLs
  guest_photo_url?: string;
  proof_photo_front_url?: string;
  proof_photo_back_url?: string;
  signature_url?: string;
  
  // Status
  status?: GuestStatus;
  checked_out_at?: Date | string;
  
  // Sync Information
  device_id?: string;
  sync_status?: SyncStatus;
  
  // Timestamps
  created_at?: Date | string;
  updated_at?: Date | string;
  
  // Additional flexible data
  guest_data?: Record<string, any>;
}

export interface CreateGuestRequest {
  property: Property;
  guest_name: string;
  contact_number: string;
  nationality: string;
  room_number: string;
  arrival_date: Date | string;
  
  // Optional fields
  gstin?: string;
  address?: string;
  po?: string;
  city?: string;
  pin?: string;
  email?: string;
  date_of_birth?: Date | string;
  state?: string;
  conference_hall?: boolean;
  number_of_rooms?: number;
  room_type?: RoomType;
  number_of_guests_male?: number;
  number_of_guests_female?: number;
  number_of_guests_child?: number;
  purpose_of_visit?: string;
  arrival_time?: string;
  departure_date?: Date | string;
  departure_time?: string;
  vehicle_number?: string;
  proof_type?: ProofType;
  proof_number?: string;
  proof_date_of_issue?: Date | string;
  proof_valid_till?: Date | string;
  proof_place_of_issue?: string;
  mode_of_payment?: PaymentMode;
  advance_payment?: number;
  tariff?: number;
  total_amount?: number;
  food_included?: boolean;
  water_included?: boolean;
  tea_included?: boolean;
  device_id?: string;
}

export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {
  id: string;
}

export interface GuestSearchQuery {
  property?: Property;
  search?: string; // Search in name, phone, room
  room_number?: string;
  status?: GuestStatus;
  arrival_date_from?: Date | string;
  arrival_date_to?: Date | string;
  page?: number;
  limit?: number;
}

export interface GuestListResponse {
  data: GuestRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Indian States for dropdown
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
] as const;

export type IndianState = typeof INDIAN_STATES[number];
