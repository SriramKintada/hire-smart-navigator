
import { useState } from 'react';
import { X, ArrowLeftRight, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { aiAnalysisService, ComparisonResult } from '@/services/aiAnalysis';
import { ProcessedCandidate } from '@/hooks/useFileProcessing';

interface ComparisonPanelProps {
  candidate1: ProcessedCandidate;
  candidate2: ProcessedCandidate;
  onClose: () => void;
}

export const ComparisonPanel = ({ candidate1, candidate2, onClose }: ComparisonPanelProps) => {
  const [comparison, setComparison] = useState<ComparisonResult[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const runComparison = async () => {
    setIsComparing(true);
    try {
      const result = await aiAnalysisService.compareCandidates(candidate1, candidate2);
      setComparison(result);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const getWinnerBadge = (winner: string, candidate: ProcessedCandidate) => {
    return winner === candidate.name ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">Winner</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">Runner-up</Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <ArrowLeftRight className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Candidate Comparison</CardTitle>
              <p className="text-gray-600">Head-to-head analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Candidate Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{candidate1.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{candidate1.title}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">{candidate1.score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{candidate2.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{candidate2.title}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-600">{candidate2.score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {!comparison ? (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Comparison</h3>
              <p className="text-gray-600 mb-6">
                Get detailed insights on how these candidates compare across key metrics.
              </p>
              <Button 
                onClick={runComparison} 
                disabled={isComparing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isComparing ? 'Comparing...' : 'Start Comparison'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Comparison Results</span>
              </h3>
              
              {comparison.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{result.category}</h4>
                      {getWinnerBadge(result.winner, candidate1)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className={`p-3 rounded-lg ${result.winner === candidate1.name ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{candidate1.name}</span>
                          <span className="text-lg font-bold">{result.score1}</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${result.winner === candidate2.name ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{candidate2.name}</span>
                          <span className="text-lg font-bold">{result.score2}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      <strong>{result.winner}</strong> wins this category: {result.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
