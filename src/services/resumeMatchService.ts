import { ProcessedCandidate } from "@/hooks/useFileProcessing";

class ResumeMatchService {
  private baseUrl = "https://0b0c-103-41-98-198.ngrok-free.app"; // Will be updated with ngrok URL

  async matchResumes(
    file: File,
    jobDescription: string
  ): Promise<ProcessedCandidate[]> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch(`${this.baseUrl}/match-resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to match resumes");
      }

      const blob = await response.blob();
      const csvText = await blob.text();

      // Check if we have valid CSV data
      if (!csvText || csvText.trim() === "") {
        throw new Error("No data received from the server");
      }

      // Parse CSV response
      const rows = csvText.split("\n").filter((row) => row.trim() !== ""); // Remove empty rows
      if (rows.length <= 1) {
        // Only header or no data
        throw new Error("No matching candidates found");
      }

      // Skip header and process rows
      return rows
        .slice(1)
        .map((row, index) => {
          const [name, skills, score] = row.split(",").map((s) => s.trim());
          if (!name || !skills || !score) {
            console.warn(`Skipping invalid row: ${row}`);
            return null;
          }
          return {
            id: index + 1,
            name,
            title: "Position To Be Determined",
            skills: skills.split(",").map((s) => s.trim()),
            score: parseFloat(score),
            summary: "",
            experience: "",
            redFlags: [],
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
            timeline: [],
            rawData: { source: "resume_match", filename: file.name },
          };
        })
        .filter(Boolean); // Remove any null entries
    } catch (error) {
      console.error("Error matching resumes:", error);
      throw error;
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
}

export const resumeMatchService = new ResumeMatchService();
