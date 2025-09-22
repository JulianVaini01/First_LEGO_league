import React from 'react';
import { Trophy, CheckCircle, Users, BarChart3, Zap } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Logos in top right */}
          <div className="absolute top-6 right-6 flex items-center space-x-4">
            <img 
              src="/Imagen2.png" 
              alt="First Lego League" 
              className="h-12 w-auto"
            />
            <img 
              src="/Imagen1.jpg" 
              alt="UNNO" 
              className="h-12 w-auto bg-white rounded-lg px-2 py-1"
            />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mr-4">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              First Lego League
            </h1>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Sistema de Evaluación para Jurados
          </p>
        </div>

        {/* Competition Description */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
            Submerged - Temporada 2024-2025
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Acerca de la Competencia</h3>
              <p className="text-blue-100 leading-relaxed">
                First Lego League desafía a los estudiantes a pensar como científicos e ingenieros. 
                Los equipos deben completar misiones en el tablero de juego utilizando robots autónomos 
                construidos con LEGO MINDSTORMS o SPIKE Prime.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Criterios de Evaluación</h3>
              <ul className="text-blue-100 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  15 Misiones con objetivos específicos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Tokens de precisión y profesionalismo
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
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
            className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Puntuar</h3>
            <p className="text-center text-green-100 text-sm">
              Evaluar las 15 misiones del equipo
            </p>
          </button>

          <button
            onClick={() => onNavigate('records')}
            className="group bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Registros</h3>
            <p className="text-center text-purple-100 text-sm">
              Historial de puntuaciones
            </p>
          </button>

          <button
            onClick={() => onNavigate('classification')}
            className="group bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Clasificación</h3>
            <p className="text-center text-orange-100 text-sm">
              Tabla de posiciones
            </p>
          </button>

          <button
            onClick={() => onNavigate('display')}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Pantalla</h3>
            <p className="text-center text-cyan-100 text-sm">
              Mostrar puntuación actual
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-blue-300">
          <p className="text-sm">
            First Lego League - Sistema de Evaluación Digital
          </p>
          <p className="text-xs mt-2 text-blue-400">
            Desarrollado para facilitar la evaluación de competencias
          </p>
        </div>
      </div>
    </div>
  );
}