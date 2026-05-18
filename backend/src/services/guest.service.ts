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
  private static readonly SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365;

  private static async createSignedPhotoUrl(pathOrUrl?: string): Promise<string | undefined> {
    if (!pathOrUrl) return undefined;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    const { data, error } = await supabase.storage
      .from('guest-photos')
      .createSignedUrl(pathOrUrl, this.SIGNED_URL_TTL_SECONDS);

    if (error) {
      console.error('Error creating signed photo URL:', error);
      return undefined;
    }

    return data.signedUrl;
  }

  private static async attachPhotoAliases<T extends GuestRecord | null>(guest: T): Promise<T> {
    if (!guest) return guest;

    const profilePhotoUrl = await this.createSignedPhotoUrl(guest.guest_photo_url || guest.profile_photo_url);
    const idFrontUrl = await this.createSignedPhotoUrl(guest.proof_photo_front_url || guest.id_photo_front_url);
    const idBackUrl = await this.createSignedPhotoUrl(guest.proof_photo_back_url || guest.id_photo_back_url);

    return {
      ...guest,
      guest_photo_url: profilePhotoUrl,
      proof_photo_front_url: idFrontUrl,
      proof_photo_back_url: idBackUrl,
      profile_photo_url: profilePhotoUrl,
      id_photo_front_url: idFrontUrl,
      id_photo_back_url: idBackUrl,
    } as T;
  }

  private static toDatabaseRecord(data: CreateGuestRequest) {
    const mediaData = {
      guest_photo_url: data.guest_photo_url || data.profile_photo_url,
      proof_photo_front_url: data.proof_photo_front_url || data.id_photo_front_url,
      proof_photo_back_url: data.proof_photo_back_url || data.id_photo_back_url,
    };

    const record: Record<string, any> = {
      property: data.property,
      guest_name: data.guest_name,
      gstin: data.gstin || data.gst_number,
      address: data.address,
      po: data.po,
      city: data.city,
      pin: data.pin,
      nationality: data.nationality,
      contact_number: data.contact_number,
      email: data.email,
      date_of_birth: data.date_of_birth,
      state: data.state,
      room_number: data.room_number,
      conference_hall: data.conference_hall,
      number_of_rooms: data.number_of_rooms,
      room_type: data.room_type,
      number_of_guests_male: data.number_of_guests_male,
      number_of_guests_female: data.number_of_guests_female,
      number_of_guests_child: data.number_of_guests_child,
      purpose_of_visit: data.purpose_of_visit,
      arrival_date: data.arrival_date,
      arrival_time: data.arrival_time,
      departure_date: data.departure_date,
      departure_time: data.departure_time,
      vehicle_number: data.vehicle_number,
      proof_type: data.proof_type,
      proof_number: data.proof_number,
      proof_date_of_issue: data.proof_date_of_issue,
      proof_valid_till: data.proof_valid_till,
      proof_place_of_issue: data.proof_place_of_issue,
      mode_of_payment: data.mode_of_payment,
      advance_payment: data.advance_payment,
      tariff: data.tariff,
      total_amount: data.total_amount,
      food_included: data.food_included,
      water_included: data.water_included,
      tea_included: data.tea_included,
      ...mediaData,
      status: (data as any).status,
      checked_out_at: (data as any).checked_out_at,
      device_id: data.device_id,
      guest_data: {
        ...(data.id_type ? { id_type: data.id_type } : {}),
        ...(data.whatsapp_receipt_sent !== undefined ? { whatsapp_receipt_sent: data.whatsapp_receipt_sent } : {}),
      },
    };

    Object.keys(record).forEach((key) => {
      if (record[key] === undefined) delete record[key];
    });

    if (record.guest_data && Object.keys(record.guest_data).length === 0) {
      delete record.guest_data;
    }

    return record;
  }

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
      ...this.toDatabaseRecord(sanitizedData),
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

    return this.attachPhotoAliases(insertedGuest);
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

    return this.attachPhotoAliases(data);
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

    const guestsWithPhotoUrls = await Promise.all((data || []).map((guest) => this.attachPhotoAliases(guest)));

    return {
      data: guestsWithPhotoUrls,
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

    return Promise.all((data || []).map((guest) => this.attachPhotoAliases(guest)));
  }

  /**
   * Update guest record
   */
  static async updateGuest(id: string, updates: Partial<CreateGuestRequest>, property?: Property): Promise<GuestRecord> {
    // Check if guest exists
    let existingQuery = supabase
      .from('guest_records')
      .select('*')
      .eq('id', id);

    if (property) {
      existingQuery = existingQuery.eq('property', property);
    }

    const { data: existingGuest, error: existingError } = await existingQuery.single();

    if (existingError || !existingGuest) {
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
        ...this.toDatabaseRecord(sanitizedUpdates),
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

    return this.attachPhotoAliases(data);
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

    return this.attachPhotoAliases(data);
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
