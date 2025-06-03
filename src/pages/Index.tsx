import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ModeToggle } from "@/components/ModeToggle";
import { QueryInterface } from "@/components/QueryInterface";
import { FileUpload } from "@/components/FileUpload";
import { ResultsPanel } from "@/components/ResultsPanel";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { TalentAnalyticsDashboard } from "@/components/analytics/TalentAnalyticsDashboard";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { useExternalSearch } from "@/hooks/useExternalSearch";
import { ScoreBreakdown } from "@/components/charts/ScoreBreakdown";
import { analytics } from "@/lib/analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export type AppMode = "internal" | "external" | "resume" | "analytics";

const Index = () => {
  const [mode, setMode] = useState<AppMode>("internal");
  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeScore, setResumeScore] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track page views
  useEffect(() => {
    analytics.trackPageView("/dashboard");
  }, []);

  // Internal mode hooks
  const { processFiles, candidates, isProcessing, error } = useFileProcessing();

  // External mode hooks
  const {
    candidates: externalCandidates,
    isSearching,
    error: searchError,
    searchTalent,
  } = useExternalSearch();

  const handleFilesSelected = async (
    excelFile?: File,
    resumeFiles?: File[]
  ) => {
    await processFiles(excelFile, resumeFiles, query);
  };

  const handleDataUploaded = () => {
    setHasData(true);
  };

  const handleExternalSearch = (searchQuery: string, filters?: any) => {
    if (mode === "internal" && hasData) {
      // Reprocess files with the new search query
      processFiles(undefined, undefined, searchQuery);
    } else {
      searchTalent(searchQuery, filters);
    }
  };

  const hasResults =
    mode === "internal"
      ? hasData && candidates.length > 0
      : externalCandidates.length > 0;

  const currentCandidates =
    mode === "internal" ? candidates : externalCandidates;
  const displayError = mode === "internal" ? error : searchError;

  // Handler for resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // Placeholder: simulate analysis
      setTimeout(() => {
        setResumeScore({
          grammar: 7,
          technical: 8,
          consistency: 9,
          buzzwords: 5,
          verifiability: 8,
          summary:
            "A solid resume with good detail. Consider elaborating on one project and double-check grammar.",
        });
      }, 1200);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#181926] text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Talent Navigator</h1>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>

          {/* Query Interface */}
          <QueryInterface
            mode={mode}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleExternalSearch}
          />

          {/* Loading States */}
          {(isProcessing || isSearching) && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-gray-300">
                {isProcessing
                  ? "Processing files..."
                  : "Searching for talent..."}
              </p>
            </div>
          )}

          {/* Error Display */}
          {displayError && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-red-300">{displayError}</p>
            </div>
          )}

          {/* File Upload (Internal Mode Only) */}
          {mode === "internal" && (
            <FileUpload
              onDataUploaded={handleDataUploaded}
              onFilesSelected={handleFilesSelected}
              isProcessing={isProcessing}
              error={error}
            />
          )}

          {/* Results and Analytics */}
          {mode === "analytics" ? (
            <div className="px-4 py-6">
              <TalentAnalyticsDashboard
                candidates={[...candidates, ...externalCandidates]}
                mode="internal"
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 px-4 py-6">
              <div className="lg:col-span-2">
                <ResultsPanel
                  mode={mode}
                  query={query}
                  candidates={candidates}
                  externalCandidates={externalCandidates}
                />
              </div>
              <div>
                <AnalyticsDashboard
                  mode={mode}
                  candidates={mode === "internal" ? candidates : []}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
