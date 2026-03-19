/*
  # Add unique constraint to team name
  
  1. Changes
    - Add unique constraint to teams.name column to prevent duplicate team names
    - This ensures each team name can only appear once in the database
  
  2. Security
    - No changes to RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'teams_name_key'
  ) THEN
    ALTER TABLE teams ADD CONSTRAINT teams_name_key UNIQUE (name);
  END IF;
END $$;
