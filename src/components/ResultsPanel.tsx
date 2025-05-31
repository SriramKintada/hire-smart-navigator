
import { useState } from 'react';
import { Users, TrendingUp, Award, AlertTriangle, Filter, SortAsc } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppMode } from '@/pages/Index';
import { CandidateDetailPanel } from './CandidateDetailPanel';
import { ProcessedCandidate } from '@/hooks/useFileProcessing';

interface ResultsPanelProps {
  mode: AppMode;
  query: string;
  candidates: ProcessedCandidate[];
}

export const ResultsPanel = ({ mode, query, candidates }: ResultsPanelProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<ProcessedCandidate | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'experience'>('score');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 bg-green-50";
    if (score >= 7.0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreCategory = (score: number) => {
    if (score >= 8.5) return 'high';
    if (score >= 7.0) return 'medium';
    return 'low';
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || getScoreCategory(candidate.score) === filterBy;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        default:
          return 0;
      }
    });

  return (
    <>
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
              {filteredCandidates.length} of {candidates.length} candidates
            </Badge>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search candidates, roles, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (8.5+)</SelectItem>
                  <SelectItem value="medium">Medium (7-8.4)</SelectItem>
                  <SelectItem value="low">Low (&lt;7)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {candidates.length === 0 
                  ? "No candidates to display. Upload files to see results."
                  : "No candidates match your search criteria."
                }
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Candidate Detail Panel */}
      {selectedCandidate && (
        <CandidateDetailPanel
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
};
