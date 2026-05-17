-- ============================================
-- Shiyaf Hotels - Supabase Database Setup
-- ============================================
-- Run this SQL in Supabase Dashboard → SQL Editor

-- Create guest_records table
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_guest_records_updated_at ON guest_records;
CREATE TRIGGER update_guest_records_updated_at
  BEFORE UPDATE ON guest_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a test record
INSERT INTO guest_records (
  property,
  guest_name,
  contact_number,
  nationality,
  room_number,
  arrival_date
) VALUES (
  'plaza',
  'Test Guest',
  '9876543210',
  'Indian',
  '101',
  CURRENT_DATE
) ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Table created successfully!' AS message;
SELECT COUNT(*) AS total_records FROM guest_records;
