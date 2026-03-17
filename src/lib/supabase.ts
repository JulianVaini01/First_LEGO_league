import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Team {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface TeamScore {
  id: string;
  team_id: string;
  round: number;
  table_name: string;
  score: number;
  equipment_inspection: number;
  precision_tokens: number;
  created_at: string;
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data || [];
}

export async function getTeamByCode(code: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    console.error('Error fetching team:', error);
    return null;
  }

  return data;
}

export async function createTeam(name: string, code: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .insert([{ name, code }])
    .select()
    .single();

  if (error) {
    console.error('Error creating team:', error);
    return null;
  }

  return data;
}

export async function saveTeamScore(
  teamId: string,
  round: number,
  tableName: string,
  score: number,
  equipmentInspection: number,
  precisionTokens: number
): Promise<TeamScore | null> {
  const { data, error } = await supabase
    .from('team_scores')
    .upsert(
      [{ team_id: teamId, round, table_name: tableName, score, equipment_inspection: equipmentInspection, precision_tokens: precisionTokens }],
      { onConflict: 'team_id,round' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving score:', error);
    return null;
  }

  return data;
}

export async function getTeamScores(teamId: string): Promise<TeamScore[]> {
  const { data, error } = await supabase
    .from('team_scores')
    .select('*')
    .eq('team_id', teamId)
    .order('round');

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }

  return data || [];
}
