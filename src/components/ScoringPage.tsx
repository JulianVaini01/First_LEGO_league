import React, { useState } from 'react';
import { ArrowLeft, Save, AlertTriangle, Settings } from 'lucide-react';
import { Score } from '../App';

interface ScoringPageProps {
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
  onAddScore: (score: Omit<Score, 'id' | 'timestamp'>) => void;
}

const missions = [
  {
    id: 'm01',
    name: 'Cepillado de Superficie',
    description: 'Cepillo tocando la lona',
    points: 10,
    maxCount: 3,
    hasNoEquipment: true
  },
  {
    id: 'm02',
    name: 'Revelación del Mapa',
    description: 'Secciones de capa superior completamente despejadas',
    points: 10,
    maxCount: 3
  },
  {
    id: 'm03',
    name: 'Explorador de Pozo Minero',
    description: 'Vagoneta en la pista del equipo contrario',
    points: 30,
    bonus: { description: 'Vagoneta contraria en tu pista', points: 10 }
  },
  {
    id: 'm04',
    name: 'Recuperación Cuidadosa',
    description: 'Artefacto precioso no toca la mina',
    points: 30,
    bonus: { description: 'Ambas estructuras de soporte en pie', points: 10 },
    hasNoEquipment: true
  },
  {
    id: 'm05',
    name: '¿Quién Vivió Aquí?',
    description: 'Piso de estructura completamente erguido',
    points: 30,
    hasNoEquipment: true
  },
  {
    id: 'm06',
    name: 'Forja',
    description: 'Bloques de mineral no tocan la forja',
    points: 10,
    maxCount: 3
  },
  {
    id: 'm07',
    name: 'Levantamiento Pesado',
    description: 'Hito ya no toca su base',
    points: 30
  },
  {
    id: 'm08',
    name: 'Silo',
    description: 'Piezas preservadas fuera del silo',
    points: 10,
    maxCount: 3
  },
  {
    id: 'm09',
    name: '¿Qué está en Venta?',
    description: 'Techo completamente levantado',
    points: 20,
    bonus: { description: 'Mercancías del mercado levantadas', points: 10 },
    hasNoEquipment: true
  },
  {
    id: 'm10',
    name: 'Inclinar las Balanzas',
    description: 'Balanza inclinada y no toca la lona',
    points: 20,
    bonus: { description: 'Plato de balanza completamente removido', points: 10 }
  },
  {
    id: 'm11',
    name: 'Artefactos del Pescador',
    description: 'Artefactos levantados sobre la capa del suelo',
    points: 20,
    bonus: { description: 'Bandera de grúa al menos parcialmente bajada', points: 10 },
    hasNoEquipment: true
  },
  {
    id: 'm12',
    name: 'Operación de Salvamento',
    description: 'Arena completamente despejada',
    points: 20,
    bonus: { description: 'Barco completamente levantado', points: 10 },
    hasNoEquipment: true
  },
  {
    id: 'm13',
    name: 'Reconstrucción de Estatua',
    description: 'Estatua completamente levantada',
    points: 30,
    hasNoEquipment: true
  },
  {
    id: 'm14',
    name: 'Foro',
    description: 'Artefactos que llegan a la lona al menos parcialmente',
    points: 5,
    maxCount: 7,
    hasNoEquipment: true
  },
  {
    id: 'm15',
    name: 'Marcado del Sitio',
    description: 'Sitios con bandera al menos parcialmente dentro y tocando la lona',
    points: 10,
    maxCount: 3
  }
];

