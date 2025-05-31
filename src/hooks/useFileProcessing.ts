
import { useState } from 'react';
import { parseExcelFile, parseResumeFiles, calculateCredibilityScore, ParsedCandidate, CredibilityScore } from '@/utils/fileParser';

export interface ProcessedCandidate extends ParsedCandidate {
  score: number;
  scoreBreakdown: CredibilityScore['breakdown'];
  redFlags: number;
  timeline: Array<{
    type: 'work' | 'education';
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

export const useFileProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [candidates, setCandidates] = useState<ProcessedCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (excelFile?: File, resumeFiles?: File[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      let parsedCandidates: ParsedCandidate[] = [];
      let resumeTexts: Record<string, string> = {};
      
      // Parse Excel file if provided
      if (excelFile) {
        parsedCandidates = await parseExcelFile(excelFile);
      }
      
      // Parse resume files if provided
      if (resumeFiles && resumeFiles.length > 0) {
        resumeTexts = await parseResumeFiles(resumeFiles);
      }
      
      // If only resumes provided, create candidates from filenames
      if (!excelFile && resumeFiles && resumeFiles.length > 0) {
        parsedCandidates = resumeFiles.map((file, index) => ({
          id: index + 1,
          name: file.name.replace(/\.(pdf|docx|doc)$/i, '').replace(/[-_]/g, ' '),
          title: "Position To Be Determined",
          skills: [],
          summary: "Resume analysis pending",
          experience: "To be determined",
          rawData: { source: 'resume', filename: file.name }
        }));
      }
      
      // Calculate credibility scores and enhance data
      const processedCandidates: ProcessedCandidate[] = parsedCandidates.map(candidate => {
        const resumeText = resumeTexts[`${candidate.name}.pdf`] || resumeTexts[Object.keys(resumeTexts)[0]];
        const credibility = calculateCredibilityScore(candidate, resumeText);
        
        // Generate mock timeline data
        const timeline = generateMockTimeline(candidate.name);
        
        return {
          ...candidate,
          score: credibility.overall,
          scoreBreakdown: credibility.breakdown,
          redFlags: credibility.redFlags,
          timeline
        };
      });
      
      setCandidates(processedCandidates);
      console.log('Processed candidates:', processedCandidates);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files');
      console.error('File processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockTimeline = (name: string) => {
    const currentYear = new Date().getFullYear();
    return [
      {
        type: 'work' as const,
        title: 'Senior Developer',
        company: 'Tech Solutions Inc',
        startDate: `${currentYear - 2}-01`,
        endDate: 'Present',
        description: 'Leading development of customer-facing applications and mentoring junior developers.'
      },
      {
        type: 'work' as const,
        title: 'Software Engineer',
        company: 'StartupXYZ',
        startDate: `${currentYear - 4}-06`,
        endDate: `${currentYear - 2}-12`,
        description: 'Built scalable microservices and implemented CI/CD pipelines.'
      },
      {
        type: 'education' as const,
        title: 'Bachelor of Computer Science',
        company: 'State University',
        startDate: `${currentYear - 8}-09`,
        endDate: `${currentYear - 4}-05`,
        description: 'Graduated with honors, focused on software engineering and algorithms.'
      }
    ];
  };

  return {
    processFiles,
    candidates,
    isProcessing,
    error,
    setCandidates
  };
};
