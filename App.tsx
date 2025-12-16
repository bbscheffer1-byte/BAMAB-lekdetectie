import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProjectDetails from './components/ProjectDetails';
import PhotoUpload from './components/PhotoUpload';
import ReportDisplay from './components/ReportDisplay';
import ReportHistory from './components/ReportHistory';
import { ReportData, ImageItem, GeneratedReport, SavedReport } from './types';
import { generateLeakReport } from './services/geminiService';
import { FileText, Wand2, AlertCircle, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'bamab_reports_history';

const App: React.FC = () => {
  const [projectData, setProjectData] = useState<ReportData>({
    clientName: '',
    address: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    phone: '',
    email: ''
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Dynamically update the document title.
  useEffect(() => {
    if (generatedReport && projectData.clientName) {
      document.title = `Rapport - ${projectData.clientName} - BAMAB`;
    } else {
      document.title = "BAMAB Lekdetectie Software";
    }
  }, [generatedReport, projectData.clientName]);

  const saveToHistory = (markdown: string, data: ReportData) => {
    const newReport: SavedReport = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: data.clientName,
      referenceNumber: data.referenceNumber,
      date: data.date,
      timestamp: Date.now(),
      markdown: markdown
    };

    const updatedReports = [newReport, ...savedReports];
    setSavedReports(updatedReports);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = savedReports.filter(r => r.id !== id);
    setSavedReports(updatedReports);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  };

  const handleLoadReport = (saved: SavedReport) => {
    setGeneratedReport({
      markdown: saved.markdown,
      timestamp: saved.timestamp
    });
    // Restore client name for the title
    setProjectData(prev => ({ ...prev, clientName: saved.clientName }));
    setImages([]); // Clear images as we don't store them
    setShowHistory(false);
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError("Upload ten minste één foto om een rapport te kunnen genereren.");
      return;
    }
    if (!projectData.clientName || !projectData.address) {
        setError("Vul de naam van de klant en het adres in.");
        return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const markdown = await generateLeakReport(projectData, images, generalNotes);
      
      // Save automatically to history
      saveToHistory(markdown, projectData);

      setGeneratedReport({
        markdown,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || "Er is een onbekende fout opgetreden.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setGeneratedReport(null);
    setImages([]);
    setGeneralNotes('');
    setProjectData({
      clientName: '',
      address: '',
      city: '',
      date: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      phone: '',
      email: ''
    });
    setError(null);
    setShowHistory(false);
  };

  // Main Content Logic
  const renderContent = () => {
    if (showHistory) {
      return (
        <ReportHistory 
          reports={savedReports} 
          onLoadReport={handleLoadReport} 
          onDeleteReport={handleDeleteReport}
        />
      );
    }

    if (generatedReport) {
      return (
        <ReportDisplay 
          report={generatedReport} 
          images={images} 
          onReset={resetForm} 
        />
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Intro Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 flex items-start space-x-4">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <Wand2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-900">Rapport Generator</h2>
            <p className="text-blue-700 text-sm mt-1">
              Vul de projectgegevens in, upload foto's van de schade en voeg eventueel korte notities toe.
              De AI genereert vervolgens een volledig, professioneel rapport voor de verzekering.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <ProjectDetails data={projectData} onChange={setProjectData} />

        <PhotoUpload images={images} setImages={setImages} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">3</span>
            Algemene Bevindingen / Notities
          </h2>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Typ hier algemene observaties, vermoedelijke oorzaak, of specifieke details die in het rapport moeten komen (bijv. 'Lekkage gevonden bij afvoer douche, kitnaden versleten')..."
            className="w-full h-32 p-3 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex items-center justify-center px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-0.5 ${
              isGenerating 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Rapport Genereren...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6 mr-3" />
                Genereer Rapport
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 bg-[#f3f4f6]">
      <Header 
        onShowHistory={() => setShowHistory(true)} 
        onHome={resetForm}
        showHistoryView={showHistory}
      />

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;