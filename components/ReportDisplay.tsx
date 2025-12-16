import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GeneratedReport, ImageItem } from '../types';
import { Download, CheckCircle, RefreshCw, Printer, AlertCircle } from 'lucide-react';

interface ReportDisplayProps {
  report: GeneratedReport;
  images: ImageItem[];
  onReset: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, images, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Control Bar */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-green-700 font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Rapport gereed</span>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Nieuw Rapport
            </button>
            <div className="relative group">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Opslaan als PDF
              </button>
              {/* Tooltip hint for PDF */}
              <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p>Kies in het afdrukmenu voor <strong>"Opslaan als PDF"</strong> of <strong>"Save as PDF"</strong>.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs mt-2">
          Tip: Als de tekst wegvalt, pas de schaal aan in de afdrukinstellingen.
        </p>
      </div>

      {/* The Report 'Paper' */}
      <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] paper-shadow report-container relative">
        
        {/* Decorative top bar for screen only */}
        <div className="h-2 bg-blue-600 w-full absolute top-0 left-0 no-print rounded-t-sm"></div>

        <div className="p-12 md:p-16">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-wider leading-tight">
                Lekdetectie<br/>Rapportage
              </h1>
              <div className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Officieel Inspectiedocument
              </div>
            </div>
            <div className="text-right">
               <div className="font-bold text-xl text-slate-900">BAMAB</div>
               <div className="text-sm text-slate-600 uppercase tracking-widest text-xs mt-1">Lekdetectie Services</div>
               <div className="text-xs text-slate-500 mt-4 leading-tight">
                 Gegenereerd op:<br/>
                 {new Date(report.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
               </div>
            </div>
          </div>

          {/* Markdown Content with refined typography */}
          <div className="report-content text-slate-800 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mb-4 mt-8 pb-2 border-b border-slate-200 break-after-avoid" {...props} />,
                
                // Stylish H2 with blue accent
                h2: ({node, ...props}) => (
                  <div className="mt-8 mb-4 break-after-avoid break-inside-avoid">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center" {...props} />
                    <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
                  </div>
                ),
                
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-2 break-after-avoid" {...props} />,
                
                p: ({node, ...props}) => <p className="mb-4 text-sm md:text-base leading-7 text-slate-700 text-justify" {...props} />,
                
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1 text-slate-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-slate-700" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                
                strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                
                // Clean, professional tables
                table: ({node, ...props}) => (
                  <div className="overflow-hidden mb-8 mt-4 border border-slate-200 rounded-lg break-inside-avoid shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-200" {...props} />,
                tr: ({node, ...props}) => <tr className="hover:bg-slate-50 transition-colors" {...props} />,
                th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" {...props} />,
                td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-slate-700 align-top" {...props} />,
                
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-400 pl-4 py-2 italic text-slate-600 bg-slate-50 rounded-r my-6 break-inside-avoid" {...props} />
                ),
              }}
            >
              {report.markdown}
            </ReactMarkdown>
          </div>

          {/* Image Attachment Section - Only show if images are present */}
          {images.length > 0 ? (
            <div className="mt-12 pt-8 border-t-2 border-slate-100 break-before-page">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Fotodocumentatie</h2>
              <div className="h-1 w-20 bg-blue-600 mb-8 rounded-full"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {images.map((img, idx) => (
                  <div key={img.id} className="break-inside-avoid bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="relative aspect-[4/3] w-full mb-3 bg-slate-100 rounded overflow-hidden border border-slate-100">
                      <img 
                        src={img.previewUrl} 
                        alt={`Bewijs ${idx + 1}`} 
                        className="absolute inset-0 w-full h-full object-contain p-2" 
                      />
                    </div>
                    <div className="px-1">
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Foto {idx + 1}</p>
                      {img.description ? (
                        <p className="text-sm text-slate-600 leading-snug">{img.description}</p>
                      ) : (
                        <p className="text-sm text-slate-400 italic">Geen beschrijving toegevoegd.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-12 pt-8 border-t border-dashed border-slate-300 no-print">
               <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm italic">
                  Let op: Dit is een gearchiveerd rapport. De originele foto's zijn niet opgeslagen in de geschiedenis.
               </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-20 pt-6 border-t border-slate-200 flex flex-col items-center justify-center text-slate-400">
             <div className="flex items-center space-x-2 mb-2">
               <span className="font-bold text-slate-500 tracking-wider text-xs">BAMAB LEKDETECTIE</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDisplay;