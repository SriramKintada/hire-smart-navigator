import { useState, useRef } from "react";
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
import { analytics } from '@/lib/analytics';

export type AppMode = "internal" | "external" | "resume" | "analytics";

const Index = () => {
  const [mode, setMode] = useState<AppMode>("internal");
  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeScore, setResumeScore] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#10111a] to-[#1a1b2e] text-white">
      {/* Enhanced Header (to be improved next) */}
      <Header />
      <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-[#181926] shadow-lg rounded-md space-y-10 mt-4 sm:mt-8 text-white">
        {/* Mode Toggle (to be enhanced) */}
        <div className="flex justify-center">
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        {/* Resume Checker Mini-Section */}
        {mode === "resume" && (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center space-y-6 bg-[#23243a]">
            {!resumeFile && (
              <>
                <p className="mb-4 text-gray-700 text-lg">
                  Upload your resume (PDF/DOCX) to get a free AI-powered review
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                />
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Resume
                </button>
              </>
            )}
            {resumeFile && resumeScore && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Resume Score Summary</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    Grammar:{" "}
                    <span className="font-medium">
                      {resumeScore.grammar}/10
                    </span>
                  </li>
                  <li>
                    Technical:{" "}
                    <span className="font-medium">
                      {resumeScore.technical}/10
                    </span>
                  </li>
                  <li>
                    Consistency:{" "}
                    <span className="font-medium">
                      {resumeScore.consistency}/10
                    </span>
                  </li>
                  <li>
                    Buzzwords:{" "}
                    <span className="font-medium">
                      {resumeScore.buzzwords}/10
                    </span>{" "}
                    (lower is better)
                  </li>
                  <li>
                    Verifiability:{" "}
                    <span className="font-medium">
                      {resumeScore.verifiability}/10
                    </span>
                  </li>
                </ul>
                <ScoreBreakdown data={resumeScore} />
                <div className="mt-4">
                  <p className="text-sm text-gray-500 italic">
                    {resumeScore.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Query Interface (to be improved for external mode) */}
        <QueryInterface
          mode={mode}
          query={query}
          onQueryChange={setQuery}
          onSearch={mode === "external" ? handleExternalSearch : undefined}
        />
        {/* Loading States */}
        {(isProcessing || isSearching) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p className="text-gray-300">
              {isProcessing ? "Processing files..." : "Searching for talent..."}
            </p>
          </div>
        )}
        {/* Error Display */}
        {displayError && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">{displayError}</p>
          </div>
        )}
        {/* File Upload (Internal Mode Only, to be enhanced) */}
        {mode === "internal" && (
          <FileUpload
            onDataUploaded={handleDataUploaded}
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
            error={error}
          />
        )}
        {/* Results and Analytics (to be refactored for new UI) */}
        {mode === "analytics" && (
          <div className="px-4 py-6">
            <TalentAnalyticsDashboard 
              candidates={[...candidates, ...externalCandidates]}
              mode={mode}
            />
          </div>
        )}
        {mode !== "analytics" && (
          <div className="grid lg:grid-cols-3 gap-6 px-4 py-6">
            <div className="lg:col-span-2">
              <ResultsPanel
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
        {/* Footer/Help Note */}
        <div className="pt-8 text-center text-xs text-gray-500">
          Need help?{" "}
          <a
            href="https://github.com/yourrepo/hire-smart-navigator#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400"
          >
            Read the docs
          </a>
        </div>
      </main>
    </div>
  );
};

export default Index;
