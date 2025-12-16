import React from 'react';
import { Droplets, FileText, History } from 'lucide-react';

interface HeaderProps {
  onShowHistory: () => void;
  onHome: () => void;
  showHistoryView: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShowHistory, onHome, showHistoryView }) => {
  return (
    <header className="bg-slate-900 text-white shadow-md no-print">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={onHome}
        >
          <div className="bg-blue-500 p-2 rounded-lg">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LekDetectie Pro</h1>
            <p className="text-xs text-slate-400">Professionele Rapportage Software</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={showHistoryView ? onHome : onShowHistory}
            className={`flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-md transition-colors ${
              showHistoryView ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {showHistoryView ? (
              <>
                <FileText className="w-4 h-4" />
                <span>Nieuw Rapport</span>
              </>
            ) : (
              <>
                <History className="w-4 h-4" />
                <span>Historie</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;