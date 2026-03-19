import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Trophy, Target } from 'lucide-react';
import { Score } from '../App';
import { supabase, TeamScore, Team } from '../lib/supabase';

interface RecordsPageProps {
  scores: Score[];
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

interface TeamScoreWithTeam extends TeamScore {
  team?: Team;
}

export default function RecordsPage({ scores, onNavigate }: RecordsPageProps) {
  const [dbScores, setDbScores] = useState<TeamScoreWithTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScoresFromDB();
  }, []);

  const loadScoresFromDB = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyO4Kn2nc2DxYGWqhjFZUP_ZADkUYPjrtZd7x3BVwAJ9Oznj8yk2Zibbnt5aFBwpsW03w/exec');
      if (!response.ok) return;

      const data = await response.json();
      if (data && data.clasificacion) {
        const allScores: TeamScoreWithTeam[] = [];

        data.clasificacion.forEach((team: any) => {
          const rounds = [
            { round: 0, score: team.ronda0 },
            { round: 1, score: team.ronda1 },
            { round: 2, score: team.ronda2 },
            { round: 3, score: team.ronda3 }
          ];

          rounds.forEach(({ round, score }) => {
            if (score > 0) {
              allScores.push({
                id: `${team.codigo}-r${round}`,
                team_id: team.codigo,
                round: round,
                score: score,
                equipment_inspection: 0,
                precision_tokens: 0,
                table_name: '',
                created_at: new Date().toISOString(),
                team: {
                  id: team.codigo,
                  code: team.codigo,
                  name: team.equipo,
                  core_values: null
                }
              });
            }
          });
        });

        allScores.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setDbScores(allScores);
      }
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const combinedScores = dbScores.map(s => ({
    id: s.id,
    timestamp: new Date(s.created_at).toLocaleString('es-ES'),
    code: s.team?.code || '',
    table: s.table_name || '',
    team: s.team?.name || '',
    round: s.round,
    score: s.score,
    equipmentInspection: s.equipment_inspection,
    missions: {},
    precisionTokens: s.precision_tokens
  } as Score)).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={{
          backgroundImage: 'url(./FIRST_AGE-powerpoint-template2.jpg)'
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
              <h1 className="text-3xl font-bold text-white">Registro de Puntuaciones</h1>
            </div>
            {/* Logos in top right */}
            <div className="hidden md:flex items-center space-x-4 mr-8">
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
                src="./Imagen1.png" 
                alt="UNNO" 
                className="h-6 w-auto rounded px-1 py-0.5"
              />
            </div>
            <div className="text-right">
              <p className="text-gray-300">Total de registros</p>
              <p className="text-2xl font-bold text-white">{combinedScores.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* F1/Cycling Style Dashboard */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Puntuaciones Hoy</p>
                <p className="text-2xl font-bold text-white">{combinedScores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Equipos Únicos</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(combinedScores.map(s => s.team)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mejor Puntuación</p>
                <p className="text-2xl font-bold text-white">
                  {combinedScores.length > 0 ? Math.max(...combinedScores.map(s => s.score)) : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Promedio</p>
                <p className="text-2xl font-bold text-white">
                  {combinedScores.length > 0 ? Math.round(combinedScores.reduce((a, b) => a + b.score, 0) / combinedScores.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 p-1">
            <div className="bg-gray-900 rounded-t-lg">
              <div className="px-6 py-4">
                <h2 className="text-xl font-bold text-white">Historial de Puntuaciones</h2>
              </div>
            </div>
          </div>
          
          {combinedScores.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-400 text-lg">No hay registros de puntuación aún</p>
              <p className="text-gray-500">Las puntuaciones aparecerán aquí después de evaluar equipos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Marca Temporal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Mesa
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Ronda
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Puntuación
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Inspección Equipamiento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {combinedScores.map((score, index) => (
                    <tr
                      key={score.id}
                      className={`hover:bg-gray-800/50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {score.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {score.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {score.table}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{score.team}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          R{score.round}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-yellow-400">{score.score}</span>
                          <span className="text-gray-400 ml-2">pts</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${score.equipmentInspection > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-white font-semibold">{score.equipmentInspection > 0 ? '20 pts' : '0 pts'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}