/*
  # Debug and Fix Database Schema

  1. Ensure proper table structure
  2. Add comprehensive sample data
  3. Verify RLS policies
  4. Add debugging functions
*/

-- Ensure employees table exists with correct structure
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  department text,
  is_manager boolean DEFAULT false,
  slack_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Ensure visitors table exists with correct structure
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  person_to_meet text NOT NULL,
  person_to_meet_id uuid REFERENCES employees(id),
  reason_to_visit text NOT NULL,
  phone_number text NOT NULL,
  photo_url text,
  checked_in_at timestamptz DEFAULT now(),
  checked_out_at timestamptz,
  status text DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure late_arrivals table exists
CREATE TABLE IF NOT EXISTS late_arrivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  reporting_manager text NOT NULL,
  reason_for_lateness text NOT NULL,
  check_in_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE late_arrivals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Public can read employees" ON employees;
DROP POLICY IF EXISTS "Public can insert visitors" ON visitors;
DROP POLICY IF EXISTS "Public can read visitors" ON visitors;
DROP POLICY IF EXISTS "Public can update visitors" ON visitors;
DROP POLICY IF EXISTS "Public can insert late arrivals" ON late_arrivals;
DROP POLICY IF EXISTS "Public can read late arrivals" ON late_arrivals;

-- Create comprehensive policies for public access (kiosk system)
CREATE POLICY "Public can read employees"
  ON employees
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert visitors"
  ON visitors
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can read visitors"
  ON visitors
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can update visitors"
  ON visitors
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public can insert late arrivals"
  ON late_arrivals
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can read late arrivals"
  ON late_arrivals
  FOR SELECT
  TO anon
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_name_lower ON employees(lower(name));
CREATE INDEX IF NOT EXISTS idx_employees_slack_id ON employees(slack_id);
CREATE INDEX IF NOT EXISTS idx_visitors_status ON visitors(status);
CREATE INDEX IF NOT EXISTS idx_visitors_checked_in_at ON visitors(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_visitors_person_to_meet_id ON visitors(person_to_meet_id);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);

-- Clear existing data and add comprehensive sample employees
DELETE FROM visitors;
DELETE FROM employees;

INSERT INTO employees (name, role, department, is_manager, slack_id) VALUES
  ('Arjun Vaidya', 'CEO', 'Leadership', true, 'U001'),
  ('Priya Sharma', 'CTO', 'Technology', true, 'U002'),
  ('Rahul Kumar', 'VP Sales', 'Sales', true, 'U003'),
  ('Sneha Patel', 'HR Director', 'Human Resources', true, 'U004'),
  ('Vikram Singh', 'Lead Developer', 'Technology', false, 'U005'),
  ('Anita Desai', 'Marketing Manager', 'Marketing', true, 'U006'),
  ('Rohit Gupta', 'Product Manager', 'Product', false, 'U007'),
  ('Kavya Nair', 'UX Designer', 'Design', false, 'U008'),
  ('Amit Joshi', 'Sales Executive', 'Sales', false, 'U009'),
  ('Deepika Rao', 'Content Writer', 'Marketing', false, 'U010'),
  ('Vinayak Mehta', 'Senior Developer', 'Technology', false, 'U011'),
  ('Ravi Patel', 'DevOps Engineer', 'Technology', false, 'U012'),
  ('Sanjana Iyer', 'Business Analyst', 'Operations', false, 'U013'),
  ('Karthik Reddy', 'QA Lead', 'Technology', true, 'U014'),
  ('Meera Krishnan', 'Finance Manager', 'Finance', true, 'U015');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for visitors table
DROP TRIGGER IF EXISTS update_visitors_updated_at ON visitors;
CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON visitors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a debug function to test database connectivity
CREATE OR REPLACE FUNCTION debug_database_status()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'employees_count', (SELECT count(*) FROM employees),
    'visitors_count', (SELECT count(*) FROM visitors),
    'late_arrivals_count', (SELECT count(*) FROM late_arrivals),
    'sample_employees', (SELECT array_agg(name) FROM employees LIMIT 5),
    'timestamp', now()
  ) INTO result;
  
  RETURN result;
END;
$$ language 'plpgsql';