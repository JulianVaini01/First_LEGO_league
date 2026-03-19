import { supabase } from '../lib/supabase';

export const allTeams = [
  { name: 'CIBEROWLS', code: 'CBO01' },
  { name: 'CALIBOTS KAIROS', code: 'CBK02' },
  { name: 'ARQUEOBOTS', code: 'ARB03' },
  { name: 'ARQUEOMIND', code: 'ARM04' },
  { name: 'POWERLEGO', code: 'PWL05' },
  { name: 'FUTURETECH', code: 'FTT06' },
  { name: 'UNICO', code: 'UNI07' },
  { name: 'ROBOX', code: 'RBX08' },
  { name: 'FUN+QREATIVOS', code: 'FNQ09' },
  { name: 'MECHATITANS', code: 'MCT10' },
  { name: 'PHOENIX BOTS', code: 'PHB11' },
  { name: 'LEGO MONSTERS', code: 'LGM12' },
  { name: 'ENCA_STEAMCO', code: 'EST13' },
  { name: 'CRONOBOTS', code: 'CRB14' },
  { name: 'ARQUEOX', code: 'ARX15' },
  { name: 'CYBERNOVA', code: 'CBN16' },
  { name: 'ROBOT KINGS', code: 'RBK17' },
  { name: 'TECNO ANDES', code: 'TCA18' },
  { name: 'KING ROBOT', code: 'KRB19' },
  { name: 'REFOUSINNOVA', code: 'RFI20' },
  { name: 'JURASSIC BRICKS', code: 'JRB21' },
  { name: 'ROBOTGAME', code: 'RBG22' },
  { name: 'SAN RAFABOTS', code: 'SRB23' },
  { name: 'SKADI', code: 'SKD24' },
  { name: 'VI TECH', code: 'VIT25' },
  { name: 'LEGION CIBERNETICA', code: 'LGC26' },
  { name: 'ROFU', code: 'RFU27' },
  { name: 'STAR VI', code: 'STV28' },
  { name: 'TOTEM STEM', code: 'TTS29' },
  { name: 'M.A.B (MENTE A BLOQUES)', code: 'MAB30' },
  { name: 'ECO HACKERS', code: 'ECH31' },
  { name: 'ROSARIO', code: 'RSR32' },
  { name: 'CYBERLEGO', code: 'CBL33' },
  { name: 'ITAROBOT', code: 'ITR34' },
  { name: 'FIREBOTS', code: 'FRB35' },
  { name: 'LANCEROS CHALL', code: 'LNC36' },
  { name: 'IRON MACHINE', code: 'IRM37' },
  { name: 'APPLEBOTS', code: 'APB38' },
  { name: 'GIGOBOTS', code: 'GGB39' },
  { name: 'FRAY', code: 'FRY40' },
  { name: 'ROBOTSCHOOL', code: 'RBS41' },
  { name: 'BUMBLEBEE', code: 'BMB42' }
];

export async function loadAllTeamsToDatabase() {
  try {
    for (const team of allTeams) {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id, name, code')
        .eq('name', team.name)
        .maybeSingle();

      if (existingTeam) {
        if (existingTeam.code !== team.code) {
          await supabase
            .from('teams')
            .update({ code: team.code })
            .eq('id', existingTeam.id);
          console.log(`Updated team: ${team.name} with code ${team.code}`);
        }
      } else {
        await supabase
          .from('teams')
          .insert([{ name: team.name, code: team.code }]);
        console.log(`Created team: ${team.name} with code ${team.code}`);
      }
    }

    return { success: true, message: 'Todos los equipos han sido cargados correctamente' };
  } catch (error) {
    console.error('Error loading teams:', error);
    return { success: false, message: 'Error al cargar equipos: ' + error };
  }
}
