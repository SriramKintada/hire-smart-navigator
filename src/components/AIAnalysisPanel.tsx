
import { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiAnalysisService, AIAnalysisResult } from '@/services/aiAnalysis';
import { ProcessedCandidate } from '@/hooks/useFileProcessing';

interface AIAnalysisPanelProps {
  candidate: ProcessedCandidate;
  onClose: () => void;
}

export const AIAnalysisPanel = ({ candidate, onClose }: AIAnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiAnalysisService.analyzeCandidate(candidate);
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'weakness': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'red_flag': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <div>
              <CardTitle className="text-xl">AI Analysis: {candidate.name}</CardTitle>
              <p className="text-gray-600">Deep insights and recommendations</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {!analysis ? (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Candidate Analysis</h3>
              <p className="text-gray-600 mb-6">
                Get deep insights, risk assessments, and personalized recommendations for this candidate.
              </p>
              <Button 
                onClick={runAnalysis} 
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <Card className={`border-2 ${getAssessmentColor(analysis.overallAssessment)}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Overall Assessment: {analysis.overallAssessment.toUpperCase()}</span>
                  </div>
                  <p className="text-sm">{analysis.summary}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Key Insights</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="mt-4">
                  <div className="space-y-4">
                    {analysis.insights.map((insight, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{insight.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(insight.confidence * 100)}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{insight.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-4">
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="mt-4">
                  <div className="space-y-3">
                    {analysis.riskFactors.map((risk, index) => (
                      <Card key={index} className="border-red-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm">{risk}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
