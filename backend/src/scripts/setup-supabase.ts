/**
 * Supabase Setup Script
 * This script automatically creates storage buckets and database tables
 */

import { supabase } from '../config/supabase.config';

async function setupSupabase() {
  console.log('🚀 Starting Supabase setup...\n');

  try {
    // Step 1: Create Storage Buckets
    console.log('📁 Creating storage buckets...');
    
    // Create guest-documents bucket
    const { error: docError } = await supabase.storage.createBucket('guest-documents', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    });

    if (docError && !docError.message.includes('already exists')) {
      console.error('❌ Error creating guest-documents bucket:', docError.message);
    } else {
      console.log('✅ guest-documents bucket created (or already exists)');
    }

    // Create guest-photos bucket
    const { error: photoError } = await supabase.storage.createBucket('guest-photos', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg']
    });

    if (photoError && !photoError.message.includes('already exists')) {
      console.error('❌ Error creating guest-photos bucket:', photoError.message);
    } else {
      console.log('✅ guest-photos bucket created (or already exists)');
    }

    // Step 2: Create Database Tables
    console.log('\n📊 Creating database tables...');

    // Create guest_records table
    await supabase.rpc('create_guest_records_table', {});
    
    // If RPC doesn't exist, create table using raw SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS guest_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        
        -- Property Information
        property TEXT NOT NULL CHECK (property IN ('plaza', 'century')),
        registration_number TEXT UNIQUE,
        
        -- Guest Details
        guest_name TEXT NOT NULL,
        gstin TEXT,
        address TEXT,
        po TEXT,
        city TEXT,
        pin TEXT,
        nationality TEXT NOT NULL DEFAULT 'Indian',
        contact_number TEXT NOT NULL,
        email TEXT,
        date_of_birth DATE,
        state TEXT,
        
        -- Stay Details
        room_number TEXT NOT NULL,
        conference_hall BOOLEAN DEFAULT FALSE,
        number_of_rooms INTEGER DEFAULT 1,
        room_type TEXT,
        number_of_guests_male INTEGER DEFAULT 0,
        number_of_guests_female INTEGER DEFAULT 0,
        number_of_guests_child INTEGER DEFAULT 0,
        purpose_of_visit TEXT,
        arrival_date DATE NOT NULL,
        arrival_time TIME,
        departure_date DATE,
        departure_time TIME,
        vehicle_number TEXT,
        
        -- ID Proof
        proof_type TEXT,
        proof_number TEXT,
        proof_date_of_issue DATE,
        proof_valid_till DATE,
        proof_place_of_issue TEXT,
        
        -- Payment
        mode_of_payment TEXT,
        advance_payment DECIMAL(10,2) DEFAULT 0,
        tariff DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) DEFAULT 0,
        food_included BOOLEAN DEFAULT FALSE,
        water_included BOOLEAN DEFAULT FALSE,
        tea_included BOOLEAN DEFAULT FALSE,
        
        -- Media URLs
        guest_photo_url TEXT,
        proof_photo_front_url TEXT,
        proof_photo_back_url TEXT,
        signature_url TEXT,
        
        -- Status
        status TEXT DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out', 'cancelled')),
        checked_out_at TIMESTAMPTZ,
        
        -- Sync Information
        device_id TEXT,
        sync_status TEXT DEFAULT 'synced',
        
        -- Additional Data (for flexibility)
        guest_data JSONB
      );

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_guest_records_property ON guest_records(property);
      CREATE INDEX IF NOT EXISTS idx_guest_records_created_at ON guest_records(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_guest_records_room_number ON guest_records(room_number);
      CREATE INDEX IF NOT EXISTS idx_guest_records_contact ON guest_records(contact_number);
      CREATE INDEX IF NOT EXISTS idx_guest_records_status ON guest_records(status);
      CREATE INDEX IF NOT EXISTS idx_guest_records_arrival_date ON guest_records(arrival_date);

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_guest_records_updated_at ON guest_records;
      CREATE TRIGGER update_guest_records_updated_at
        BEFORE UPDATE ON guest_records
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    // Execute the SQL using a simple query
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (sqlError) {
      console.log('⚠️  Note: Table creation via RPC not available.');
      console.log('📝 You can create the table manually using the SQL in the setup script.');
    } else {
      console.log('✅ guest_records table created (or already exists)');
    }

    // Step 3: Verify Setup
    console.log('\n🔍 Verifying setup...');

    // Check buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
    } else {
      console.log('✅ Storage buckets:', buckets.map(b => b.name).join(', '));
    }

    // Check table
    const { error: checkError } = await supabase
      .from('guest_records')
      .select('count')
      .limit(1);

    if (checkError) {
      console.log('⚠️  Table check:', checkError.message);
      console.log('📝 You may need to create the table manually in Supabase dashboard.');
    } else {
      console.log('✅ guest_records table is accessible');
    }

    console.log('\n🎉 Supabase setup completed!\n');
    console.log('Next steps:');
    console.log('1. If table creation failed, create it manually in Supabase dashboard');
    console.log('2. Run: npm run dev');
    console.log('3. Test: curl http://localhost:3000/api/v1/test-supabase\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupSupabase()
  .then(() => {
    console.log('✅ Setup script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup script failed:', error);
    process.exit(1);
  });
