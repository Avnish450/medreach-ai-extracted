-- Supabase Schema for MedReach AI (Community Rescue Network)
-- Run this in your Supabase SQL Editor

-- Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- We will use simple numeric lat/lng for demo ease, instead of requiring PostGIS right away.
-- If you want to use PostGIS, you can alter these tables later.

CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Optional: references auth.users if using Supabase Auth
  name TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  certifications JSONB DEFAULT '[]',
  vehicle_info JSONB,
  is_online BOOLEAN DEFAULT false,
  lat NUMERIC, 
  lng NUMERIC,
  rating NUMERIC(2,1) DEFAULT 5.0,
  total_rescues INT DEFAULT 0,
  avg_response_time_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sos_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID, -- Optional: references auth.users
  patient_name TEXT,
  volunteer_id UUID REFERENCES volunteers(id),
  volunteer_name TEXT,
  status TEXT DEFAULT 'broadcasting',
  urgency TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  destination_hospital JSONB,
  symptoms TEXT,
  triage_data JSONB,
  broadcast_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  auto_escalated_112 BOOLEAN DEFAULT false
);

CREATE TABLE incident_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES sos_incidents(id),
  update_type TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incidents_status ON sos_incidents(status);

-- Enable Realtime
-- IMPORTANT: Go to Supabase Dashboard -> Database -> Replication -> Click '0 tables' under Source -> Enable 'sos_incidents'
-- Alternatively, if running this script as a superuser:
-- ALTER PUBLICATION supabase_realtime ADD TABLE sos_incidents;
