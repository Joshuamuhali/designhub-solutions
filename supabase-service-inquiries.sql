-- Create service_inquiries table
CREATE TABLE IF NOT EXISTS service_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  service_category TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('Standard', 'Subscription', 'Bundle')),
  service_title TEXT NOT NULL,
  service_price TEXT NOT NULL,
  selected_addons TEXT[] DEFAULT '{}',
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  business_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Enable RLS
ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;

-- Create index on status and created_at
CREATE INDEX IF NOT EXISTS idx_service_inquiries_status_created_at 
ON service_inquiries (status, created_at DESC);

-- RLS Policies
-- Allow anonymous users to insert (for public inquiry forms)
CREATE POLICY IF NOT EXISTS "Allow anon insert"
ON service_inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to select and update (for team dashboard)
CREATE POLICY IF NOT EXISTS "Allow authenticated select"
ON service_inquiries
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated update"
ON service_inquiries
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
