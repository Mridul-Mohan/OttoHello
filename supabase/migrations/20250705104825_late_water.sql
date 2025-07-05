/*
  # Add Slack integration to employees table

  1. Schema Updates
    - Add slack_id column to employees table for Slack user mapping
    - Add unique constraint on slack_id
    - Clear existing sample data to prepare for Slack data

  2. Security
    - Maintain existing RLS policies
*/

-- Add slack_id column to employees table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'slack_id'
  ) THEN
    ALTER TABLE employees ADD COLUMN slack_id text UNIQUE;
  END IF;
END $$;

-- Add index for better performance on slack_id lookups
CREATE INDEX IF NOT EXISTS idx_employees_slack_id ON employees(slack_id);

-- Clear existing sample data to prepare for real Slack data
DELETE FROM employees WHERE slack_id IS NULL;