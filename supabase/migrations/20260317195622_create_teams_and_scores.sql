/*
  # Create Teams and Scores Tables

  1. New Tables
    - `teams`: Store team information with unique codes
      - `id` (uuid, primary key)
      - `name` (text, team name)
      - `code` (text, unique identifier)
      - `created_at` (timestamp)
    
    - `team_scores`: Store scores linked to teams
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key to teams)
      - `round` (integer)
      - `table` (text)
      - `score` (integer)
      - `equipment_inspection` (integer)
      - `precision_tokens` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policy for public read access
    - Add policy for public insert (no auth required for demo)
    - Add policy to prevent code duplication per team
*/

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  round integer NOT NULL,
  table_name text,
  score integer DEFAULT 0,
  equipment_inspection integer DEFAULT 0,
  precision_tokens integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, round)
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Teams can be inserted by everyone"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Scores are viewable by everyone"
  ON team_scores FOR SELECT
  USING (true);

CREATE POLICY "Scores can be inserted by everyone"
  ON team_scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Scores can be updated by everyone"
  ON team_scores FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);
CREATE INDEX IF NOT EXISTS idx_scores_team_id ON team_scores(team_id);
CREATE INDEX IF NOT EXISTS idx_scores_round ON team_scores(round);