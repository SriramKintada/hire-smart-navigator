
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ModeToggle } from '@/components/ModeToggle';
import { QueryInterface } from '@/components/QueryInterface';
import { FileUpload } from '@/components/FileUpload';
import { ResultsPanel } from '@/components/ResultsPanel';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useFileProcessing } from '@/hooks/useFileProcessing';

export type AppMode = 'internal' | 'external';

const Index = () => {
  const [mode, setMode] = useState<AppMode>('internal');
  const [query, setQuery] = useState('');
  const [hasData, setHasData] = useState(false);
  
  const { processFiles, candidates, isProcessing, error } = useFileProcessing();

  const handleFilesSelected = async (excelFile?: File, resumeFiles?: File[]) => {
    await processFiles(excelFile, resumeFiles);
  };

  const handleDataUploaded = () => {
    setHasData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* Query Interface */}
        <QueryInterface 
          mode={mode} 
          query={query} 
          onQueryChange={setQuery}
        />

        {/* File Upload (Internal Mode Only) */}
        {mode === 'internal' && (
          <FileUpload 
            onDataUploaded={handleDataUploaded}
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
            error={error}
          />
        )}

        {/* Results and Analytics */}
        {((hasData && candidates.length > 0) || mode === 'external') && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <ResultsPanel 
                mode={mode} 
                query={query} 
                candidates={mode === 'internal' ? candidates : []}
              />
            </div>
            <div>
              <AnalyticsDashboard 
                mode={mode} 
                candidates={mode === 'internal' ? candidates : []}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
