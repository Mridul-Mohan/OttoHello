/*
  # Make person_to_meet column nullable

  1. Changes
    - Remove NOT NULL constraint from person_to_meet column in visitors table
    - This allows the column to be null since we now use person_to_meet_id as foreign key

  2. Reasoning
    - The person_to_meet_id column now serves as the primary reference to employees
    - The person_to_meet text column can be derived from the employee relationship
    - Making it nullable prevents constraint violations during insert operations
*/

-- Remove NOT NULL constraint from person_to_meet column
ALTER TABLE visitors ALTER COLUMN person_to_meet DROP NOT NULL;