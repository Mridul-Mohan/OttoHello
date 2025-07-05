/*
  # Enhanced Visitor Management System Schema

  1. New Tables
    - `visitors` - Store visitor check-in/out data with proper timestamps
    - `late_arrivals` - Store employee late arrival records with enum reasons
    - `employees` - Store employee data for autocomplete

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (kiosk usage)

  3. Changes
    - Added proper timestamp fields for check-in and check-out
    - Added enum for late arrival reasons
    - Enhanced visitor status tracking
*/

-- Create enum for late arrival reasons
CREATE TYPE late_arrival_reason AS ENUM (
  'Woke up Late',
  'Transportation Delay',
  'Manager Approved',
  'Working Late Yesterday',
  'Personal Issue',
  'Health Issue',
  'Weather Issue',
  'Early Morning Office Work'
);

-- Enhanced visitors table with proper timestamps
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  person_to_meet text NOT NULL,
  reason_to_visit text NOT NULL,
  phone_number text NOT NULL,
  photo_url text,
  checked_in_at timestamptz DEFAULT now(),
  checked_out_at timestamptz,
  status text DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced late arrivals table with enum reasons
CREATE TABLE IF NOT EXISTS late_arrivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  reporting_manager text NOT NULL,
  reason_for_lateness late_arrival_reason NOT NULL,
  check_in_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Employees table for autocomplete
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  department text,
  is_manager boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE late_arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Public access policies for kiosk usage
CREATE POLICY "Public can read visitors"
  ON visitors
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert visitors"
  ON visitors
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update visitors"
  ON visitors
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public can read employees"
  ON employees
  FOR SELECT
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

-- Insert sample employees
INSERT INTO employees (name, role, department, is_manager) VALUES
  ('Arjun Vaidya', 'CEO', 'Leadership', true),
  ('Priya Sharma', 'CTO', 'Technology', true),
  ('Rahul Kumar', 'VP Sales', 'Sales', true),
  ('Sneha Patel', 'HR Director', 'Human Resources', true),
  ('Vikram Singh', 'Lead Developer', 'Technology', false),
  ('Anita Desai', 'Marketing Manager', 'Marketing', true),
  ('Rohit Gupta', 'Product Manager', 'Product', false),
  ('Kavya Nair', 'UX Designer', 'Design', false),
  ('Amit Joshi', 'Sales Executive', 'Sales', false),
  ('Deepika Rao', 'Content Writer', 'Marketing', false)
ON CONFLICT DO NOTHING;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for visitors table
DROP TRIGGER IF EXISTS update_visitors_updated_at ON visitors;
CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON visitors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();