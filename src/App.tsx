import React, { useState } from 'react';
import { Trophy, CheckCircle, Users, BarChart3, Home, Plus, ArrowLeft, Save, Lock } from 'lucide-react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ScoringPage from './components/ScoringPage';
import RecordsPage from './components/RecordsPage';
import ClassificationPage from './components/ClassificationPage';
import ScoreDisplayPage from './components/ScoreDisplayPage';
import GoogleScriptTestPage from './components/GoogleScriptTestPage';

type Page = 'home' | 'scoring' | 'records' | 'classification' | 'display' | 'test';

export interface Score {
  id: string;
  timestamp: string;
  code: string;
  table: string;
  team: string;
  round: number;
  score: number;
  equipmentInspection: number;
  missions: Record<string, boolean>;
  precisionTokens: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scores, setScores] = useState<Score[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('fll_authenticated') === 'true';
  });

  const addScore = (score: Omit<Score, 'id' | 'timestamp'>) => {
    const newScore: Score = {
      ...score,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('es-ES')
    };
    setScores(prev => [...prev, newScore]);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('fll_authenticated', 'true');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'scoring':
        return <ScoringPage onNavigate={setCurrentPage} onAddScore={addScore} />;
      case 'records':
        return <RecordsPage scores={scores} onNavigate={setCurrentPage} />;
      case 'classification':
        return <ClassificationPage scores={scores} onNavigate={setCurrentPage} />;
      case 'display':
        return <ScoreDisplayPage scores={scores} onNavigate={setCurrentPage} />;
      case 'test':
        return <GoogleScriptTestPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderPage()}
    </div>
  );
}

export default App;