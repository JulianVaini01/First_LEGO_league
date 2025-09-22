import React from 'react';
import { ArrowLeft, Clock, Users, Trophy, Target } from 'lucide-react';
import { Score } from '../App';

interface RecordsPageProps {
  scores: Score[];
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

export default function RecordsPage({ scores, onNavigate }: RecordsPageProps) {
  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-25 z-0"
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
              <h1 className="text-3xl font-bold text-white">Registro de Puntuaciones</h1>
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
              <p className="text-gray-300">Total de registros</p>
              <p className="text-2xl font-bold text-white">{scores.length}</p>
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
                <p className="text-2xl font-bold text-white">{scores.length}</p>
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
                  {new Set(scores.map(s => s.team)).size}
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
                  {scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0}
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
                  {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0}
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
          
          {scores.length === 0 ? (
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
                      Profesionalismo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {scores.slice().reverse().map((score, index) => (
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
                          <div className="bg-purple-600 h-2 rounded-full mr-2" style={{width: `${(score.professionalism / 20) * 100}%`, minWidth: '20px'}} />
                          <span className="text-white font-semibold">{score.professionalism}</span>
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