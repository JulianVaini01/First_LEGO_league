import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertTriangle, Settings, AlertCircle, Trophy } from 'lucide-react';
import { Score } from '../App';
import noEquipmentImg from '../assets/no-equipment.png';
import { getTeams, getTeamByCode, saveTeamScore, updateTeamCoreValues, Team, supabase } from '../lib/supabase';

interface ScoringPageProps {
  onNavigate: (page: 'home' | 'scoring' | 'records' | 'classification' | 'display') => void;
  onAddScore: (score: Omit<Score, 'id' | 'timestamp'>) => void;
}

const missions = [
  {
    id: 'm01',
    name: 'Cepillado de Superficie',
    description: 'El cepillo de arqueología no toca el sitio de excavación',
    points: 10,
    maxCount: 2,
    bonus: { description: 'El cepillo de arqueología no toca el sitio de excavación', points: 10 },
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamSearchInput, setTeamSearchInput] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [round, setRound] = useState(0);
  const [table, setTable] = useState('Mesa 1');
  const [missionScores, setMissionScores] = useState<Record<string, { completed: boolean; bonus: boolean; count: number }>>({});
  const [precisionTokens, setPrecisionTokens] = useState(6);
  const [equipmentInspection, setEquipmentInspection] = useState(false);
  const [coreValues, setCoreValues] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamScores, setTeamScores] = useState<any[]>([]);
  const [topScores, setTopScores] = useState<any[]>([]);

  useEffect(() => {
    loadTeams();
    loadTopScores();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamScores(selectedTeam.id);
    }
  }, [selectedTeam]);

  const loadTeams = async () => {
    setLoading(true);
    const teamList = await getTeams();
    setTeams(teamList);
    setLoading(false);
  };

  const loadTeamScores = async (teamId: string) => {
    const { data } = await supabase
      .from('team_scores')
      .select('*')
      .eq('team_id', teamId)
      .order('round', { ascending: true });

    if (data) {
      setTeamScores(data);
    }
  };

  const loadTopScores = async () => {
    const { data } = await supabase
      .from('team_scores')
      .select('*, teams(name, code)')
      .order('score', { ascending: false })
      .limit(5);

    if (data) {
      setTopScores(data);
    }
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(teamSearchInput.toLowerCase()) ||
    t.code.toLowerCase().includes(teamSearchInput.toLowerCase())
  );

  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team);
    setTeamSearchInput(team.name);
    setCodeInput(team.code);
    setCodeError('');
    setShowTeamDropdown(false);
    setCoreValues(team.core_values || null);
  };

  const handleCodeChange = async (newCode: string) => {
    setCodeInput(newCode);
    setCodeError('');

    if (newCode.trim() === '') {
      setSelectedTeam(null);
      setTeamSearchInput('');
      return;
    }

    if (newCode.length >= 3) {
      const team = await getTeamByCode(newCode.toUpperCase());
      if (team) {
        setSelectedTeam(team);
        setTeamSearchInput(team.name);
        setCodeError('');
        setCoreValues(team.core_values || null);
      } else {
        setSelectedTeam(null);
        setCodeError('Código no encontrado');
      }
    }
  };

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
  const handleSave = async () => {
    if (!selectedTeam) {
      alert('Por favor selecciona un equipo válido');
      return;
    }

    const totalScore = calculateTotal() + getPrecisionTokenPoints(precisionTokens) + (equipmentInspection ? 20 : 0);
    const equipmentInspectionPoints = equipmentInspection ? 20 : 0;

    await saveTeamScore(
      selectedTeam.id,
      round,
      table,
      totalScore,
      equipmentInspectionPoints,
      getPrecisionTokenPoints(precisionTokens)
    );

    if (coreValues !== null) {
      await updateTeamCoreValues(selectedTeam.id, coreValues);
    }

    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyy96bo10sYRgVrNFHucSaujFVfWAz_6U1AHzsUcW_LT3GasdE-jT_StBsPR8STKNkPAA/exec";

    const data = {
      codigo: selectedTeam.code,
      mesa: table,
      equipo: selectedTeam.name,
      ronda: round,
      puntuacion: totalScore,
      equipmentInspection: equipmentInspectionPoints,
      inspeccion_equipamiento: equipmentInspectionPoints,
    };

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }

    alert('Puntuación guardada exitosamente');

    // Recargar puntuaciones
    if (selectedTeam) {
      await loadTeamScores(selectedTeam.id);
    }
    await loadTopScores();

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-300 to-blue-300 bg-clip-text text-transparent">Hoja de Puntajes - UNEARTHED 2025-2026</h1>
          </div>
          {/* Logos in top right */}
          <div className="hidden md:flex items-center space-x-4">
            <img
              src="./Imagen2.png"
              alt="First Lego League"
              className="h-12 w-auto"
            />
            <img
              src="./Imagen1.jpg"
              alt="UNNO"
              className="h-12 w-auto rounded-lg px-1 py-0.5"
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
                className="h-6 w-auto rounded px-1 py-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Team Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Equipo</label>
              <div className="relative">
                <input
                  type="text"
                  value={teamSearchInput}
                  onChange={(e) => {
                    setTeamSearchInput(e.target.value);
                    setShowTeamDropdown(true);
                  }}
                  onFocus={() => setShowTeamDropdown(true)}
                  onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    selectedTeam ? 'border-green-400 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Buscar equipo por nombre"
                  disabled={loading}
                />
                {showTeamDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        Cargando equipos...
                      </div>
                    ) : filteredTeams.length > 0 ? (
                      filteredTeams.map(team => (
                        <button
                          key={team.id}
                          onClick={() => handleSelectTeam(team)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0"
                        >
                          <div className="font-semibold">{team.name}</div>
                          <div className="text-xs text-gray-500">Código: {team.code}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No se encontraron equipos
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedTeam && <p className="text-xs text-green-600 mt-1">✓ Equipo seleccionado</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">código único del equipo</label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                  selectedTeam ? 'border-green-400 bg-green-50' : codeError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Digitar código"
              />
              {codeError && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{codeError}</p>}
              {selectedTeam && <p className="text-xs text-green-600 mt-1">✓ Código válido</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesa</label>
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({length: 6}, (_, i) => (
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
                <option value={0}>Ronda 0</option>
                <option value={1}>Ronda 1</option>
                <option value={2}>Ronda 2</option>
                <option value={3}>Ronda 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restrictions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-100 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={noEquipmentImg}
                  alt="No equipamiento"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="flex-1">
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
                    <span className="text-2xl font-bold text-blue-600">
                      {(mission.maxCount
                        ? (missionScores[mission.id]?.count || 0) * mission.points
                        : (missionScores[mission.id]?.completed ? mission.points : 0)
                      ) + (mission.bonus && missionScores[mission.id]?.bonus ? mission.bonus.points : 0)}
                    </span>
                    <span className="text-gray-500 ml-1">pts</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{mission.description}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  {mission.maxCount ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                        <select
                          value={missionScores[mission.id]?.count || 0}
                          onChange={(e) => handleCountChange(mission.id, Number(e.target.value))}
                          className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center font-semibold"
                        >
                          {Array.from({ length: mission.maxCount + 1 }, (_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-500">/ {mission.maxCount}</span>
                      </div>

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

        {/* Core Values Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            ¿Qué tal fue el desempeño del equipo en Core Values?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Esta evaluación no puntúa en el ranking general, solo se guarda para referencia.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setCoreValues(1)}
              className={`p-4 rounded-lg border-2 transition-all ${
                coreValues === 1
                  ? 'bg-red-100 border-red-500 shadow-lg'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">1</div>
                <div className="text-sm font-medium mt-1">BÁSICO</div>
              </div>
            </button>
            <button
              onClick={() => setCoreValues(2)}
              className={`p-4 rounded-lg border-2 transition-all ${
                coreValues === 2
                  ? 'bg-yellow-100 border-yellow-500 shadow-lg'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">2</div>
                <div className="text-sm font-medium mt-1">EN DESARROLLO</div>
              </div>
            </button>
            <button
              onClick={() => setCoreValues(3)}
              className={`p-4 rounded-lg border-2 transition-all ${
                coreValues === 3
                  ? 'bg-green-100 border-green-500 shadow-lg'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">3</div>
                <div className="text-sm font-medium mt-1">CUMPLIDO</div>
              </div>
            </button>
            <button
              onClick={() => setCoreValues(4)}
              className={`p-4 rounded-lg border-2 transition-all ${
                coreValues === 4
                  ? 'bg-blue-100 border-blue-500 shadow-lg'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">4</div>
                <div className="text-sm font-medium mt-1">SUPERADO</div>
              </div>
            </button>
          </div>
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
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-lg text-white font-semibold"
                >
                  <Save className="h-5 w-5" />
                  <span>Enviar Puntaje</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Puntuación Total</h2>
          <div className="text-6xl font-bold mb-4">
            {calculateTotal() + getPrecisionTokenPoints(precisionTokens) + (equipmentInspection ? 20 : 0)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-red-200 mt-4">
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

        {/* Current Scores Section */}
        {selectedTeam && teamScores.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="h-6 w-6 text-blue-600 mr-2" />
              Puntuaciones de {selectedTeam.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ronda</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mesa</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamScores.map((score, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">Ronda {score.round}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{score.table_name || 'N/A'}</td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-lg font-bold text-blue-600">{score.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {teamScores.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Mejor Puntuación:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {Math.max(...teamScores.map(s => s.score))}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-700">Promedio:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round(teamScores.reduce((acc, s) => acc + s.score, 0) / teamScores.length)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}