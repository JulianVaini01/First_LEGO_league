import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft, Database, CheckCircle, XCircle } from 'lucide-react';

interface TeamData {
  posicion: number;
  equipo: string;
  codigo: number;
  ronda0: number;
  ronda1: number;
  ronda2: number;
  ronda3: number;
  mejorPuntuacion: number;
  coreValues: number;
}

interface GoogleScriptTestPageProps {
  onNavigate: (page: string) => void;
}

const GoogleScriptTestPage: React.FC<GoogleScriptTestPageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TeamData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRqxHYeu_ovGq7CQHknXQ7Gh4JEtPC5zdTA_ZG798-snHfhPIisX74D5SfTZxTPpjT6g/exec';

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.clasificacion && Array.isArray(result.clasificacion)) {
        setData(result.clasificacion);
        setLastUpdated(new Date().toLocaleString('es-ES'));
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Database className="w-8 h-8 text-blue-600" />
                  Google Script API Test
                </h1>
                <p className="text-gray-600 mt-1">Testing external data source integration</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>

          {/* API Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {error ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    API Status: {error ? 'Error' : 'Connected'}
                  </p>
                  {lastUpdated && (
                    <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>
                  )}
                </div>
              </div>
              {data && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                  <p className="text-sm text-gray-600">Teams</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Data Table */}
          {data && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Round 0</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Round 1</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Round 2</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Round 3</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Best Score</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Core Values</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((team, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                          {team.posicion}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{team.equipo}</td>
                      <td className="px-4 py-3 text-gray-600">{team.codigo}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{team.ronda0}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{team.ronda1}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{team.ronda2}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{team.ronda3}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                          {team.mejorPuntuacion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">{team.coreValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && (!data || data.length === 0) && (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No data available</p>
            </div>
          )}

          {/* API Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-semibold text-blue-900 mb-2">API Endpoint:</p>
            <p className="text-xs text-blue-700 break-all font-mono">{GOOGLE_SCRIPT_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleScriptTestPage;
