
export interface ParsedCandidate {
  id: number;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  summary: string;
  experience: string;
  resumeText?: string;
  rawData: Record<string, any>;
}

export interface CredibilityScore {
  overall: number;
  breakdown: {
    grammar: number;
    technical: number;
    consistency: number;
    buzzwords: number;
    verifiability: number;
  };
  redFlags: number;
}

export const parseExcelFile = async (file: File): Promise<ParsedCandidate[]> => {
  // Simulate Excel parsing - in real implementation, use libraries like xlsx
  console.log('Parsing Excel file:', file.name);
  
  // Mock data that would come from Excel
  const mockData = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior React Developer",
      email: "sarah.chen@email.com",
      phone: "+1-555-0123",
      location: "San Francisco, CA",
      skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
      summary: "Experienced frontend developer with 5+ years building scalable web applications",
      experience: "5 years",
      rawData: { source: 'excel', row: 1 }
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "Full Stack Engineer",
      email: "marcus.j@email.com",
      phone: "+1-555-0124",
      location: "Austin, TX",
      skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
      summary: "Versatile engineer with expertise in both frontend and backend development",
      experience: "4 years",
      rawData: { source: 'excel', row: 2 }
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "ML Engineer",
      email: "elena.r@email.com",
      phone: "+1-555-0125",
      location: "Seattle, WA",
      skills: ["Python", "TensorFlow", "Kubernetes", "MLOps", "PyTorch"],
      summary: "Machine learning specialist with strong MLOps and deployment experience",
      experience: "6 years",
      rawData: { source: 'excel', row: 3 }
    }
  ];

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockData;
};

export const parseResumeFiles = async (files: File[]): Promise<Record<string, string>> => {
  console.log('Parsing resume files:', files.map(f => f.name));
  
  const resumeTexts: Record<string, string> = {};
  
  for (const file of files) {
    // Simulate text extraction - in real implementation, use libraries like pdf-parse
    const mockText = `
      PROFESSIONAL SUMMARY
      Experienced software developer with ${Math.floor(Math.random() * 5) + 3} years of experience in full-stack development.
      
      TECHNICAL SKILLS
      - Programming Languages: JavaScript, Python, Java
      - Frameworks: React, Node.js, Django
      - Databases: PostgreSQL, MongoDB
      - Cloud: AWS, Docker, Kubernetes
      
      WORK EXPERIENCE
      Senior Developer at Tech Corp (2020-2023)
      - Led development of customer-facing web applications
      - Implemented CI/CD pipelines reducing deployment time by 50%
      - Mentored junior developers and conducted code reviews
      
      Software Engineer at StartupXYZ (2018-2020)
      - Built scalable microservices architecture
      - Developed RESTful APIs serving 1M+ requests daily
      - Collaborated with cross-functional teams on product features
      
      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology (2014-2018)
    `;
    
    resumeTexts[file.name] = mockText;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return resumeTexts;
};

export const calculateCredibilityScore = (candidate: ParsedCandidate, resumeText?: string): CredibilityScore => {
  const text = resumeText || candidate.summary;
  
  // Grammar and writing quality (simple heuristics)
  const grammarScore = Math.min(10, Math.max(1, 
    10 - (text.split(/[.!?]/).length > 20 ? 2 : 0) - 
    (text.includes('utilize') || text.includes('synergize') ? 1 : 0)
  ));
  
  // Technical content depth
  const technicalKeywords = ['api', 'database', 'algorithm', 'architecture', 'performance', 'scalable'];
  const technicalMatches = technicalKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const technicalScore = Math.min(10, technicalMatches * 1.5 + 3);
  
  // Date consistency (mock check)
  const consistencyScore = Math.floor(Math.random() * 3) + 8; // Most resumes are consistent
  
  // Buzzword overuse
  const buzzwords = ['rockstar', 'ninja', 'guru', 'synergy', 'leverage', 'paradigm'];
  const buzzwordCount = buzzwords.filter(word => 
    text.toLowerCase().includes(word)
  ).length;
  const buzzwordScore = Math.max(1, 10 - buzzwordCount * 2);
  
  // Verifiability (mock external checks)
  const verifiabilityScore = Math.floor(Math.random() * 3) + 7;
  
  const breakdown = {
    grammar: grammarScore,
    technical: technicalScore,
    consistency: consistencyScore,
    buzzwords: buzzwordScore,
    verifiability: verifiabilityScore
  };
  
  const overall = Object.values(breakdown).reduce((sum, score) => sum + score, 0) / 5;
  
  // Calculate red flags
  let redFlags = 0;
  if (grammarScore < 6) redFlags++;
  if (technicalScore < 5) redFlags++;
  if (buzzwordScore < 7) redFlags++;
  if (consistencyScore < 7) redFlags++;
  
  return {
    overall: Math.round(overall * 10) / 10,
    breakdown,
    redFlags
  };
};
