import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Score } from '../App';

interface ScoringPageProps {
  scores: Score[];
  onAddScore: (score: Score) => void;
  onDeleteScore: (index: number) => void;
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

interface GoogleSheetScore {
  team: string;
  code: string;
  round: number;
  score: number;
  equipmentInspection: number;
  timestamp?: string;
}

export default function ScoringPage({
  scores,
  onAddScore,
  onDeleteScore,
  onNavigate
}: ScoringPageProps) {
  const [formData, setFormData] = useState({
    team: '',
    code: '',
    round: 1,
    score: 0,
    equipmentInspection: 0
  });
  const [isLoadingFromSheet, setIsLoadingFromSheet] = useState(false);

  const loadFromGoogleSheet = useCallback(async () => {
    try {
      setIsLoadingFromSheet(true);
      const response = await fetch('https://script.google.com/macros/s/AKfycbyy96bo10sYRgVrNFHucSaujFVfWAz_6U1AHzsUcW_LT3GasdE-jT_StBsPR8STKNkPAA/exec');
      const data = await response.json();

      if (data && Array.isArray(data)) {
        data.forEach((item: GoogleSheetScore) => {
          const newScore: Score = {
            team: item.team,
            code: item.code,
            round: item.round,
            score: item.score,
            equipmentInspection: item.equipmentInspection
          };
          onAddScore(newScore);
        });
      }
    } catch (error) {
      console.error('Error loading from Google Sheet:', error);
    } finally {
      setIsLoadingFromSheet(false);
    }
  }, [onAddScore]);

  useEffect(() => {
    loadFromGoogleSheet();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.team || !formData.code) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newScore: Score = {
      team: formData.team,
      code: formData.code,
      round: formData.round,
      score: parseFloat(formData.score.toString()),
      equipmentInspection: parseFloat(formData.equipmentInspection.toString())
    };

    onAddScore(newScore);
    setFormData({
      team: '',
      code: '',
      round: 1,
      score: 0,
      equipmentInspection: 0
    });
  };

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-900">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-45 z-0"
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0';
          fallback.style.backgroundImage = 'url(./FIRST_AGE-powerpoint-template2.jpg)';
          target.parentNode?.appendChild(fallback);
        }}
      >
        <source src="./first-lego-video.mp4" type="video/mp4" />
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60 z-0"
          style={{
            backgroundImage: 'url(./FIRST_AGE-powerpoint-template2.jpg)'
          }}
        />
      </video>

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
              <h1 className="text-3xl font-bold text-white">Registro de Puntuación</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <img src="./Imagen2.png" alt="First Lego League" className="h-16 w-auto" />
              <img src="./Imagen1.png" alt="UNNO" className="h-16 w-auto rounded-lg px-1 py-0.5" />
            </div>
            <div className="text-right">
              <p className="text-gray-300">Total de Registros</p>
              <p className="text-2xl font-bold text-white">{scores.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-6 border border-gray-700 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Nueva Puntuación</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equipo</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Nombre del equipo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Código</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Código equipo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ronda</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.round}
                    onChange={(e) => setFormData({ ...formData, round: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Puntuación</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Inspección Equipamiento</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.equipmentInspection}
                    onChange={(e) => setFormData({ ...formData, equipmentInspection: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Agregar Puntuación</span>
                </button>
              </form>
            </div>
          </div>

          {/* Scores Table */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-xl font-bold text-white">Puntuaciones Registradas {isLoadingFromSheet && '(Cargando...)'}</h2>
              </div>

              {scores.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400">No hay puntuaciones registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Equipo</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Código</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ronda</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Puntuación</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Inspección</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {sortedScores.map((score, index) => (
                        <tr key={index} className="hover:bg-gray-800/50 transition-colors bg-gray-900/50">
                          <td className="px-6 py-4 text-white font-semibold">{score.team}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {score.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">{score.round}</td>
                          <td className="px-6 py-4">
                            <span className="text-yellow-400 font-bold text-lg">{score.score}</span>
                          </td>
                          <td className="px-6 py-4 text-white">{score.equipmentInspection}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => onDeleteScore(scores.indexOf(score))}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
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
      </div>
    </div>
  );
}
