import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    ENV?: {
      VITE_GOOGLE_API_KEY?: string;
    };
  }
}

const ai = new GoogleGenAI({
  apiKey:
    import.meta.env.VITE_GOOGLE_API_KEY ||
    "AIzaSyDUt1FrShKdTlhr5RGn1zSvPZHIClD7DHg",
});

export interface ResumeAnalysis {
  credibility_score: number;
  red_flags: Array<{
    issue: string;
    description: string;
  }>;
  extracted_resume_data: {
    name: string;
    contact_info: string;
    education: Array<{
      degree: string;
      institution: string;
      graduation_year: number;
    }>;
    experience: Array<{
      company: string;
      role: string;
      start_date: string;
      end_date: string;
      description: string;
    }>;
    skills: string[];
  };
  reasoning: string[];
  category_scores?: {
    grammar: number;
    technical: number;
    consistency: number;
    buzzwords: number;
    verifiability: number;
    realism: number;
    detailing: number;
    education: number;
    employers: number;
    external_presence: number;
    professionalism: number;
    ai_generated: number;
  };
  category_explanations?: {
    grammar: string;
    technical: string;
    consistency: string;
    buzzwords: string;
    verifiability: string;
    realism: string;
    detailing: string;
    education: string;
    employers: string;
    external_presence: string;
    professionalism: string;
    ai_generated: string;
  };
  radar_chart_data?: Array<{
    category: string;
    score: number;
  }>;
  bar_chart_data?: Array<{
    category: string;
    score: number;
  }>;
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);

    // Create the analysis prompt
    const prompt = `You are an expert in resume analysis and verification. Your task is to analyze the provided resume (attached image or PDF) for authenticity and provide:

A credibility score between 0–100, where 0 indicates a highly suspicious/fabricated resume and 100 indicates a highly credible resume.

A list of possible red flags or areas of concern with brief explanations.

A structured breakdown of the resume's content, including extracted information about the candidate's experience, education, skills, and career progression.

A summary of the reasoning behind your credibility score.

**Additionally, provide a detailed breakdown of the following categories, each scored from 0–10, and a one-sentence explanation for each:**
- grammar
- technical
- consistency
- buzzwords (lower is better)
- verifiability
- realism
- detailing
- education
- employers
- external_presence
- professionalism
- ai_generated

**Also, provide data for charts:**
- radar_chart_data: an array of objects with category and score for the radar chart (use the above categories)
- bar_chart_data: an array of objects with category and score for the bar chart (use the above categories)

**Return your response in the following JSON format:**
{
  "credibility_score": number,
  "red_flags": [
    { "issue": string, "description": string }
  ],
  "extracted_resume_data": {
    "name": string,
    "contact_info": string,
    "education": [
      { "degree": string, "institution": string, "graduation_year": number }
    ],
    "experience": [
      { "company": string, "role": string, "start_date": string, "end_date": string, "description": string }
    ],
    "skills": string[]
  },
  "reasoning": string[],
  "category_scores": {
    "grammar": number,
    "technical": number,
    "consistency": number,
    "buzzwords": number,
    "verifiability": number,
    "realism": number,
    "detailing": number,
    "education": number,
    "employers": number,
    "external_presence": number,
    "professionalism": number,
    "ai_generated": number
  },
  "category_explanations": {
    "grammar": string,
    "technical": string,
    "consistency": string,
    "buzzwords": string,
    "verifiability": string,
    "realism": string,
    "detailing": string,
    "education": string,
    "employers": string,
    "external_presence": string,
    "professionalism": string,
    "ai_generated": string
  },
  "radar_chart_data": [
    { "category": string, "score": number }
  ],
  "bar_chart_data": [
    { "category": string, "score": number }
  ]
}`;

    // Generate content with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type,
                data: base64,
              },
            },
          ],
        },
      ],
    });

    // Parse the response, handling markdown formatting
    const responseText = response.text;
    let jsonStr = responseText;

    // Remove markdown code block formatting if present
    if (responseText.includes("```json")) {
      jsonStr = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.includes("```")) {
      jsonStr = responseText.split("```")[1].split("```")[0].trim();
    }

    try {
      const analysis = JSON.parse(jsonStr);
      return analysis;
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      console.error("Raw response:", responseText);
      throw new Error("Failed to parse resume analysis response");
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
