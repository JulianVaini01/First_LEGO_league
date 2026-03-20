import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { Score } from '../App';
import { supabase } from '../lib/supabase';

interface ScoreDisplayPageProps {
  scores: Score[];
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

interface TeamScore {
  team_id: string;
  team_name: string;
  team_code: string;
  total_score: number;
  round_count: number;
  best_score: number;
  rounds: Array<{ round: number; score: number }>;
  round0?: number;
  round1?: number;
  round2?: number;
  round3?: number;
  core_values?: number | null;
}

export default function ScoreDisplayPage({ scores, onNavigate }: ScoreDisplayPageProps) {
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamScores();

    const interval = setInterval(() => {
      loadTeamScores();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadTeamScores = async () => {
    const { data: allScores } = await supabase
      .from('team_scores')
      .select('*, teams(name, code, core_values)')
      .order('score', { ascending: false });

    if (allScores) {
      const teamMap = new Map<string, TeamScore>();

      allScores.forEach((score: any) => {
        const teamId = score.team_id;
        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, {
            team_id: teamId,
            team_name: score.teams?.name || 'N/A',
            team_code: score.teams?.code || 'N/A',
            total_score: 0,
            round_count: 0,
            best_score: 0,
            rounds: [],
            round0: undefined,
            round1: undefined,
            round2: undefined,
            round3: undefined,
            core_values: score.teams?.core_values || null,
          });
        }

        const teamData = teamMap.get(teamId)!;
        teamData.rounds.push({ round: score.round, score: score.score });

        // Guardar puntaje por ronda específica
        if (score.round === 0) teamData.round0 = score.score;
        if (score.round === 1) teamData.round1 = score.score;
        if (score.round === 2) teamData.round2 = score.score;
        if (score.round === 3) teamData.round3 = score.score;

        teamData.round_count++;

        // El mejor puntaje excluye la ronda 0
        if (score.round !== 0) {
          teamData.best_score = Math.max(teamData.best_score, score.score);
        }
      });

      const teamsArray = Array.from(teamMap.values()).map(team => {
        // Filtrar solo las rondas oficiales (1, 2, 3) para el cálculo del total
        const officialRounds = team.rounds.filter(r => r.round !== 0);
        const sortedRounds = officialRounds.sort((a, b) => b.score - a.score);
        const topRounds = sortedRounds.slice(0, 3);
        team.total_score = topRounds.reduce((sum, round) => sum + round.score, 0);
        return team;
      });

      teamsArray.sort((a, b) => b.total_score - a.total_score);

      setTeamScores(teamsArray);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-50 z-0"
        onError={(e) => {
          // Fallback to image if video fails to load
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0';
          fallback.style.backgroundImage = 'url(./FIRST_AGE-powerpoint-template2.jpg)';
          target.parentNode?.appendChild(fallback);
        }}
      >
        <source src="./first-lego-video.mp4" type="video/mp4" />
        {/* Fallback image if video not supported */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0"
          style={{
            backgroundImage: 'url(./FIRST_AGE-powerpoint-template2.jpg)'
          }}
        />
      </video>
      
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-white">Pantalla de Puntuación</h1>
            </div>
            {/* Logos in top right */}
            <div className="hidden md:flex items-center space-x-4">
              <img
                src="./Imagen2.png"
                alt="First Lego League"
                className="h-16 w-auto"
              />
              <img
                src="./Imagen1.png"
                alt="UNNO"
                className="h-16 w-auto rounded-lg px-1 py-0.5"
              />
            </div>
            {/* Mobile logos */}
            <div className="md:hidden absolute top-4 right-4 flex items-center space-x-2">
              <img 
                src="./Imagen2.png" 
                alt="First Lego League" 
                className="h-6 w-auto"
              />
              <img 
                src="./Imagen1.jpg" 
                alt="UNNO" 
                className="h-6 w-auto bg-white rounded px-1 py-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Team Standings */}
        {loading ? (
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-12 mb-8 border border-amber-500/20 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-white text-xl mb-2">Cargando puntuaciones...</p>
          </div>
        ) : teamScores.length > 0 ? (
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Trophy className="h-8 w-8 text-amber-400 mr-3" />
                Clasificación General
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-amber-500/30">
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Posición</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Código</th>
                    <th className="text-left py-4 px-3 text-amber-300 font-bold">Equipo</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Ronda 0</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Ronda 1</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Ronda 2</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Ronda 3</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Mejor Ronda</th>
                    <th className="text-center py-4 px-3 text-amber-300 font-bold">Core Values</th>
                  </tr>
                </thead>
                <tbody>
                  {teamScores.map((team, index) => (
                    <tr
                      key={team.team_id}
                      className={`border-b border-amber-500/10 transition-all duration-300 ${
                        index < 3 ? 'bg-amber-500/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-4 px-3 text-center">
                        <div className="flex items-center justify-center">
                          {index === 0 && (
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-2">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center mr-2">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center mr-2">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <span className={`text-2xl font-bold ${
                            index < 3 ? 'text-amber-400' : 'text-white'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="text-gray-300 font-mono text-sm">{team.team_code}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-white font-semibold text-lg">{team.team_name}</span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`${team.round0 !== undefined ? 'text-gray-400 font-semibold' : 'text-gray-600'}`}>
                          {team.round0 !== undefined ? team.round0 : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`${team.round1 !== undefined ? 'text-white font-semibold text-lg' : 'text-gray-600'}`}>
                          {team.round1 !== undefined ? team.round1 : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`${team.round2 !== undefined ? 'text-white font-semibold text-lg' : 'text-gray-600'}`}>
                          {team.round2 !== undefined ? team.round2 : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`${team.round3 !== undefined ? 'text-white font-semibold text-lg' : 'text-gray-600'}`}>
                          {team.round3 !== undefined ? team.round3 : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                          <span className="text-green-400 font-bold text-xl">{team.best_score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        {team.core_values !== null && team.core_values !== undefined ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                            <span className="text-blue-400 font-bold text-lg">{team.core_values}</span>
                          </div>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-12 mb-8 border border-amber-500/20 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-white text-xl mb-2">No hay puntuaciones registradas</p>
            <p className="text-gray-400">Las puntuaciones aparecerán aquí en tiempo real</p>
          </div>
        )}
      </div>
    </div>
  );
}