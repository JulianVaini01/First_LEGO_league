import { supabase } from '../lib/supabase';

const teamsToSeed = [
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

export async function seedTeams() {
  console.log('Iniciando carga de equipos...');

  for (const team of teamsToSeed) {
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('code', team.code)
      .maybeSingle();

    if (!existingTeam) {
      const { error } = await supabase
        .from('teams')
        .insert([team]);

      if (error) {
        console.error(`Error al insertar ${team.name}:`, error);
      } else {
        console.log(`✓ ${team.name} insertado con código ${team.code}`);
      }
    } else {
      console.log(`- ${team.name} ya existe`);
    }
  }

  console.log('Carga de equipos completada');
}
