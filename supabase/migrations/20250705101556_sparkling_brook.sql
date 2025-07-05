/*
  # Fix visitor management schema

  1. Schema Updates
    - Add person_to_meet_id column to visitors table as foreign key to employees
    - Update existing data to maintain compatibility
    - Add proper indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure foreign key constraints work with public access

  3. Data Migration
    - Safely add the new column without breaking existing functionality
*/

-- Add person_to_meet_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visitors' AND column_name = 'person_to_meet_id'
  ) THEN
    ALTER TABLE visitors ADD COLUMN person_to_meet_id uuid REFERENCES employees(id);
  END IF;
END $$;

-- Add index for better performance on foreign key lookups
CREATE INDEX IF NOT EXISTS idx_visitors_person_to_meet_id ON visitors(person_to_meet_id);

-- Ensure we have the proper constraint name for the foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'visitors_person_to_meet_id_fkey' 
    AND table_name = 'visitors'
  ) THEN
    ALTER TABLE visitors 
    ADD CONSTRAINT visitors_person_to_meet_id_fkey 
    FOREIGN KEY (person_to_meet_id) REFERENCES employees(id);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists, do nothing
    NULL;
END $$;

-- Update RLS policies to ensure they work with the new schema
DROP POLICY IF EXISTS "Public can insert visitors" ON visitors;
DROP POLICY IF EXISTS "Public can read visitors" ON visitors;
DROP POLICY IF EXISTS "Public can update visitors" ON visitors;

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

-- Ensure employees table has proper sample data
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
ON CONFLICT (name) DO NOTHING;