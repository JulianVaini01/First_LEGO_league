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
      .select('*, teams(name, code)')
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
            rounds: []
          });
        }

        const teamData = teamMap.get(teamId)!;
        teamData.rounds.push({ round: score.round, score: score.score });
        teamData.round_count++;
        teamData.best_score = Math.max(teamData.best_score, score.score);
      });

      const teamsArray = Array.from(teamMap.values()).map(team => {
        const sortedRounds = team.rounds.sort((a, b) => b.score - a.score);
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
              <div className="text-sm text-gray-400">
                Se suman las mejores 3 rondas de cada equipo
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-amber-500/30">
                    <th className="text-left py-4 px-4 text-amber-300 font-bold">Posición</th>
                    <th className="text-left py-4 px-4 text-amber-300 font-bold">Código</th>
                    <th className="text-left py-4 px-4 text-amber-300 font-bold">Equipo</th>
                    <th className="text-center py-4 px-4 text-amber-300 font-bold">Rondas</th>
                    <th className="text-center py-4 px-4 text-amber-300 font-bold">Mejor Ronda</th>
                    <th className="text-right py-4 px-4 text-amber-300 font-bold">Total Acumulado</th>
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
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {index === 0 && (
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center mr-3">
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
                      <td className="py-4 px-4">
                        <span className="text-gray-300 font-mono text-sm">{team.team_code}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-lg">{team.team_name}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-gray-300">{team.round_count}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                          <span className="text-green-400 font-bold">{team.best_score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-3xl font-bold ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-orange-500' :
                          'text-amber-400'
                        }`}>
                          {team.total_score}
                        </span>
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