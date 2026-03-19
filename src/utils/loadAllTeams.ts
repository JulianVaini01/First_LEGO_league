import { supabase } from '../lib/supabase';

const API_URL = "https://script.google.com/macros/s/AKfycbyO4Kn2nc2DxYGWqhjFZUP_ZADkUYPjrtZd7x3BVwAJ9Oznj8yk2Zibbnt5aFBwpsW03w/exec";

export async function loadAllTeamsToDatabase() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.equipos || !Array.isArray(data.equipos)) {
      return { success: false, message: 'No se pudieron obtener los equipos desde Google Sheets' };
    }

    const teams = data.equipos;
    let created = 0;
    let updated = 0;

    for (const team of teams) {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id, name, code')
        .eq('name', team.equipo)
        .maybeSingle();

      if (existingTeam) {
        if (existingTeam.code !== team.codigo) {
          await supabase
            .from('teams')
            .update({ code: team.codigo })
            .eq('id', existingTeam.id);
          console.log(`Updated team: ${team.equipo} with code ${team.codigo}`);
          updated++;
        }
      } else {
        await supabase
          .from('teams')
          .insert([{ name: team.equipo, code: team.codigo }]);
        console.log(`Created team: ${team.equipo} with code ${team.codigo}`);
        created++;
      }
    }

    return {
      success: true,
      message: `Equipos sincronizados: ${created} creados, ${updated} actualizados`
    };
  } catch (error) {
    console.error('Error loading teams:', error);
    return { success: false, message: 'Error al cargar equipos: ' + error };
  }
}
