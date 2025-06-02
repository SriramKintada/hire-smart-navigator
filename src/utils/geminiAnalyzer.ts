import { GoogleGenerativeAI } from "@google/generative-ai";

declare global {
  interface Window {
    ENV?: {
      VITE_GOOGLE_API_KEY?: string;
    };
  }
}

const ai = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_API_KEY ||
  "AIzaSyDUt1FrShKdTlhr5RGn1zSvPZHIClD7DHg"
);

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
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const response = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    // Parse the response, handling markdown formatting
    const responseText = response.response.text();
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

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  focus_area: string;
}

export interface CandidateData {
  skills: string[];
  experience: string;
  summary: string;
  name: string;
}

export async function generateInterviewQuestions(candidateData: CandidateData): Promise<InterviewQuestion[]> {
  try {
    const { skills, experience, summary, name } = candidateData;
    
    const prompt = `You are an expert HR interviewer. Generate 8-10 personalized interview questions for the candidate "${name}" based on their profile.

CANDIDATE PROFILE:
- Skills: ${skills.join(', ')}
- Experience: ${experience}
- Summary: ${summary}

REQUIREMENTS:
1. Generate exactly 8-10 questions
2. Mix of technical, behavioral, and situational questions
3. Questions should be relevant to their specific skills and experience
4. Include different difficulty levels (Easy, Medium, Hard)
5. Cover different categories: Technical, Behavioral, Experience, Problem-Solving, Culture Fit

Return ONLY a valid JSON array with this exact format:
[
  {
    "question": "Can you walk me through your experience with [specific technology from their skills]?",
    "category": "Technical",
    "difficulty": "Medium",
    "focus_area": "Technology Experience"
  }
]

Make questions specific to their background, not generic. Use their actual skills and experience in the questions.`;

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const response = await model.generateContent(prompt);
    
    const responseText = response.response.text();
    let jsonStr = responseText;

    // Remove markdown code block formatting if present
    if (responseText.includes("```json")) {
      jsonStr = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.includes("```")) {
      jsonStr = responseText.split("```")[1].split("```")[0].trim();
    }

    // Clean up any potential extra text
    jsonStr = jsonStr.trim();
    if (!jsonStr.startsWith('[')) {
      const arrayStart = jsonStr.indexOf('[');
      const arrayEnd = jsonStr.lastIndexOf(']');
      if (arrayStart !== -1 && arrayEnd !== -1) {
        jsonStr = jsonStr.substring(arrayStart, arrayEnd + 1);
      }
    }

    const questions: InterviewQuestion[] = JSON.parse(jsonStr);
    
    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }

    // Validate each question has required fields
    const validQuestions = questions.filter(q => 
      q.question && q.category && q.difficulty && q.focus_area
    );

    if (validQuestions.length === 0) {
      throw new Error('No valid questions generated');
    }

    return validQuestions;

  } catch (error) {
    console.error('Error generating interview questions:', error);
    
    // Fallback questions based on skills
    const fallbackQuestions: InterviewQuestion[] = [
      {
        question: `Tell me about a challenging project you worked on using ${candidateData.skills[0] || 'your technical skills'}.`,
        category: "Experience",
        difficulty: "Medium",
        focus_area: "Project Experience"
      },
      {
        question: "How do you approach problem-solving when faced with a technical challenge?",
        category: "Problem-Solving",
        difficulty: "Medium",
        focus_area: "Technical Approach"
      },
      {
        question: "Describe a time when you had to learn a new technology quickly. How did you approach it?",
        category: "Behavioral",
        difficulty: "Medium",
        focus_area: "Learning Ability"
      },
      {
        question: `What interests you most about working with ${candidateData.skills.slice(0, 2).join(' and ')}?`,
        category: "Technical",
        difficulty: "Easy",
        focus_area: "Technical Interest"
      },
      {
        question: "How do you stay updated with the latest trends in your field?",
        category: "Culture Fit",
        difficulty: "Easy",
        focus_area: "Professional Development"
      }
    ];

    return fallbackQuestions;
  }
}