export default function ScoringPage({ onNavigate, onAddScore }: ScoringPageProps) {
  const [teamName, setTeamName] = useState('');
  const [round, setRound] = useState(1);
  const [table, setTable] = useState('Mesa 1');
  const [code, setCode] = useState('');
  const [missionScores, setMissionScores] = useState<Record<string, { completed: boolean; bonus: boolean; count: number }>>({});
  const [precisionTokens, setPrecisionTokens] = useState(6);
  const [equipmentInspection, setEquipmentInspection] = useState(false);

  const handleMissionToggle = (missionId: string, type: 'completed' | 'bonus' = 'completed') => {
    setMissionScores(prev => ({
      ...prev,
      [missionId]: {
        ...prev[missionId],
        [type]: !prev[missionId]?.[type],
        count: prev[missionId]?.count || 0
      }
    }));
  };

  const handleCountChange = (missionId: string, count: number) => {
    setMissionScores(prev => ({
      ...prev,
      [missionId]: {
        ...prev[missionId],
        count: Math.max(0, count),
        completed: prev[missionId]?.completed || false,
        bonus: prev[missionId]?.bonus || false
      }
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    
    missions.forEach(mission => {
      const score = missionScores[mission.id];
      if (!score) return;

      if (mission.maxCount) {
        total += score.count * mission.points;
      } else if (score.completed) {
        total += mission.points;
      }

      if (mission.bonus && score.bonus) {
        total += mission.bonus.points;
      }
    });

    return total;
  };

  const getPrecisionTokenPoints = (tokens: number) => {
    switch (tokens) {
      case 6: return 50;
      case 5: return 50;
      case 4: return 35;
      case 3: return 25;
      case 2: return 15;
      case 1: return 10;
      default: return 0;
    }
  };
  const handleSave = () => {
    if (!teamName.trim() || !code.trim()) {
      alert('Por favor completa el nombre del equipo y el código');
      return;
    }

    const totalScore = calculateTotal() + getPrecisionTokenPoints(precisionTokens) + (equipmentInspection ? 20 : 0);

    // 🚀 Enviar los datos a Google Sheets
    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyy96bo10sYRgVrNFHucSaujFVfWAz_6U1AHzsUcW_LT3GasdE-jT_StBsPR8STKNkPAA/exec";

    const data = {
      codigo: code || "",
      mesa: table || "",
      equipo: teamName || "",
      ronda: round || "",
      puntuacion: totalScore || 0,
      equipmentInspection: equipmentInspection ? 20 : 0,
      inspeccion_equipamiento: equipmentInspection ? 20 : 0,
    };

    const sendToSheets = async () => {
      try {
        await fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log("✅ Datos enviados a Google Sheets correctamente");
      } catch (error) {
        console.error("❌ Error al enviar datos:", error);
      }
    };

    // Ejecutar el envío a Google Sheets
    sendToSheets();

    const score: Omit<Score, 'id' | 'timestamp'> = {
      code,
      table,
      team: teamName,
      round,
      score: totalScore,
      equipmentInspection: equipmentInspection ? 20 : 0,
      missions: Object.keys(missionScores).reduce((acc, key) => {
        acc[key] = missionScores[key].completed;
        return acc;
      }, {} as Record<string, boolean>),
      precisionTokens: getPrecisionTokenPoints(precisionTokens)
    };

    // Mantener la funcionalidad original
    onAddScore(score);
    alert('Puntuación guardada exitosamente');
    onNavigate('display');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-25 z-0"
        style={{
          backgroundImage: 'url(./FIRST_AGE-powerpoint-template2.jpg)'
        }}
      />
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Hoja de Puntajes</h1>
          </div>
          {/* Logos in top right */}
          <div className="hidden md:flex items-center space-x-4">
            <img 
              src="./Imagen2.png" 
              alt="First Lego League" 
              className="h-8 w-auto md:h-10"
            />
            <img 
              src="./Imagen1.jpg" 
              alt="UNNO" 
              className="h-8 w-auto md:h-10 bg-white rounded-lg px-1 py-0.5 md:px-2 md:py-1"
            />
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
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Generar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Team Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Equipo</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el nombre del equipo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código del equipo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesa</label>
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({length: 8}, (_, i) => (
                  <option key={i} value={`Mesa ${i + 1}`}>Mesa {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ronda</label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Ronda 1</option>
                <option value={2}>Ronda 2</option>
                <option value={3}>Ronda 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restrictions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Restricción de No Equipamiento</h3>
                <p className="text-sm text-orange-700">
                  Cuando este símbolo aparezca en la esquina superior derecha de una misión, 
                  ningún equipamiento puede tocar ninguna parte de este modelo de misión 
                  al final de la partida para puntuar en esta misión.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Settings className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Inspección de Equipamiento</h3>
                <p className="text-sm text-blue-700">
                  Antes de participar se hará una inspección del equipamiento del robot 
                  para verificar que cumple con todas las especificaciones técnicas.
                </p>
                <button
                  onClick={() => setEquipmentInspection(!equipmentInspection)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    equipmentInspection
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {equipmentInspection ? 'Completada (+20 pts)' : 'No Completada'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Missions */}
        <div className="grid gap-6 mb-8">
          {missions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Mission Image */}
                <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={`./missions/${mission.id.replace('m', 'mission-')}.png`}
                    alt={`Imagen de ${mission.name}`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Mission Content */}
                <div className="md:w-2/3">
              <div className={`p-4 ${mission.hasNoEquipment ? 'bg-orange-100 border-l-4 border-orange-400' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mission.name}
                    {mission.hasNoEquipment && (
                      <span className="ml-2 text-orange-600 text-sm">⚠️ Sin Equipamiento</span>
                    )}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">{mission.points}</span>
                    <span className="text-gray-500 ml-1">pts</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{mission.description}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  {mission.maxCount ? (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                      <input
                        type="number"
                        min="0"
                        max={mission.maxCount}
                        value={missionScores[mission.id]?.count || 0}
                        onChange={(e) => handleCountChange(mission.id, Number(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                      />
                      <span className="text-sm text-gray-500">/ {mission.maxCount}</span>
                    </div>
                  ) : (
                   <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleMissionToggle(mission.id, 'completed')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        missionScores[mission.id]?.completed
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {missionScores[mission.id]?.completed ? 'Completada' : 'No Completada'}
                    </button>
                     
                     {mission.bonus && (
                       <button
                         onClick={() => handleMissionToggle(mission.id, 'bonus')}
                         className={`px-4 py-2 rounded-lg font-medium transition-all ${
                           missionScores[mission.id]?.bonus
                             ? 'bg-yellow-500 text-white shadow-lg'
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                         }`}
                       >
                         Bonus: {mission.bonus.description} (+{mission.bonus.points})
                       </button>
                     )}
                   </div>
                  )}
                </div>
              </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {/* Precision Tokens */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <img src="./image.png" alt="Precision Token" className="w-8 h-8 mr-3" />
              Tokens de Precisión
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Tokens Restantes:</label>
                <select
                  value={precisionTokens}
                  onChange={(e) => setPrecisionTokens(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={6}>6 Tokens</option>
                  <option value={5}>5 Tokens</option>
                  <option value={4}>4 Tokens</option>
                  <option value={3}>3 Tokens</option>
                  <option value={2}>2 Tokens</option>
                  <option value={1}>1 Token</option>
                  <option value={0}>0 Tokens</option>
                </select>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {getPrecisionTokenPoints(precisionTokens)}
                  </span>
                  <span className="text-gray-500 ml-1">pts</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• 6-5 tokens: 50 puntos</p>
                <p>• 4 tokens: 35 puntos</p>
                <p>• 3 tokens: 25 puntos</p>
                <p>• 2 tokens: 15 puntos</p>
                <p>• 1 token: 10 puntos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Puntuación Total</h2>
          <div className="text-6xl font-bold mb-4">
            {calculateTotal() + getPrecisionTokenPoints(precisionTokens) + (equipmentInspection ? 20 : 0)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-blue-200 mt-4">
            <div>
              <p className="font-semibold">Misiones</p>
              <p className="text-2xl">{calculateTotal()}</p>
            </div>
            <div>
              <p className="font-semibold">Tokens</p>
              <p className="text-2xl">{getPrecisionTokenPoints(precisionTokens)}</p>
            </div>
            <div>
              <p className="font-semibold">Inspección</p>
              <p className="text-2xl">{equipmentInspection ? 20 : 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}