
import { useState } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppMode } from '@/pages/Index';

interface QueryInterfaceProps {
  mode: AppMode;
  query: string;
  onQueryChange: (query: string) => void;
}

const INTERNAL_EXAMPLES = [
  "Find senior React developers with 5+ years experience",
  "Show candidates with strong Python and machine learning skills",
  "Rank all candidates by overall credibility score",
  "Find candidates with gaps in employment history"
];

const EXTERNAL_EXAMPLES = [
  "Search for React developers on GitHub with recent activity",
  "Find machine learning researchers on arXiv",
  "Look for full-stack developers with open source contributions",
  "Search for data scientists with published papers"
];

export const QueryInterface = ({ mode, query, onQueryChange }: QueryInterfaceProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const examples = mode === 'internal' ? INTERNAL_EXAMPLES : EXTERNAL_EXAMPLES;

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Search className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {mode === 'internal' ? 'Query Your Candidate Pool' : 'Search External Talent'}
          </h2>
        </div>
        
        <div className="relative">
          <Input
            placeholder={
              mode === 'internal'
                ? "Ask anything about your candidates..."
                : "Search for talent across the web..."
            }
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="text-lg py-3 pr-12"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {showSuggestions && (
          <Card className="absolute z-10 w-full mt-1 p-3 bg-white border shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Example queries:</span>
            </div>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => onQueryChange(example)}
                  className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>
        )}
        
        <p className="text-sm text-gray-600">
          {mode === 'internal'
            ? "Upload your candidate data below, then use natural language to filter, rank, and analyze your applicant pool."
            : "Search across GitHub, arXiv, StackOverflow, and other platforms to find external talent."}
        </p>
      </div>
    </Card>
  );
};
