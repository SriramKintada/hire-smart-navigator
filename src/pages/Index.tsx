
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ModeToggle } from '@/components/ModeToggle';
import { QueryInterface } from '@/components/QueryInterface';
import { FileUpload } from '@/components/FileUpload';
import { ResultsPanel } from '@/components/ResultsPanel';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useFileProcessing } from '@/hooks/useFileProcessing';
import { useExternalSearch } from '@/hooks/useExternalSearch';

export type AppMode = 'internal' | 'external';

const Index = () => {
  const [mode, setMode] = useState<AppMode>('internal');
  const [query, setQuery] = useState('');
  const [hasData, setHasData] = useState(false);
  
  // Internal mode hooks
  const { processFiles, candidates, isProcessing, error } = useFileProcessing();
  
  // External mode hooks  
  const { candidates: externalCandidates, isSearching, error: searchError, searchTalent } = useExternalSearch();

  const handleFilesSelected = async (excelFile?: File, resumeFiles?: File[]) => {
    await processFiles(excelFile, resumeFiles);
  };

  const handleDataUploaded = () => {
    setHasData(true);
  };

  const handleExternalSearch = (searchQuery: string, filters?: any) => {
    searchTalent(searchQuery, filters);
  };

  const hasResults = mode === 'internal' 
    ? (hasData && candidates.length > 0)
    : externalCandidates.length > 0;

  const currentCandidates = mode === 'internal' ? candidates : [];
  const displayError = mode === 'internal' ? error : searchError;

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
          onSearch={mode === 'external' ? handleExternalSearch : undefined}
        />

        {/* Loading States */}
        {(isProcessing || isSearching) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">
              {isProcessing ? 'Processing files...' : 'Searching for talent...'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{displayError}</p>
          </div>
        )}

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
        {hasResults && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <ResultsPanel 
                mode={mode} 
                query={query} 
                candidates={currentCandidates}
                externalCandidates={mode === 'external' ? externalCandidates : undefined}
              />
            </div>
            <div>
              <AnalyticsDashboard 
                mode={mode} 
                candidates={currentCandidates}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
