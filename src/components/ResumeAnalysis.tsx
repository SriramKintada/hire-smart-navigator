import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ResumeAnalysisProps {
  analysis: {
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
  };
}

export const ResumeAnalysis = ({ analysis }: ResumeAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Credibility Score */}
      <Card className="p-8 bg-[#23243a] border-[#2a2b3d]">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Credibility Analysis
        </h3>
        <div className="flex items-center space-x-8">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center">
            <span
              className={`text-4xl font-bold ${getScoreColor(
                analysis.credibility_score
              )}`}
            >
              {analysis.credibility_score}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg text-gray-300">Credibility Score</span>
              <span
                className={`text-xl font-semibold ${getScoreColor(
                  analysis.credibility_score
                )}`}
              >
                {analysis.credibility_score}/100
              </span>
            </div>
            <Progress value={analysis.credibility_score} className="h-3" />
          </div>
        </div>
      </Card>

      {/* Red Flags */}
      {analysis.red_flags && analysis.red_flags.length > 0 && (
        <Card className="p-8 bg-[#23243a] border-[#2a2b3d]">
          <h3 className="text-2xl font-semibold text-white mb-6">Red Flags</h3>
          <div className="space-y-4">
            {analysis.red_flags.map((flag, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-red-900/20 rounded-lg"
              >
                <AlertCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-medium text-red-400 mb-1">
                    {flag.issue}
                  </h4>
                  <p className="text-gray-300">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Extracted Information */}
      <Card className="p-8 bg-[#23243a] border-[#2a2b3d]">
        <h3 className="text-2xl font-semibold text-white mb-8">
          Resume Information
        </h3>

        {/* Basic Info */}
        <div className="mb-8">
          <h4 className="text-xl font-medium text-blue-400 mb-4">
            Basic Information
          </h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-lg text-white">
                {analysis.extracted_resume_data.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Contact</p>
              <p className="text-lg text-white">
                {analysis.extracted_resume_data.contact_info || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h4 className="text-xl font-medium text-blue-400 mb-4">Experience</h4>
          <div className="space-y-6">
            {analysis.extracted_resume_data.experience &&
              analysis.extracted_resume_data.experience.map((exp, index) => (
                <div key={index} className="p-6 bg-[#181926] rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="text-lg font-medium text-white mb-1">
                        {exp.role}
                      </h5>
                      <p className="text-gray-300">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {exp.start_date} - {exp.end_date}
                    </span>
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h4 className="text-xl font-medium text-blue-400 mb-4">Education</h4>
          <div className="space-y-4">
            {analysis.extracted_resume_data.education &&
              analysis.extracted_resume_data.education.map((edu, index) => (
                <div key={index} className="p-6 bg-[#181926] rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-lg font-medium text-white mb-1">
                        {edu.degree}
                      </h5>
                      <p className="text-gray-300">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      Graduated {edu.graduation_year}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xl font-medium text-blue-400 mb-4">Skills</h4>
          <div className="flex flex-wrap gap-3">
            {analysis.extracted_resume_data.skills &&
              analysis.extracted_resume_data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </Card>

      {/* Reasoning */}
      <Card className="p-8 bg-[#23243a] border-[#2a2b3d]">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Analysis Reasoning
        </h3>
        <div className="space-y-4">
          {analysis.reasoning &&
            analysis.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-lg">{reason}</p>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
