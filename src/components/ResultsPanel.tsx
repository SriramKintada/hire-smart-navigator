import { useState } from 'react';
import { Users, TrendingUp, Award, AlertTriangle, Filter, SortAsc, Brain, ArrowLeftRight, Download, Info, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AppMode } from '@/pages/Index';
import { CandidateDetailPanel } from './CandidateDetailPanel';
import { ExternalCandidatePanel } from './ExternalCandidatePanel';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import { ComparisonPanel } from './ComparisonPanel';
import { ProcessedCandidate } from '@/hooks/useFileProcessing';
import { ExternalCandidate } from '@/services/githubApi';
import { exportService } from '@/services/exportService';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ExpandableCardDemo from './ui/expandable-card-demo-standard';

interface ResultsPanelProps {
  mode: AppMode;
  query: string;
  candidates: ProcessedCandidate[];
  externalCandidates?: ExternalCandidate[];
}

export const ResultsPanel = ({ mode, query, candidates, externalCandidates = [] }: ResultsPanelProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<ProcessedCandidate | null>(null);
  const [selectedExternalCandidate, setSelectedExternalCandidate] = useState<ExternalCandidate | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState<ProcessedCandidate | null>(null);
  const [comparisonCandidates, setComparisonCandidates] = useState<ProcessedCandidate[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'experience'>('score');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ label: string; value: string }[]>([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardData, setCardData] = useState<any[]>([]);

  const currentCandidates = mode === 'internal' ? candidates : externalCandidates;

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

  const handleComparisonToggle = (candidate: ProcessedCandidate) => {
    setComparisonCandidates(prev => {
      const exists = prev.find(c => c.id === candidate.id);
      if (exists) {
        return prev.filter(c => c.id !== candidate.id);
      } else if (prev.length < 2) {
        return [...prev, candidate];
      }
      return prev;
    });
  };

  const handleExportPDF = () => {
    exportService.exportToPDF(currentCandidates, `${mode} Candidates Report`);
  };

  const handleExportExcel = () => {
    exportService.exportToExcel(currentCandidates);
  };

  const handleSortChange = (value: string) => {
    if (value === 'score' || value === 'name' || value === 'experience') {
      setSortBy(value);
    }
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'high' || value === 'medium' || value === 'low') {
      setFilterBy(value);
    }
  };

  // Filter and sort candidates
  const filteredCandidates = currentCandidates
    .filter(candidate => {
      const name = candidate.name.toLowerCase();
      const skills = candidate.skills.join(' ').toLowerCase();
      const title = mode === 'internal' 
        ? (candidate as ProcessedCandidate).title.toLowerCase()
        : (candidate as ExternalCandidate).username.toLowerCase();
      
      const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                           title.includes(searchTerm.toLowerCase()) ||
                           skills.includes(searchTerm.toLowerCase());
      
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
          if (mode === 'internal') {
            const aExp = parseInt((a as ProcessedCandidate).experience) || 0;
            const bExp = parseInt((b as ProcessedCandidate).experience) || 0;
            return bExp - aExp;
          }
          return (b as ExternalCandidate).accountAge - (a as ExternalCandidate).accountAge;
        default:
          return 0;
      }
    });

  const renderRedFlags = (candidate: ProcessedCandidate) => {
    if (!candidate.redFlags || candidate.redFlags === 0) return null;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 align-middle cursor-pointer text-red-500">
            <Info className="inline h-4 w-4" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="font-semibold mb-1 text-red-600">{candidate.redFlags} Red Flag{candidate.redFlags > 1 ? 's' : ''}:</div>
          <ul className="list-disc ml-4 text-xs text-gray-700 space-y-1">
            <li>Overlapping dates</li>
            <li>Grammar issues</li>
            <li>Unverifiable links</li>
            {/* Add more as needed */}
          </ul>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Handler to add a filter tag
  const addFilter = (label: string, value: string) => {
    if (!activeFilters.some(f => f.label === label && f.value === value)) {
      setActiveFilters([...activeFilters, { label, value }]);
    }
  };
  // Handler to remove a filter tag
  const removeFilter = (idx: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== idx));
  };

  // Handler to open modal for a candidate
  const handleCandidateClick = (candidate: any) => {
    setCardData([mapCandidateToCard(candidate)]);
    setShowCardModal(true);
  };

  // Handler to open modal for all talent search cards
  const handleTalentSearchModal = () => {
    setCardData(mockTalentCards);
    setShowCardModal(true);
  };

  // Map internal candidate to card format
  const mapCandidateToCard = (candidate: any) => ({
    title: candidate.name,
    description: candidate.title || candidate.bio || '',
    src: candidate.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
    ctaText: 'View Profile',
    ctaLink: '#',
    content: () => (
      <div>
        <p><b>Summary:</b> {candidate.summary || candidate.bio}</p>
        <p><b>Skills:</b> {candidate.skills?.join(', ')}</p>
        <p><b>Experience:</b> {candidate.experience || candidate.accountAge + ' years'}</p>
        <p><b>Score:</b> {candidate.score}</p>
        <p><b>Red Flags:</b> {candidate.redFlags || 0}</p>
      </div>
    )
  });

  // Mock data for Talent Search
  const mockTalentCards = [
    {
      title: 'React Developer',
      description: 'Expert in React, TypeScript, and Tailwind.',
      src: 'https://randomuser.me/api/portraits/men/32.jpg',
      ctaText: 'View Profile',
      ctaLink: '#',
      content: () => <p>Skilled in building scalable UIs, 5+ years experience, open to remote work.</p>
    },
    {
      title: 'Python Engineer',
      description: 'Backend specialist, Django & FastAPI.',
      src: 'https://randomuser.me/api/portraits/women/44.jpg',
      ctaText: 'View Profile',
      ctaLink: '#',
      content: () => <p>Expert in API design, cloud deployments, and data pipelines.</p>
    },
    {
      title: 'DevOps Lead',
      description: 'AWS, Docker, Kubernetes, CI/CD.',
      src: 'https://randomuser.me/api/portraits/men/65.jpg',
      ctaText: 'View Profile',
      ctaLink: '#',
      content: () => <p>10+ years in infrastructure automation and team leadership.</p>
    }
  ];

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* External Search Tag Filter Bar */}
          {mode === 'external' && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {activeFilters.map((filter, idx) => (
                  <span key={idx} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full flex items-center text-xs font-medium">
                    {filter.label}: {filter.value}
                    <button className="ml-2" onClick={() => removeFilter(idx)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search GitHub talent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full shadow-sm rounded-lg border-gray-200"
                />
                {/* Example filter buttons (could be dropdowns in future) */}
                <Button size="sm" variant="outline" onClick={() => addFilter('Language', 'Python')}>Python</Button>
                <Button size="sm" variant="outline" onClick={() => addFilter('Location', 'Berlin')}>Berlin</Button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                {mode === 'internal' ? 'Candidate Results' : 'External Talent Search'}
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1">
                {filteredCandidates.length} of {currentCandidates.length} candidates
              </Badge>
              {mode === 'internal' && comparisonCandidates.length === 2 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setComparisonCandidates([])}
                  className="text-blue-600"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Compare Selected
                </Button>
              )}
            </div>
          </div>

          {/* Export and Advanced Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            {mode === 'internal' && (
              <Button 
                variant="outline" 
                size="sm"
                disabled={comparisonCandidates.length !== 2}
                onClick={() => {/* Will be handled by comparison panel */}}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Compare ({comparisonCandidates.length}/2)
              </Button>
            )}
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
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="experience">
                    {mode === 'internal' ? 'Experience' : 'Account Age'}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBy} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (8.5+)</SelectItem>
                  <SelectItem value="medium">Medium (7-8.4)</SelectItem>
                  <SelectItem value="low">Low (under 7)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {currentCandidates.length === 0 
                  ? mode === 'internal' 
                    ? "No candidates to display. Upload files to see results."
                    : "No external candidates found. Try a different search query."
                  : "No candidates match your search criteria."
                }
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id || (candidate as ExternalCandidate).username} className="p-4 hover:shadow-md transition-shadow" onClick={() => handleCandidateClick(candidate)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {mode === 'internal' && (
                        <Checkbox
                          checked={comparisonCandidates.some(c => c.id === (candidate as ProcessedCandidate).id)}
                          onCheckedChange={() => handleComparisonToggle(candidate as ProcessedCandidate)}
                          className="mt-1"
                        />
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{candidate.name} {renderRedFlags(candidate as ProcessedCandidate)}</h3>
                          <Badge variant="outline">
                            {mode === 'internal' 
                              ? (candidate as ProcessedCandidate).title 
                              : `@${(candidate as ExternalCandidate).username}`}
                          </Badge>
                          {mode === 'internal' && (candidate as ProcessedCandidate).redFlags > 0 && (
                            <div className="flex items-center space-x-1 text-red-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs">{(candidate as ProcessedCandidate).redFlags} red flag{(candidate as ProcessedCandidate).redFlags > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {mode === 'internal' 
                            ? (candidate as ProcessedCandidate).summary 
                            : (candidate as ExternalCandidate).bio}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500">
                            {mode === 'internal' 
                              ? `Experience: ${(candidate as ProcessedCandidate).experience}`
                              : `${(candidate as ExternalCandidate).accountAge} years on GitHub`}
                          </span>
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
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-3 py-2 rounded-lg ${getScoreColor(candidate.score)} flex items-center space-x-1 group relative`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center cursor-pointer">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-semibold text-lg">{candidate.score}</span>
                              {candidate.score >= 8 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500 animate-bounce" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-400 animate-bounce" />
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>Overall Resume Score</span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (mode === 'internal') {
                              setSelectedCandidate(candidate as ProcessedCandidate);
                            } else {
                              setSelectedExternalCandidate(candidate as ExternalCandidate);
                            }
                          }}
                        >
                          View Details
                        </Button>
                        {mode === 'internal' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAIAnalysis(candidate as ProcessedCandidate);
                            }}
                            className="text-purple-600"
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Detail Panels */}
      {selectedCandidate && (
        <CandidateDetailPanel
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {selectedExternalCandidate && (
        <ExternalCandidatePanel
          candidate={selectedExternalCandidate}
          onClose={() => setSelectedExternalCandidate(null)}
        />
      )}

      {showAIAnalysis && (
        <AIAnalysisPanel
          candidate={showAIAnalysis}
          onClose={() => setShowAIAnalysis(null)}
        />
      )}

      {comparisonCandidates.length === 2 && (
        <ComparisonPanel
          candidate1={comparisonCandidates[0]}
          candidate2={comparisonCandidates[1]}
          onClose={() => setComparisonCandidates([])}
        />
      )}

      {showCardModal && <ExpandableCardDemo cards={cardData} />}
    </>
  );
};
