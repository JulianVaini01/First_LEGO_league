import React from 'react';
import { Trophy, CheckCircle, Users, BarChart3, Zap } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={{
          backgroundImage: 'url(./FIRST_AGE-powerpoint-template2.jpg)'
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-600 to-indigo-500 text-white relative z-10">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            {/* Logos in top right */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center space-x-2 md:space-x-4">
              <img
                src="./Imagen2.png"
                alt="First Lego League"
                className="h-12 w-auto md:h-20"
              />
              <img
                src="./Imagen1.png"
                alt="UNNO"
                className="h-12 w-auto md:h-20 rounded-lg px-1 py-0.5 md:px-2 md:py-1"
              />
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-blue-600 p-4 rounded-full mr-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
                UNEARTHED - Temporada 2025-2026
              </h1>
            </div>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Sistema de Evaluación para Réferis
            </p>
          </div>

          {/* Competition Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
              First LEGO league
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-300 to-blue-300 bg-clip-text text-transparent">Acerca de la Competencia</h3>
                <p className="text-white leading-relaxed">
                  First Lego League desafía a los estudiantes a pensar como científicos e ingenieros.
                  Los equipos deben completar misiones en el tablero de juego utilizando robots autónomos
                  construidos con LEGO MINDSTORMS o SPIKE Prime.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-300 to-blue-300 bg-clip-text text-transparent">Criterios de Evaluación</h3>
                <ul className="text-white space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-white mr-2" />
                    15 Misiones con objetivos específicos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-white mr-2" />
                    Tokens de precisión y profesionalismo
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-white mr-2" />
                    Trabajo en equipo y valores fundamentales
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => onNavigate('scoring')}
              className="group bg-gradient-to-r from-orange-500 to-pink-600 hover:from-red-600 hover:to-blue-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Puntuar</h3>
              <p className="text-center text-red-100 text-sm">
                Evaluar las 15 misiones del equipo
              </p>
            </button>

            <button
              onClick={() => onNavigate('records')}
              className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-blue-600 hover:to-red-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Registros</h3>
              <p className="text-center text-blue-100 text-sm">
                Historial de puntuaciones
              </p>
            </button>

            <button
              onClick={() => onNavigate('classification')}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-red-600 hover:to-blue-600 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Clasificación</h3>
              <p className="text-center text-red-100 text-sm">
                Tabla de posiciones
              </p>
            </button>

            <button
              onClick={() => onNavigate('display')}
              className="group bg-gradient-to-r from-green-500 to-black hover:from-blue-600 hover:to-red-600 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Pantalla</h3>
              <p className="text-center text-blue-100 text-sm">
                Mostrar puntuación actual
              </p>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-blue-300">
            <p className="text-sm">
              UNEARTHED 2025-2026 - Sistema de Evaluación Digital para Réferis
            </p>
            <p className="text-xs mt-2 text-blue-400">
              Desarrollado para facilitar la evaluación de competencias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}