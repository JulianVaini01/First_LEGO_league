import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Score } from '../App';

interface ScoreDisplayPageProps {
  scores: Score[];
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

export default function ScoreDisplayPage({ scores, onNavigate }: ScoreDisplayPageProps) {
  const [selectedTable, setSelectedTable] = useState('Mesa 8');
  
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;
  const tableScores = scores.filter(score => score.table === selectedTable);
  const latestTableScore = tableScores.length > 0 ? tableScores[tableScores.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
        style={{
          backgroundImage: 'url(/FIRST_AGE-powerpoint-template2.jpg)'
        }}
      />
      
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
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 relative z-10">
        {/* Main Score Display */}
        {latestScore ? (
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-amber-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Última Puntuación</h2>
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-400/30">
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-2">{latestScore.team}</h3>
                  <p className="text-amber-200 mb-4">Ronda {latestScore.round}</p>
                  <div className="text-6xl font-bold mb-4">{latestScore.score}</div>
                  <p className="text-lg">Profesionalismo: {latestScore.professionalism}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-black/50 rounded-xl p-4 border border-amber-500/20">
                  <p className="text-gray-300">Mesa</p>
                  <p className="text-xl font-bold">{latestScore.table}</p>
                </div>
                <div className="bg-black/50 rounded-xl p-4 border border-amber-500/20">
                  <p className="text-gray-300">Código</p>
                  <p className="text-xl font-bold">{latestScore.code}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl p-12 mb-8 border border-amber-500/20 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-white text-xl mb-2">No hay puntuaciones registradas</p>
            <p className="text-gray-400">Las puntuaciones aparecerán aquí en tiempo real</p>
          </div>
        )}

        {/* Table Selection */}
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-amber-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Seleccionar Mesa</h3>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full p-3 bg-black/50 border border-amber-500/30 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {Array.from({length: 8}, (_, i) => (
              <option key={i} value={`Mesa ${i + 1}`} className="bg-gray-900">Mesa {i + 1}</option>
            ))}
          </select>
        </div>

        {/* Table Specific Display */}
        {latestTableScore && selectedTable !== 'Mesa 8' && (
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-amber-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Última Puntuación - {selectedTable}</h3>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-amber-400/30">
              <div className="text-white">
                <h4 className="text-2xl font-bold mb-2">{latestTableScore.team}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-amber-200">Ronda</p>
                    <p className="text-xl font-bold">{latestTableScore.round}</p>
                  </div>
                  <div>
                    <p className="text-amber-200">Puntuación</p>
                    <p className="text-3xl font-bold text-amber-400">{latestTableScore.score}</p>
                  </div>
                  <div>
                    <p className="text-amber-200">Profesionalismo</p>
                    <p className="text-xl font-bold">{latestTableScore.professionalism}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate('scoring')}
            className="flex-1 bg-black/80 hover:bg-black/90 border border-amber-500/50 hover:border-amber-400 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Puntuación</span>
          </button>
          
          <button
            onClick={() => onNavigate('home')}
            className="bg-black/60 hover:bg-black/80 border border-gray-500/50 hover:border-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-all"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Recent Scores Table */}
        {scores.length > 0 && (
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-amber-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Puntuaciones Recientes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-500/20">
                    <th className="text-left py-3 text-gray-300">Equipo</th>
                    <th className="text-left py-3 text-gray-300">Mesa</th>
                    <th className="text-left py-3 text-gray-300">Ronda</th>
                    <th className="text-left py-3 text-gray-300">Puntuación</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.slice(-5).reverse().map((score) => (
                    <tr key={score.id} className="border-b border-amber-500/10">
                      <td className="py-3 text-white font-semibold">{score.team}</td>
                      <td className="py-3 text-gray-300">{score.table}</td>
                      <td className="py-3 text-gray-300">R{score.round}</td>
                      <td className="py-3 text-amber-400 font-bold">{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}