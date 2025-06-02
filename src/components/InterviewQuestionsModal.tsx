import { useState } from 'react';
import { X, HelpCircle, Loader2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";
import { analytics } from '@/lib/analytics';

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  focus_area: string;
}

interface InterviewQuestionsModalProps {
  candidateName: string;
  candidateSkills: string[];
  candidateExperience: string;
  candidateSummary: string;
  onClose: () => void;
}

export const InterviewQuestionsModal = ({
  candidateName,
  candidateSkills,
  candidateExperience,
  candidateSummary,
  onClose
}: InterviewQuestionsModalProps) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      // Import the generateInterviewQuestions function dynamically
      const { generateInterviewQuestions } = await import('@/utils/geminiAnalyzer');
      
      const generatedQuestions = await generateInterviewQuestions({
        skills: candidateSkills,
        experience: candidateExperience,
        summary: candidateSummary,
        name: candidateName
      });
      
      setQuestions(generatedQuestions);
      toast.success(`Generated ${generatedQuestions.length} interview questions for ${candidateName}`);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyQuestion = async (question: string, index: number) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedIndex(index);
      toast.success('Question copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy question');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Interview Questions</CardTitle>
              <p className="text-gray-600">Personalized for {candidateName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {!questions.length && !loading ? (
            <div className="text-center py-8">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Generate Interview Questions
              </h3>
              <p className="text-gray-500 mb-6">
                Create personalized interview questions based on {candidateName}'s skills and experience
              </p>
              
              {/* Skills Preview */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Skills to focus on:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {candidateSkills.slice(0, 6).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidateSkills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidateSkills.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button 
                onClick={generateQuestions}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Generate Interview Questions
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Generating Questions...
                  </h3>
                  <p className="text-gray-500">
                    Creating personalized interview questions for {candidateName}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {questions.length} Questions Generated
                    </h3>
                    <Button 
                      onClick={generateQuestions}
                      variant="outline"
                      size="sm"
                    >
                      Regenerate
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {q.category}
                                </Badge>
                                <Badge className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                                  {q.difficulty}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyQuestion(q.question, index)}
                                className="h-8 w-8 p-0"
                              >
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-gray-800 font-medium mb-2">
                              {q.question}
                            </p>
                            <p className="text-sm text-gray-600">
                              Focus Area: {q.focus_area}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};