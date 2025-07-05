/*
  # Create OttoHello Visitor Management System Schema

  1. New Tables
    - `visitors` - Store visitor check-in/check-out data
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `person_to_meet` (text)
      - `reason_to_visit` (text)
      - `phone_number` (text)
      - `photo_url` (text)
      - `checked_in_at` (timestamp)
      - `checked_out_at` (timestamp)
      - `status` (text: 'checked_in', 'checked_out')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `late_arrivals` - Store late employee check-ins
      - `id` (uuid, primary key)
      - `employee_name` (text)
      - `reporting_manager` (text)
      - `reason_for_lateness` (text)
      - `check_in_time` (timestamp)
      - `created_at` (timestamp)

    - `employees` - Store employee and manager data for autocomplete
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `department` (text)
      - `is_manager` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a kiosk system)
*/

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

CREATE TABLE IF NOT EXISTS late_arrivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  reporting_manager text NOT NULL,
  reason_for_lateness text NOT NULL,
  check_in_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

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

-- Create policies for public access (kiosk system)
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

CREATE POLICY "Public can read employees"
  ON employees
  FOR SELECT
  TO anon
  USING (true);

-- Insert sample employees for autocomplete
INSERT INTO employees (name, role, department, is_manager) VALUES
  ('John Smith', 'CEO', 'Leadership', true),
  ('Sarah Johnson', 'VP Marketing', 'Marketing', true),
  ('Mike Davis', 'CTO', 'Engineering', true),
  ('Emily Brown', 'HR Director', 'Human Resources', true),
  ('David Wilson', 'Sales Manager', 'Sales', true),
  ('Lisa Garcia', 'Senior Developer', 'Engineering', false),
  ('Tom Anderson', 'Marketing Specialist', 'Marketing', false),
  ('Anna Martinez', 'Designer', 'Design', false),
  ('Chris Taylor', 'Account Manager', 'Sales', false),
  ('Jessica Lee', 'Operations Manager', 'Operations', true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for visitors table
CREATE TRIGGER update_visitors_updated_at
  BEFORE UPDATE ON visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();