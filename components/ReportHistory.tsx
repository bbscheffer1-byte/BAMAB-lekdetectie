import React from 'react';
import { SavedReport } from '../types';
import { FileText, Trash2, Calendar, User, Search, ArrowRight } from 'lucide-react';

interface ReportHistoryProps {
  reports: SavedReport[];
  onLoadReport: (report: SavedReport) => void;
  onDeleteReport: (id: string) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ reports, onLoadReport, onDeleteReport }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredReports = reports.filter(r => 
    r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <HistoryIcon className="w-6 h-6 mr-2 text-blue-600" />
              Rapport Archief
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Een overzicht van uw eerder gegenereerde rapporten.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Zoek op klant of referentie..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">Geen rapporten gevonden</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm ? 'Geen resultaten voor uw zoekopdracht.' : 'Genereer uw eerste rapport om deze hier terug te zien.'}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aangemaakt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Klant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Referentie</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(report.timestamp).toLocaleDateString('nl-NL')}
                        <span className="text-xs ml-1 text-slate-400">
                           {new Date(report.timestamp).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{report.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {report.referenceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => onLoadReport(report)}
                          className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <span className="mr-1">Openen</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('Weet u zeker dat u dit rapport uit de geschiedenis wilt verwijderen?')) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start text-sm text-yellow-800">
        <span className="font-bold mr-1">Let op:</span>
        Vanwege de opslaglimiet van de browser worden alleen de teksten van de rapporten opgeslagen. Foto's worden niet bewaard in de geschiedenis.
      </div>
    </div>
  );
};

// Helper icon component
const HistoryIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default ReportHistory;