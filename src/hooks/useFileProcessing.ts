import { useState } from "react";
import { parseExcelFile } from "@/utils/fileParser";
import { analyzeResume, ResumeAnalysis } from "@/utils/geminiAnalyzer";
import { ParsedCandidate } from "@/utils/fileParser";
import { resumeMatchService } from "@/services/resumeMatchService";
import { analytics } from "@/lib/analytics";

export interface ProcessedCandidate extends ParsedCandidate {
  score: number;
  scoreBreakdown: {
    consistency: number;
    realism: number;
    detailing: number;
    education: number;
    employers: number;
    externalPresence: number;
    professionalism: number;
    aiGenerated: number;
  };
  redFlags: Array<{
    issue: string;
    description: string;
  }>;
  timeline: Array<{
    type: "work" | "education";
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  avatar?: string;
}

export const useFileProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [candidates, setCandidates] = useState<ProcessedCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (
    excelFile?: File,
    resumeFiles?: File[],
    jobDescription?: string
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Track file uploads
      if (excelFile) {
        analytics.trackResumeUploaded(
          excelFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          excelFile.size
        );
      }
      
      if (resumeFiles) {
        resumeFiles.forEach(file => {
          analytics.trackResumeUploaded(file.type, file.size);
        });
      }

      let processedCandidates: ProcessedCandidate[] = [];

      // If we have a job description and an Excel file, use the resume matching service
      if (jobDescription && excelFile) {
        processedCandidates = await resumeMatchService.matchResumes(
          excelFile,
          jobDescription
        );
      } else {
        // Original processing logic
        let parsedCandidates: ParsedCandidate[] = [];
        let resumeAnalyses: Record<string, ResumeAnalysis> = {};

        // Parse Excel file if provided
        if (excelFile) {
          parsedCandidates = await parseExcelFile(excelFile);
        }

        // Analyze resume files if provided
        if (resumeFiles && resumeFiles.length > 0) {
          for (const file of resumeFiles) {
            const analysis = await analyzeResume(file);
            resumeAnalyses[file.name] = analysis;
          }
        }

        // If only resumes provided, create candidates from analyses
        if (!excelFile && resumeFiles && resumeFiles.length > 0) {
          parsedCandidates = resumeFiles.map((file, index) => {
            const analysis = resumeAnalyses[file.name];
            return {
              id: index + 1,
              name:
                analysis.extracted_resume_data.name ||
                file.name
                  .replace(/\.(pdf|docx|doc)$/i, "")
                  .replace(/[-_]/g, " "),
              title:
                analysis.extracted_resume_data.experience[0]?.role ||
                "Position To Be Determined",
              skills: analysis.extracted_resume_data.skills,
              summary: analysis.reasoning.join(" "),
              experience: analysis.extracted_resume_data.experience
                .map(
                  (exp) =>
                    `${exp.role} at ${exp.company} (${exp.start_date} - ${exp.end_date})`
                )
                .join("\n"),
              rawData: { source: "resume", filename: file.name },
            };
          });
        }

        // Process candidates with resume analyses
        processedCandidates = parsedCandidates.map((candidate) => {
          const resumeAnalysis = resumeAnalyses[Object.keys(resumeAnalyses)[0]];

          // Convert resume analysis to timeline format
          const timeline = [
            ...resumeAnalysis.extracted_resume_data.experience.map((exp) => ({
              type: "work" as const,
              title: exp.role,
              company: exp.company,
              startDate: exp.start_date,
              endDate: exp.end_date,
              description: exp.description,
            })),
            ...resumeAnalysis.extracted_resume_data.education.map((edu) => ({
              type: "education" as const,
              title: edu.degree,
              company: edu.institution,
              startDate: `${edu.graduation_year - 4}-09`,
              endDate: `${edu.graduation_year}-05`,
              description: `Graduated with ${edu.degree} from ${edu.institution}`,
            })),
          ];

          return {
            ...candidate,
            score: resumeAnalysis.credibility_score,
            scoreBreakdown: {
              consistency: 0,
              realism: 0,
              detailing: 0,
              education: 0,
              employers: 0,
              externalPresence: 0,
              professionalism: 0,
              aiGenerated: 0,
            },
            redFlags: resumeAnalysis.red_flags,
            timeline,
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          };
        });
      }

      setCandidates(processedCandidates);
      
      // Track analytics for each processed candidate
      processedCandidates.forEach((candidate) => {
        analytics.trackCandidateAnalyzed({
          score: candidate.score,
          skills: candidate.skills || [],
          mode: 'internal',
          redFlags: candidate.redFlags?.length || 0
        });
      });
      
      console.log("Processed candidates:", processedCandidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process files");
      console.error("File processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    candidates,
    error,
    processFiles,
  };
};
