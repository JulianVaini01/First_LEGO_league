/*
  # Add UPDATE policy for teams table

  1. Changes
    - Add UPDATE policy to allow everyone to update teams
    - This is needed to update core_values field

  2. Security
    - Policy allows public users to update team records
    - This matches the existing INSERT and SELECT policies
*/

CREATE POLICY "Teams can be updated by everyone"
  ON teams
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
