
import { useState } from 'react';
import { X, User, MapPin, Mail, Phone, Calendar, TrendingUp, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillHeatmap } from './charts/SkillHeatmap';
import { ResumeTimeline } from './charts/ResumeTimeline';
import { ScoreBreakdown } from './charts/ScoreBreakdown';
import { InterviewQuestionsModal } from './InterviewQuestionsModal';

interface Candidate {
  id: number;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  score: number;
  skills: string[];
  summary: string;
  experience: string;
  redFlags: number;
  scoreBreakdown: {
    grammar: number;
    technical: number;
    consistency: number;
    buzzwords: number;
    verifiability: number;
  };
  timeline: Array<{
    type: 'work' | 'education';
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

interface CandidateDetailPanelProps {
  candidate: Candidate;
  onClose: () => void;
}

export const CandidateDetailPanel = ({ candidate, onClose }: CandidateDetailPanelProps) => {
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600";
    if (score >= 7.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{candidate.name}</CardTitle>
              <p className="text-gray-600">{candidate.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                {candidate.score}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInterviewQuestions(true)}
                className="flex items-center space-x-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                title="Generate interview questions for this candidate"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Interview Questions</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {candidate.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{candidate.location}</span>
                </div>
              )}
            </div>

            {/* Red Flags */}
            {candidate.redFlags > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{candidate.redFlags} Red Flag{candidate.redFlags > 1 ? 's' : ''} Detected</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    <li>• Employment gap detected (2019-2020)</li>
                    {candidate.redFlags > 1 && <li>• High buzzword usage in technical sections</li>}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-gray-700">{candidate.summary}</p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="breakdown" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
                <TabsTrigger value="timeline">Career Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="breakdown" className="mt-4">
                <ScoreBreakdown data={candidate.scoreBreakdown} />
              </TabsContent>

              <TabsContent value="skills" className="mt-4">
                <SkillHeatmap skills={candidate.skills} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <ResumeTimeline timeline={candidate.timeline} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions Modal */}
      {showInterviewQuestions && (
        <InterviewQuestionsModal
          candidateName={candidate.name}
          candidateSkills={candidate.skills}
          candidateExperience={candidate.experience}
          candidateSummary={candidate.summary}
          onClose={() => setShowInterviewQuestions(false)}
        />
      )}
    </div>
  );
};
