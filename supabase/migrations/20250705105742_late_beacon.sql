/*
  # Add Slack integration to employees table

  1. Schema Updates
    - Ensure employees table exists
    - Add slack_id column for Slack user mapping
    - Add indexes for performance

  2. Data Management
    - Clear sample data to prepare for real Slack data
    - Maintain existing RLS policies
*/

-- Create employees table if it doesn't exist
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  department text,
  is_manager boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add slack_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'slack_id'
  ) THEN
    ALTER TABLE employees ADD COLUMN slack_id text UNIQUE;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_name_lower ON employees(lower(name));
CREATE INDEX IF NOT EXISTS idx_employees_slack_id ON employees(slack_id);

-- Enable RLS if not already enabled
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Ensure RLS policy exists for public access (needed for visitor check-in)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'employees' 
    AND policyname = 'Public can read employees'
  ) THEN
    CREATE POLICY "Public can read employees"
      ON employees
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Clear existing sample data to prepare for real Slack data
DELETE FROM employees WHERE slack_id IS NULL;

-- Add some basic sample data if table is completely empty (fallback)
INSERT INTO employees (name, role, department, is_manager) 
SELECT 'System Admin', 'Administrator', 'IT', true
WHERE NOT EXISTS (SELECT 1 FROM employees LIMIT 1);