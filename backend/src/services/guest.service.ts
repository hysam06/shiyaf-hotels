/**
 * Guest Service
 * Business logic for guest registration and management
 */

import { supabase } from '../config/supabase.config';
import { 
  GuestRecord, 
  CreateGuestRequest, 
  UpdateGuestRequest,
  GuestSearchQuery,
  GuestListResponse,
  Property 
} from '../models/guest.model';
import { ValidationService } from './validation.service';

export class GuestService {
  /**
   * Generate registration number based on property
   * Format: PLAZA-YYYY-XXXX or CNTRY-YYYY-XXXX
   */
  static async generateRegistrationNumber(property: Property): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = property === 'plaza' ? 'PLAZA' : 'CNTRY';
    
    // Get the count of registrations for this property this year
    const { count, error } = await supabase
      .from('guest_records')
      .select('*', { count: 'exact', head: true })
      .eq('property', property)
      .gte('created_at', `${year}-01-01`)
      .lte('created_at', `${year}-12-31`);
    
    if (error) {
      console.error('Error counting registrations:', error);
      // Fallback to random number if count fails
      const random = Math.floor(Math.random() * 9999) + 1;
      return `${prefix}-${year}-${random.toString().padStart(4, '0')}`;
    }
    
    const nextNumber = (count || 0) + 1;
    return `${prefix}-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  /**
   * Create a new guest registration
   */
  static async createGuest(data: CreateGuestRequest): Promise<GuestRecord> {
    // Validate data
    const validation = ValidationService.validateGuestRegistration(data);
    if (!validation.isValid) {
      throw {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    // Sanitize data
    const sanitizedData = ValidationService.sanitizeGuestData(data);

    // Generate registration number
    const registration_number = await this.generateRegistrationNumber(sanitizedData.property);

    // Prepare guest record
    const guestRecord = {
      ...sanitizedData,
      registration_number,
      status: 'checked_in',
      sync_status: 'synced',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert into database
    const { data: insertedGuest, error } = await supabase
      .from('guest_records')
      .insert(guestRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating guest:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to create guest record',
        details: error.message
      };
    }

    return insertedGuest;
  }

  /**
   * Get guest by ID
   */
  static async getGuestById(id: string, property?: Property): Promise<GuestRecord | null> {
    let query = supabase
      .from('guest_records')
      .select('*')
      .eq('id', id);

    // Apply property filter if provided
    if (property) {
      query = query.eq('property', property);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching guest:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch guest record',
        details: error.message
      };
    }

    return data;
  }

  /**
   * Get all guests with pagination and filters
   */
  static async getGuests(query: GuestSearchQuery): Promise<GuestListResponse> {
    const {
      property,
      search,
      room_number,
      status,
      arrival_date_from,
      arrival_date_to,
      page = 1,
      limit = 20
    } = query;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let dbQuery = supabase
      .from('guest_records')
      .select('*', { count: 'exact' });

    // Apply filters
    if (property) {
      dbQuery = dbQuery.eq('property', property);
    }

    if (search) {
      // Search in name, phone, or room number
      dbQuery = dbQuery.or(`guest_name.ilike.%${search}%,contact_number.ilike.%${search}%,room_number.ilike.%${search}%`);
    }

    if (room_number) {
      dbQuery = dbQuery.eq('room_number', room_number);
    }

    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    if (arrival_date_from) {
      dbQuery = dbQuery.gte('arrival_date', arrival_date_from);
    }

    if (arrival_date_to) {
      dbQuery = dbQuery.lte('arrival_date', arrival_date_to);
    }

    // Apply pagination and sorting
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Error fetching guests:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch guests',
        details: error.message
      };
    }

    const total = count || 0;
    const total_pages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      page,
      limit,
      total_pages
    };
  }

  /**
   * Get today's registrations for a property
   */
  static async getTodayGuests(property: Property): Promise<GuestRecord[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('guest_records')
      .select('*')
      .eq('property', property)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching today\'s guests:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch today\'s guests',
        details: error.message
      };
    }

    return data || [];
  }

  /**
   * Update guest record
   */
  static async updateGuest(id: string, updates: Partial<CreateGuestRequest>, property?: Property): Promise<GuestRecord> {
    // Check if guest exists
    const existingGuest = await this.getGuestById(id, property);
    if (!existingGuest) {
      throw {
        code: 'NOT_FOUND',
        message: 'Guest not found'
      };
    }

    // Sanitize update data
    const sanitizedUpdates = ValidationService.sanitizeGuestData({
      ...existingGuest,
      ...updates
    } as CreateGuestRequest);

    // Update record
    const { data, error } = await supabase
      .from('guest_records')
      .update({
        ...sanitizedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to update guest record',
        details: error.message
      };
    }

    return data;
  }

  /**
   * Check out a guest
   */
  static async checkoutGuest(id: string, property?: Property): Promise<GuestRecord> {
    const guest = await this.getGuestById(id, property);
    if (!guest) {
      throw {
        code: 'NOT_FOUND',
        message: 'Guest not found'
      };
    }

    const { data, error } = await supabase
      .from('guest_records')
      .update({
        status: 'checked_out',
        checked_out_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error checking out guest:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to check out guest',
        details: error.message
      };
    }

    return data;
  }

  /**
   * Soft delete a guest (mark as cancelled)
   */
  static async deleteGuest(id: string, property?: Property): Promise<void> {
    const guest = await this.getGuestById(id, property);
    if (!guest) {
      throw {
        code: 'NOT_FOUND',
        message: 'Guest not found'
      };
    }

    const { error } = await supabase
      .from('guest_records')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting guest:', error);
      throw {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete guest',
        details: error.message
      };
    }
  }

  /**
   * Get dashboard statistics for a property
   */
  static async getDashboardStats(property: Property) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total guests today
    const { count: totalToday } = await supabase
      .from('guest_records')
      .select('*', { count: 'exact', head: true })
      .eq('property', property)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    // Currently checked in
    const { count: checkedIn } = await supabase
      .from('guest_records')
      .select('*', { count: 'exact', head: true })
      .eq('property', property)
      .eq('status', 'checked_in');

    // Departures today
    const { count: departuresToday } = await supabase
      .from('guest_records')
      .select('*', { count: 'exact', head: true })
      .eq('property', property)
      .gte('departure_date', today.toISOString().split('T')[0])
      .lt('departure_date', tomorrow.toISOString().split('T')[0]);

    // New check-ins today
    const { count: newCheckIns } = await supabase
      .from('guest_records')
      .select('*', { count: 'exact', head: true })
      .eq('property', property)
      .eq('status', 'checked_in')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    return {
      total_guests_today: totalToday || 0,
      rooms_occupied: checkedIn || 0,
      departures_today: departuresToday || 0,
      new_check_ins_today: newCheckIns || 0
    };
  }
}

export default GuestService;
