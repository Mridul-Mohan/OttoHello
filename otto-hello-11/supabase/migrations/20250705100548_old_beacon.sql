/*
  # Fix employee search functionality

  The visitors table stores person_to_meet as text (employee name) rather than a foreign key.
  This migration ensures the employees table has proper data and indexes for efficient searching.

  1. Tables
    - Ensure employees table has proper indexes for name searching
    - Add sample employee data if table is empty

  2. Security
    - Ensure RLS policies allow reading employees for visitor check-in
*/

-- Add index on employee name for faster searching
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_name_lower ON employees(lower(name));

-- Ensure we have some sample employees if the table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM employees LIMIT 1) THEN
    INSERT INTO employees (name, role, department, is_manager) VALUES
    ('John Smith', 'CEO', 'Executive', true),
    ('Sarah Johnson', 'CTO', 'Technology', true),
    ('Mike Wilson', 'VP Sales', 'Sales', true),
    ('Emily Davis', 'HR Manager', 'Human Resources', true),
    ('David Brown', 'Senior Developer', 'Technology', false),
    ('Lisa Garcia', 'Marketing Manager', 'Marketing', true),
    ('Tom Anderson', 'Sales Representative', 'Sales', false),
    ('Jennifer Lee', 'Designer', 'Design', false),
    ('Robert Taylor', 'Product Manager', 'Product', false),
    ('Amanda White', 'Operations Manager', 'Operations', true);
  END IF;
END $$;

-- Ensure RLS policy allows anonymous users to read employees (needed for visitor check-in)
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