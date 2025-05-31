
import { Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppMode } from '@/pages/Index';

interface ResultsPanelProps {
  mode: AppMode;
  query: string;
}

// Mock data for demonstration
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior React Developer",
    score: 8.7,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    summary: "Experienced frontend developer with strong backend skills and leadership experience.",
    experience: "5 years",
    redFlags: 0
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Full Stack Engineer",
    score: 7.9,
    skills: ["Python", "Django", "React", "PostgreSQL"],
    summary: "Versatile engineer with expertise in both frontend and backend development.",
    experience: "4 years",
    redFlags: 1
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "ML Engineer",
    score: 9.1,
    skills: ["Python", "TensorFlow", "Kubernetes", "MLOps"],
    summary: "Machine learning specialist with strong MLOps and deployment experience.",
    experience: "6 years",
    redFlags: 0
  }
];

export const ResultsPanel = ({ mode, query }: ResultsPanelProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 bg-green-50";
    if (score >= 7.0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {mode === 'internal' ? 'Candidate Results' : 'External Talent Search'}
            </h2>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {mockCandidates.length} candidates found
          </Badge>
        </div>

        {/* Results Table */}
        <div className="space-y-4">
          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                    <Badge variant="outline">{candidate.title}</Badge>
                    {candidate.redFlags > 0 && (
                      <div className="flex items-center space-x-1 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">{candidate.redFlags} red flag{candidate.redFlags > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">{candidate.summary}</p>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">Experience: {candidate.experience}</span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className={`px-3 py-2 rounded-lg ${getScoreColor(candidate.score)}`}>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">{candidate.score}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
