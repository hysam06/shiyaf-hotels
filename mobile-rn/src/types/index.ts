// Type definitions for the Shiyaf Hotels app

export type Property = 'plaza' | 'century';

export type GuestStatus = 'checked_in' | 'checked_out' | 'cancelled';

export type UserRole = 'admin' | 'manager';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  property?: Property;
  isActive: boolean;
}

export interface Guest {
  id: string;
  property: Property;
  guest_name: string;
  contact_number: string;
  email?: string;
  nationality: string;
  address?: string;
  city?: string;
  pin?: string;
  room_number: string;
  room_type?: string;
  arrival_date: string;
  departure_date?: string;
  purpose_of_visit?: string;
  mode_of_payment?: string;
  advance_payment?: number;
  tariff?: number;
  status: GuestStatus;
  registration_number: string;
  
  // Media and operations fields
  profile_photo_url?: string;
  id_photo_front_url?: string;
  id_photo_back_url?: string;
  id_type?: 'aadhaar' | 'pan' | 'passport' | 'driving_licence';
  whatsapp_receipt_sent?: boolean;
  gst_number?: string;
  checked_out_at?: string;

  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_guests_today: number;
  rooms_occupied: number;
  departures_today: number;
  new_check_ins_today: number;
  available_rooms: number;
  revenue_today: number;
}

export interface GuestFormData {
  property: Property;
  guest_name: string;
  contact_number: string;
  email?: string;
  nationality: string;
  address?: string;
  city?: string;
  pin?: string;
  room_number: string;
  room_type?: string;
  arrival_date: string;
  departure_date?: string;
  purpose_of_visit?: string;
  mode_of_payment?: string;
  advance_payment?: number;
  tariff?: number;
  
  // Photo + ID fields
  profile_photo_url?: string;
  id_photo_front_url?: string;
  id_photo_back_url?: string;
  id_type?: string;
  whatsapp_receipt_sent?: boolean;
  gst_number?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
}

export interface NotificationItem {
  id: string;
  type: 'checkout' | 'payment' | 'overstay' | 'summary';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  meta?: any;
}

export interface RevenueDataPoint {
  date: string;
  amount: number;
  occupancy: number;
}
