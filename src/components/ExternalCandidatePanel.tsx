
import { X, User, MapPin, Mail, Globe, Github, Star, GitFork, Calendar, Code, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalCandidate } from '@/services/githubApi';

interface ExternalCandidatePanelProps {
  candidate: ExternalCandidate;
  onClose: () => void;
}

export const ExternalCandidatePanel = ({ candidate, onClose }: ExternalCandidatePanelProps) => {
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
            <img 
              src={candidate.avatar} 
              alt={candidate.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <CardTitle className="text-xl">{candidate.name}</CardTitle>
              <p className="text-gray-600">@{candidate.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6">
            {/* Contact & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{candidate.location}</span>
                </div>
              )}
              {candidate.email !== 'Not public' && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
              )}
              {candidate.blog && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a href={candidate.blog} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {candidate.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-gray-500" />
                <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View GitHub Profile
                </a>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{candidate.bio}</p>
            </div>

            {/* GitHub Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Commits</p>
                    <p className="font-semibold">{candidate.totalCommits.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-500">Stars</p>
                    <p className="font-semibold">{candidate.totalStars}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <GitFork className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Forks</p>
                    <p className="font-semibold">{candidate.totalForks}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Years Active</p>
                    <p className="font-semibold">{candidate.accountAge}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-2">Programming Languages & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Contribution Score</p>
                    <p className={`text-lg font-semibold ${getScoreColor(candidate.contributionScore)}`}>
                      {candidate.contributionScore}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-500">Code Quality</p>
                    <p className={`text-lg font-semibold ${getScoreColor(candidate.codeQualityScore)}`}>
                      {candidate.codeQualityScore}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Project Diversity</p>
                    <p className={`text-lg font-semibold ${getScoreColor(candidate.projectDiversityScore)}`}>
                      {candidate.projectDiversityScore}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
