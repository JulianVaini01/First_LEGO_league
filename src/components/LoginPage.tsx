import React, { useState } from 'react';
import { Lock, Trophy, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Contraseña por defecto - CAMBIAR EN PRODUCCIÓN
  const JUDGE_PASSWORD = 'FLL2024Judge';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular verificación
    setTimeout(() => {
      if (password === JUDGE_PASSWORD) {
        onLogin();
      } else {
        setError('Contraseña incorrecta. Contacta al administrador del torneo.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-6">
      {/* Logos in top right */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-10">
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
      
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Acceso de Jurado
          </h1>
          <p className="text-blue-200">
            First Lego League - Sistema de Evaluación
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Contraseña de Jurado
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Ingresa la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>Acceder al Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-200 font-semibold text-sm mb-1">
                Sistema Protegido
              </h3>
              <p className="text-blue-300 text-xs">
                Solo los jurados autorizados pueden acceder al sistema de puntuación.
                Si no tienes la contraseña, contacta al coordinador del torneo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-300 text-xs">
            First Lego League - Temporada 2024-2025
          </p>
        </div>
      </div>
    </div>
  );
}