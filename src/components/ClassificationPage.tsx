import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { Score } from '../App';

interface ClassificationPageProps {
  scores: Score[];
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

export default function ClassificationPage({ scores, onNavigate }: ClassificationPageProps) {
  const standings = useMemo(() => {
    const teamStats = new Map<string, {
      team: string;
      code: string;
      bestScore: number;
      totalScore: number;
      rounds: number;
      averageScore: number;
      averageProfessionalism: number;
      bestRound: number;
    }>();

    scores.forEach(score => {
      const existing = teamStats.get(score.team) || {
        team: score.team,
        code: score.code,
        bestScore: 0,
        totalScore: 0,
        rounds: 0,
        averageScore: 0,
        averageProfessionalism: 0,
        bestRound: 0
      };

      existing.totalScore += score.score;
      existing.rounds += 1;
      existing.bestScore = Math.max(existing.bestScore, score.score);
      existing.averageScore = existing.totalScore / existing.rounds;
      existing.averageProfessionalism = ((existing.averageProfessionalism * (existing.rounds - 1)) + score.professionalism) / existing.rounds;
      
      if (score.score === existing.bestScore) {
        existing.bestRound = score.round;
      }

      teamStats.set(score.team, existing);
    });

    return Array.from(teamStats.values())
      .sort((a, b) => b.bestScore - a.bestScore)
      .map((team, index) => ({ ...team, position: index + 1 }));
  }, [scores]);

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-orange-600" />;
      default:
        return <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">{position}</div>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0"
        style={{
          backgroundImage: 'url(/FIRST_AGE-powerpoint-template2.jpg)'
        }}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-white">Tabla de Clasificación</h1>
            </div>
            {/* Logos in top right */}
            <div className="flex items-center space-x-4 mr-8">
              <img 
                src="/Imagen2.png" 
                alt="First Lego League" 
                className="h-10 w-auto"
              />
              <img 
                src="/Imagen1.jpg" 
                alt="UNNO" 
                className="h-10 w-auto bg-white rounded-lg px-2 py-1"
              />
            </div>
            <div className="text-right">
              <p className="text-gray-300">Equipos Participantes</p>
              <p className="text-2xl font-bold text-white">{standings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {standings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-400 text-lg mb-2">No hay clasificaciones disponibles</p>
            <p className="text-gray-500">Las clasificaciones aparecerán después de que los equipos completen sus evaluaciones</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {standings.length >= 3 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Podium</h2>
                <div className="flex justify-center items-end space-x-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-6 mb-4 transform hover:scale-105 transition-transform">
                      <Medal className="h-16 w-16 text-white mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">{standings[1].team}</h3>
                      <p className="text-gray-200 text-3xl font-bold">{standings[1].bestScore}</p>
                      <p className="text-gray-300 text-sm">pts</p>
                    </div>
                    <div className="bg-gray-400 h-24 rounded-t-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">2°</span>
                    </div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-8 mb-4 transform hover:scale-105 transition-transform shadow-2xl">
                      <Trophy className="h-20 w-20 text-white mx-auto mb-4" />
                      <h3 className="text-white font-bold text-xl mb-2">{standings[0].team}</h3>
                      <p className="text-white text-4xl font-bold">{standings[0].bestScore}</p>
                      <p className="text-yellow-200 text-sm">pts</p>
                    </div>
                    <div className="bg-yellow-500 h-32 rounded-t-lg flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">1°</span>
                    </div>
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 mb-4 transform hover:scale-105 transition-transform">
                      <Award className="h-16 w-16 text-white mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">{standings[2].team}</h3>
                      <p className="text-orange-100 text-3xl font-bold">{standings[2].bestScore}</p>
                      <p className="text-orange-200 text-sm">pts</p>
                    </div>
                    <div className="bg-orange-500 h-16 rounded-t-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">3°</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings Table */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 p-1">
                <div className="bg-gray-900 rounded-t-lg">
                  <div className="px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Clasificación General</h2>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Equipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Mejor Puntuación
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Promedio
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Rondas
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Profesionalismo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {standings.map((team, index) => (
                      <tr
                        key={team.team}
                        className={`hover:bg-gray-800/50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getPodiumIcon(team.position)}
                            <span className="text-white font-bold">{team.position}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-white text-lg">{team.team}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {team.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-3xl font-bold text-yellow-400">{team.bestScore}</span>
                            <span className="text-gray-400 ml-2">pts</span>
                            <span className="text-xs text-gray-500 ml-2">(R{team.bestRound})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-400 font-semibold">{Math.round(team.averageScore)}</span>
                          <span className="text-gray-500 ml-1">pts</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {team.rounds}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-indigo-600 h-2 rounded-full mr-2" style={{width: `${(team.averageProfessionalism / 20) * 100}%`, minWidth: '20px'}} />
                            <span className="text-white font-semibold">{Math.round(team.averageProfessionalism)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}